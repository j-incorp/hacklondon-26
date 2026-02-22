package internal

import (
	"context"
	"net/http"

	"hacklondon26/internal/handlers"
	"hacklondon26/internal/pkg/common"
	"hacklondon26/internal/pkg/s3"
	"log/slog"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Start() {
	common.InitLogger()
	var env handlers.Environment
	common.LoadEnvironment(&env)

	s3Store, err := s3.NewS3Store(context.Background(), env.AwsBucketName)
	if err != nil {
		slog.Error("Failed to initialise S3 store", "error", err)
		panic(err)
	}

	server := &handlers.Server{Env: env, S3Store: s3Store}

	slog.Info("Starting server")

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/lobby", server.CreateLobby)
	r.GET("/lobby/:code", server.JoinLobby)
	r.POST("/lobby/:code/start", server.StartGame)
	r.GET("/lobby/:code/reconnect", server.Reconnect)
	r.POST("/upload", server.GetPresignedURL)
	r.POST("/lobby/:code/end", server.EndGame)

	if err := r.Run(":8080"); err != nil {
		slog.Error("server exited", "error", err)
	}
}
