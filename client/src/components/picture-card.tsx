import { Picture } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

interface PictureCardProps {
  picture: Picture;
}

export function PictureCard({ picture }: PictureCardProps) {
  const initials = picture.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/pictures/${picture.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer group" data-testid={`card-picture-${picture.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={picture.imageUrl}
            alt={picture.caption}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            data-testid={`img-picture-${picture.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="font-medium line-clamp-2" data-testid={`text-picture-caption-${picture.id}`}>
                {picture.caption}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={picture.avatarUrl || undefined} />
              <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium" data-testid={`text-picture-author-${picture.id}`}>
              {picture.author}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
