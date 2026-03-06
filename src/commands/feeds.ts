import { createFeedFollow } from 'src/lib/db/queries/feed-follows';
import { createFeed, getAllFeeds } from 'src/lib/db/queries/feeds';
import { getUserById } from 'src/lib/db/queries/user';
import { Feed, User } from 'src/lib/db/schema';
import { printFeedFollow } from './feed-follows';

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`Usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const feedURL = args[1];
  const feed = await createFeed(feedName, feedURL, user.id);
  if (!feed) {
    throw new Error('Failed to create feed');
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  printFeedFollow(feedFollow.userName, feedFollow.feedName);
 

  console.log('Feed created successfully:');
  printFeed(feed, user);
}

export async function handlerListFeeds(_: string) {
  const feeds = await getAllFeeds();

  if (feeds.length === 0) {
    console.log('No feeds found.');
    return;
  }

  console.log(`Found ${feeds.length} feeds:`);
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log('=====================================');
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
