import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Lock, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import MatchCard from "../components/MatchCard";
import { mockVideos } from "../data/mockVideos";
import { useSubscriptionStatus } from "../hooks/useQueries";

const FILTERS = ["All", "Live", "Today", "Highlights", "Full Match"];

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { data: isSubscribed = false, isLoading } = useSubscriptionStatus();

  const filtered = mockVideos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.matchInfo.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Live" && v.isLive) ||
      (activeFilter === "Today" && v.date.startsWith("Today")) ||
      (activeFilter === "Full Match" && !v.isLive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            IPL Live &amp; Videos
          </h1>
          <Badge className="bg-live-red text-white text-xs">2 LIVE</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Stream live IPL 2024 matches or watch full match replays and
          highlights.
        </p>
      </motion.div>

      {/* Subscription gate banner */}
      {!isSubscribed && !isLoading && (
        <div
          className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          data-ocid="videos.error_state"
        >
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-sm text-foreground">
                Subscribe to watch &amp; download
              </p>
              <p className="text-xs text-muted-foreground">
                Get full access to all IPL matches for just ₹20/month
              </p>
            </div>
          </div>
          <Link to="/subscribe">
            <Button
              className="bg-primary hover:bg-primary/90 font-bold shrink-0"
              data-ocid="videos.primary_button"
            >
              Subscribe — ₹20/mo
            </Button>
          </Link>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2" data-ocid="videos.filter.tab">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={activeFilter === f ? "default" : "outline"}
              className={
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }
              onClick={() => setActiveFilter(f)}
              data-ocid="videos.tab"
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
            data-ocid="videos.search_input"
          />
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        data-ocid="videos.list"
      >
        {filtered.map((video, i) => (
          <MatchCard
            key={video.id}
            video={video}
            isSubscribed={isSubscribed}
            index={i + 1}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="videos.empty_state"
        >
          <p className="text-lg font-semibold">No matches found</p>
          <p className="text-sm mt-1">Try a different filter or search term</p>
        </div>
      )}
    </div>
  );
}
