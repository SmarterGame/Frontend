/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URI: process.env.BACKEND_URI,
  },
  images: {
    domains: ['robohash.org'],
  },
}

module.exports = nextConfig
