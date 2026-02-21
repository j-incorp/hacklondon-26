package handlers

import "hacklondon26/internal/pkg/s3"

type Environment struct {
	AwsBucketName       string `env:"AWS_BUCKET_NAME,required"`
	AwsCloudFrontPrefix string `env:"AWS_CLOUD_FRONT_PREFIX,required"`
}

type Server struct {
	Env     Environment
	S3Store *s3.S3Store
}
