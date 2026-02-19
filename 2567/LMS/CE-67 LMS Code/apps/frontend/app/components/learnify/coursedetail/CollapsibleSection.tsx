import { type ReactNode, useState } from 'react';

interface CollapsibleSectionProps {
	title: string;
	content: ReactNode;
}

const CollapsibleSection = ({ title, content }: CollapsibleSectionProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSection = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className='border-b border-gray-200 py-4'>
			<button
				type='button'
				className='flex justify-between w-full text-left text-gray-700 font-semibold'
				onClick={toggleSection}
			>
				<span>{title}</span>
				<span>{isOpen ? '▴' : '▾'}</span>
			</button>
			{isOpen && <div className='mt-2 text-gray-600'>{content}</div>}
		</div>
	);
};

export default CollapsibleSection;
