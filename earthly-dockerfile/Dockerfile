# Stage 1: Build Rust
FROM rust:1.74-bookworm as builder_rust

# Set the working directory in the container
WORKDIR /app

RUN apt update && apt install -y nodejs curl npm
RUN npm install --global corepack
RUN corepack enable

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./

# Copy the Rust source files
COPY rust ./rust

# Compile Rust project
RUN yarn build:rust

# Stage 1: Build Node
FROM node:20 as builder_node

# Set the working directory in the container
WORKDIR /app

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy required Rust files
COPY --from=builder_rust /app/rust/index.node ./rust/
COPY --from=builder_rust /app/rust/index.d.ts ./rust/

# Copy the TypeScript source files
COPY src ./src
COPY tsconfig.json ./

# Transpile TypeScript to JavaScript
RUN yarn build:node

# Stage 2: Final
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production

# Copy the transpiled JavaScript from the builder stage
COPY --from=builder_node /app/dist ./dist
COPY --from=builder_rust /app/rust/index.node ./rust/
COPY --from=builder_rust /app/rust/index.d.ts ./rust/

# Set the command to start the node server
CMD ["node", "dist/index.js"]
