"use client";

import React, { useState } from "react";
import localFont from "next/font/local";
import { ChevronDown, ChevronUp } from "lucide-react";

const myFont = localFont({
  src: "./fonts/font.ttf",
  display: "swap",
});

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Trendscreener?",
      answer:
        "Trendscreener lets you create, save, and analyze lists of trending tweets, aggregating stats like likes, views, and more. It's designed for content creators and social media professionals who need powerful analytics tools.",
    },
    {
      question: "How do I add a tweet to my trends list?",
      answer:
        "Paste a valid tweet URL into the input box and press enter. The tweet will be added to your list and its stats will be fetched automatically. You can add multiple tweets to track their performance over time.",
    },
    {
      question: "Can I edit or delete a trends list?",
      answer:
        "Yes, you can edit the name, add or remove tweets, and delete your trends lists from their detail pages. All changes are saved automatically and synced across your devices.",
    },
    {
      question: "Are my trends lists public?",
      answer:
        "By default, your lists are private. You can choose to make them public when saving or editing a list. Public lists can be discovered and viewed by other users on the platform.",
    },
    {
      question: "What stats are shown for each tweet?",
      answer:
        "You can see likes, views, replies, reposts, quotes, and bookmarks for each tweet in your list. We provide real-time updates and historical data to track performance over time.",
    },
    {
      question: "Why do some tweets show 0 stats?",
      answer:
        "If a tweet is deleted, private, or stats are unavailable from the platform, it may show as 0 for some or all metrics. This can also happen temporarily due to API limitations or rate limiting.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="w-[94vw] h-full md:min-h-[94vh] my-[3vh] rounded-4xl overflow-hidden bg-black text-white flex mx-auto flex-col items-center text-center relative sm:px-6 lg:px-8 z-1"
    >
      <div className="relative antialiased w-full justify-center items-center absolute inset -top-[50vh] blur-xl z-1 pointer-events-none">
        <div className="absolute w-[100vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[20vh] left-[80%] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute w-[170vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[0vh] left-[-50%] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute w-[50vh] h-[50vh] bg-radial from-[#60a5fa]/30 to-transparent top-[100vh] left-[-40%] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute w-[70vh] h-[100vh] bg-radial from-[#60a5fa] to-transparent top-[120vh] rounded-full blur-[170px] left-[-20%] pointer-events-none"></div>
        <div className="absolute w-[70vw] h-[170vh] bg-radial from-[#60a5fa] to-transparent top-[120vh] rounded-full blur-[170px] left-[50%] pointer-events-none"></div>
      </div>

      <div className="w-full flex flex-col items-center justify-center pt-[14vh] pb-20 z-10 px-5 md:px-10 relative">
        <h2
          className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-shine text-[#e5eae6] w-full max-w-4xl mt-0 ${myFont.className}`}
        >
          Frequently Asked Questions
        </h2>
        <p className="text-base text-[#e5eae6]/50 mt-6 sm:mt-8 max-w-2xl px-4">
          Got questions? We've got answers. Explore our FAQ to learn more about
          <span className="text-[#e5eae6]">
            {" "}
            Trendscreener and social media analytics.
          </span>
        </p>

        <div className="w-full max-w-4xl mt-10 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-start text-left overflow-hidden bg-[#ffffff11] backdrop-blur-lg rounded-3xl mb-4 relative"
            >
              <button
                className="w-full flex justify-between items-center gap-6 text-left p-6"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`text-lg text-[#e5eae6] w-full`}>
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-[#e5eae6]/70" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-[#e5eae6]/70" />
                )}
              </button>
              <p
                className={`text-base text-[#e5eae6]/70 px-6 transition-all duration-300 ${
                  openIndex === index
                    ? "translate-y-0 pb-6 opacity-100"
                    : "translate-y-[100%] opacity-0 h-0"
                }`}
              >
                {openIndex === index && faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
