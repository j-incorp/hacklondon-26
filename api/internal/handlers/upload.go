package handlers

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type presignRequest struct {
	Filetype string `json:"filetype" binding:"required"`
	Size     uint64 `json:"size" binding:"required"`
}

// GetPresignedURL returns a presigned S3 PUT URL that the client can use to
// upload an image. The key is a server-generated UUID so clients cannot
// overwrite arbitrary objects.
func (s *Server) GetPresignedURL(c *gin.Context) {
	var req presignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		slog.Debug("Invalid presign request", "error", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "filetype and size are required"})
		return
	}

	key := uuid.New().String()

	url, err := s.S3Store.GetPresignedURL(c.Request.Context(), key, req.Filetype, req.Size)
	if err != nil {
		slog.Error("Failed to generate presigned URL", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate upload URL"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"url": url,
		"key": key,
	})
}
