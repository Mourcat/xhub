import { 
  type Story, 
  type InsertStory,
  type Article,
  type InsertArticle,
  type Picture,
  type InsertPicture,
  type Video,
  type InsertVideo,
  stories,
  articles,
  pictures,
  videos
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getStories(): Promise<Story[]>;
  getStory(id: string): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  deleteStory(id: string): Promise<boolean>;

  getArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  deleteArticle(id: string): Promise<boolean>;

  getPictures(): Promise<Picture[]>;
  getPicture(id: string): Promise<Picture | undefined>;
  createPicture(picture: InsertPicture): Promise<Picture>;
  deletePicture(id: string): Promise<boolean>;

  getVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  deleteVideo(id: string): Promise<boolean>;
}

// DatabaseStorage implementation using PostgreSQL via Drizzle ORM
// Referenced from blueprint:javascript_database
export class DatabaseStorage implements IStorage {
  async getStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.createdAt));
  }

  async getStory(id: string): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story || undefined;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(stories).values(insertStory).returning();
    return story;
  }

  async deleteStory(id: string): Promise<boolean> {
    const result = await db.delete(stories).where(eq(stories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getPictures(): Promise<Picture[]> {
    return await db.select().from(pictures).orderBy(desc(pictures.createdAt));
  }

  async getPicture(id: string): Promise<Picture | undefined> {
    const [picture] = await db.select().from(pictures).where(eq(pictures.id, id));
    return picture || undefined;
  }

  async createPicture(insertPicture: InsertPicture): Promise<Picture> {
    const [picture] = await db.insert(pictures).values(insertPicture).returning();
    return picture;
  }

  async deletePicture(id: string): Promise<boolean> {
    const result = await db.delete(pictures).where(eq(pictures.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
