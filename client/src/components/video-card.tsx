import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video } from "@shared/schema";
import { useLocation } from "wouter";
import { Clock, Play } from "lucide-react";
import { format } from "date-fns";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [, setLocation] = useLocation();

  const initials = video.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all hover-elevate active-elevate-2"
      onClick={() => setLocation(`/videos/${video.id}`)}
      data-testid={`card-video-${video.id}`}
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid="img-video-thumbnail"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <video
              src={video.videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="p-4 rounded-full bg-white/90 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-8 w-8 text-black" fill="black" />
          </div>
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium backdrop-blur-sm">
            {video.duration}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={video.avatarUrl || undefined} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors"
              data-testid="text-video-title"
            >
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1" data-testid="text-video-author">
              {video.author}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(video.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
