/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URI: process.env.BACKEND_URI,
  }
}

module.exports = nextConfig
