// import { json } from '@remix-run/node';
// // import fs from 'node:fs';
// // import path from 'node:path';
// import type { ActionFunction } from '@remix-run/node';
// // import getJsonData from '@/lib/jsonmock';
// import type { ICourseCreate } from '@/interfaces/course';

// export const action: ActionFunction = async ({ request }) => {
// 	const data = await request.formData();
// const courseData: ICourseCreate = {
// 	name: (data.get('name') as string) || '',
// 	description: (data.get('description') as string) || '',
// 	keywords: (data.getAll('keywords') as string[]),
// 	intro_video: (data.get('intro_video') as string) || '',
// 	type: (data.get('course_type') as string) || 'public',
// 	cover_image: (data.get('cover_image') as string) || '',
// 	language: (data.get('language') as string) || '',
// 	creator_id: Number(data.get('creator_id')),
// 	categories: {
// 		main: (data.get('category_main') as string) || '',
// 		sub: (data.get('category_sub') as string) || '',
// 	},
// 	instructors: (data.getAll('instructors') as string[]).map(Number)
// };

// 	const res = await fetch('http://localhost:5000/api/courses', {
// 		method: 'POST',
// 		body: JSON.stringify(courseData),
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	});

// 	console.log('res', res);

// 	// ระบุ path ที่ต้องการเขียนไฟล์
// 	// const filePath = path.join(process.cwd(), 'public/json/coursecreated.json'); // process ห้ามใช้

// 	// const courseList = await getJsonData('coursecreated.json') as ICourseCreate[];
// 	// const courseList =  JSON.parse( await fs.readFileSync(filePath, 'utf8') || '[]');
// 	// const file = await fs.readFile(filepath, 'utf8');
// 	// courseList.push(courseData as ICourseCreate);

// 	// เขียนไฟล์ JSON
// 	// await fs.promises.writeFile(filePath, JSON.stringify(courseList, null, 2));

// 	return json({ success: true });
// };

// // import { json } from '@remix-run/node';
