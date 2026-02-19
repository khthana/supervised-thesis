import { Button, Card, CardBody, CardHeader, Input, Radio, RadioGroup, Textarea } from '@heroui/react';
import { Maximize, Play, Settings, Subtitles, Upload, Volume2 } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

interface VideoUploadProps {
	onSave: (videoData: {
		id: string;
		title: string;
		type: 'video';
		uploadType: string;
		videoUrl: string;
	}) => void;
	existingId?: string;
	existingTitle?: string;
	existingUrl?: string;
}

const VideoUploadComponent = ({ onSave, existingId, existingTitle, existingUrl }: VideoUploadProps) => {
	const [title, setTitle] = useState<string>(existingTitle || '');
	const [uploadType, setUploadType] = useState<string>('youtube');
	const [videoUrl, setVideoUrl] = useState<string>(existingUrl || '');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [filePreview, setFilePreview] = useState<string>('');

	const handleUploadTypeChange = (value: string) => {
		setUploadType(value);
		setVideoUrl('');
		setSelectedFile(null);
		setFilePreview('');
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 838860800) {
				// 800MB in bytes
				alert('File size exceeds 800MB limit');
				return;
			}
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setFilePreview(url);
			setVideoUrl(url);
		}
	};

	const handleYoutubeLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
		setVideoUrl(e.target.value);
	};

	const handleSave = () => {
		if (!title.trim() || !videoUrl.trim()) {
			alert('Please fill in all required fields');
			return;
		}

		onSave({
			id: existingId || `video-${Date.now()}`,
			title: title.trim(),
			type: 'video',
			uploadType,
			videoUrl: videoUrl.trim(),
		});

		// Reset form if it's a new entry
		if (!existingId) {
			setTitle('');
			setVideoUrl('');
			setSelectedFile(null);
			setFilePreview('');
		}
	};

	return (
		<Card className='max-w-7xl mx-auto'>
			<CardHeader>
				<h2 className='text-2xl font-bold'>Upload Video</h2>
			</CardHeader>
			<CardBody>
				<div className='space-y-4'>
					<Input
						label='Video Title'
						placeholder='Enter video title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='mb-4'
					/>

					<RadioGroup label='Select upload type' value={uploadType} onValueChange={handleUploadTypeChange}>
						<Radio value='file'>Upload file</Radio>
						<Radio value='youtube'>YouTube link</Radio>
					</RadioGroup>

					{uploadType === 'file' ? (
						<div>
							<label
								htmlFor='file-upload'
								className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600'
							>
								<div className='flex flex-col items-center justify-center'>
									<Upload className='w-8 h-8 mb-2 text-gray-500 dark:text-gray-400' />
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										<span className='font-semibold'>Click to upload</span> or drag and drop
									</p>
									<p className='text-xs text-gray-500 dark:text-gray-400'>MP4, WebM or Ogg (MAX. 800MB)</p>
								</div>
								<Input id='file-upload' type='file' className='hidden' accept='video/*' onChange={handleFileChange} />
							</label>

							{filePreview && (
								<div className='mt-4'>
									<video controls className='w-full rounded-lg' src={filePreview}>
										<track kind='captions' srcLang='en' src='path/to/captions.vtt' label='English' default />
										Your browser does not support the video tag.
									</video>
								</div>
							)}
						</div>
					) : (
						<div>
							<Input
								label='YouTube Link'
								placeholder='Enter YouTube video URL'
								value={videoUrl}
								onChange={handleYoutubeLinkChange}
							/>
							<p className='text-sm text-gray-500 mt-1'>
								Example: https://youtu.be/video_id or https://www.youtube.com/watch?v=video_id
							</p>
						</div>
					)}

					<Textarea label='Description (Optional)' placeholder='Enter video description' className='mt-4' />

					<div className='flex justify-end mt-6'>
						<Button color='primary' onPress={handleSave} isDisabled={!title.trim() || !videoUrl.trim()}>
							{existingId ? 'Update Video' : 'Upload Video'}
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default VideoUploadComponent;
