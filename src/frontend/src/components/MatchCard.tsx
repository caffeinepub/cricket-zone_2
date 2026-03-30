import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Download, Lock, Play } from "lucide-react";
import type { MockVideo } from "../data/mockVideos";

interface MatchCardProps {
  video: MockVideo;
  isSubscribed: boolean;
  index: number;
}

export default function MatchCard({
  video,
  isSubscribed,
  index,
}: MatchCardProps) {
  return (
    <Link
      to="/videos/$id"
      params={{ id: video.id }}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-card"
      data-ocid={`videos.item.${index}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Live badge */}
        {video.isLive ? (
          <div className="absolute top-3 left-3">
            <Badge className="bg-live-red text-white text-xs font-bold px-2 py-0.5 rounded-md animate-pulse">
              ● LIVE
            </Badge>
          </div>
        ) : (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-black/50 text-white text-xs"
            >
              {video.duration}
            </Badge>
          </div>
        )}

        {/* Lock / Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/60 rounded-full p-3">
            {isSubscribed ? (
              <Play className="h-8 w-8 text-white fill-white" />
            ) : (
              <Lock className="h-8 w-8 text-white" />
            )}
          </div>
        </div>

        {/* Score overlay */}
        {video.score && (
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">
              {video.score}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">
              {video.matchInfo}
            </p>
            <h3 className="font-bold text-foreground truncate text-sm md:text-base">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {video.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{video.date}</span>
          {isSubscribed && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Download className="h-3 w-3" />
              Download
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
