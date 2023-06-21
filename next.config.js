/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URI: process.env.BACKEND_URI,
    MQTT_URI: process.env.MQTT_URI,
    MQTT_USER: process.env.MQTT_USER,
    MQTT_PSW: process.env.MQTT_PSW
  },
  images: {
    domains: ['robohash.org'],
  },
}

module.exports = nextConfig
