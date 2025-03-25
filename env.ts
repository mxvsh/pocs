import { cleanEnv, str } from 'envalid';

export const env = cleanEnv(process.env, {
	S3_BUCKET_NAME: str(),
	S3_ACCESS_KEY_ID: str(),
	S3_SECRET_ACCESS_KEY: str(),
	S3_REGION: str(),
	S3_ENDPOINT: str(),
});
