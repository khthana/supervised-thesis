interface Topic {
	id: number;
	title: string;
	subtopics: Subtopic[];
}

interface Subtopic {
	id: string;
	title: string;
	type: string;
	videoUrl?: string;
	attachments?: Attachment[];
	quizContent?: string;
	assignmentContent?: AssignmentContent;
}

interface Attachment {
	id: number;
	title: string;
	type: string;
	url: string;
	description: string;
	size: string;
}

interface AssignmentContent {
	description: string;
	dueDate: string;
	maxScore: number;
	attachments: Attachment[];
}

export const mockData: Topic[] = [
	{
		id: 1,
		title: 'บทที่ 1: แนะนำภาษา Python',
		subtopics: [
			{
				id: '1-1',
				title: 'ทำความรู้จักกับ Python',
				type: 'video',
				videoUrl: 'https://youtu.be/6-hmySNgaWI?si=00MnjRxzzycP1rct',
			},
			{
				id: '1-2',
				title: 'เอกสารประกอบการเรียน',
				type: 'file',
				attachments: [
					{
						id: 101,
						title: 'แนะนำ Python และการติดตั้ง',
						type: 'pdf',
						url: '/python/intro.pdf',
						description: 'เอกสารแนะนำภาษา Python การติดตั้ง IDE และ การเตรียมสภาพแวดล้อม',
						size: '2.1 MB',
					},
				],
			},
			{
				id: '1-3',
				title: 'แบบทดสอบ',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงเขียนโปรแกรมแสดงข้อความ "ยินดีต้อนรับสู่ Python" เริ่มเขียนโค้ดที่นี่',
					image: null,
					selectedTest: 1,
				}),
			},
			{
				id: '1-4',
				title: 'Assignwork 1',
				type: 'assignment',
				assignmentContent: {
					description: 'เขียนโปรแกรม Python เพื่อคำนวณพื้นที่สามเหลี่ยม',
					dueDate: '2024-12-31',
					maxScore: 10,
					attachments: [
						{
							id: 103,
							title: 'คำอธิบายแบบฝึกหัด',
							type: 'pdf',
							url: '/assignments/assignment1.pdf',
							description: 'รายละเอียดและเงื่อนไขของแบบฝึกหัด',
							size: '1.2 MB',
						},
					],
				},
			},
		],
	},
	{
		id: 2,
		title: 'บทที่ 2: ตัวแปรและชนิดข้อมูล',
		subtopics: [
			{
				id: '2-1',
				title: 'ทำความเข้าใจตัวแปร',
				type: 'video',
				videoUrl: 'https://youtu.be/u58iQBa4oQY?si=Cw92lSwbYoOsqkCj', // Zinglecode - ตัวแปรใน Python
			},
			{
				id: '2-2',
				title: 'เอกสารเรื่องตัวแปร',
				type: 'file',
				attachments: [
					{
						id: 201,
						title: 'ชนิดข้อมูลใน Python',
						type: 'pdf',
						url: '/python/variables.pdf',
						description: 'สรุปเรื่องตัวแปร ชนิดข้อมูล และการดำเนินการ',
						size: '1.8 MB',
					},
				],
			},
			{
				id: '2-3',
				title: 'แบบทดสอบตัวแปร',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงสร้างตัวแปรต่อไปนี้\n# - ชื่อ name เก็บชื่อของคุณ\n# - อายุ age เก็บอายุเป็นตัวเลข\n# - เกรด grade เก็บเป็นทศนิยม\n# และแสดงผลทั้งหมด\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 2,
				}),
			},
		],
	},
	{
		id: 3,
		title: 'บทที่ 3: การควบคุมการทำงาน',
		subtopics: [
			{
				id: '3-1',
				title: 'การใช้งาน if-else',
				type: 'video',
				videoUrl: 'https://www.youtube.com/watch?v=by8D0LMUDcg', // BorntoDev - เงื่อนไขการทำงาน
			},
			{
				id: '3-2',
				title: 'เอกสารประกอบ',
				type: 'file',
				attachments: [
					{
						id: 301,
						title: 'Control Flow',
						type: 'pdf',
						url: '/python/control-flow.pdf',
						description: 'การควบคุมการทำงานของโปรแกรม if-else และ loops',
						size: '2.3 MB',
					},
				],
			},
			{
				id: '3-3',
				title: 'แบบทดสอบ if-else',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงเขียนโปรแกรมตรวจสอบอายุ\n# ถ้าอายุมากกว่าหรือเท่ากับ 18 ให้แสดง "สามารถเข้าใช้งานได้"\n# ถ้าน้อยกว่า ให้แสดง "อายุไม่ถึงเกณฑ์"\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 3,
				}),
			},
		],
	},
	{
		id: 4,
		title: 'บทที่ 4: การวนซ้ำ',
		subtopics: [
			{
				id: '4-1',
				title: 'การใช้ For Loop',
				type: 'video',
				videoUrl: 'https://www.youtube.com/watch?v=HE4S7iGgCGc', // BorntoDev - Loop
			},
			{
				id: '4-2',
				title: 'เอกสารเรื่อง Loop',
				type: 'file',
				attachments: [
					{
						id: 401,
						title: 'การวนซ้ำ',
						type: 'pdf',
						url: '/python/loops.pdf',
						description: 'สรุปการใช้งาน for และ while loop',
						size: '1.7 MB',
					},
				],
			},
			{
				id: '4-3',
				title: 'แบบทดสอบ Loop',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงเขียนโปรแกรมแสดงตารางสูตรคูณแม่ 2\n# ตั้งแต่ 2x1 ถึง 2x12\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 4,
				}),
			},
		],
	},
	{
		id: 5,
		title: 'บทที่ 5: ฟังก์ชัน',
		subtopics: [
			{
				id: '5-1',
				title: 'การสร้างฟังก์ชัน',
				type: 'video',
				videoUrl: 'https://youtu.be/3ohitxTfjUU', // BorntoDev - Function
			},
			{
				id: '5-2',
				title: 'เอกสารเรื่องฟังก์ชัน',
				type: 'file',
				attachments: [
					{
						id: 501,
						title: 'Python Functions',
						type: 'pdf',
						url: '/python/functions.pdf',
						description: 'การสร้างและใช้งานฟังก์ชัน parameter และ return',
						size: '2.5 MB',
					},
				],
			},
			{
				id: '5-3',
				title: 'แบบทดสอบฟังก์ชัน',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงสร้างฟังก์ชัน calculate_grade\n# รับพารามิเตอร์เป็นคะแนน 0-100\n# ส่งคืนเกรด A B C D F ตามเกณฑ์ทั่วไป\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 5,
				}),
			},
		],
	},
	{
		id: 6,
		title: 'บทที่ 6: List และ Tuple',
		subtopics: [
			{
				id: '6-1',
				title: 'การใช้งาน List',
				type: 'video',
				videoUrl: 'https://youtu.be/eePtidNb-BU', // ZEN ZEN CODING - Python List
			},
			{
				id: '6-2',
				title: 'เอกสาร Collection',
				type: 'file',
				attachments: [
					{
						id: 601,
						title: 'Python Collections',
						type: 'pdf',
						url: '/python/collections.pdf',
						description: 'การใช้งาน List Tuple และการจัดการข้อมูล',
						size: '2.2 MB',
					},
				],
			},
			{
				id: '6-3',
				title: 'แบบทดสอบ List',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงสร้าง List ชื่อ numbers เก็บเลข 1-5\n# และแสดงผลตัวเลขที่มากกว่า 3\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 6,
				}),
			},
		],
	},
	{
		id: 7,
		title: 'บทที่ 7: Dictionary',
		subtopics: [
			{
				id: '7-1',
				title: 'การใช้งาน Dictionary',
				type: 'video',
				videoUrl: 'https://youtu.be/ATuQpNWI6yI', // ZEN ZEN CODING - Dictionary
			},
			{
				id: '7-2',
				title: 'เอกสาร Dictionary',
				type: 'file',
				attachments: [
					{
						id: 701,
						title: 'Python Dictionary',
						type: 'pdf',
						url: '/python/dictionary.pdf',
						description: 'การใช้งาน Dictionary และ Methods',
						size: '1.9 MB',
					},
				],
			},
			{
				id: '7-3',
				title: 'แบบทดสอบ Dictionary',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงสร้าง Dictionary เก็บข้อมูลนักเรียน\n# ประกอบด้วย ชื่อ อายุ และเกรดเฉลี่ย\n# แสดงผลข้อมูลทั้งหมด\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 7,
				}),
			},
		],
	},
	{
		id: 8,
		title: 'บทที่ 8: การจัดการไฟล์',
		subtopics: [
			{
				id: '8-1',
				title: 'การอ่านเขียนไฟล์',
				type: 'video',
				videoUrl: 'https://youtu.be/v-OSfV01-84', // BorntoDev - File Handling
			},
			{
				id: '8-2',
				title: 'เอกสารจัดการไฟล์',
				type: 'file',
				attachments: [
					{
						id: 801,
						title: 'File Operations',
						type: 'pdf',
						url: '/python/files.pdf',
						description: 'การอ่าน เขียน และจัดการไฟล์ใน Python',
						size: '2.0 MB',
					},
				],
			},
			{
				id: '8-3',
				title: 'แบบทดสอบจัดการไฟล์',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงเขียนโปรแกรมเพื่อ\n# 1. เขียนข้อความ "Hello Python" ลงไฟล์ test.txt\n# 2. อ่านและแสดงผลข้อความจากไฟล์\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 8,
				}),
			},
		],
	},
	{
		id: 9,
		title: 'บทที่ 9: การจัดการข้อผิดพลาด',
		subtopics: [
			{
				id: '9-1',
				title: 'Try Except',
				type: 'video',
				videoUrl: 'https://youtu.be/YcetrJ-5yPc', // Prasert Channel - Exception Handling
			},
			{
				id: '9-2',
				title: 'เอกสาร Exception',
				type: 'file',
				attachments: [
					{
						id: 901,
						title: 'Exception Handling',
						type: 'pdf',
						url: '/python/exceptions.pdf',
						description: 'การจัดการข้อผิดพลาดใน Python',
						size: '1.8 MB',
					},
				],
			},
			{
				id: '9-3',
				title: 'แบบทดสอบ Exception',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงเขียนโปรแกรมรับข้อมูลตัวเลขจากผู้ใช้\n# และจัดการข้อผิดพลาดกรณีผู้ใช้ป้อนข้อมูลไม่ใช่ตัวเลข\n# โดยให้แสดงข้อความ "กรุณาป้อนตัวเลขเท่านั้น"\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 9,
				}),
			},
		],
	},
	{
		id: 10,
		title: 'บทที่ 10: การเขียนโปรแกรมเชิงวัตถุ',
		subtopics: [
			{
				id: '10-1',
				title: 'แนะนำ OOP',
				type: 'video',
				videoUrl: 'https://youtu.be/k9WKNzRnYys', // NatapolCC - OOP in Python
			},
			{
				id: '10-2',
				title: 'Class และ Method',
				type: 'video',
				videoUrl: 'https://youtu.be/8qwLCqRgJnE', // CodeWithPech - OOP Basic
			},
			{
				id: '10-3',
				title: 'เอกสาร OOP',
				type: 'file',
				attachments: [
					{
						id: 1001,
						title: 'Object Oriented Programming',
						type: 'pdf',
						url: '/python/oop.pdf',
						description: 'หลักการเขียนโปรแกรมเชิงวัตถุใน Python',
						size: '2.5 MB',
					},
					{
						id: 1002,
						title: 'OOP Design Principles',
						type: 'pdf',
						url: '/python/oop-principles.pdf',
						description: 'หลักการออกแบบโปรแกรมเชิงวัตถุ',
						size: '1.8 MB',
					},
				],
			},
			{
				id: '10-4',
				title: 'แบบทดสอบ OOP',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงสร้าง Class ชื่อ Student\n# มี attributes: name, age, gpa\n# มี method: show_info() สำหรับแสดงข้อมูลนักเรียน\n# และสร้าง object จากคลาสนี้ 1 object พร้อมทั้งเรียกใช้ method\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 10,
				}),
			},
			{
				id: '10-5',
				title: 'แบบทดสอบ Inheritance',
				type: 'quiz',
				quizContent: JSON.stringify({
					code: '# จงสร้าง Class Person เป็น Parent Class\n# และ Class Student เป็น Child Class\n# - Person มี attributes: name, age\n# - Student เพิ่ม attributes: student_id, gpa\n\n# เริ่มเขียนโค้ดที่นี่\n',
					image: null,
					selectedTest: 11,
				}),
			},
		],
	},
];
