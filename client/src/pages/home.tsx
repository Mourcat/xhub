import { useQuery } from "@tanstack/react-query";
import { Story, Article, Picture, Video } from "@shared/schema";
import { StoryCard } from "@/components/story-card";
import { ArticleCard } from "@/components/article-card";
import { PictureCard } from "@/components/picture-card";
import { VideoCard } from "@/components/video-card";
import { StoryViewer } from "@/components/story-viewer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FileText, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get("filter");

  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: pictures, isLoading: picturesLoading } = useQuery<Picture[]>({
    queryKey: ["/api/pictures"],
  });

  const { data: videos, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const isLoading = storiesLoading || articlesLoading || picturesLoading || videosLoading;

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setStoryViewerOpen(true);
  };

  const filteredArticles = filter === "articles" || !filter ? articles : [];
  const filteredPictures = filter === "pictures" || !filter ? pictures : [];
  const filteredStories = filter === "stories" || !filter ? stories : [];
  const filteredVideos = filter === "videos" || !filter ? videos : [];

  const getPageSubtitle = () => {
    switch (filter) {
      case "stories":
        return "Ephemeral moments shared by the community";
      case "articles":
        return "Long-form content and insights from the community";
      case "pictures":
        return "Visual inspiration shared by the community";
      case "videos":
        return "Video content shared by the community";
      default:
        return "Discover Stories, Articles, Pictures, and Videos from the community";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Content Feed
              </h1>
              <p className="text-muted-foreground">
                {getPageSubtitle()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setLocation("/stories/new")}
                data-testid="button-create-story"
                variant="outline"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Story
              </Button>
              <Button
                onClick={() => setLocation("/articles/new")}
                data-testid="button-create-article"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Article
              </Button>
              <Button
                onClick={() => setLocation("/pictures/new")}
                data-testid="button-create-picture"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                <ImageIcon className="h-4 w-4 mr-1" />
                Picture
              </Button>
              <Button
                onClick={() => setLocation("/videos/new")}
                data-testid="button-create-video"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <VideoIcon className="h-4 w-4 mr-2" />
                Video
              </Button>
            </div>
          </div>

          {(!filter || filter === "stories") && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Stories</h2>
              {isLoading ? (
                <div className="flex gap-6 overflow-x-auto pb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : filteredStories && filteredStories.length > 0 ? (
                <div className="flex gap-6 overflow-x-auto pb-4" data-testid="container-stories">
                  {filteredStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onClick={() => handleStoryClick(story)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No stories yet. Create your first story!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {(!filter || filter === "articles") && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Articles</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-video w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>
              ) : filteredArticles && filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="container-articles">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No articles yet. Write your first article!</p>
                </div>
              )}
            </div>
          )}

          {(!filter || filter === "pictures") && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Pictures</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full" />
                  ))}
                </div>
              ) : filteredPictures && filteredPictures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="container-pictures">
                  {filteredPictures.map((picture) => (
                    <PictureCard key={picture.id} picture={picture} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No pictures yet. Upload your first picture!</p>
                </div>
              )}
            </div>
          )}

          {(!filter || filter === "videos") && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-purple-500" />
                Videos
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-video w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredVideos && filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="container-videos">
                  {filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-800">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <VideoIcon className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-muted-foreground font-medium">No videos yet. Upload your first video!</p>
                  <Button
                    onClick={() => setLocation("/videos/new")}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <StoryViewer
        story={selectedStory}
        open={storyViewerOpen}
        onOpenChange={setStoryViewerOpen}
      />
    </div>
  );
}
