import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, Lock, Play, Share2 } from "lucide-react";
import { motion } from "motion/react";
import MatchCard from "../components/MatchCard";
import { mockVideos } from "../data/mockVideos";
import { useSubscriptionStatus } from "../hooks/useQueries";

export default function VideoPlayerPage() {
  const { id } = useParams({ from: "/videos/$id" });
  const { data: isSubscribed = false } = useSubscriptionStatus();

  const video = mockVideos.find((v) => v.id === id) ?? mockVideos[0];
  const related = mockVideos.filter((v) => v.id !== video.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back nav */}
      <Link
        to="/videos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="player.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Videos
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main player */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Player area */}
            <div
              className="relative aspect-video bg-black rounded-xl overflow-hidden border border-border"
              data-ocid="player.canvas_target"
            >
              {isSubscribed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-black via-secondary to-black">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      className="bg-primary hover:bg-primary/90 rounded-full p-5 shadow-glow transition-transform hover:scale-105 active:scale-95"
                      data-ocid="player.primary_button"
                    >
                      <Play className="h-10 w-10 text-primary-foreground fill-current" />
                    </button>
                    <span className="text-sm text-white/70">Click to play</span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-black/90 to-secondary">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div
                    className="relative z-10 flex flex-col items-center gap-4 p-6 text-center"
                    data-ocid="player.error_state"
                  >
                    <div className="bg-border rounded-full p-5">
                      <Lock className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">
                        Subscribe to Watch
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Get full access for just ₹20/month
                      </p>
                    </div>
                    <Link to="/subscribe">
                      <Button
                        className="bg-primary hover:bg-primary/90 font-bold"
                        data-ocid="player.primary_button"
                      >
                        Subscribe Now — ₹20/mo
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Live badge */}
              {video.isLive && (
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-live-red text-white animate-pulse font-bold">
                    ● LIVE
                  </Badge>
                </div>
              )}
            </div>

            {/* Video info */}
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {video.matchInfo}
                  </p>
                  <h1 className="text-xl md:text-2xl font-black text-foreground">
                    {video.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    {video.date}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border"
                    disabled={!isSubscribed}
                    data-ocid="player.secondary_button"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border"
                    data-ocid="player.toggle"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {video.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar — related */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-4">
            More Matches
          </h3>
          <div className="flex flex-col gap-4" data-ocid="related.list">
            {related.map((v, i) => (
              <MatchCard
                key={v.id}
                video={v}
                isSubscribed={isSubscribed}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
