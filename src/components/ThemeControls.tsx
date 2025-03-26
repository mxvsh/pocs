type ThemeControlsProps = {
	fontSize: number;
	setFontSize: (size: number) => void;
	fontColor: string;
	setFontColor: (color: string) => void;
	backgroundColor: string;
	setBackgroundColor: (color: string) => void;
	density: number;
	setDensity: (density: number) => void;
	theme: string;
	setTheme: (theme: string) => void;
};

export default function ThemeControls({
	fontSize,
	setFontSize,
	fontColor,
	setFontColor,
	backgroundColor,
	setBackgroundColor,
	density,
	setDensity,
	theme,
	setTheme,
}: ThemeControlsProps) {
	const colorOptions = [
		{ name: 'Black', value: '#000000' },
		{ name: 'White', value: '#FFFFFF' },
		{ name: 'Red', value: '#FF0000' },
		{ name: 'Green', value: '#00FF00' },
		{ name: 'Blue', value: '#0000FF' },
		{ name: 'Yellow', value: '#FFFF00' },
		{ name: 'Cyan', value: '#00FFFF' },
		{ name: 'Magenta', value: '#FF00FF' },
	];

	const backgroundOptions = [
		{ name: 'White', value: '#FFFFFF' },
		{ name: 'Black', value: '#000000' },
		{ name: 'Light Gray', value: '#F0F0F0' },
		{ name: 'Dark Gray', value: '#303030' },
		{ name: 'Navy', value: '#001F3F' },
		{ name: 'Teal', value: '#39CCCC' },
	];

	return (
		<div className='w-full'>
			<h3 className='text-lg font-semibold mb-3'>Customize Appearance</h3>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{/* Theme toggle */}
				<div>
					<label className='block text-sm font-medium mb-1'>Theme</label>
					<div className='flex items-center space-x-2'>
						<button
							onClick={() => setTheme('light')}
							className={`px-3 py-1 rounded ${
								theme === 'light'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 dark:bg-gray-700'
							}`}
						>
							Light
						</button>
						<button
							onClick={() => setTheme('dark')}
							className={`px-3 py-1 rounded ${
								theme === 'dark'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 dark:bg-gray-700'
							}`}
						>
							Dark
						</button>
					</div>
				</div>

				{/* Font size control */}
				<div>
					<label htmlFor='font-size' className='block text-sm font-medium mb-1'>
						Font Size: {fontSize}px
					</label>
					<input
						id='font-size'
						type='range'
						min='8'
						max='48'
						value={fontSize}
						onChange={(e) => setFontSize(Number(e.target.value))}
						className='w-full'
					/>
				</div>

				{/* Density control */}
				<div>
					<label className='block text-sm font-medium mb-1'>
						Density: {density}
					</label>
					<div className='flex items-center space-x-2'>
						{[1, 2, 3].map((value) => (
							<button
								key={value}
								onClick={() => setDensity(value)}
								className={`px-3 py-1 rounded ${
									density === value
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 dark:bg-gray-700'
								}`}
							>
								{value}
							</button>
						))}
					</div>
				</div>

				{/* Font color */}
				<div>
					<label className='block text-sm font-medium mb-1'>Font Color</label>
					<select
						value={fontColor}
						onChange={(e) => setFontColor(e.target.value)}
						className='w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2'
					>
						{colorOptions.map((color) => (
							<option key={color.value} value={color.value}>
								{color.name}
							</option>
						))}
					</select>
				</div>

				{/* Background color */}
				<div>
					<label className='block text-sm font-medium mb-1'>
						Background Color
					</label>
					<select
						value={backgroundColor}
						onChange={(e) => setBackgroundColor(e.target.value)}
						className='w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2'
					>
						{backgroundOptions.map((color) => (
							<option key={color.value} value={color.value}>
								{color.name}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
