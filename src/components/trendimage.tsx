import { useEffect, useState } from "react";

export default function TrendImage({
  trendId,
  className,
}: {
  trendId: string;
  className?: string;
}) {
  const exts = ["png", "jpg", "jpeg", "svg"];
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [triedExts, setTriedExts] = useState<number>(0);

  useEffect(() => {
    setImgSrc(
      "https://dd.dexscreener.com/ds-data/tokens/solana/" +
        trendId +
        "." +
        exts[0]
    );
    setTriedExts(0);
  }, [trendId]);

  if (!imgSrc) return null;

  return (
    <img
      src={imgSrc}
      alt=""
      className={`rounded ${className}`}
      style={{ display: "inline" }}
      onError={() => {
        if (triedExts < exts.length - 1) {
          setTriedExts(triedExts + 1);
          setImgSrc(
            "https://dd.dexscreener.com/ds-data/tokens/solana/" +
              trendId +
              "." +
              exts[triedExts + 1]
          );
        } else {
          setImgSrc(null);
        }
      }}
    />
  );
}
