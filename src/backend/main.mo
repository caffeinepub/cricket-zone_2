import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Array "mo:core/Array";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type VideoMetadata = {
    title : Text;
    description : Text;
    matchInfo : Text;
    thumbnailUrl : Text;
    blobRef : Storage.ExternalBlob;
    isLive : Bool;
    uploadedBy : Principal;
  };

  type Subscription = {
    user : Principal;
    startTime : Time.Time;
    endTime : Time.Time;
    isActive : Bool;
  };

  module Video {
    public func compare(v1 : VideoMetadata, v2 : VideoMetadata) : Order.Order {
      switch (Text.compare(v1.title, v2.title)) {
        case (#equal) { Text.compare(v1.matchInfo, v2.matchInfo) };
        case (order) { order };
      };
    };
  };

  type DownloadRecord = {
    user : Principal;
    videoId : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let videoMetadatas = Map.empty<Text, VideoMetadata>();
  let subscriptions = Map.empty<Principal, Subscription>();
  var downloadRecords = List.empty<DownloadRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video Management
  public shared ({ caller }) func uploadVideo(metadata : VideoMetadata) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload videos");
    };
    videoMetadatas.add(metadata.title, { metadata with uploadedBy = caller });
    metadata.title;
  };

  public query func getVideoMetadata(videoId : Text) : async VideoMetadata {
    switch (videoMetadatas.get(videoId)) {
      case (null) {
        Runtime.trap("No such video");
      };
      case (?metadata) { metadata };
    };
  };

  public query func listVideos() : async [VideoMetadata] {
    videoMetadatas.values().toArray().sort();
  };

  // Subscription and Access Control
  private func hasActiveSubscription(user : Principal) : Bool {
    switch (subscriptions.get(user)) {
      case (null) { false };
      case (?subscription) {
        subscription.isActive and Time.now() <= subscription.endTime;
      };
    };
  };

  public shared ({ caller }) func downloadVideo(videoId : Text) : async Storage.ExternalBlob {
    // Must be authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can download videos");
    };
    
    // Must have active subscription
    if (not hasActiveSubscription(caller)) {
      Runtime.trap("Unauthorized: Active subscription required to download videos");
    };
    
    switch (videoMetadatas.get(videoId)) {
      case (null) { Runtime.trap("No such video") };
      case (?video) {
        let record = {
          user = caller;
          videoId;
          timestamp = Time.now();
        };
        downloadRecords.add(record);
        video.blobRef;
      };
    };
  };

  public shared ({ caller }) func subscribe() : async Text {
    // Must be authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can subscribe");
    };
    
    let newSub : Subscription = {
      user = caller;
      startTime = Time.now();
      endTime = Time.now() + 2_592_000_000_000; // 30 days in nanoseconds
      isActive = true;
    };
    subscriptions.add(caller, newSub);
    "Subscription activated";
  };

  public query ({ caller }) func getSubscriptionStatus(user : Principal) : async Bool {
    // Users can only check their own status, admins can check anyone's
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own subscription status");
    };
    
    hasActiveSubscription(user);
  };

  // Download tracking - admin only
  public query ({ caller }) func listDownloads() : async [DownloadRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view download records");
    };
    downloadRecords.toArray();
  };

  // Stripe Integration
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    // Must be authenticated user to create checkout session
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
      };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };
    
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        await Stripe.getSessionStatus(config, sessionId, transform);
      };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };
};
