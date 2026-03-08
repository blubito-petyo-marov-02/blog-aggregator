# ts-blog-aggregator

A small TypeScript CLI for aggregating RSS feeds into PostgreSQL.

It lets you:

- register and switch users
- add RSS feeds
- follow and unfollow feeds
- periodically fetch posts from followed feeds
- browse the latest posts for the current user

The project uses:

- TypeScript
- `tsx` for running the CLI
- PostgreSQL
- Drizzle ORM and Drizzle Kit
- `fast-xml-parser` for RSS parsing

## Requirements

- Node.js
- npm
- PostgreSQL

## Install

```bash
npm install
```

## Configuration

This project reads its config from a file in your home directory:

`~/.gatorconfig.json`

Expected shape:

```json
{
  "db_url": "postgres://username:password@localhost:5432/ts_blog_aggregator",
  "current_user_name": "your-username"
}
```

Notes:

- `db_url` is required and is used by both the CLI and Drizzle migrations.
- `current_user_name` is required. Use any placeholder value before your first `register` or `login`.
- The CLI updates `current_user_name` automatically when you run `register` or `login`.

## Database Setup

Create a PostgreSQL database, then point `db_url` at it in `~/.gatorconfig.json`.

Run migrations:

```bash
npm run migrate
```

If you change the schema and want to generate a new migration:

```bash
npm run generate
```

## Running Commands

All commands are executed through the CLI entrypoint:

```bash
npm run start -- <command> [args...]
```

Example:

```bash
npm run start -- register alice
```

## Commands

### `register <name>`

Create a user and make them the current user.

```bash
npm run start -- register alice
```

### `login <username>`

Switch the current user in `~/.gatorconfig.json`.

```bash
npm run start -- login alice
```

### `users`

List all users. The active one is marked as `(current)`.

```bash
npm run start -- users
```

### `reset`

Delete all users from the database.

Because the schema uses cascading deletes, this also removes dependent feeds, follow records, and posts.

```bash
npm run start -- reset
```

### `addfeed <feed_name> <url>`

Create a feed and automatically follow it as the current user.

```bash
npm run start -- addfeed "Hacker News" "https://news.ycombinator.com/rss"
```

### `feeds`

List all feeds in the database.

```bash
npm run start -- feeds
```

### `follow <feed_url>`

Follow an existing feed as the current user.

```bash
npm run start -- follow "https://news.ycombinator.com/rss"
```

### `following`

List feeds followed by the current user.

```bash
npm run start -- following
```

### `unfollow <feed_url>`

Unfollow a feed as the current user.

```bash
npm run start -- unfollow "https://news.ycombinator.com/rss"
```

### `agg <time_between_reqs>`

Start the feed aggregator loop. It immediately fetches one feed, then continues polling on an interval until you stop it with `Ctrl+C`.

Duration examples accepted by the CLI include values like:

- `30s`
- `5m`
- `1h`
- `3500ms`

Example:

```bash
npm run start -- agg 30s
```

### `browse [limit]`

Show recent posts from feeds followed by the current user.

If `limit` is omitted, the default is `2`.

```bash
npm run start -- browse
npm run start -- browse 10
```

## Typical Workflow

```bash
# 1. install dependencies
npm install

# 2. create ~/.gatorconfig.json

# 3. run database migrations
npm run migrate

# 4. create a user
npm run start -- register alice

# 5. add one or more feeds
npm run start -- addfeed "Hacker News" "https://news.ycombinator.com/rss"

# 6. start the aggregator
npm run start -- agg 30s

# 7. in another terminal, browse posts
npm run start -- browse 10
```

## Project Structure

```text
src/
  commands/        CLI command handlers
  lib/db/          Drizzle schema, queries, migrations, DB bootstrap
  lib/rss.ts       RSS fetching and parsing
  config.ts        reads and writes ~/.gatorconfig.json
  middleware.ts    resolves the current logged-in user
  index.ts         CLI entrypoint and command registration
```

## Implementation Notes

- The current user is stored locally in `~/.gatorconfig.json`.
- Feed fetching selects the least recently fetched feed first.
- Posts are stored in PostgreSQL and browsed by joining followed feeds to posts.
- The aggregator process is long-running and is meant to stay active until interrupted.
