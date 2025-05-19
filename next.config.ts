import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent the problematic lightningcss module from being loaded
    config.module.rules.push({
      test: /lightningcss\..*\.node$/,
      use: "null-loader",
    });

    // Add a custom rule for CSS modules in react-tweet
    config.module.rules.push({
      test: /react-tweet\/.*\.module\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
