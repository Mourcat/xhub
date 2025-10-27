import { Story } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  const initials = story.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
      data-testid={`story-card-${story.id}`}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-chart-2 to-chart-3 p-[3px] group-hover:scale-105 transition-transform">
          <div className="bg-background rounded-full p-[3px]">
            <Avatar className="h-20 w-20 md:h-20 md:w-20 border-0">
              <AvatarImage src={story.avatarUrl || undefined} />
              <AvatarFallback className="bg-accent text-accent-foreground text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Avatar className="h-20 w-20 md:h-20 md:w-20 opacity-0">
          <AvatarFallback />
        </Avatar>
      </div>
      <div className="text-center w-20">
        <p className="text-xs font-medium truncate" data-testid={`text-story-author-${story.id}`}>
          {story.author}
        </p>
        <p className="text-xs text-muted-foreground" data-testid={`text-story-time-${story.id}`}>
          {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
