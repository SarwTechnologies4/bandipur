# Step 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy app source and build
COPY . .
RUN npm run build

# Step 2: Run with production server
FROM node:18-alpine
WORKDIR /app

# Copy built app and dependencies
COPY --from=builder /app ./

# Set environment variables (optional)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
