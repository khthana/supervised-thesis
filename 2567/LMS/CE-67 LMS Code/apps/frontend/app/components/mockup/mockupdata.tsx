// src/mockData.js

export const mockQuiz = {
	title: 'Python Programming Fundamentals Quiz',
	pointsPerQuestion: {
		1: 1, // Radio - 1 point
		2: 1, // Checkbox with 2 correct answers - 1 point
		3: 1, // Radio - 1 point
		4: 2, // Checkbox with 3 correct answers - 2 points
		5: 5, // Short Answer - 5 points
		6: 1, // Radio - 1 point
		7: 5, // Short Answer - 5 points
		8: 1, // Checkbox with 2 correct answers - 1 point
	},
	questions: [
		{
			id: 1,
			type: 'radio',
			question: 'ข้อใดคือการประกาศตัวแปรที่ถูกต้องใน Python?',
			questionImage: null,
			options: [
				{ id: 'A', text: 'var name = "John"', image: null },
				{ id: 'B', text: 'string name = "John"', image: null },
				{ id: 'C', text: 'name = "John"', image: null },
				{ id: 'D', text: 'dim name = "John"', image: null },
			],
			correctAnswer: 'C',
		},
		{
			id: 2,
			type: 'checkbox',
			question: 'เลือกวิธีการที่ถูกต้องในการแสดงผลข้อความใน Python (เลือก 2 ข้อ)',
			questionImage: null,
			options: [
				{ id: 'A', text: 'print("Hello")', image: null },
				{ id: 'B', text: 'console.log("Hello")', image: null },
				{ id: 'C', text: 'print(f"Hello")', image: null },
				{ id: 'D', text: 'echo("Hello")', image: null },
			],
			correctAnswer: ['A', 'C'],
		},
		{
			id: 3,
			type: 'radio',
			question: 'ข้อใดคือ output ของโค้ด print(type(5.0))?',
			questionImage: null,
			options: [
				{ id: 'A', text: "<class 'int'>", image: null },
				{ id: 'B', text: "<class 'float'>", image: null },
				{ id: 'C', text: "<class 'number'>", image: null },
				{ id: 'D', text: "<class 'double'>", image: null },
			],
			correctAnswer: 'B',
		},
		{
			id: 4,
			type: 'checkbox',
			question: 'เลือกข้อที่เป็น Built-in Data Structures ใน Python (เลือก 3 ข้อ)',
			questionImage: null,
			options: [
				{ id: 'A', text: 'List', image: null },
				{ id: 'B', text: 'Tuple', image: null },
				{ id: 'C', text: 'Dictionary', image: null },
				{ id: 'D', text: 'Array', image: null },
			],
			correctAnswer: ['A', 'B', 'C'],
		},
		{
			id: 5,
			type: 'shortAnswer',
			question: 'จงอธิบายหลักการทำงานของ List Comprehension ใน Python พร้อมยกตัวอย่างประกอบ',
			questionImage: null,
			correctAnswer:
				'List Comprehension เป็นวิธีการสร้าง list ใหม่จาก sequence หรือ iterable อื่นๆ ในรูปแบบที่กระชับ ตัวอย่างเช่น [x for x in range(10) if x % 2 == 0] จะสร้าง list ของเลขคู่ตั้งแต่ 0-9 โดยมีรูปแบบคือ [expression for item in iterable if condition]',
		},
		{
			id: 6,
			type: 'radio',
			question: 'ข้อใดคือผลลัพธ์ของ len("Python")',
			questionImage: null,
			options: [
				{ id: 'A', text: '5', image: null },
				{ id: 'B', text: '6', image: null },
				{ id: 'C', text: '4', image: null },
				{ id: 'D', text: '7', image: null },
			],
			correctAnswer: 'B',
		},
		{
			id: 7,
			type: 'shortAnswer',
			question: 'จงอธิบายความแตกต่างระหว่าง List และ Tuple ใน Python พร้อมยกตัวอย่างการใช้งานที่เหมาะสม',
			questionImage: null,
			correctAnswer:
				'List เป็น mutable data structure สามารถแก้ไขข้อมูลได้ เหมาะกับข้อมูลที่ต้องการเปลี่ยนแปลง เช่น shopping_cart = ["apple", "banana"]. Tuple เป็น immutable ไม่สามารถแก้ไขได้หลังจากสร้าง เหมาะกับข้อมูลที่ไม่ต้องการเปลี่ยนแปลง เช่น point = (x, y) หรือใช้เป็น return value จาก function',
		},
		{
			id: 8,
			type: 'checkbox',
			question: 'เลือกข้อที่เป็น Valid Operators ใน Python (เลือก 2 ข้อ)',
			questionImage: null,
			options: [
				{ id: 'A', text: '**', image: null },
				{ id: 'B', text: '++', image: null },
				{ id: 'C', text: '//', image: null },
				{ id: 'D', text: '><', image: null },
			],
			correctAnswer: ['A', 'C'],
		},
	],
};

