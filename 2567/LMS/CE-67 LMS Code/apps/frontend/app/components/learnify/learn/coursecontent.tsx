import { Card } from '@heroui/react';
import { ChevronRight, FileText, HelpCircle, Video } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';

interface Attachment {
	id: number;
	title: string;
	type: 'pdf' | 'docx' | 'link';
	url: string;
	description: string;
	size?: string;
}

interface Subtopic {
	id: string;
	title: string;
	type: 'video' | 'file' | 'quiz' | 'assignment';
	videoUrl?: string;
	attachments?: Attachment[];
	quizContent?: string;
	assignmentContent?: {
		description: string;
		dueDate: string;
		maxScore: number;
		attachments?: Attachment[];
	};
}
interface Topic {
	id: number;
	title: string;
	subtopics: Subtopic[];
}

interface CourseContentProps {
	courseData: Topic[];
	onSubtopicSelect: (subtopic: Subtopic) => void;
}

type SubtopicIconProps = {
	type: string;
};

const SubtopicIcon = ({ type }: SubtopicIconProps) => {
	switch (type) {
		case 'video':
			return <Video size={20} />;
		case 'file':
			return <FileText size={20} />;
		case 'quiz':
			return <HelpCircle size={20} />;
		default:
			return null;
	}
};

interface TopicItemProps {
	topic: Topic;
	onSubtopicSelect: (subtopic: Subtopic) => void;
}

const TopicItem = ({ topic, onSubtopicSelect }: TopicItemProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => setIsOpen(!isOpen);

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleToggle();
		}
	};

	const handleSubtopicKeyDown = (event: KeyboardEvent<HTMLButtonElement>, subtopic: Subtopic) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSubtopicSelect(subtopic);
		}
	};

	return (
		<div className='mb-2'>
			<button
				type='button'
				className='flex items-center justify-between bg-white p-3 rounded-lg shadow cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-md w-full text-left'
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
			>
				<span className='font-semibold'>{topic.title}</span>
				<ChevronRight
					size={20}
					className={`transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''}`}
				/>
			</button>
			{isOpen && topic.subtopics.length > 0 && (
				<div className='ml-6 mt-2'>
					{topic.subtopics.map((subtopic) => (
						<button
							type='button'
							key={subtopic.id}
							className='flex items-center bg-gray-50 p-2 rounded-lg shadow-sm mt-1 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200 w-full text-left'
							onClick={() => onSubtopicSelect(subtopic)}
							onKeyDown={(e) => handleSubtopicKeyDown(e, subtopic)}
						>
							<SubtopicIcon type={subtopic.type} />
							<span className='ml-2'>{subtopic.title}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const CourseContent = ({ courseData, onSubtopicSelect }: CourseContentProps) => {
	return (
		<Card>
			<div className='p-4 rounded-xl'>
				<h2 className='text-2xl font-bold mb-4'>Course Content</h2>
				{courseData.map((topic) => (
					<TopicItem key={topic.id} topic={topic} onSubtopicSelect={onSubtopicSelect} />
				))}
			</div>
		</Card>
	);
};

export default CourseContent;
