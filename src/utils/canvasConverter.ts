// ASCII characters from darkest to lightest (denser characters for darker pixels)
const ASCII_CHARS = [
	'$',
	'@',
	'B',
	'%',
	'8',
	'&',
	'W',
	'M',
	'#',
	'*',
	'o',
	'a',
	'h',
	'k',
	'b',
	'd',
	'p',
	'q',
	'w',
	'm',
	'Z',
	'O',
	'0',
	'Q',
	'L',
	'C',
	'J',
	'U',
	'Y',
	'X',
	'z',
	'c',
	'v',
	'u',
	'n',
	'x',
	'r',
	'j',
	'f',
	't',
	'/',
	'\\',
	'|',
	'(',
	')',
	'1',
	'{',
	'}',
	'[',
	']',
	'?',
	'-',
	'_',
	'+',
	'~',
	'<',
	'>',
	'i',
	'!',
	'l',
	'I',
	';',
	':',
	',',
	'"',
	'^',
	'`',
	"'",
	'.',
	' ',
];

/**
 * Converts an emoji to ASCII art using canvas to analyze the emoji visually
 * @param emoji The emoji to convert
 * @param width The width of the output ASCII art
 * @param height The height of the output ASCII art
 * @returns A promise that resolves to the ASCII art string
 */
export function emojiToAsciiArt(
	emoji: string,
	width: number = 40,
	height: number = 20
): Promise<string> {
	return new Promise((resolve) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			resolve(`Failed to create canvas context for emoji: ${emoji}`);
			return;
		}

		// Set canvas size (larger for better sampling)
		const canvasSize = Math.max(width, height) * 2;
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		// Clear canvas with a transparent background
		ctx.clearRect(0, 0, canvasSize, canvasSize);

		// Draw emoji centered on canvas
		ctx.font = `${canvasSize * 0.75}px Arial`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(emoji, canvasSize / 2, canvasSize / 2);

		// Get image data
		const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
		const data = imageData.data;

		// Calculate sampling parameters
		const sampleWidth = canvasSize / width;
		const sampleHeight = canvasSize / height;

		// Generate ASCII art
		let asciiArt = '';

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// Calculate the region of pixels to sample
				const startX = Math.floor(x * sampleWidth);
				const startY = Math.floor(y * sampleHeight);
				const endX = Math.floor((x + 1) * sampleWidth);
				const endY = Math.floor((y + 1) * sampleHeight);

				// Sample brightness in this region
				let totalBrightness = 0;
				let sampleCount = 0;
				let hasContent = false;

				for (let sy = startY; sy < endY; sy++) {
					for (let sx = startX; sx < endX; sx++) {
						const pixelIndex = (sy * canvasSize + sx) * 4;
						const r = data[pixelIndex];
						const g = data[pixelIndex + 1];
						const b = data[pixelIndex + 2];
						const a = data[pixelIndex + 3];

						// Skip transparent pixels
						if (a < 50) continue;

						hasContent = true;
						const brightness = (0.299 * r + 0.587 * g + 0.114 * b) * (a / 255);
						totalBrightness += brightness;
						sampleCount++;
					}
				}

				// If no content was found in this sample, use space
				if (!hasContent || sampleCount === 0) {
					asciiArt += ' ';
				} else {
					// Calculate average brightness and map to ASCII character
					const avgBrightness = totalBrightness / sampleCount;
					// Invert the brightness mapping (darker pixels get denser characters)
					const charIndex = Math.floor(
						((255 - avgBrightness) / 255) * (ASCII_CHARS.length - 1)
					);
					asciiArt += ASCII_CHARS[charIndex];
				}
			}
			asciiArt += '\n';
		}

		resolve(asciiArt);
	});
}
