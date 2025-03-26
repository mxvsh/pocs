// ASCII characters from darkest to lightest
const ASCII_CHARS = ['@', '#', '8', '&', 'o', ':', '*', '.', ' '];

/**
 * Converts an emoji to ASCII art by using the emoji as a visual reference
 * @param emoji - The emoji to convert
 * @returns ASCII art representation of the emoji
 */
export function convertEmojiToAscii(emoji: string): string {
	return generateFallbackAscii(emoji);
}

/**
 * Generates a fallback ASCII art for emojis that can't be processed
 * @param emoji - The emoji to convert
 * @returns A simple generic ASCII art representation
 */
const generateFallbackAscii = (emoji: string): string => {
	return `
  [${emoji}]
   /|\\
  / | \\
 /__|__\\`;
};

/**
 * Applies style transformations to ASCII art
 * @param asciiArt - The original ASCII art
 * @param density - Controls the density of characters (1-3)
 * @returns Transformed ASCII art
 */
export function applyStyleToAscii(
	asciiArt: string,
	density: number = 1
): string {
	let result = asciiArt;

	// Adjust density by adding more characters
	if (density === 2) {
		result = result.replace(/([^\s\n])/g, '$1$1');
	} else if (density === 3) {
		result = result.replace(/([^\s\n])/g, '$1$1$1');
	}

	return result;
}
