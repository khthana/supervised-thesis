import { Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	FileText,
	HelpCircle,
	MoreVertical,
	Plus,
	Trash2,
	Video,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

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

interface CreateCourseContentProps {
	courseData: Topic[];
	setCourseData: Dispatch<SetStateAction<Topic[]>>;
	onItemSelect: (type: 'video' | 'file' | 'quiz' | 'assignment', fullTitle: string, part: Topic) => void;
}

type ContentType = 'video' | 'file' | 'quiz' | 'assignment' | 'delete';

const CreateCourseContent = ({ courseData, setCourseData, onItemSelect }: CreateCourseContentProps) => {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState<string>('');
	const [openTopics, setOpenTopics] = useState<number[]>([]);
	const editInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (editInputRef.current && !editInputRef.current.contains(event.target as Node)) {
				finishEditing();
			}
		};

		document.addEventListener('mousedown', handleClickOutside as EventListener);
		document.addEventListener('touchend', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside as EventListener);
			document.removeEventListener('touchend', handleClickOutside);
		};
	}, []);

	const toggleTopic = (topicId: number) => {
		setOpenTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]));
	};

	const addTopic = () => {
		const newTopicId = Math.max(...courseData.map((topic) => topic.id), 0) + 1;
		const newTopic: Topic = {
			id: newTopicId,
			title: `บทที่ ${newTopicId}: หัวข้อใหม่`,
			subtopics: [],
		};
		setCourseData((prev) => [...prev, newTopic]);
	};

	const addSubtopic = (topicId: number) => {
		setCourseData((prev) =>
			prev.map((topic) => {
				if (topic.id === topicId) {
					const newSubtopicId = `${topicId}-${topic.subtopics.length + 1}`;
					const newSubtopic: Subtopic = {
						id: newSubtopicId,
						title: 'หัวข้อย่อยใหม่',
						type: 'file',
					};
					return {
						...topic,
						subtopics: [...topic.subtopics, newSubtopic],
					};
				}
				return topic;
			}),
		);
	};

	const getItemIcon = (type: string) => {
		switch (type) {
			case 'video':
				return <Video className='text-default-600' size={20} />;
			case 'file':
				return <FileText className='text-default-600' size={20} />;
			case 'quiz':
				return <HelpCircle className='text-default-600' size={20} />;
			case 'assignment':
				return <BookOpen className='text-default-600' size={20} />;
			default:
				return null;
		}
	};

	const handleOptionClick = (option: ContentType, topic: Topic, subtopicId: string) => {
		if (option === 'delete') {
			setCourseData((prev) =>
				prev.map((t) => {
					if (t.id === topic.id) {
						return {
							...t,
							subtopics: t.subtopics.filter((sub) => sub.id !== subtopicId),
						};
					}
					return t;
				}),
			);
			return;
		}

		setCourseData((prev) =>
			prev.map((t) => {
				if (t.id === topic.id) {
					return {
						...t,
						subtopics: t.subtopics.map((sub) => (sub.id === subtopicId ? { ...sub, type: option } : sub)),
					};
				}
				return t;
			}),
		);

		const subtopic = topic.subtopics.find((sub) => sub.id === subtopicId);
		if (subtopic) {
			onItemSelect(option, subtopic.title, topic);
		}
	};

	const startEditing = (id: string | number, title: string) => {
		setEditingId(id.toString());
		setEditingTitle(title);
	};

	const finishEditing = () => {
		if (editingId) {
			setCourseData((prev) => {
				return prev.map((topic) => {
					if (topic.id.toString() === editingId) {
						return { ...topic, title: editingTitle };
					}
					return {
						...topic,
						subtopics: topic.subtopics.map((subtopic) =>
							subtopic.id === editingId ? { ...subtopic, title: editingTitle } : subtopic,
						),
					};
				});
			});
			setEditingId(null);
			setEditingTitle('');
		}
	};

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEditingTitle(e.target.value);
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			finishEditing();
		}
	};

	const handleSubtopicKeyPress = (e: KeyboardEvent<HTMLButtonElement>, subtopic: Subtopic, topic: Topic) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onItemSelect(subtopic.type, subtopic.title, topic);
		}
	};

	return (
		<Card className='p-4 relative'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold'>เนื้อหาหลักสูตร</h2>
				<Button isIconOnly variant='light' onPress={addTopic} aria-label='เพิ่มบทใหม่'>
					<Plus size={24} />
				</Button>
			</div>
			<div className='space-y-2'>
				{courseData.map((topic) => (
					<div key={topic.id} className='bg-default-100 rounded-lg overflow-hidden'>
						<div
							className='w-full text-left p-3 flex items-center justify-between transition-colors hover:bg-default-200'
							onDoubleClick={() => startEditing(topic.id, topic.title)}
						>
							{editingId === topic.id.toString() ? (
								<input
									ref={editInputRef}
									type='text'
									value={editingTitle}
									onChange={handleTitleChange}
									onKeyPress={handleKeyPress}
									onBlur={finishEditing}
									className='flex-grow mr-2 p-1 border rounded bg-default-100'
								/>
							) : (
								<span className='font-medium'>{topic.title}</span>
							)}
							<Button isIconOnly variant='light' onPress={() => toggleTopic(topic.id)}>
								{openTopics.includes(topic.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
							</Button>
						</div>
						{openTopics.includes(topic.id) && (
							<div className='px-3 pb-3 space-y-2'>
								{topic.subtopics.map((subtopic) => (
									<div key={subtopic.id} className='bg-default-200 rounded-lg hover:bg-default-300 transition-colors'>
										<div className='flex items-center justify-between py-3 px-3'>
											<Button
												className='flex items-center justify-start p-0 min-w-0 h-auto bg-transparent hover:bg-transparent'
												onDoubleClick={() => startEditing(subtopic.id, subtopic.title)}
												onPress={() => onItemSelect(subtopic.type, subtopic.title, topic)}
												onKeyPress={(e) => handleSubtopicKeyPress(e, subtopic, topic)}
											>
												{getItemIcon(subtopic.type)}
												{editingId === subtopic.id ? (
													<input
														ref={editInputRef}
														type='text'
														value={editingTitle}
														onChange={handleTitleChange}
														onKeyPress={handleKeyPress}
														onBlur={finishEditing}
														className='ml-2 p-1 border rounded flex-grow bg-default-100'
													/>
												) : (
													<span className='ml-2'>{subtopic.title}</span>
												)}
											</Button>
											<Dropdown>
												<DropdownTrigger>
													<Button isIconOnly variant='light' className='ml-2'>
														<MoreVertical size={20} />
													</Button>
												</DropdownTrigger>
												<DropdownMenu
													aria-label='Content type options'
													onAction={(key) => handleOptionClick(key as ContentType, topic, subtopic.id)}
												>
													<DropdownItem key='video' startContent={<Video size={16} />}>
														วิดีโอ
													</DropdownItem>
													<DropdownItem key='quiz' startContent={<HelpCircle size={16} />}>
														แบบทดสอบ
													</DropdownItem>
													<DropdownItem key='file' startContent={<FileText size={16} />}>
														เอกสาร
													</DropdownItem>
													<DropdownItem key='assignment' startContent={<BookOpen size={16} />}>
														แบบฝึกหัด
													</DropdownItem>
													<DropdownItem
														key='delete'
														className='text-danger'
														color='danger'
														startContent={<Trash2 size={16} />}
													>
														ลบ
													</DropdownItem>
												</DropdownMenu>
											</Dropdown>
										</div>
									</div>
								))}
								<Button
									onPress={() => addSubtopic(topic.id)}
									className='w-full'
									color='success'
									startContent={<Plus size={20} />}
								>
									เพิ่มหัวข้อ
								</Button>
							</div>
						)}
					</div>
				))}
			</div>
		</Card>
	);
};

export default CreateCourseContent;
