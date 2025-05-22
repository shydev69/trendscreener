"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Terminal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full mx-auto flex flex-col relative items-center min-h-screen bg-black">
      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover"
        style={{ filter: "blur(150px)" }}
      />
      <div className="w-full max-w-2xl -mt-[10vh] z-1">
        <div className="bg-transparent rounded-3xl p-8 pt-10 shadow-lg backdrop-blur-lg flex flex-col items-center">
          <h1 className="text-4xl mb-2 text-white">Something went wrong</h1>
          <p className="text-lg text-gray-300 mb-6">
            A server error occurred. Please try again or go home.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button
              variant="outline"
              className="rounded-[8px] bg-white/10 text-white border-none shadow-sm hover:bg-white/20 transition-all duration-200"
              onClick={reset}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button
              variant="outline"
              className="rounded-[8px] bg-white/10 text-white border-none shadow-sm hover:bg-white/20 transition-all duration-200"
              asChild
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
