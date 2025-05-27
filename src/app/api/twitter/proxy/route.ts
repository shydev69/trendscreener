import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 10; // max requests
const WINDOW_MS = 60 * 1000; // per minute
const ipRequests = new Map<string, { count: number; timestamp: number }>();

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  // Rate limiting logic
  const entry = ipRequests.get(ip) || { count: 0, timestamp: now };
  if (now - entry.timestamp > WINDOW_MS) {
    entry.count = 1;
    entry.timestamp = now;
  } else {
    entry.count += 1;
  }
  ipRequests.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const tweetId = req.nextUrl.searchParams.get("tweet_id");
  if (!tweetId) {
    return NextResponse.json({ error: "Missing tweet_id" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_TWITTERAPI_BEARER_TOKEN;
  const url = `https://api.twitterapi.io/twitter/tweets?tweet_ids=${tweetId}`;

  const res = await fetch(url, {
    headers: {
      "X-API-Key": apiKey as string,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
