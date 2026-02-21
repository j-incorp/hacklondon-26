package internal

import (
	"hacklondon26/internal/pkg/common"
	"log/slog"
)

func Start() {
	common.InitLogger()
	slog.Info("Starting server")
}
