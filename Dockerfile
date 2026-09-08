FROM node:24-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm --prefix backend ci && npm --prefix frontend ci

COPY backend ./backend
COPY frontend ./frontend

RUN npm --prefix frontend run build \
    && npm --prefix backend prune --omit=dev \
    && npm --prefix frontend prune --omit=dev

ENV NODE_ENV=production

CMD ["node", "backend/src/server.js"]
