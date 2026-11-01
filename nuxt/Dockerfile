# Author: Kevin Pabón
# Nuxt image, multi-stage: the builder stage compiles the app and prerenders
# the blog, and the final stage only runs the compiled .output/ (not in git).

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
# without an explicit host the server may listen only inside the container
ENV HOST=0.0.0.0
ENV PORT=3000
# Nitro bundles every runtime dependency into .output, so no node_modules here
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
