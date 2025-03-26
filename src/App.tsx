import { useState, useRef, useEffect } from 'react';
import './App.css';
import EmojiPicker from './components/EmojiPicker';
import AsciiArtRenderer from './components/AsciiArtRenderer';
import ThemeControls from './components/ThemeControls';
import ExportOptions from './components/ExportOptions';
import { applyStyleToAscii } from './utils/emojiToAscii';
import { emojiToAsciiArt } from './utils/canvasConverter';

function App() {
	const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
	const [asciiArt, setAsciiArt] = useState<string>('');
	const [theme, setTheme] = useState<string>('light');
	const [fontSize, setFontSize] = useState<number>(16);
	const [fontColor, setFontColor] = useState<string>('#000000');
	const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
	const [density, setDensity] = useState<number>(1);
	const [asciiWidth, setAsciiWidth] = useState<number>(60);
	const [asciiHeight, setAsciiHeight] = useState<number>(30);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const asciiArtRef = useRef<HTMLDivElement>(null);

	// Update ASCII art when emoji or style changes
	useEffect(() => {
		if (selectedEmoji) {
			setIsLoading(true);

			// Generate ASCII art from emoji using canvas
			emojiToAsciiArt(selectedEmoji, asciiWidth, asciiHeight)
				.then((art) => {
					const styledArt = applyStyleToAscii(art, density);
					setAsciiArt(styledArt);
				})
				.catch((error) => {
					console.error('Error generating ASCII art:', error);
					setAsciiArt(`Failed to generate ASCII art: ${error.message}`);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [selectedEmoji, density, asciiWidth, asciiHeight]);

	// Update colors based on theme
	useEffect(() => {
		if (theme === 'dark') {
			setFontColor((prevColor) =>
				prevColor === '#000000' ? '#FFFFFF' : prevColor
			);
			setBackgroundColor((prevBg) =>
				prevBg === '#FFFFFF' ? '#303030' : prevBg
			);
		} else {
			setFontColor((prevColor) =>
				prevColor === '#FFFFFF' ? '#000000' : prevColor
			);
			setBackgroundColor((prevBg) =>
				prevBg === '#303030' ? '#FFFFFF' : prevBg
			);
		}
	}, [theme]);

	const handleEmojiSelect = (emoji: string) => {
		setSelectedEmoji(emoji);
	};

	return (
		<div
			className={`min-h-screen ${
				theme === 'dark'
					? 'bg-gray-900 text-white'
					: 'bg-gray-100 text-gray-900'
			}`}
		>
			<header className='py-6 text-center'>
				<h1 className='text-3xl font-bold'>Emoji to ASCII Art Converter</h1>
				<p className='mt-2'>Select an emoji to convert it to ASCII art</p>
			</header>

			<main className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
						<div className='mb-6'>
							<h2 className='text-xl font-semibold mb-4'>Choose an Emoji</h2>
							<EmojiPicker onEmojiSelect={handleEmojiSelect} theme={theme} />
							{selectedEmoji && (
								<div className='text-center mt-4'>
									<span className='text-6xl'>{selectedEmoji}</span>
								</div>
							)}
						</div>

						<div className='mt-8'>
							<ThemeControls
								fontSize={fontSize}
								setFontSize={setFontSize}
								fontColor={fontColor}
								setFontColor={setFontColor}
								backgroundColor={backgroundColor}
								setBackgroundColor={setBackgroundColor}
								density={density}
								setDensity={setDensity}
								theme={theme}
								setTheme={setTheme}
							/>

							{/* ASCII size controls */}
							<div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label
										htmlFor='ascii-width'
										className='block text-sm font-medium mb-1'
									>
										Width: {asciiWidth} chars
									</label>
									<input
										id='ascii-width'
										type='range'
										min='20'
										max='100'
										value={asciiWidth}
										onChange={(e) => setAsciiWidth(Number(e.target.value))}
										className='w-full'
									/>
								</div>
								<div>
									<label
										htmlFor='ascii-height'
										className='block text-sm font-medium mb-1'
									>
										Height: {asciiHeight} chars
									</label>
									<input
										id='ascii-height'
										type='range'
										min='10'
										max='50'
										value={asciiHeight}
										onChange={(e) => setAsciiHeight(Number(e.target.value))}
										className='w-full'
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
						<h2 className='text-xl font-semibold mb-4'>ASCII Art Output</h2>

						{isLoading ? (
							<div className='flex justify-center items-center h-40'>
								<div className='text-center'>
									<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
									<p className='mt-2'>Generating ASCII art...</p>
								</div>
							</div>
						) : (
							<AsciiArtRenderer
								ref={asciiArtRef}
								asciiArt={asciiArt}
								fontSize={fontSize}
								fontColor={fontColor}
								backgroundColor={backgroundColor}
							/>
						)}

						<div className='mt-6'>
							<ExportOptions
								targetRef={asciiArtRef}
								asciiArt={asciiArt}
								disabled={!asciiArt || isLoading}
							/>
						</div>
					</div>
				</div>
			</main>

			<footer className='py-6 text-center text-sm text-gray-500 dark:text-gray-400'>
				<p>Created with React and TailwindCSS</p>
			</footer>
		</div>
	);
}

export default App;
