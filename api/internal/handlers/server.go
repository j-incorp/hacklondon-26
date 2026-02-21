package handlers

type Environment struct {
	AwsAccessKey        string `env:"AWS_ACCESS_KEY,required"`
	AwsSecretKey        string `env:"AWS_SECRET_KEY,required"`
	AwsBucketName       string `env:"AWS_BUCKET_NAME,required"`
	AwsCloudFrontPrefix string `env:"AWS_CLOUD_FRONT_PREFIX,required"`
}

type Server struct {
	Env Environment
}
