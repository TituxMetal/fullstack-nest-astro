# Stage 1: Install dependencies and generate Prisma client
FROM node:22-alpine AS deps

WORKDIR /app

# Enable Corepack, set Yarn 4.9.1 and add node_modules linker
RUN corepack enable && corepack prepare yarn@4.9.1 --activate
RUN echo 'nodeLinker: "node-modules"' > ./.yarnrc.yml

# Copy dependency files
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Install all dependencies (including dev) for Prisma generation
RUN yarn install --immutable

# Generate Prisma client
RUN yarn prisma generate

# Stage 2: Build the application
FROM node:22-alpine AS build

WORKDIR /app

# Enable Corepack, set Yarn 4.9.1 and add node_modules linker
RUN corepack enable && corepack prepare yarn@4.9.1 --activate
RUN echo 'nodeLinker: "node-modules"' > ./.yarnrc.yml

# Copy node_modules and Prisma files from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Build the application
RUN yarn build

# Stage 3: Production image
FROM node:22-alpine AS production

# Create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Enable Corepack, set Yarn 4.9.1 and add node_modules linker
RUN corepack enable && corepack prepare yarn@4.9.1 --activate
RUN echo 'nodeLinker: "node-modules"' > ./.yarnrc.yml

# Copy minimal files for production
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./

# Install only production dependencies
RUN yarn workspaces focus --production

# Copy built app and Prisma files
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

# Copy the start script for migration
COPY docker/start.sh ./

# Set environment variables for production runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:/data/dev.db"

# Set up data directory and permissions
RUN mkdir -p /data && \
    chown -R appuser:appgroup /data && \
    chown -R appuser:appgroup /app

EXPOSE ${PORT}

USER appuser

VOLUME ["/data"]

# Start the application
CMD ["/app/start.sh"]
