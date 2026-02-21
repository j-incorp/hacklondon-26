package common

import (
	"log/slog"
	"os"
	"time"

	"github.com/lmittmann/tint"
)

func InitLogger() {
	w := os.Stderr

	// Set global logger with custom options
	slog.SetDefault(slog.New(
		tint.NewHandler(w, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.Kitchen,
		}),
	))
}
