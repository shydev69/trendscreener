import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
