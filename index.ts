import express from 'express';
import { engine } from 'express-handlebars';
import { uploadFileToS3 } from './s3';
import type { Request, Response } from 'express';

const app = express();
const port = 3000;

// Set up Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (_: Request, res: Response): void => {
	res.render('home');
});

app.post('/upload', async (req: Request, res: Response): Promise<void> => {
	if (!req.headers['content-type']?.includes('multipart/form-data')) {
		res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
		return;
	}

	try {
		// Get the boundary from the content type
		const boundary = req.headers['content-type'].split('boundary=')[1];
		if (!boundary) {
			res.status(400).json({ error: 'No boundary found in content type' });
			return;
		}

		const filename =
			Buffer.from(req.headers['x-file-name'] as string, 'base64').toString() ||
			'unknown-file';
		const mimetype = req.headers['content-type'];

		// Stream directly to S3
		const fileUrl = await uploadFileToS3(
			req, // Pass the request stream directly
			filename,
			mimetype
		);

		res.json({
			message: 'File uploaded successfully',
			fileUrl,
			file: {
				originalname: filename,
				mimetype: mimetype,
			},
		});
	} catch (error) {
		console.error('Upload error:', error);
		res.status(500).json({
			error: 'Failed to upload file',
			details: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
	console.log('SIGINT signal received');
	process.exit(0);
});
