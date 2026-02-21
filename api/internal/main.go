package internal

import (
	"net/http"

	"hacklondon26/internal/handlers"
	"hacklondon26/internal/pkg/common"
	"log/slog"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Start() {
	common.InitLogger()
	slog.Info("Starting server")

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/lobby", handlers.CreateLobby)
	r.POST("/lobby/:code", handlers.JoinLobby)

	if err := r.Run(":8080"); err != nil {
		slog.Error("server exited", "error", err)
	}
}
