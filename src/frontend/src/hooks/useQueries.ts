import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VideoMetadata } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscriptionStatus() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["subscriptionStatus", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.getSubscriptionStatus(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useListVideos() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVideoMetadata(videoId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVideoMetadata(videoId);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (metadata: VideoMetadata) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadVideo(metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useSubscribe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribe();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      successUrl,
      cancelUrl,
    }: { successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(
        [
          {
            productName: "Cricket Zone Monthly Subscription",
            currency: "inr",
            quantity: 1n,
            priceInCents: 2000n,
            productDescription:
              "Unlimited IPL live stream access and video downloads for 1 month",
          },
        ],
        successUrl,
        cancelUrl,
      );
    },
  });
}

export function useStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
    refetchInterval: 2000,
  });
}
