"use client";
import React from "react";

const faqs = [
  {
    question: "What is Trendscreen?",
    answer:
      "Trendscreen lets you create, save, and analyze lists of trending tweets, aggregating stats like likes, views, and more.",
  },
  {
    question: "How do I add a tweet to my trends list?",
    answer:
      "Paste a valid tweet URL into the input box and press enter. The tweet will be added to your list and its stats will be fetched automatically.",
  },
  {
    question: "Can I edit or delete a trends list?",
    answer:
      "Yes, you can edit the name, add or remove tweets, and delete your trends lists from their detail pages.",
  },
  {
    question: "Are my trends lists public?",
    answer:
      "By default, your lists are private. You can choose to make them public when saving or editing a list.",
  },
  {
    question: "What stats are shown for each tweet?",
    answer:
      "You can see likes, views, replies, reposts, quotes, and bookmarks for each tweet in your list.",
  },
  {
    question: "Why do some tweets show 0 stats?",
    answer:
      "If a tweet is deleted, private, or stats are unavailable, it may show as 0 for some or all metrics.",
  },
];

export default function FAQPage() {
  return (
    <div className="w-full mx-auto flex flex-col items-center min-h-screen">
      {/* Blue gradient background effects */}
      <div className="relative antialiased w-full justify-center items-center fixed inset-0 -top-[50vh] blur-xl z-0">
        <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa]/30 to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[45vh] left-[95%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[60%]"></div>
        <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa]/30 to-transparent top-[100vh] rounded-full blur-3xl left-[-20%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[40%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] blur-3xl left-[30%]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="w-full max-w-2xl mx-auto mt-20">
          <h1 className="text-3xl mb-8 text-[#e5eae6] text-center">FAQ</h1>
          <ul className="flex flex-col gap-6">
            {faqs.map((faq, idx) => (
              <li
                key={idx}
                className="rounded-3xl bg-[#ffffff11] backdrop-blur-3xl p-6 pt-8 transition-all duration-200 border border-[#e5eae6]/10"
              >
                <div className="text-xl mb-2 text-[#e5eae6]">
                  {faq.question}
                </div>
                <div className="text-sm text-[#e5eae6]/70">{faq.answer}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
