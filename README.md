# Node.js S3 Streaming Upload

A proof-of-concept application demonstrating efficient file streaming to S3 through a Node.js backend, using multipart uploads and memory-efficient streaming.

## Features

- Direct streaming of files to S3 without storing on the server
- Memory-efficient handling of large files using multipart uploads
- Support for any file type through multipart/form-data
- Simple web interface for file uploads
- Express.js backend with TypeScript
- Handlebars templating for the frontend
- Environment-based configuration

## Prerequisites

- Bun (https://bun.sh)
- S3-compatible storage (AWS S3 or compatible services)
- Environment variables configured

## Environment Variables

Create a `.env.local` file with the following variables:

```env
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
S3_REGION=your_region
S3_ENDPOINT=your_s3_endpoint
```

## Installation

```bash
# Using Bun (recommended)
bun install
```

## Running the Application

```bash
# Using Bun
bun run index.ts
```

The application will be available at `http://localhost:3000`

## Technical Details

- Uses `busboy` for efficient multipart form parsing
- Implements S3 multipart upload with 5MB minimum chunk size
- Streams file data directly to S3 without intermediate disk storage
- Handles upload errors with proper cleanup of multipart uploads
- TypeScript for type safety and better development experience

## Project Structure

- `index.ts` - Main application entry point and Express server setup
- `s3.ts` - S3 client configuration and upload logic
- `env.ts` - Environment variable validation

## Security Considerations

- Never stores files on the server disk
- Validates content types and file metadata
- Uses environment variables for sensitive configuration
- Implements proper error handling and cleanup

## Limitations

- This is a proof of concept and may need additional error handling for production use
- No authentication/authorization implemented
- Basic frontend interface
- Limited file upload progress feedback

## License

MIT

```bash
bun install
```

```bash
bun run index.ts
```

