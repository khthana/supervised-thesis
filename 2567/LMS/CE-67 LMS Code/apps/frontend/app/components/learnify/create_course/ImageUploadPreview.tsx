import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { XCircle } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadPreviewProps {
	src: string;
	onRemove: () => void;
	previewMode: boolean;
	onDimensionsChange?: (dimensions: { width: number; height: number }) => void;
	initialDimensions?: { width: number; height: number };
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
	src,
	onRemove,
	previewMode,
	onDimensionsChange,
	initialDimensions = { width: 300, height: 200 },
}) => {
	const [dimensions, setDimensions] = useState(initialDimensions);

	const handleDimensionChange = (type: 'width' | 'height', value: string) => {
		const newDimensions = {
			...dimensions,
			[type]: Number.parseInt(value) || 0,
		};
		setDimensions(newDimensions);
		onDimensionsChange?.(newDimensions);
	};

	if (!src) return null;

	return (
		<div className='space-y-4'>
			{/* Dimension Controls */}
			<div className='flex gap-4 items-center'>
				<div className='flex gap-2 items-center'>
					<label htmlFor='widthInput' className='text-sm text-gray-600'>
						Width:
					</label>
					<input
						id='widthInput'
						type='number'
						value={dimensions.width}
						onChange={(e) => handleDimensionChange('width', e.target.value)}
						className='w-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500'
						min='1'
						disabled={previewMode}
					/>
					<span className='text-sm text-gray-600'>px</span>
				</div>

				<div className='flex gap-2 items-center'>
					<label htmlFor='heightInput' className='text-sm text-gray-600'>
						Height:
					</label>
					<input
						id='heightInput'
						type='number'
						value={dimensions.height}
						onChange={(e) => handleDimensionChange('height', e.target.value)}
						className='w-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500'
						min='1'
						disabled={previewMode}
					/>
					<span className='text-sm text-gray-600'>px</span>
				</div>
			</div>

			{/* Image Preview */}
			<div className='relative inline-block group'>
				<Popover placement='right'>
					<PopoverTrigger>
						<img
							src={src}
							alt='Preview'
							style={{
								width: `${dimensions.width}px`,
								height: `${dimensions.height}px`,
								objectFit: 'cover',
							}}
							className='rounded-md cursor-pointer'
						/>
					</PopoverTrigger>
					<PopoverContent>
						<img src={src} alt='Large Preview' className='max-w-md max-h-96 object-contain' />
					</PopoverContent>
				</Popover>

				{!previewMode && (
					<button
						type='button'
						onClick={onRemove}
						className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 
                    text-white opacity-0 group-hover:opacity-100 transition-opacity'
					>
						<XCircle className='h-4 w-4' />
					</button>
				)}
			</div>
		</div>
	);
};

export default ImageUploadPreview;
