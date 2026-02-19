import type { ParentLoaderData } from '@/routes/_lnf';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useOutletContext } from 'react-router';

const mockData = [
	{
		id: 1,
		title: 'Pre-Act Course Equivalency',
		date: '24 October 2024',
		content: `The faculty is in the process of course equivalency for the diploma program with course 90642036 Engineer Preparation. Please complete the form below:

1) Select courses with grades higher than C+ (the higher the better). Choose 2 courses related to basic electrical work, measuring instruments, or courses with lab equipment usage. Selected courses must be completed and appear in your transcript.

2) Fill out the form with your student ID, name, surname, and course codes according to the example.`,
		author: 'Thana Hongsuwan',
		category: 'Academic',
		views: 122,
	},
	{
		id: 2,
		title: 'Exam Announcement',
		date: '',
		content: 'Practical examination will be held on November 22, 2023, from 13:30-15:30',
		author: 'Thana Hongsuwan',
		category: 'Exam',
		views: 89,
	},
	{
		id: 3,
		title: 'Exam Content',
		date: '31 July 2024',
		content:
			'Questions 1-3: Functions and Scope (20 points), Question 4: List Comprehension (20 points), Question 5: Dictionary (30 points)',
		author: 'Thana Hongsuwan',
		category: 'Exam',
		views: 156,
	},
];

const Announcement = () => {
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const { user } = loaderData;
	if (!user) {
		return 'Loading...';
	}
	const [announcements, setAnnouncements] = useState(mockData);
	const [newAnnouncement, setNewAnnouncement] = useState({
		title: '',
		content: '',
	});

	// Detail Modal
	const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
	const [selectedAnnouncement, setSelectedAnnouncement] = useState<{
		id: number;
		title: string;
		date: string;
		content: string;
		author: string;
		category: string;
		views: number;
	} | null>(null);

	// Create Modal
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

	const handleCardClick = (announcement: {
		id: number;
		title: string;
		date: string;
		content: string;
		author: string;
		category: string;
		views: number;
	}) => {
		setSelectedAnnouncement(announcement);
		onDetailOpen();
	};

	const handleCreateSubmit = () => {
		if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
			const announcement = {
				id: announcements.length + 1,
				title: newAnnouncement.title,
				content: newAnnouncement.content,
				date: new Date().toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}),
				author: 'System Admin',
				category: 'General',
				views: 0,
			};

			setAnnouncements([announcement, ...announcements]);
			setNewAnnouncement({ title: '', content: '' });
			onCreateClose();
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 p-4 flex items-center justify-center'>
			<div className='w-full max-w-8xl bg-white rounded-lg shadow-lg overflow-hidden'>
				<div className='p-4 flex justify-end'>
					{user.user_role.includes('INSTRUCTOR') && (
						<Button color='primary' variant='solid' onPress={onCreateOpen}>
							New Announcement
						</Button>
					)}
				</div>
				<div className='overflow-y-auto h-screen p-4'>
					<div className='grid gap-4'>
						{announcements.map((item) => (
							<Card key={item.id} className='h-48' isPressable onPress={() => handleCardClick(item)}>
								<CardHeader className='flex justify-between items-center p-4'>
									<h2 className='text-xl font-bold line-clamp-1'>{item.title}</h2>
									<span className='text-sm text-gray-500 whitespace-nowrap ml-2'>{item.date}</span>
								</CardHeader>
								<CardBody className='p-4 overflow-hidden'>
									<div className='flex flex-col justify-between h-full'>
										<p className='text-gray-700 line-clamp-3'>{item.content}</p>
										<div className='text-sm text-gray-500 mt-2'>
											<span>Author:</span>
											<span className='font-semibold ml-1'>{item.author}</span>
										</div>
									</div>
								</CardBody>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* Article-style Detail Modal */}
			<Modal isOpen={isDetailOpen} onClose={onDetailClose} size='3xl' scrollBehavior='inside'>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalBody className='p-8'>
								{selectedAnnouncement && (
									<article>
										<h1 className='text-2xl font-bold text-orange-500 mb-6'>{selectedAnnouncement.title}</h1>

										<div className='flex items-center gap-6 text-gray-500 text-sm mb-8'>
											<div className='flex items-center gap-2'>
												<span className='material-icons'>person</span>
												{selectedAnnouncement.author}
											</div>
											<div className='flex items-center gap-2'>
												<span className='material-icons'>calendar_today</span>
												{selectedAnnouncement.date}
											</div>
											<div className='flex items-center gap-2'>
												<span className='material-icons'>folder</span>
												{selectedAnnouncement.category}
											</div>
											<div className='flex items-center gap-2'>
												<Eye size={16} />
												{selectedAnnouncement.views} Views
											</div>
										</div>

										<Divider className='my-6' />

										<div className='text-gray-700 whitespace-pre-line'>{selectedAnnouncement.content}</div>

										<Divider className='my-6' />

										<div className='text-right text-sm text-gray-500'>Last update: {selectedAnnouncement.date}</div>
									</article>
								)}
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Create Modal */}
			<Modal isOpen={isCreateOpen} onClose={onCreateClose} size='2xl'>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='flex justify-between items-center'>
								<div className='text-xl font-bold'>New Announcement</div>
							</ModalHeader>
							<ModalBody>
								<div className='flex flex-col gap-4'>
									<Input
										label='Title'
										placeholder='Enter announcement title'
										value={newAnnouncement.title}
										onChange={(e) =>
											setNewAnnouncement({
												...newAnnouncement,
												title: e.target.value,
											})
										}
									/>
									<Textarea
										label='Content'
										placeholder='Enter announcement content'
										minRows={5}
										value={newAnnouncement.content}
										onChange={(e) =>
											setNewAnnouncement({
												...newAnnouncement,
												content: e.target.value,
											})
										}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose} className='mr-2'>
									Cancel
								</Button>
								<Button color='primary' onPress={handleCreateSubmit}>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};

export default Announcement;
