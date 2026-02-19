import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import type { ContentType, Lesson, LessonContent } from '@shared/types/courses/lesson.model';
import { useState } from 'react';
import { useFetcher } from 'react-router';

interface DraggableProps {
	lessonsData: Lesson[];
	onLessonsChange?: (updatedLessons: Lesson[]) => void;
}

function SortableContent({ content_id, name, content_type, lessonId }: LessonContent & { lessonId: string | number }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: `content-${lessonId}-${content_id}`,
		data: {
			type: 'content',
			lessonId,
			contentId: content_id,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const getContentTypeIcon = (type: ContentType) => {
		switch (type) {
			case 'VIDEO':
				return 'videocam';
			case 'QUIZ':
				return 'quiz';
			case 'ASSIGN_SHEET':
			case 'ASSIGN_CODE':
				return 'assignment';
			case 'BLOG':
				return 'article';
			default:
				return 'description';
		}
	};

	return (
		<div ref={setNodeRef} style={style} className='p-3 mb-2 border rounded-md flex items-center'>
			<div className='flex justify-between w-full'>
				<div className='flex items-center gap-2'>
					<span className='material-symbols-outlined'>{getContentTypeIcon(content_type)}</span>
					<div className='font-medium'>{name}</div>
				</div>
				<div className='px-4 cursor-grab ' {...attributes} {...listeners}>
					<span className='material-symbols-outlined'>drag_indicator</span>
				</div>
			</div>
		</div>
	);
}

function SortableAccordionItem({
	lesson,
	onContentSorted,
}: {
	lesson: Lesson & { contents?: LessonContent[] };
	onContentSorted: (lessonId: string | number, updatedContent: LessonContent[]) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [newContentName, setNewContentName] = useState('');
	const [newContentType, setNewContentType] = useState<ContentType>('BLOG');
	const [isAdding, setIsAdding] = useState(false);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: `lesson-${lesson.lesson_id}`,
		data: {
			type: 'lesson',
			lessonId: lesson.lesson_id,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleContentDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id && lesson.contents) {
			const oldIndex = lesson.contents.findIndex(
				(content) => `content-${lesson.lesson_id}-${content.content_id}` === active.id,
			);
			const newIndex = lesson.contents.findIndex(
				(content) => `content-${lesson.lesson_id}-${content.content_id}` === over.id,
			);

			if (oldIndex !== -1 && newIndex !== -1) {
				const updatedContent = arrayMove(lesson.contents, oldIndex, newIndex).map((item, index) => ({
					...item,
					sequence: index + 1, // Update the sequence to be sequential
				}));

				onContentSorted(lesson.lesson_id, updatedContent);
			}
		}
	};

	const handleAddContent = () => {
		setIsAdding(true);
	};

	const handleSaveContent = () => {
		if (newContentName.trim() !== '') {
			const currentContent = lesson.contents || [];
			const newSequence =
				currentContent.length > 0
					? Math.max(
							...currentContent.map((item) =>
								typeof item.sequence === 'string' ? Number.parseInt(item.sequence) : item.sequence,
							),
						) + 1
					: 1;

			const newContent: LessonContent = {
				content_id: Date.now(), // Generate a temporary unique ID
				lesson_id: lesson.lesson_id,
				name: newContentName,
				content_type: newContentType,
				sequence: newSequence,
				content_status: 'PUBLISH',
				content: '',
			};

			const updatedContent = [...currentContent, newContent];

			onContentSorted(lesson.lesson_id, updatedContent);
			setNewContentName('');
			setIsAdding(false);
		}
	};

	const handleCancelAdd = () => {
		setNewContentName('');
		setIsAdding(false);
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor),
	);

	return (
		<div ref={setNodeRef} style={style} className='mb-3 border rounded-lg overflow-hidden'>
			<div className='flex items-center justify-between p-4'>
				<div className='flex items-center'>
					<div className='px-4 cursor-grab' {...attributes} {...listeners}>
						<span className='material-symbols-outlined'>drag_indicator</span>
					</div>
					<div className='font-medium'>{lesson.name}</div>
				</div>
				<button
					type='button'
					onClick={() => setIsOpen(!isOpen)}
					className='p-2 rounded-full'
					onMouseDown={(e) => e.stopPropagation()}
					onTouchStart={(e) => e.stopPropagation()}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
					>
						<title>{isOpen ? 'Collapse accordion' : 'Expand accordion'}</title>
						<polyline points='6 9 12 15 18 9' />
					</svg>
				</button>
			</div>

			{isOpen && (
				<div className='p-4'>
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleContentDragEnd}>
						<SortableContext
							items={(lesson.contents || []).map((item) => `content-${lesson.lesson_id}-${item.content_id}`)}
							strategy={verticalListSortingStrategy}
						>
							{(lesson.contents || []).map((item) => (
								<SortableContent
									key={`content-${lesson.lesson_id}-${item.content_id}`}
									{...item}
									lessonId={lesson.lesson_id}
								/>
							))}
						</SortableContext>
					</DndContext>

					{isAdding ? (
						<div className='mt-3'>
							<Card className='flex p-4'>
								<Input
									value={newContentName}
									onChange={(e) => setNewContentName(e.target.value)}
									className='w-full p-2 border rounded-md'
									placeholder='Enter content name'
								/>
								<select
									value={newContentType}
									onChange={(e) => setNewContentType(e.target.value as ContentType)}
									className='w-full p-2 border rounded-md'
								>
									<option value='BLOG'>Blog Post</option>
									<option value='VIDEO'>Video</option>
									<option value='QUIZ'>Quiz</option>
									<option value='ASSIGN_SHEET'>Sheet Assignment</option>
									<option value='ASSIGN_CODE'>Code Assignment</option>
								</select>
							</Card>
							<div className='flex space-x-2'>
								<Button
									variant='solid'
									color='primary'
									radius='full'
									size='sm'
									onPress={handleSaveContent}
									className='px-3 py-1 text-sm'
								>
									Save
								</Button>
								<Button
									variant='faded'
									color='danger'
									radius='full'
									size='sm'
									onPress={handleCancelAdd}
									className='px-3 py-1 text-sm'
								>
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<div className='mt-3'>
							<Button
								onPress={handleAddContent}
								variant='solid'
								color='primary'
								radius='full'
								size='sm'
								className='px-3 py-1 text-sm'
							>
								Add Content
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

import { useEffect } from 'react';

export default function NestedDraggable({
	lessonsData,
	onLessonsChange,
	cycle_id,
}: DraggableProps & { cycle_id: string }) {
	const [lessons, setLessons] = useState<(Lesson & { contents?: LessonContent[] })[]>(lessonsData);
	const [showModal, setShowModal] = useState(false);
	const [newLessonForm, setNewLessonForm] = useState({
		name: '',
		sequence: 0,
		requires_previous_lesson: false,
	});

	const fetcher = useFetcher();

	// เมื่อ fetcher มีข้อมูลใหม่จาก API (หลังจากส่งฟอร์มสร้าง lesson)
	// เราจะอัพเดทข้อมูล lesson ในหน้าจอ
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (fetcher.data && fetcher.state === 'idle') {
			// สมมติว่า API ตอบกลับด้วยข้อมูล lesson ที่สร้างใหม่ใน fetcher.data
			// รูปแบบจะขึ้นอยู่กับการตอบกลับจาก API จริงๆ
			if (fetcher.data.lesson) {
				// เพิ่ม lesson ใหม่เข้าไปในรายการ
				const newLesson = {
					...fetcher.data.lesson,
					contents: [],
				};

				const updatedLessons = [...lessons, newLesson];
				setLessons(updatedLessons);

				if (onLessonsChange) {
					onLessonsChange(updatedLessons);
				}
			}
		}
	}, [fetcher.data, fetcher.state]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id !== over.id) {
			const activeId = String(active.id);
			const overId = String(over.id);

			if (activeId.startsWith('lesson-') && overId.startsWith('lesson-')) {
				const oldIndex = lessons.findIndex((item) => `lesson-${item.lesson_id}` === activeId);
				const newIndex = lessons.findIndex((item) => `lesson-${item.lesson_id}` === overId);

				if (oldIndex !== -1 && newIndex !== -1) {
					const updatedLessons = arrayMove(lessons, oldIndex, newIndex).map((lesson, index) => ({
						...lesson,
						sequence: index + 1, // Update the sequence to be sequential
					}));

					setLessons(updatedLessons);

					if (onLessonsChange) {
						onLessonsChange(updatedLessons);
					}
				}
			}
		}
	};

	const handleContentSorted = (lessonId: string | number, updatedContent: LessonContent[]) => {
		const updatedLessons = lessons.map((lesson) =>
			lesson.lesson_id === lessonId ? { ...lesson, contents: updatedContent } : lesson,
		);

		setLessons(updatedLessons);

		if (onLessonsChange) {
			onLessonsChange(updatedLessons);
		}
	};

	const handleCreateLesson = () => {
		if (newLessonForm.name.trim() === '') return;

		// Use fetcher to submit the data to your API
		fetcher.submit(
			{
				name: newLessonForm.name,
				sequence: newLessonForm.sequence.toString(),
				requires_previous_lesson: newLessonForm.requires_previous_lesson.toString(),
			},
			// action.create.lesson.$cycle_id.tsx
			{ method: 'post', action: `/action/create/lesson/${cycle_id}` },
		);

		// Reset the form and close the modal
		setShowModal(false);
		setNewLessonForm({
			name: '',
			sequence: 0,
			requires_previous_lesson: false,
		});
	};

	const handleFormChange = (field: keyof typeof newLessonForm, value: string | number | boolean) => {
		setNewLessonForm({
			...newLessonForm,
			[field]: value,
		});
	};

	return (
		<Card className='min-w-[300px] min-h-[560px] p-4'>
			<CardHeader className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Lessons</h1>
				<Button
					variant='solid'
					color='primary'
					radius='full'
					size='sm'
					className='px-3 py-1 text-sm'
					onPress={() => setShowModal(true)}
				>
					Add Lesson
				</Button>
			</CardHeader>
			<CardBody>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext
						items={lessons.map((lesson) => `lesson-${lesson.lesson_id}`)}
						strategy={verticalListSortingStrategy}
					>
						{lessons.map((lesson) => (
							<SortableAccordionItem
								key={`lesson-${lesson.lesson_id}`}
								lesson={lesson}
								onContentSorted={handleContentSorted}
							/>
						))}
					</SortableContext>
				</DndContext>
			</CardBody>

			{/* Add Lesson Modal */}
			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>Add New Lesson</ModalHeader>
					<ModalBody>
						<div className='space-y-4'>
							<div>
								<p className='block text-sm font-medium mb-1'>Lesson Name</p>
								<Input
									placeholder='Enter lesson name'
									value={newLessonForm.name}
									onChange={(e) => handleFormChange('name', e.target.value)}
									className='w-full'
								/>
							</div>
							<div>
								<p className='block text-sm font-medium mb-1'>Sequence</p>
								<Input
									type='number'
									placeholder='Enter sequence number'
									value={newLessonForm.sequence.toString()}
									onChange={(e) => handleFormChange('sequence', Number.parseInt(e.target.value) || 0)}
									className='w-full'
								/>
							</div>
							<div className='flex items-center'>
								<Checkbox
									checked={newLessonForm.requires_previous_lesson}
									onChange={(e) => handleFormChange('requires_previous_lesson', e.target.checked)}
								/>
								<p className='ml-2 text-sm'>Requires previous lesson completion</p>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							variant='faded'
							color='danger'
							radius='full'
							size='sm'
							className='px-3 py-1 text-sm'
							onPress={() => setShowModal(false)}
						>
							Cancel
						</Button>
						<Button
							variant='solid'
							color='primary'
							radius='full'
							size='sm'
							className='px-3 py-1 text-sm'
							onPress={handleCreateLesson}
							isDisabled={!newLessonForm.name.trim()}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Card>
	);
}
