FROM docker.io/node:24 as build-stage

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN npm i -g pnpm
RUN pnpm i

COPY . .

RUN pnpm run build

FROM docker.io/nginx:latest

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist ./

EXPOSE 80