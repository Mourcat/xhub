import { Article } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { Link } from "wouter";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const initials = article.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer" data-testid={`card-article-${article.id}`}>
        {article.featuredImage && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
              data-testid={`img-article-featured-${article.id}`}
            />
          </div>
        )}
        <CardHeader className="gap-4 space-y-0 pb-4">
          <h3 className="text-xl font-semibold leading-tight line-clamp-2" data-testid={`text-article-title-${article.id}`}>
            {article.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3" data-testid={`text-article-excerpt-${article.id}`}>
            {article.excerpt}
          </p>
        </CardHeader>
        <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.avatarUrl || undefined} />
              <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium" data-testid={`text-article-author-${article.id}`}>
                {article.author}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span data-testid={`text-article-readtime-${article.id}`}>{article.readTime}</span>
            </div>
            <span data-testid={`text-article-time-${article.id}`}>
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
