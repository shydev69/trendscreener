"use client";

import localFont from "next/font/local";
const myFont = localFont({
  src: "./fonts/font.ttf",
  display: "swap",
});
import dynamic from "next/dynamic";
import {
  Shield,
  ShieldCheck,
  TrendingUp,
  Share,
  Atom,
  BadgeDollarSign,
} from "lucide-react";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  }
);

export const InfoCardsSection = () => {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#000000",
    showAtmosphere: true,
    atmosphereColor: "#000000",
    atmosphereAltitude: 0.2,
    emissive: "#ffffff",
    emissiveIntensity: 0.1,
    shininess: 0.2,
    polygonColor: "#ffffff",
    ambientLight: "#ffffff",
    directionalLeftLight: "#b9d0bf",
    directionalTopLight: "#e5eae655",
    pointLight: "#416858",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: false,
    autoRotateSpeed: 0,
  };
  const colors = ["#93c5fd", "#60a5fa", "#2563eb"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];
  return (
    <section className="w-[94vw] h-full md:min-h-[94vh] my-[3vh] rounded-4xl overflow-hidden bg-black text-white flex mx-auto flex-col items-center text-center relative sm:px-6 lg:px-8 z-1">
      <div className="relative antialiased w-full justify-center items-center absolute inset -top-[50vh] blur-xl z-1">
        <div className="absolute w-[100vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[5vh] left-[70%] rounded-full blur-3xl"></div>
        <div className="absolute w-[50vh] h-[50vh] bg-radial from-[#60a5fa]/40 to-transparent top-[100vh] left-[40%] rounded-full blur-3xl"></div>
        <div className="absolute w-[70vh] h-[100vh] bg-radial from-[#60a5fa] to-transparent top-[150vh] rounded-full blur-3xl left-[-20%]"></div>
      </div>
      <div className="w-full flex flex-col items-center justify-center pt-[14vh] pb-20 z-10 px-5 md:px-10 relative">
        <h1
          className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-shine text-[#e5eae6] w-full max-w-4xl mt-0 ${myFont.className}`}
        >
          Powerful analytics for social media trends.
        </h1>
        <p className="text-base text-[#e5eae6]/50 mt-6 sm:mt-8 max-w-2xl px-4">
          <span className="text-[#e5eae6]">Create and analyze trend lists</span>{" "}
          with advanced metrics that track engagement across platforms. Our
          tools are{" "}
          <span className="text-[#e5eae6]">
            built for content creators and social media professionals.
          </span>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10 w-full max-w-6xl relative">
          {/* First Row */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-start justify-end overflow-hidden bg-[#ffffff11] backdrop-blur-3xl rounded-3xl min-h-[500px]">
            <div className="absolute w-full top-[30%] md:h-full z-10 text-left px-10">
              <h2 className="text-5xl text-[#e5eae6] font-light">83M</h2>
              <p className="text-xl text-[#e5eae6]/50 mt-2">
                Views across all platforms
              </p>
            </div>
            <div className="absolute w-[120%] -right-[35%] -top-[27%] h-full z-10 opacity-50">
              <World data={sampleArcs} globeConfig={globeConfig} />
            </div>
            <div className="w-full overflow-x-scroll z-10 hide-x-scrollbar  px-10">
              <div className="mb-4 text-[#e5eae6] flex flex-wrap gap-2 w-[1150px]">
                <div className="flex gap-2 w-[180px] items-center justify-center py-2 px-4 rounded-full bg-[#ffffff22] backdrop-blur-xl">
                  <TrendingUp className="w-4 h-4" />
                  <p>
                    <span className="text-[#e5eae6]/60 text-sm">
                      54k trending posts
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-[180px] items-center justify-center py-2 px-4 rounded-full bg-[#ffffff22] backdrop-blur-xl">
                  <Share className="w-4 h-4" />
                  <p>
                    <span className="text-[#e5eae6]/60 text-sm">
                      35m total views
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-[180px] items-center justify-center py-2 px-4 rounded-full bg-[#ffffff22] backdrop-blur-xl">
                  <Atom className="w-4 h-4" />
                  <p>
                    <span className="text-[#e5eae6]/60 text-sm">
                      17k viral posts
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-[180px] items-center justify-center py-2 px-4 rounded-full bg-[#ffffff22] backdrop-blur-xl">
                  <BadgeDollarSign className="w-4 h-4" />
                  <p>
                    <span className="text-[#e5eae6]/60 text-sm">
                      89% engagement
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-[180px] items-center justify-center py-2 px-4 rounded-full bg-[#ffffff22] backdrop-blur-xl">
                  <Shield className="w-4 h-4" />
                  <p>
                    <span className="text-[#e5eae6]/60 text-sm">
                      24 active lists
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-[180px] items-center justify-center py-2 px-4 rounded-full bg-[#ffffff22] backdrop-blur-xl">
                  <ShieldCheck className="w-4 h-4" />
                  <p>
                    <span className="text-[#e5eae6]/60 text-sm">
                      46 new trends
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <h2 className="text-xl text-[#e5eae6] text-left  px-10">
              Global Trend Monitoring
            </h2>
            <p className="text-sm text-[#e5eae6]/50 mt-2 text-left  px-10 pb-10">
              Real-time trend detection across worldwide social platforms with
              advanced analytics and instant engagement tracking.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-5 flex flex-col items-end justify-end overflow-hidden bg-[#ffffff11] backdrop-blur-3xl p-10 rounded-3xl min-h-[500px] relative">
            <div className="absolute w-full h-full inset-0 top-0 flex items-center justify-center">
              {/* Chart placeholder - you would integrate your actual chart component here */}
              <div className="w-full h-full flex items-center p-10 justify-center">
                <div className="w-[80%] h-full rounded-lg relative">
                  <div className="absolute bottom-0 left-0 w-[15%] md:w-[10%] h-[30%] bg-gradient-to-b from-[#93c5fd] via-[#93c5fd]/10 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-14 left-0 w-full text-center flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#93c5fd] mb-1"></div>
                      <div className="text-[#e5eae6] font-medium">30%</div>
                      <div className="text-[#e5eae6]/60 text-xs">Likes</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[21%] w-[15%] md:w-[10%] h-[60%] bg-gradient-to-b from-[#60a5fa] via-[#60a5fa]/10 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-14 left-0 w-full text-center flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#60a5fa] mb-1"></div>
                      <div className="text-[#e5eae6] font-medium">60%</div>
                      <div className="text-[#e5eae6]/60 text-xs">Views</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[42%] w-[15%] md:w-[10%] h-[45%] bg-gradient-to-b from-[#2563eb] via-[#2563eb]/10 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-14 left-0 w-full text-center flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#2563eb] mb-1"></div>
                      <div className="text-[#e5eae6] font-medium">45%</div>
                      <div className="text-[#e5eae6]/60 text-xs">Replies</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[63%] w-[15%] md:w-[10%] h-[90%] bg-gradient-to-b from-[#e5eae6] via-[#e5eae6]/10 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-14 left-0 w-full text-center flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#e5eae6] mb-1"></div>
                      <div className="text-[#e5eae6] font-medium">90%</div>
                      <div className="text-[#e5eae6]/60 text-xs">
                        Engagement
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[84%] w-[15%] md:w-[10%] h-[35%] bg-gradient-to-b from-[#93c5fd] via-[#93c5fd]/10 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-14 left-0 w-full text-center flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#93c5fd] mb-1"></div>
                      <div className="text-[#e5eae6] font-medium">35%</div>
                      <div className="text-[#e5eae6]/60 text-xs">Shares</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl text-[#e5eae6]">Trend Analytics</h2>
            <p className="text-sm text-[#e5eae6]/50 mt-2 text-right">
              Advanced engagement visualization with performance metrics
              tracking social media trends across your lists.
            </p>
          </div>

          {/* Second Row */}
          <div className="col-span-1 text-start lg:col-span-5 flex flex-col items-start justify-end overflow-hidden bg-[#ffffff11] backdrop-blur-3xl p-10 rounded-3xl min-h-[500px]">
            <div className="absolute top-[20%] left-10 flex items-start gap-5">
              <div className="p-6 px-9 bg-[#ffffff22] rounded-2xl">
                <div className="flex items-center h-6 gap-2 mb-2">
                  <div className="w-1.5 h-6 bg-[#93c5fd] rounded-full"></div>
                  <span className="text-[#e5eae6]/50 text-sm">Analytics</span>
                </div>
                <span className="text-[#60a5fa]/80 text-xl">Growth</span>
                <h3 className="font-light text-5xl text-[#e5eae6] mt-2">84%</h3>
                <p className="text-[#60a5fa]/80 text-xl mt-2">+3.1M</p>
              </div>
              <div className="p-6 px-9 bg-[#ffffff22] opacity-40 rounded-2xl">
                <div className="flex items-center h-6 gap-2 mb-2">
                  <div className="w-1.5 h-6 bg-[#60a5fa] rounded-full"></div>
                  <span className="text-[#e5eae6]/50 text-sm">Tracking</span>
                </div>
                <span className="text-[#60a5fa]/80 text-xl">Lists</span>
                <h3 className="font-light text-5xl text-[#e5eae6] mt-2">546</h3>
                <p className="text-[#60a5fa]/80 text-xl mt-2">+1.9K</p>
              </div>
              <div className="p-6 px-9 bg-[#ffffff22] opacity-10 rounded-2xl">
                <div className="flex items-center h-6 gap-2 mb-2">
                  <div className="w-1.5 h-6 bg-[#93c5fd] rounded-full"></div>
                  <span className="text-[#e5eae6]/50 text-sm">Trending</span>
                </div>
                <span className="text-[#60a5fa]/80 text-xl">Posts</span>
                <h3 className="font-light text-5xl text-[#e5eae6] mt-2">92</h3>
                <p className="text-[#60a5fa]/80 text-xl mt-2">+4.5K</p>
              </div>
            </div>
            <div className="w-full mt-auto">
              <h2 className="text-xl text-[#e5eae6]">Your Analytics ROI</h2>
              <p className="text-sm text-[#e5eae6]/50 mt-2">
                Watch your content performance grow with advanced trend tracking
                in a robust ecosystem that's easy to monitor
              </p>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-start overflow-hidden bg-[#ffffff11] backdrop-blur-3xl p-10 rounded-3xl min-h-[500px]">
            <div className="w-full h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl text-[#e5eae6]">
                  Social Media Trend Suite
                </h2>
                <p className="text-sm text-[#e5eae6]/50 mt-2">
                  Comprehensive trend analysis with advanced monitoring,
                  automated engagement tracking, and content insights designed
                  for modern social media workflows.
                </p>
              </div>
              <div className="w-full h-full flex items-center md:p-10 pb-0 justify-center">
                <div className="w-[120%] h-full rounded-lg relative">
                  <div className="absolute bottom-0 left-0 w-[15%] h-[30%] bg-gradient-to-b from-[#e5eae6] via-[#e5eae6]/30 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-6 left-0 w-full text-center flex flex-col items-center">
                      <div className="text-[#e5eae6] font-medium">42%</div>
                    </div>
                    <div className="text-[#e5eae6]/60 mt-2 text-xs truncate max-w-full p-1">
                      January
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[21%] w-[15%] h-[60%] bg-gradient-to-b from-[#93c5fd] via-[#93c5fd]/30 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-6 left-0 w-full text-center flex flex-col items-center">
                      <div className="text-[#e5eae6] font-medium">74%</div>
                    </div>
                    <div className="text-[#e5eae6]/60 mt-2 text-xs truncate max-w-full p-1">
                      February
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[42%] w-[15%] h-[45%] bg-gradient-to-b from-[#60a5fa] via-[#60a5fa]/30 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-6 left-0 w-full text-center flex flex-col items-center">
                      <div className="text-[#e5eae6] font-medium">51%</div>
                    </div>
                    <div className="text-[#e5eae6]/60 mt-2 text-xs truncate max-w-full p-1">
                      March
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[63%] w-[15%] h-[80%] bg-gradient-to-b from-[#2563eb] via-[#2563eb]/30 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-6 left-0 w-full text-center flex flex-col items-center">
                      <div className="text-[#e5eae6] font-medium">88%</div>
                    </div>
                    <div className="text-[#e5eae6]/60 mt-2 text-xs truncate max-w-full p-1">
                      April
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[84%] w-[15%] h-[35%] bg-gradient-to-b from-[#60a5fa] via-[#60a5fa]/30 to-transparent rounded-sm mx-[3%]">
                    <div className="absolute -top-6 left-0 w-full text-center flex flex-col items-center">
                      <div className="text-[#e5eae6] font-medium">39%</div>
                    </div>
                    <div className="text-[#e5eae6]/60 mt-2 text-xs truncate max-w-full p-1">
                      May
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
