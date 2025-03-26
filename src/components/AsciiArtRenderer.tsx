import { forwardRef } from 'react';

type AsciiArtRendererProps = {
	asciiArt: string;
	fontSize: number;
	fontColor: string;
	backgroundColor: string;
};

const AsciiArtRenderer = forwardRef<HTMLDivElement, AsciiArtRendererProps>(
	function AsciiArtRenderer(
		{ asciiArt, fontSize, fontColor, backgroundColor },
		ref
	) {
		return (
			<div
				ref={ref}
				className='border rounded-lg p-4 overflow-auto'
				style={{
					backgroundColor,
					color: fontColor,
					fontSize: `${fontSize}px`,
					minHeight: '200px',
					fontFamily: 'monospace',
					whiteSpace: 'pre',
					textAlign: 'center',
				}}
			>
				{asciiArt || 'No ASCII art to display'}
			</div>
		);
	}
);

export default AsciiArtRenderer;
