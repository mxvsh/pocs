import {
	S3,
	CreateMultipartUploadCommand,
	UploadPartCommand,
	CompleteMultipartUploadCommand,
	AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import type { Request } from 'express';
import { env } from './env';
import { Buffer } from 'buffer';
import busboy from 'busboy';
import ora from 'ora';

const s3Client = new S3({
	region: env.S3_REGION,
	endpoint: env.S3_ENDPOINT,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY_ID,
		secretAccessKey: env.S3_SECRET_ACCESS_KEY,
	},
});

// 5MB minimum part size as required by S3
const MIN_PART_SIZE = 5 * 1024 * 1024;

export async function uploadFileToS3(
	req: Request,
	filename: string,
	mimetype: string
): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const key = `uploads/${Date.now()}-${filename}`;
		let uploadId: string;
		let currentBuffer: Buffer[] = [];
		let currentBufferSize = 0;
		let totalBytesUploaded = 0;
		let fileSize = parseInt(req.headers['content-length'] || '0', 10);

		// Create main spinner for overall progress
		const mainSpinner = ora({
			text: `Starting upload of ${filename}...`,
			color: 'blue',
		}).start();

		try {
			// Create multipart upload
			const createMultipartUpload = await s3Client.send(
				new CreateMultipartUploadCommand({
					Bucket: env.S3_BUCKET_NAME,
					Key: key,
					ContentType: mimetype,
				})
			);

			uploadId = createMultipartUpload.UploadId!;
			const parts: { ETag: string; PartNumber: number }[] = [];
			let partNumber = 1;

			// Function to upload a part
			const uploadPart = async (
				buffer: Buffer,
				isLastPart: boolean = false
			) => {
				try {
					// Only upload if buffer has data
					if (buffer.length === 0) return;

					mainSpinner.text = `Uploading part ${partNumber}...`;

					const uploadPartResult = await s3Client.send(
						new UploadPartCommand({
							Bucket: env.S3_BUCKET_NAME,
							Key: key,
							UploadId: uploadId,
							PartNumber: partNumber,
							Body: buffer,
						})
					);

					if (uploadPartResult.ETag) {
						parts.push({
							ETag: uploadPartResult.ETag,
							PartNumber: partNumber,
						});
						totalBytesUploaded += buffer.length;

						// Update progress
						const progress = (totalBytesUploaded / fileSize) * 100;
						mainSpinner.text = `Overall progress: ${progress.toFixed(
							2
						)}% (${formatBytes(totalBytesUploaded)} / ${formatBytes(
							fileSize
						)})`;
						partNumber++;
					}
				} catch (error) {
					console.error('Error uploading part:', error);
					throw error;
				}
			};

			// Set up streaming with busboy
			const bb = busboy({ headers: req.headers });

			bb.on('file', (_, file) => {
				// Handle incoming data chunks
				file.on('data', async (chunk: Buffer) => {
					try {
						currentBuffer.push(chunk);
						currentBufferSize += chunk.length;

						// Upload part when buffer size exceeds minimum part size
						if (currentBufferSize >= MIN_PART_SIZE) {
							const bufferToUpload = Buffer.concat(currentBuffer);
							currentBuffer = [];
							currentBufferSize = 0;
							await uploadPart(bufferToUpload);
						}
					} catch (error) {
						mainSpinner.fail('Upload failed');
						console.error('Error processing chunk:', error);
						// Abort multipart upload on error
						await s3Client.send(
							new AbortMultipartUploadCommand({
								Bucket: env.S3_BUCKET_NAME,
								Key: key,
								UploadId: uploadId,
							})
						);
						reject(new Error('Failed to upload file part'));
					}
				});

				file.on('end', async () => {
					try {
						// Upload any remaining data as the last part
						if (currentBufferSize > 0) {
							const finalBuffer = Buffer.concat(currentBuffer);
							await uploadPart(finalBuffer, true);
						}

						mainSpinner.text = 'Completing multipart upload...';

						// Complete multipart upload
						await s3Client.send(
							new CompleteMultipartUploadCommand({
								Bucket: env.S3_BUCKET_NAME,
								Key: key,
								UploadId: uploadId,
								MultipartUpload: {
									Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
								},
							})
						);

						mainSpinner.succeed(`Upload completed successfully: ${filename}`);
						resolve(`${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${key}`);
					} catch (error) {
						mainSpinner.fail('Upload failed during completion');
						console.error('Error completing multipart upload:', error);
						// Abort multipart upload on error
						await s3Client.send(
							new AbortMultipartUploadCommand({
								Bucket: env.S3_BUCKET_NAME,
								Key: key,
								UploadId: uploadId,
							})
						);
						reject(new Error('Failed to complete multipart upload'));
					}
				});
			});

			bb.on('error', async (error) => {
				mainSpinner.fail('Upload failed');
				console.error('Error parsing form data:', error);
				if (uploadId) {
					// Abort multipart upload on error
					await s3Client.send(
						new AbortMultipartUploadCommand({
							Bucket: env.S3_BUCKET_NAME,
							Key: key,
							UploadId: uploadId,
						})
					);
				}
				reject(new Error('Failed to parse upload data'));
			});

			// Pipe request to busboy
			req.pipe(bb);
		} catch (error) {
			mainSpinner.fail('Upload failed during initialization');
			console.error('Error initiating multipart upload:', error);
			reject(new Error('Failed to initiate multipart upload'));
		}
	});
}

// Helper function to format bytes into human readable format
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default s3Client;
