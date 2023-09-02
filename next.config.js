/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    domains: ["uploadthing.com"],
  },
};

module.exports = nextConfig;
