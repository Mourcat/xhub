import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Picture } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function PictureDetail() {
  const [, params] = useRoute("/pictures/:id");
  const [, setLocation] = useLocation();

  const { data: picture, isLoading } = useQuery<Picture>({
    queryKey: [`/api/pictures/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="aspect-square w-full max-w-3xl mx-auto" />
        </div>
      </div>
    );
  }

  if (!picture) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Picture not found</h2>
          <Button onClick={() => setLocation("/")}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  const initials = picture.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={picture.imageUrl}
                alt={picture.caption}
                className="w-full h-full object-cover"
                data-testid="img-picture"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={picture.avatarUrl || undefined} />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold mb-1" data-testid="text-picture-author">
                  {picture.author}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-picture-time">
                  {formatDistanceToNow(new Date(picture.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-3" data-testid="text-picture-caption">
                {picture.caption}
              </h1>
              {picture.description && (
                <p className="text-muted-foreground leading-relaxed" data-testid="text-picture-description">
                  {picture.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
