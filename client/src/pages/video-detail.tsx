import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { type Video } from "@shared/schema";
import { format } from "date-fns";

export default function VideoDetail() {
  const [, params] = useRoute("/videos/:id");
  const [, setLocation] = useLocation();

  const { data: video, isLoading } = useQuery<Video>({
    queryKey: [`/api/videos/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="aspect-video w-full mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Video not found</h2>
            <Button onClick={() => setLocation("/")}>Back to Feed</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = video.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2">
              <div className="aspect-video w-full bg-black">
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={video.thumbnailUrl || undefined}
                  data-testid="video-player"
                />
              </div>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold mb-4" data-testid="text-video-title">
                  {video.title}
                </h1>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={video.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold" data-testid="text-video-author">
                      {video.author}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(video.createdAt), "MMM d, yyyy")}
                      </span>
                      {video.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {video.description && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed" data-testid="text-video-description">
                      {video.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Video Information</h3>
                <div className="space-y-3 text-sm">
                  {video.duration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{video.duration}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium">
                      {format(new Date(video.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creator</span>
                    <span className="font-medium">{video.author}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {video.thumbnailUrl && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Thumbnail</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={video.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      data-testid="img-video-thumbnail"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
