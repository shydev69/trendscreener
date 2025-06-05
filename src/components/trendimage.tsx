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
  const [tryingSolana, setTryingSolana] = useState<boolean>(true);

  const fetchSolanaTokenImage = async (tokenAddress: string) => {
    try {
      console.log("Fetching Solana token image for:", tokenAddress);
      const response = await fetch(
        `/api/fetchSolanaImage?mintAddress=${tokenAddress}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tokenLogo = data.image;

      if (tokenLogo) {
        console.log("Token Logo from Solana API:", tokenLogo);
        return tokenLogo;
      }
      return null;
    } catch (error) {
      console.log("Failed to fetch Solana token image:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      setTryingSolana(true);
      setImgSrc(null);
      setTriedExts(0);

      // First try to get image from Solana metadata
      const solanaImage = await fetchSolanaTokenImage(trendId);

      if (solanaImage) {
        setImgSrc(solanaImage);
        setTryingSolana(false);
      } else {
        // Fallback to Dexscreener
        setTryingSolana(false);
        setImgSrc(
          "https://dd.dexscreener.com/ds-data/tokens/solana/" +
            trendId +
            "." +
            exts[0]
        );
      }
    };

    if (trendId) {
      loadImage();
    }
  }, [trendId]);

  const handleImageError = () => {
    if (tryingSolana) {
      // If Solana image failed, try Dexscreener
      setTryingSolana(false);
      setImgSrc(
        "https://dd.dexscreener.com/ds-data/tokens/solana/" +
          trendId +
          "." +
          exts[0]
      );
    } else if (triedExts < exts.length - 1) {
      // Try next Dexscreener extension
      setTriedExts(triedExts + 1);
      setImgSrc(
        "https://dd.dexscreener.com/ds-data/tokens/solana/" +
          trendId +
          "." +
          exts[triedExts + 1]
      );
    } else {
      // All attempts failed
      setImgSrc(null);
    }
  };

  if (!imgSrc) return null;

  return (
    <img
      src={imgSrc}
      alt=""
      className={`rounded ${className}`}
      style={{ display: "inline" }}
      onError={handleImageError}
    />
  );
}
