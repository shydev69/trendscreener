import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent the problematic lightningcss module from being loaded
    config.module.rules.push({
      test: /lightningcss\..*\.node$/,
      use: "null-loader",
    });

    // Only use style-loader on client side
    if (!isServer) {
      config.module.rules.push({
        test: /react-tweet\/.*\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
        ],
      });
    } else {
      // Server-side handling with correct option
      config.module.rules.push({
        test: /react-tweet\/.*\.module\.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
                exportOnlyLocals: true, // <-- move here, inside modules
              },
              importLoaders: 1,
            },
          },
        ],
      });
    }

    return config;
  },
};

export default nextConfig;
