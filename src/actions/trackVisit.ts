"use server";

import { onTrendscreenVisit } from "@/lib/updateStats";

export async function trackTrendscreenVisit(
  trendscreenId: string,
  urls: string[]
) {
  try {
    await onTrendscreenVisit(trendscreenId, urls);
    console.log(
      `Trendscreen visit tracked for ID: ${trendscreenId}, URLs: ${urls.join(", ")}`
    );
    return { success: true };
  } catch (error) {
    console.error("Error tracking trendscreen visit:", error);
    return { success: false, error: "Failed to track visit" };
  }
}
