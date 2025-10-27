FROM oven/bun:1.3

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY ./dist .

EXPOSE 3000

CMD ["bun"]
ENTRYPOINT ["bun", "index.html"]
