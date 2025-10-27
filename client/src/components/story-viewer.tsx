import { Story } from "@shared/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryViewerProps {
  story: Story | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryViewer({ story, open, onOpenChange }: StoryViewerProps) {
  if (!story) return null;

  const initials = story.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 bg-gradient-to-br from-primary/90 to-chart-2/90 text-white border-0" data-testid="dialog-story-viewer">
        <div className="relative h-[600px] flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-full" />
          </div>
          
          <div className="flex items-center justify-between p-4 pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={story.avatarUrl || undefined} />
                <AvatarFallback className="bg-white/20 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium" data-testid="text-story-viewer-author">
                  {story.author}
                </p>
                <p className="text-xs text-white/80" data-testid="text-story-viewer-time">
                  {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
              data-testid="button-close-story"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-xl leading-relaxed text-center" data-testid="text-story-viewer-content">
              {story.content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
