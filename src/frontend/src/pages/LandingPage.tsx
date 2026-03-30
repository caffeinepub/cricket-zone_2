import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, Download, MapPin, Play, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import MatchCard from "../components/MatchCard";
import { mockVideos } from "../data/mockVideos";
import { useSubscriptionStatus } from "../hooks/useQueries";

export default function LandingPage() {
  const { data: isSubscribed = false } = useSubscriptionStatus();

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[540px] md:min-h-[600px] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-stadium.dim_1400x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

        {/* Cricketer cutout — right side */}
        <div className="absolute right-0 bottom-0 h-full hidden lg:flex items-end justify-end pointer-events-none">
          <img
            src="/assets/generated/cricketer-hero-transparent.dim_400x600.png"
            alt="IPL Cricketer"
            className="h-full object-contain object-bottom opacity-90"
            style={{ maxHeight: "560px" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <Badge className="bg-live-red text-white mb-4 font-semibold text-xs">
              ● LIVE NOW — IPL 2024
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-foreground mb-4">
              STREAM
              <br />
              <span className="text-primary">IPL LIVE</span>
              <br />
              ANYWHERE
            </h1>

            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Watch every IPL 2024 match live in HD. Download videos. Never miss
              a boundary or wicket.
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <Link to="/videos">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-wide"
                  data-ocid="hero.primary_button"
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  STREAM LIVE NOW
                </Button>
              </Link>
              <Link to="/subscribe">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground/30 hover:border-primary hover:text-primary font-bold uppercase tracking-wide"
                  data-ocid="hero.secondary_button"
                >
                  Subscribe Now
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Available across India • HD Quality • No Ads</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MATCHES SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">
              UPCOMING & LIVE MATCHES
            </h2>
            <Link to="/videos">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm"
                data-ocid="matches.link"
              >
                View All →
              </Button>
            </Link>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="matches.list"
          >
            {mockVideos.map((video, i) => (
              <MatchCard
                key={video.id}
                video={video}
                isSubscribed={isSubscribed}
                index={i + 1}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PREMIUM SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: value prop */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/generated/cricket-zone-logo-transparent.dim_120x120.png"
                  alt=""
                  className="h-7 w-7 object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Cricket Zone Premium
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-4">
                NEVER MISS
                <br />A MOMENT
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Get unlimited access to all IPL 2024 matches, highlights, and
                exclusive content.
              </p>
              <ul className="space-y-3">
                {[
                  "Live HD streaming of all IPL 2024 matches",
                  "Download videos for offline viewing",
                  "Multi-device access — phone, tablet, TV",
                  "Exclusive player interviews & analysis",
                  "No ads during live matches",
                  "Instant playback with DVR rewind",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: pricing cards */}
            <div className="p-8 md:p-10 flex flex-col gap-4 justify-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Choose Your Plan
              </h3>

              {/* Monthly card */}
              <div className="bg-secondary border border-border rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Monthly
                    </p>
                    <p className="text-3xl font-black text-foreground mt-1">
                      ₹20
                      <span className="text-base font-normal text-muted-foreground">
                        /mo
                      </span>
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cancel anytime
                  </div>
                </div>
                <Link to="/subscribe">
                  <Button
                    className="w-full mt-4 bg-primary hover:bg-primary/90 font-bold"
                    data-ocid="pricing.primary_button"
                  >
                    Subscribe Now
                  </Button>
                </Link>
              </div>

              {/* Annual card — emphasized */}
              <div className="bg-primary/10 border-2 border-primary rounded-xl p-5 relative">
                <div className="absolute -top-3 right-4">
                  <span className="bg-gold text-[oklch(0.15_0_0)] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                    Best Value
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Annual
                    </p>
                    <p className="text-3xl font-black text-foreground mt-1">
                      ₹199
                      <span className="text-base font-normal text-muted-foreground">
                        /yr
                      </span>
                    </p>
                    <p className="text-xs text-primary mt-1">
                      Save ₹41 vs monthly
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    2 months free
                  </div>
                </div>
                <Link to="/subscribe">
                  <Button
                    className="w-full mt-4 bg-primary hover:bg-primary/90 font-bold shadow-glow"
                    data-ocid="pricing.secondary_button"
                  >
                    Get Annual Plan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── APP DOWNLOAD SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-primary/10 via-card to-card border border-border rounded-2xl p-8 md:p-12"
        >
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-4">
              DOWNLOAD THE
              <br />
              <span className="text-primary">CRICKET ZONE</span> APP
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Get the best IPL experience on your phone. Available on Android
              and iOS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-border gap-2"
                data-ocid="download.primary_button"
              >
                <Smartphone className="h-4 w-4" />
                App Store
              </Button>
              <Button
                variant="outline"
                className="border-border gap-2"
                data-ocid="download.secondary_button"
              >
                <Download className="h-4 w-4" />
                Google Play
              </Button>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="relative">
              <div className="h-40 w-24 md:h-56 md:w-32 bg-secondary rounded-3xl border-2 border-border shadow-card flex items-center justify-center">
                <img
                  src="/assets/generated/cricket-zone-logo-transparent.dim_120x120.png"
                  alt="App"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Play className="h-4 w-4 text-primary-foreground fill-current" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
