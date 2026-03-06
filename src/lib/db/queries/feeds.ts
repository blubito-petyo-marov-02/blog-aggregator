import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
  const result = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
  return firstOrUndefined(result);
}

export async function getAllFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}
