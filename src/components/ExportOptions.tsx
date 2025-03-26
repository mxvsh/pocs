import { toPng } from 'html-to-image';
import { RefObject } from 'react';

type ExportOptionsProps = {
	targetRef: RefObject<HTMLDivElement>;
	asciiArt: string;
	disabled: boolean;
};

export default function ExportOptions({
	targetRef,
	asciiArt,
	disabled,
}: ExportOptionsProps) {
	const copyToClipboard = () => {
		if (asciiArt) {
			navigator.clipboard
				.writeText(asciiArt)
				.then(() => {
					alert('ASCII art copied to clipboard!');
				})
				.catch((error) => {
					console.error('Failed to copy text: ', error);
				});
		}
	};

	const exportAsImage = () => {
		if (targetRef.current) {
			toPng(targetRef.current, { cacheBust: true })
				.then((dataUrl) => {
					const link = document.createElement('a');
					link.download = 'ascii-art.png';
					link.href = dataUrl;
					link.click();
				})
				.catch((error) => {
					console.error('Error exporting image: ', error);
				});
		}
	};

	return (
		<div className='flex flex-wrap gap-3'>
			<button
				onClick={copyToClipboard}
				disabled={disabled}
				className={`px-4 py-2 rounded-md ${
					disabled
						? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
						: 'bg-blue-500 hover:bg-blue-600 text-white'
				}`}
			>
				Copy to Clipboard
			</button>

			<button
				onClick={exportAsImage}
				disabled={disabled}
				className={`px-4 py-2 rounded-md ${
					disabled
						? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
						: 'bg-green-500 hover:bg-green-600 text-white'
				}`}
			>
				Export as Image
			</button>
		</div>
	);
}
