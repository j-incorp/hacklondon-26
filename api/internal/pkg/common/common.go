package common

import (
	"log/slog"
	"os"
	"time"

	"github.com/Netflix/go-env"
	"github.com/joho/godotenv"
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

// LoadEnvironment loads from a ".env" file into the given struct. Panics if there is an error
// unmarshalling the environment vars. Does not panic if no ".env" file is found, but will log a
// message to indicate that this has occurred.
func LoadEnvironment(v any) {
	slog.Info("Loading environment")
	// godotenv does not overwrite existing variables, this will only have an effect in dev where
	// vars haven't already been set.
	err := godotenv.Load()
	if err != nil {
		slog.Info("No .env file found")
		slog.Info("Using existing environment")
	}

	// Load environment variables
	_, err = env.UnmarshalFromEnviron(v)
	if err != nil {
		slog.Error("Failed to read all required environment variables", "err", err)
		panic(err)
	}
}
