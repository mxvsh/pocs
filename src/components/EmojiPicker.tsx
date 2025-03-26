import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

type EmojiPickerProps = {
	onEmojiSelect: (emoji: string) => void;
	theme: string;
};

export default function EmojiPicker({
	onEmojiSelect,
	theme,
}: EmojiPickerProps) {
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const handleEmojiSelect = (emoji: any) => {
		onEmojiSelect(emoji.native);
		setIsPickerVisible(false);
	};

	return (
		<div className='w-full'>
			<button
				onClick={() => setIsPickerVisible(!isPickerVisible)}
				className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full transition-colors'
			>
				{isPickerVisible ? 'Close Emoji Picker' : 'Open Emoji Picker'}
			</button>

			{isPickerVisible && (
				<div className='mt-4'>
					<Picker
						data={data}
						onEmojiSelect={handleEmojiSelect}
						theme={theme}
						previewPosition='none'
						skinTonePosition='none'
					/>
				</div>
			)}
		</div>
	);
}
