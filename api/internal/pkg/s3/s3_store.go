package s3

import (
	"context"
	"log/slog"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Store struct {
	accessKey  string
	secretKey  string
	bucketName string

	presignClient *s3.PresignClient
}

func NewS3Store(ctx context.Context, accessKey, secretKey, bucketName string) (*S3Store, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, err
	}

	cl := s3.NewFromConfig(cfg)
	pr := s3.NewPresignClient(cl)

	return &S3Store{
		accessKey:     accessKey,
		secretKey:     secretKey,
		bucketName:    bucketName,
		presignClient: pr,
	}, nil
}

// GetPresignedURL creates a presigned URL that the client can send a PUT request to in order to
// upload a file to the staging bucket.
func (s *S3Store) GetPresignedURL(ctx context.Context, key string, filetype string, size uint64) (string, error) {
	req, err := s.presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:        aws.String(s.bucketName),
		Key:           aws.String(key),
		ContentType:   aws.String(filetype),
		ContentLength: aws.Int64(int64(size)),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = 10 * time.Minute
	})

	if err != nil {
		slog.Error("Failed to create presigned URL", "err", err)
		return "", err
	}

	return req.URL, nil
}
