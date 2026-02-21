FROM docker.io/golang:1.25 as build-stage

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build ./cmd/http

FROM docker.io/busybox:latest

WORKDIR /app

COPY --from=build-stage /app/http .

EXPOSE 8080

CMD ["./http"]