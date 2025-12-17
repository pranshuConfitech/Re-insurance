FROM --platform=linux/arm64 node:18-alpine as base

#RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app
COPY  next.config.mjs ./
COPY dist ./dist

COPY node_modules ./node_modules
COPY package.json ./package.json
COPY public ./public

EXPOSE 80


# Set the environment variable to force Next.js to run on port 80
ENV PORT=80
ENV AUTH_TRUST_HOST=true
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-http-header-size=24576 --dns-result-order=ipv4first"

# Define the entrypoint and pass multiple arguments including secret values
ENTRYPOINT ["sh", "-c", "npm start"]
