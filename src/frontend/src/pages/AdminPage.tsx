import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Shield, Upload, Video } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { mockVideos } from "../data/mockVideos";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin, useListVideos, useUploadVideo } from "../hooks/useQueries";

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: backendVideos = [] } = useListVideos();
  const { mutateAsync: uploadVideo, isPending: uploading } = useUploadVideo();

  const [title, setTitle] = useState("");
  const [matchInfo, setMatchInfo] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLive, setIsLive] = useState(false);

  if (checkingAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-black text-foreground mb-2">
          Admin Access Required
        </h1>
        <p className="text-muted-foreground">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !matchInfo) {
      toast.error("Title and match info are required");
      return;
    }
    try {
      await uploadVideo({
        title,
        matchInfo,
        description,
        thumbnailUrl,
        isLive,
        uploadedBy: identity.getPrincipal(),
        blobRef: ExternalBlob.fromURL(""),
      });
      toast.success("Video uploaded successfully!");
      setTitle("");
      setMatchInfo("");
      setDescription("");
      setThumbnailUrl("");
      setIsLive(false);
    } catch {
      toast.error("Failed to upload video. Please try again.");
    }
  };

  const allVideos = [...mockVideos];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            Admin Panel
          </h1>
          <Badge className="bg-primary text-primary-foreground">Admin</Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Upload className="h-5 w-5 text-primary" />
                Upload New Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm text-muted-foreground"
                  >
                    Video Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. MI vs CSK — Match Highlights"
                    className="bg-secondary border-border mt-1"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="matchInfo"
                    className="text-sm text-muted-foreground"
                  >
                    Match Info *
                  </Label>
                  <Input
                    id="matchInfo"
                    value={matchInfo}
                    onChange={(e) => setMatchInfo(e.target.value)}
                    placeholder="e.g. MI vs CSK • IPL 2024 • Match 1"
                    className="bg-secondary border-border mt-1"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="thumbnailUrl"
                    className="text-sm text-muted-foreground"
                  >
                    Thumbnail URL
                  </Label>
                  <Input
                    id="thumbnailUrl"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-secondary border-border mt-1"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Match description..."
                    rows={3}
                    className="bg-secondary border-border mt-1"
                    data-ocid="admin.textarea"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isLive"
                    className="text-sm text-muted-foreground"
                  >
                    Mark as Live
                  </Label>
                  <Switch
                    id="isLive"
                    checked={isLive}
                    onCheckedChange={setIsLive}
                    data-ocid="admin.switch"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-bold"
                  disabled={uploading}
                  data-ocid="admin.submit_button"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Video"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Video list */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Video className="h-5 w-5 text-primary" />
                Manage Videos
                <Badge variant="secondary" className="ml-auto">
                  {allVideos.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-3 max-h-96 overflow-y-auto"
                data-ocid="admin.list"
              >
                {allVideos.map((video, i) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border"
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="h-12 w-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.matchInfo}
                      </p>
                    </div>
                    {video.isLive && (
                      <Badge className="bg-live-red text-white text-xs shrink-0">
                        LIVE
                      </Badge>
                    )}
                  </div>
                ))}
                {backendVideos.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    + {backendVideos.length} videos from backend
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
