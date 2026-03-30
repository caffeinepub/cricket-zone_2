import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, Flame, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateCheckoutSession,
  useStripeSessionStatus,
  useSubscriptionStatus,
} from "../hooks/useQueries";

export default function SubscribePage() {
  const { identity, login } = useInternetIdentity();
  const { data: isSubscribed, isLoading: checkingStatus } =
    useSubscriptionStatus();
  const { mutateAsync: createSession, isPending } = useCreateCheckoutSession();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check URL for session_id after Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (sid) setSessionId(sid);
  }, []);

  const { data: sessionStatus } = useStripeSessionStatus(sessionId);

  useEffect(() => {
    if (sessionStatus?.__kind__ === "completed") {
      toast.success("Subscription activated! Welcome to Cricket Zone Premium.");
      setSessionId(null);
    } else if (sessionStatus?.__kind__ === "failed") {
      toast.error("Payment failed. Please try again.");
      setSessionId(null);
    }
  }, [sessionStatus]);

  const handleSubscribe = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      const url = await createSession({
        successUrl: `${window.location.origin}/subscribe?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscribe`,
      });
      window.location.href = url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const features = [
    "Live HD streams of all IPL 2024 matches",
    "Offline video downloads",
    "Exclusive post-match analysis",
    "Multi-device support",
    "No ads during matches",
    "DVR rewind & replay",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <img
            src="/assets/generated/cricket-zone-logo-transparent.dim_120x120.png"
            alt="Cricket Zone"
            className="h-16 w-16 object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-4">
          Cricket Zone <span className="text-primary">Premium</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Unlock the complete IPL 2024 experience. Watch live, download replays,
          and never miss a moment.
        </p>
      </motion.div>

      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/10 border border-primary/40 rounded-2xl p-8 text-center"
          data-ocid="subscribe.success_state"
        >
          <div className="bg-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-black text-foreground mb-2">
            You're Subscribed!
          </h2>
          <p className="text-muted-foreground mb-6">
            You have full access to all IPL 2024 content.
          </p>
          <Link to="/videos">
            <Button
              className="bg-primary hover:bg-primary/90 font-bold"
              data-ocid="subscribe.primary_button"
            >
              Watch Now
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col"
            data-ocid="subscribe.card"
          >
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Monthly
              </p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-foreground">₹20</span>
                <span className="text-muted-foreground pb-1">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cancel anytime
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-primary hover:bg-primary/90 font-bold"
              onClick={handleSubscribe}
              disabled={isPending || checkingStatus}
              data-ocid="subscribe.primary_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !identity ? (
                "Sign In to Subscribe"
              ) : (
                "Subscribe — ₹20/mo"
              )}
            </Button>
          </motion.div>

          {/* Annual plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/10 border-2 border-primary rounded-2xl p-6 flex flex-col relative"
            data-ocid="subscribe.card"
          >
            <div className="absolute -top-3 right-6">
              <Badge className="bg-gold text-[oklch(0.15_0_0)] font-black text-xs uppercase">
                Best Value
              </Badge>
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Annual
              </p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-foreground">
                  ₹199
                </span>
                <span className="text-muted-foreground pb-1">/year</span>
              </div>
              <p className="text-xs text-primary mt-1">
                Save ₹41 vs monthly billing
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm">
                <Flame className="h-4 w-4 text-primary shrink-0" />
                <span className="text-primary font-semibold">
                  Priority customer support
                </span>
              </li>
            </ul>
            <Button
              className="w-full bg-primary hover:bg-primary/90 font-bold shadow-glow"
              onClick={handleSubscribe}
              disabled={isPending || checkingStatus}
              data-ocid="subscribe.secondary_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !identity ? (
                "Sign In to Subscribe"
              ) : (
                "Get Annual Plan — ₹199/yr"
              )}
            </Button>
          </motion.div>
        </div>
      )}

      {sessionId && !sessionStatus && (
        <div
          className="text-center mt-8 flex items-center justify-center gap-3 text-muted-foreground"
          data-ocid="subscribe.loading_state"
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verifying your payment...</span>
        </div>
      )}
    </div>
  );
}
