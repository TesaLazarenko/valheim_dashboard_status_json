FROM oven/bun:1.3

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY ./dist ./dist
COPY ./server ./server

EXPOSE 3000

CMD ["bun"]
ENTRYPOINT ["bun", "/app/server/server.js"]
