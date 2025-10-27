import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Article } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetail() {
  const [, params] = useRoute("/articles/:id");
  const [, setLocation] = useLocation();

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="aspect-video w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button onClick={() => setLocation("/")}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  const initials = article.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        {article.featuredImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 bg-muted">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
              data-testid="img-article-featured"
            />
          </div>
        )}

        <article>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-testid="text-article-title">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.avatarUrl || undefined} />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold" data-testid="text-article-author">
                  {article.author}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span data-testid="text-article-time">
                    {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span data-testid="text-article-readtime">{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none font-serif" data-testid="text-article-content">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="whitespace-pre-wrap leading-loose text-lg">
              {article.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
