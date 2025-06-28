import { Eye, Heart, Reply, RefreshCcw, Bookmark } from "lucide-react";

type AnalysisProps = {
  total: {
    views: number;
    likes: number;
    replies: number;
    reposts: number;
    quotes: number;
    bookmarks: number;
  };
  links?: string[]; // Optional array of links to determine platform types
};

export default function Analysis({ total, links = [] }: AnalysisProps) {
  const returnReadableNumber = (num: number) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(1)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Check if the trendscreen contains only Instagram or TikTok posts
  const hasTwitterPosts = links.some(
    (link) =>
      link.toLowerCase().includes("twitter.com") ||
      link.toLowerCase().includes("x.com")
  );
  const hasInstagramPosts = links.some((link) =>
    link.toLowerCase().includes("instagram.com")
  );
  const hasTiktokPosts = links.some((link) =>
    link.toLowerCase().includes("tiktok.com")
  );

  // Hide views if:
  // 1. Total views is 0, AND
  // 2. The trendscreen contains only Instagram or TikTok posts (no Twitter posts)
  const shouldHideViews =
    total.views === 0 &&
    !hasTwitterPosts &&
    (hasInstagramPosts || hasTiktokPosts);

  // Hide reposts/retweets if:
  // 1. Total reposts + quotes is 0, AND
  // 2. The trendscreen contains only Instagram or TikTok posts (no Twitter posts)
  const shouldHideReposts =
    total.reposts + total.quotes === 0 &&
    !hasTwitterPosts &&
    (hasInstagramPosts || hasTiktokPosts);

  // Hide bookmarks if:
  // 1. Total bookmarks is 0, AND
  // 2. The trendscreen contains only Instagram or TikTok posts (no Twitter posts)
  const shouldHideBookmarks =
    total.bookmarks === 0 &&
    !hasTwitterPosts &&
    (hasInstagramPosts || hasTiktokPosts);

  return (
    <div className="flex flex-wrap items-center justify-start gap-10 mt-6 mb-4 px-4 w-full">
      {!shouldHideViews && (
        <span
          className="flex justify-center opacity-70 items-center gap-2"
          title="Total Views"
        >
          <Eye className="w-5 h-5" />
          {returnReadableNumber(total.views)}
        </span>
      )}
      <span
        className="flex justify-center opacity-70 items-center gap-2"
        title="Total Likes"
      >
        <Heart className="w-5 h-5" />
        {returnReadableNumber(total.likes)}
      </span>
      <span
        className="flex justify-center opacity-70 items-center gap-2"
        title="Total Replies"
      >
        <Reply className="w-5 h-5" />
        {returnReadableNumber(total.replies)}
      </span>
      {!shouldHideReposts && (
        <span
          className="flex justify-center opacity-70 items-center gap-2"
          title="Total Reposts"
        >
          <RefreshCcw className="w-5 h-5" />
          {returnReadableNumber(total.reposts + total.quotes)}
        </span>
      )}
      {!shouldHideBookmarks && (
        <span
          className="flex justify-center opacity-70 items-center gap-2"
          title="Total Bookmarks"
        >
          <Bookmark className="w-5 h-5" />
          {returnReadableNumber(total.bookmarks)}
        </span>
      )}
      <div className="flex-1" />
    </div>
  );
}
