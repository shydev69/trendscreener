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
};

export default function Analysis({ total }: AnalysisProps) {
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
  return (
    <div className="flex flex-wrap items-center justify-start gap-10 mt-6 mb-4 px-4 w-full">
      <span
        className="flex justify-center opacity-70 items-center gap-2"
        title="Total Views"
      >
        <Eye className="w-5 h-5" />
        {returnReadableNumber(total.views)}
      </span>
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
      <span
        className="flex justify-center opacity-70 items-center gap-2"
        title="Total Reposts"
      >
        <RefreshCcw className="w-5 h-5" />
        {returnReadableNumber(total.reposts + total.quotes)}
      </span>
      <span
        className="flex justify-center opacity-70 items-center gap-2"
        title="Total Bookmarks"
      >
        <Bookmark className="w-5 h-5" />
        {returnReadableNumber(total.bookmarks)}
      </span>
      <div className="flex-1" />
    </div>
  );
}
