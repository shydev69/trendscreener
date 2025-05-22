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
    <div className="w-full mx-auto flex flex-col items-center">
      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover shadow-lg"
        style={{ filter: "blur(150px)" }}
      />
      <div className="w-full max-w-2xl -mt-[10vh] z-1">
        <h1 className="text-3xl mb-8 text-white text-center">FAQ</h1>
        <ul className="flex flex-col gap-6">
          {faqs.map((faq, idx) => (
            <li
              key={idx}
              className="rounded-3xl bg-white/10 dark:bg-[#1a1a1a]/30 p-6 pt-8 transition-all duration-200 backdrop-blur-lg border-none"
            >
              <div className="text-xl mb-2 text-white">{faq.question}</div>
              <div className="text-sm opacity-80 text-gray-200">{faq.answer}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
