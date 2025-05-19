import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-tweet"],
  webpack: (config, { isServer }) => {
    // Prevent the problematic lightningcss module from being loaded
    config.module.rules.push({
      test: /lightningcss\..*\.node$/,
      use: "null-loader",
    });

    // Find and modify the CSS module rule
    const cssRule = config.module.rules.find(
      (rule: any) =>
        typeof rule === "object" && rule.oneOf && Array.isArray(rule.oneOf)
    );

    if (cssRule && cssRule.oneOf) {
      // Exclude react-tweet from CSS processing
      cssRule.oneOf.forEach((rule: any) => {
        if (rule.test && rule.test.toString().includes("module")) {
          if (!rule.exclude) {
            rule.exclude = [/node_modules\/react-tweet/];
          } else if (Array.isArray(rule.exclude)) {
            rule.exclude.push(/node_modules\/react-tweet/);
          } else {
            rule.exclude = [rule.exclude, /node_modules\/react-tweet/];
          }
        }
      });
    }

    // Only use style-loader on client side
    if (!isServer) {
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
    } else {
      // Server-side handling
      config.module.rules.push({
        test: /react-tweet\/.*\.module\.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: true,
              exportOnlyLocals: true,
            },
          },
        ],
      });
    }

    return config;
  },
};

export default nextConfig;
