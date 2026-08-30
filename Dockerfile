FROM node:20-bookworm-slim

# Install system audio dependencies, python 3.11+, and ffmpeg
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    python3-pip \
    make \
    g++ \
    build-essential \
    libsodium-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]
