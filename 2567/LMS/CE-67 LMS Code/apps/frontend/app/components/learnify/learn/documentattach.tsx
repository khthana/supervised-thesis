import { Card } from '@heroui/react';
import { Download, File, Link } from 'lucide-react';

interface Attachment {
	id: number;
	title: string;
	type: 'pdf' | 'docx' | 'link';
	url: string;
	description: string;
	size?: string;
}

interface DocumentattachProps {
	title: string;
	attachments: Attachment[];
	quizContent: string;
}

type AttachmentIconProps = {
	type: string;
};

const AttachmentIcon = ({ type }: AttachmentIconProps) => {
	switch (type) {
		case 'pdf':
			return <File className='w-8 h-8 text-red-500' />;
		case 'docx':
			return <File className='w-8 h-8 text-blue-500' />;
		case 'link':
			return <Link className='w-8 h-8 text-gray-500' />;
		default:
			return <File className='w-8 h-8 text-gray-500' />;
	}
};

const Documentattach = ({ title, attachments }: DocumentattachProps) => {
	const handleDownload = (url: string) => {
		console.log(`Downloading file: ${url}`);
		// Implement actual download logic here
	};

	const handleOpenLink = (url: string) => {
		window.open(url, '_blank');
	};

	return (
		<Card className='w-full max-w-7xl mx-auto px-4'>
			<div className='p-4'>
				<h2 className='text-lg font-semibold mb-4'>{title}</h2>
				{attachments.map((attachment) => (
					<div
						key={attachment.id}
						className='flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors mb-2'
					>
						<div className='flex items-center'>
							<AttachmentIcon type={attachment.type} />
							<div>
								<p className='font-medium'>{attachment.title}</p>
								<p className='text-sm text-gray-500'>{attachment.description}</p>
								{attachment.size && <p className='text-xs text-gray-400'>{attachment.size}</p>}
							</div>
						</div>
						<button
							type='button'
							onClick={() =>
								attachment.type === 'link' ? handleOpenLink(attachment.url) : handleDownload(attachment.url)
							}
							className='p-1 hover:bg-gray-200 rounded-full transition-colors'
						>
							{attachment.type === 'link' ? (
								<Link className='w-5 h-5 text-gray-600' />
							) : (
								<Download className='w-5 h-5 text-gray-600' />
							)}
						</button>
					</div>
				))}
			</div>
		</Card>
	);
};

export default Documentattach;
