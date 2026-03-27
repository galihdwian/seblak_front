const withFlowbiteReact = require("flowbite-react/plugin/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "ImageLoader.js",
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH
}

module.exports = withFlowbiteReact(nextConfig)