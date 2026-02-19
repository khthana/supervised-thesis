import { Card, CardBody, CardFooter, CardHeader, Divider } from '@heroui/react';

interface VideotemplateProps {
	videoUrl: string;
	title: string;
}

function Videotemplate({ videoUrl, title }: VideotemplateProps) {
	// Function to extract video ID from YouTube URL
	const getYoutubeVideoId = (url: string) => {
		const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};

	const videoId = getYoutubeVideoId(videoUrl);
	const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

	return (
		<Card className='w-full max-w-7xl mx-auto px-4 '>
			<CardHeader className='flex justify-between items-center p-4'>
				<h2 className='text-2xl font-bold'>{title}</h2>
			</CardHeader>
			<Divider />
			<CardBody className='p-0'>
				<div className='relative w-full pt-[56.25%]'>
					<iframe
						className='absolute top-0 left-0 w-full h-full'
						src={embedUrl}
						title={title}
						frameBorder='0'
						allowFullScreen
					/>
				</div>
			</CardBody>
			<Divider />
			<CardFooter className='flex flex-col items-start p-6'>
				<h3 className='text-xl font-semibold mb-3'>Description</h3>
				<p className='text-sm text-gray-700 dark:text-gray-300'>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur.
				</p>
			</CardFooter>
		</Card>
	);
}

export default Videotemplate;
