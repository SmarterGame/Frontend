/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	env: {
		BACKEND_URI: process.env.BACKEND_URI,
		AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
		AUTH0_SECRET: process.env.AUTH0_SECRET,
		AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
		AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
		AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
		AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
		AUTH0_SCOPE: process.env.AUTH0_SCOPE,
	},
	images: {
		domains: ["robohash.org"],
	},
};

module.exports = nextConfig

