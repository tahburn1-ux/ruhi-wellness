FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npx pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN npx pnpm build

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
