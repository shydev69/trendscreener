import { useEffect } from "react";

export function InstagramEmbed({ url }: { url: string }) {
  // Extract post ID from the URL
  const postId = url.split("/").filter(Boolean).pop() || "";
  if (!postId) {
    console.error("Invalid Instagram URL");
    return null;
  }
  useEffect(() => {
    // Dynamically load Instagram embed script
    const script = document.createElement("script");
    script.async = true;
    script.src = "//www.instagram.com/embed.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <blockquote
      className="instagram-media bg-transparent !overflow-hidden max-h-full !rounded-[20px] shadow-lg m-1 w-full !border-none max-w-2xl p-0"
      data-instgrm-captioned
      data-instgrm-permalink={`https://www.instagram.com/p/${postId}/?utm_source=ig_embed&amp;utm_campaign=loading`}
      data-instgrm-version="14"
    ></blockquote>
  );
}

// https://www.instagram.com/reel/DJ6wfqcMDO_/?utm_source=ig_web_copy_link
