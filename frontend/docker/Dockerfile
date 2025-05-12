# Stage 1: Install dependencies and build the application
FROM node:22-alpine AS build

WORKDIR /app

# Enable Corepack, set Yarn and add node_modules linker
RUN corepack enable && corepack prepare yarn@4.9.1 --activate
RUN echo 'nodeLinker: "node-modules"' > ./.yarnrc.yml

# Copy dependency files
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn install --immutable

# Copy the rest of the application
COPY . .

# Set environment variables for the build
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

# Build the application
RUN yarn build

# Stage 2: Production
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

# Copy built app
COPY --from=build /app/dist ./dist

# Set environment variables for production runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Change ownership of the app directory
RUN chown -R appuser:appgroup /app

EXPOSE ${PORT}

USER appuser

# Start the application
CMD ["node", "dist/server/entry.mjs"]
