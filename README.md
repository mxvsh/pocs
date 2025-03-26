# Emoji to ASCII Art Converter

A web application that converts emojis to ASCII art by analyzing the visual representation of the emoji. The app renders dynamic ASCII art character by character, similar to the image example, rather than using predefined mappings.

## How It Works

The emoji-to-ASCII art conversion process works through these steps:

1. **Rendering**: When an emoji is selected, it's rendered onto an HTML Canvas element
2. **Pixel Analysis**: The application analyzes the pixel data from the rendered emoji
3. **Brightness Mapping**: Each pixel's brightness is calculated and mapped to an appropriate ASCII character
   - Darker areas are represented by denser characters like `@`, `#`, `$`
   - Lighter areas use more sparse characters like `.`, `,`, `'`
   - Transparent areas are represented by spaces
4. **ASCII Assembly**: The characters are assembled into a grid to form the ASCII art representation
5. **Styling**: The ASCII art can be customized with various style options

The result is visually similar to the original emoji, captured in ASCII characters.

## Features

- **Dynamic Conversion**: Uses canvas rendering instead of predefined mappings to generate authentic ASCII art
- **Real-time Adjustment**: Controls for width, height, and density of the ASCII output
- **Theme Customization**: Adjust font size, color, background, and character density
- **Export Options**: Copy ASCII art to clipboard or download as an image
- **Light/Dark Mode**: Switch between light and dark themes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/emoji-to-art.git
cd emoji-to-art
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Click the "Open Emoji Picker" button to select an emoji
2. The application will render the emoji onto a canvas and analyze its pixels
3. ASCII art is generated based on the brightness values of the emoji's pixels
4. Customize the appearance using the controls:
   - Adjust font size and colors
   - Change the width and height of the ASCII output
   - Modify character density for different levels of detail
   - Toggle between light and dark themes
5. Export your creation:
   - Copy to clipboard for pasting elsewhere
   - Export as PNG image

## Technical Implementation

The conversion process involves:

```typescript
// Simplified version of the core conversion logic
function emojiToAsciiArt(emoji, width, height) {
  // Create a canvas and render the emoji
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Draw the emoji on the canvas
  ctx.font = `${canvasSize * 0.75}px Arial`;
  ctx.fillText(emoji, canvasSize/2, canvasSize/2);
  
  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  
  // Convert to ASCII characters
  let asciiArt = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate brightness and map to ASCII character
      const avgBrightness = calculateBrightness(x, y);
      const charIndex = mapBrightnessToCharacter(avgBrightness);
      asciiArt += ASCII_CHARS[charIndex];
    }
    asciiArt += '\n';
  }
  
  return asciiArt;
}
```

## Tech Stack

- React with TypeScript
- TailwindCSS for styling
- HTML Canvas API for emoji rendering
- Emoji Mart for emoji selection
- html-to-image for export functionality

## Credits

- [Junaid Ahmed](https://github.com/ajstudd) for the idea

## License

MIT
