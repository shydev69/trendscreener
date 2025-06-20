"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TrendContextType {
  currentUrls: string[];
  setCurrentUrls: (urls: string[]) => void;
}

const TrendContext = createContext<TrendContextType | undefined>(undefined);

export const TrendProvider = ({ children }: { children: ReactNode }) => {
  const [currentUrls, setCurrentUrls] = useState<string[]>([]);

  return (
    <TrendContext.Provider value={{ currentUrls, setCurrentUrls }}>
      {children}
    </TrendContext.Provider>
  );
};

export const useTrend = () => {
  const context = useContext(TrendContext);
  if (context === undefined) {
    throw new Error("useTrend must be used within a TrendProvider");
  }
  return context;
};
