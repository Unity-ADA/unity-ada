/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    // Ignore the 'async/await' warning
    config.ignoreWarnings = [/The generated code contains 'async\/await'/];
    return config;
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
