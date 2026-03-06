import { fetchFeed } from 'src/lib/rss';

export async function handlerFetchFeeds(_: string) {
  const feedURL = 'https://www.wagslane.dev/index.xml'
  const feed = await fetchFeed(feedURL);
  console.log('Feed:', JSON.stringify(feed, null, 2));
}
