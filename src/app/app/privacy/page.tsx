"use client";
import React from "react";

export default function PrivacyPolicyPage() {
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
        <div className="w-full max-w-4xl mx-auto mt-20 mb-20">
          <h1 className="text-3xl mb-8 text-[#e5eae6] text-center">
            Privacy Policy
          </h1>
          <div className="rounded-3xl bg-[#ffffff11] backdrop-blur-3xl p-8 transition-all duration-200 border border-[#e5eae6]/10">
            <div className="prose prose-invert max-w-none">
              <p className="text-sm text-[#e5eae6]/70 mb-6">
                Last updated: June 14, 2025
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    1. Introduction
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    This Privacy Policy describes how Trendscreen ("we," "our,"
                    or "us") collects, uses, and protects your information when
                    you use our service. We are committed to protecting your
                    privacy and ensuring transparency about our data practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    2. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg mb-2 text-[#e5eae6]">
                        Account Information
                      </h3>
                      <div className="text-sm text-[#e5eae6]/70 space-y-1">
                        <p>• Email address and authentication credentials</p>
                        <p>• Profile information you choose to provide</p>
                        <p>• Account preferences and settings</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg mb-2 text-[#e5eae6]">
                        Usage Data
                      </h3>
                      <div className="text-sm text-[#e5eae6]/70 space-y-1">
                        <p>• Trends lists you create and interact with</p>
                        <p>• Social media URLs you add to your lists</p>
                        <p>• Search queries and filters you use</p>
                        <p>• Pages visited and features used</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg mb-2 text-[#e5eae6]">
                        Technical Information
                      </h3>
                      <div className="text-sm text-[#e5eae6]/70 space-y-1">
                        <p>• IP address and device information</p>
                        <p>• Browser type and version</p>
                        <p>• Operating system</p>
                        <p>• Cookies and similar tracking technologies</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    3. How We Use Your Information
                  </h2>
                  <div className="text-sm text-[#e5eae6]/70 space-y-2">
                    <p>• To provide and maintain our service</p>
                    <p>• To authenticate your account and ensure security</p>
                    <p>
                      • To analyze and aggregate social media engagement data
                    </p>
                    <p>• To improve our service and develop new features</p>
                    <p>
                      • To respond to your questions and provide customer
                      support
                    </p>
                    <p>• To send important service-related communications</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    4. Data Sources and Third-Party Content
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    Our service aggregates publicly available data from social
                    media platforms including Twitter, Instagram, TikTok, and
                    others. We collect engagement metrics such as likes, views,
                    replies, and shares that are publicly accessible. We do not
                    access private or protected content.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    5. Information Sharing
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg mb-2 text-[#e5eae6]">
                        Public Trends
                      </h3>
                      <p className="text-sm text-[#e5eae6]/70 mb-2">
                        When you mark a trends list as "public," the following
                        information becomes visible to other users:
                      </p>
                      <div className="text-sm text-[#e5eae6]/70 space-y-1">
                        <p>• Trend list name and description</p>
                        <p>
                          • Social media URLs and their aggregated statistics
                        </p>
                        <p>• Creation date and view counts</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg mb-2 text-[#e5eae6]">
                        Service Providers
                      </h3>
                      <p className="text-sm text-[#e5eae6]/70 mb-2">
                        We may share information with trusted third parties who
                        help us operate our service:
                      </p>
                      <div className="text-sm text-[#e5eae6]/70 space-y-1">
                        <p>• Authentication services</p>
                        <p>• Cloud hosting providers</p>
                        <p>• Analytics services</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    6. Data Security
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We implement appropriate security measures to protect your
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction. However, no method
                    of transmission over the internet is 100% secure, and we
                    cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    7. Data Retention
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We retain your personal information only as long as
                    necessary to provide our service and fulfill the purposes
                    outlined in this Privacy Policy. You may delete your account
                    and associated data at any time through your account
                    settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    8. Cookies and Tracking
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We use cookies and similar technologies to enhance your
                    experience, remember your preferences, and analyze how our
                    service is used. You can control cookie settings through
                    your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    9. Your Rights
                  </h2>
                  <div className="text-sm text-[#e5eae6]/70 space-y-2">
                    <p>You have the right to:</p>
                    <p>• Access and update your personal information</p>
                    <p>• Delete your account and associated data</p>
                    <p>• Control the visibility of your trends lists</p>
                    <p>• Opt out of non-essential communications</p>
                    <p>• Request information about data we have collected</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    10. Children's Privacy
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    Our service is not intended for children under 13 years of
                    age. We do not knowingly collect personal information from
                    children under 13. If you become aware that a child has
                    provided us with personal information, please contact us
                    immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    11. International Data Transfers
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    Your information may be transferred to and processed in
                    countries other than your own. We ensure appropriate
                    safeguards are in place to protect your information in
                    accordance with this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    12. Changes to This Privacy Policy
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    13. Contact Us
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us through our support
                    channels.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
