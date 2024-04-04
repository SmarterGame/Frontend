FROM node:18-alpine as base
# Install dependencies only when needed

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app



COPY package.json package-lock.json*  ./

RUN \
	if [ -f package-lock.json ]; then npm ci; \
	else echo "Lockfile not found." && exit 1; \
	fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG AUTH0_SECRET
ARG AUTH0_BASE_URL
ARG AUTH0_ISSUER_BASE_URL="https://smarter.eu.auth0.com"
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET

ARG BACKEND_URI
ENV BACKEND_URI=${BACKEND_URI}
ARG AUDIENCE="https://smartgame.eu.auth0.com/api/v2/"
ARG AUTH0_SCOPE="openid profile email"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN export AUTH0_BASE_URL=${AUTH0_BASE_URL} && \
	export AUTH0_SECRET=${AUTH0_SECRET} && \
	export AUTH0_ISSUER_BASE_URL=${AUTH0_ISSUER_BASE_URL} && \
	export AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID} && \
	export AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET} && \
	export AUDIENCE=${AUDIENCE} && \
	export AUTH0_SCOPE=${AUTH0_SCOPE} && \
	npm run build


FROM gcr.io/distroless/nodejs20-debian12:nonroot
COPY --from=builder /app/.next/standalone/ /app
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next/static /app/.next/static
ENV HOSTNAME "0.0.0.0"
# nonroot user id
USER 65532 
EXPOSE 3000
WORKDIR /app
CMD ["server.js"]