export const mockResponses = [
	{
		studentId: '6511001',
		studentName: 'สมชาย เขียนโค้ด',
		submittedAt: '2025-01-14T09:30:00Z',
		timeSpent: 1500,
		answers: {
			1: 'C', // ถูก (1 คะแนน)
			2: ['A', 'C'], // ถูก (1 คะแนน)
			3: 'B', // ถูก (1 คะแนน)
			4: ['A', 'B', 'C'], // ถูก (2 คะแนน)
			5: 'List Comprehension คือการสร้าง list ใหม่แบบสั้นๆ เช่น [x for x in range(5)] จะได้ [0,1,2,3,4]', // ต้องตรวจด้วยผู้สอน (5 คะแนน)
			6: 'B', // ถูก (1 คะแนน)
			7: 'List แก้ไขได้ใช้ [] ส่วน Tuple แก้ไขไม่ได้ใช้ ()', // ต้องตรวจด้วยผู้สอน (5 คะแนน)
			8: ['A', 'C'], // ถูก (1 คะแนน)
		},
	},
	{
		studentId: '6511002',
		studentName: 'สมหญิง รักเรียน',
		submittedAt: '2025-01-14T09:40:00Z',
		timeSpent: 1800,
		answers: {
			1: 'A', // ผิด
			2: ['A'], // ผิด (ตอบไม่ครบ)
			3: 'B', // ถูก
			4: ['A', 'B', 'D'], // ผิด
			5: 'List Comprehension เป็นการสร้าง list จาก loop', // ต้องตรวจด้วยผู้สอน
			6: 'B', // ถูก
			7: 'List กับ Tuple ต่างกันที่ List ใช้ [] Tuple ใช้ ()', // ต้องตรวจด้วยผู้สอน
			8: ['A', 'B'], // ผิด
		},
	},
	{
		studentId: '6511003',
		studentName: 'วิชัย ตั้งใจ',
		submittedAt: '2025-01-14T09:25:00Z',
		timeSpent: 1200,
		answers: {
			1: 'C', // ถูก
			2: ['A', 'C'], // ถูก
			3: 'D', // ผิด
			4: ['A', 'B'], // ผิด (ไม่ครบ)
			5: 'List Comprehension คือการสร้าง list โดยใช้ loop แบบย่อ สามารถเขียนให้สั้นกว่าการใช้ for loop ปกติ เช่น [x*2 for x in range(5)] จะได้ [0,2,4,6,8]', // ต้องตรวจด้วยผู้สอน
			6: 'A', // ผิด
			7: 'Tuple คือ list ที่แก้ไขไม่ได้ เหมาะกับการเก็บข้อมูลที่ไม่ต้องการเปลี่ยนแปลง เช่น ค่าคงที่ หรือ coordinates', // ต้องตรวจด้วยผู้สอน
			8: ['A', 'C'], // ถูก
		},
	},
];

export const QuestionTypes = {
	RADIO: 'radio',
	CHECKBOX: 'checkbox',
	SHORT_ANSWER: 'shortAnswer',
};
