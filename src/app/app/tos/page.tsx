"use client";
import React from "react";

export default function TOSPage() {
  return (
    <div className="w-full mx-auto flex flex-col items-center min-h-screen">
      {/* Blue gradient background effects */}
      <div className="relative antialiased w-full justify-center items-center fixed inset-0 -top-[50vh] blur-xl z-0 pointer-events-none">
        <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa]/30 to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[45vh] left-[95%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[60%] pointer-events-none"></div>
        <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa]/30 to-transparent top-[100vh] rounded-full blur-3xl left-[-20%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[40%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] blur-3xl left-[30%] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="w-full max-w-4xl mx-auto mt-20 mb-20">
          <h1 className="text-3xl mb-8 text-[#e5eae6] text-center">
            Terms of Service
          </h1>
          <div className="rounded-3xl bg-[#ffffff11] backdrop-blur-3xl p-8 transition-all duration-200 border border-[#e5eae6]/10">
            <div className="prose prose-invert max-w-none">
              <p className="text-sm text-[#e5eae6]/70 mb-6">
                Last updated: June 14, 2025
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    By accessing and using Trendscreen ("the Service"), you
                    accept and agree to be bound by the terms and provision of
                    this agreement. If you do not agree to abide by the above,
                    please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    2. Description of Service
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    Trendscreen is a platform that allows users to create, save,
                    and analyze lists of trending social media content. The
                    service aggregates publicly available statistics such as
                    likes, views, replies, and other engagement metrics from
                    various social media platforms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    3. User Accounts and Registration
                  </h2>
                  <div className="text-sm text-[#e5eae6]/70 space-y-2">
                    <p>
                      • You must provide accurate and complete information when
                      creating an account
                    </p>
                    <p>
                      • You are responsible for maintaining the confidentiality
                      of your account credentials
                    </p>
                    <p>
                      • You are responsible for all activities that occur under
                      your account
                    </p>
                    <p>
                      • You must notify us immediately of any unauthorized use
                      of your account
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    4. Acceptable Use
                  </h2>
                  <div className="text-sm text-[#e5eae6]/70 space-y-2">
                    <p className="mb-2">You agree not to use the Service to:</p>
                    <p>• Violate any applicable laws or regulations</p>
                    <p>• Infringe upon intellectual property rights</p>
                    <p>
                      • Collect or harvest personal information from other users
                    </p>
                    <p>• Interfere with or disrupt the Service or servers</p>
                    <p>
                      • Attempt to gain unauthorized access to any part of the
                      Service
                    </p>
                    <p>
                      • Use automated tools to access the Service without
                      permission
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    5. Content and Data
                  </h2>
                  <div className="text-sm text-[#e5eae6]/70 space-y-2">
                    <p>
                      • Users retain ownership of content they create on the
                      platform
                    </p>
                    <p>
                      • By using the Service, you grant us a license to display
                      and analyze your public content
                    </p>
                    <p>
                      • We aggregate publicly available data from social media
                      platforms
                    </p>
                    <p>
                      • Users are responsible for ensuring they have rights to
                      share any content they add
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    6. Privacy and Data Protection
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    Your privacy is important to us. Please review our Privacy
                    Policy, which also governs your use of the Service, to
                    understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    7. Limitation of Liability
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    The Service is provided "as is" without warranties of any
                    kind. We shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages resulting from
                    your use of the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    8. Service Availability
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We strive to maintain high availability but do not guarantee
                    uninterrupted access to the Service. We reserve the right to
                    modify, suspend, or discontinue the Service at any time.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    9. Termination
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We reserve the right to terminate or suspend your account
                    and access to the Service immediately, without prior notice,
                    for conduct that we believe violates these Terms of Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    10. Changes to Terms
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    We reserve the right to modify these terms at any time.
                    Changes will be effective immediately upon posting. Your
                    continued use of the Service constitutes acceptance of any
                    changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl mb-4 text-[#e5eae6]">
                    11. Contact Information
                  </h2>
                  <p className="text-sm text-[#e5eae6]/70 mb-4">
                    If you have any questions about these Terms of Service,
                    please contact us through our support channels.
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
