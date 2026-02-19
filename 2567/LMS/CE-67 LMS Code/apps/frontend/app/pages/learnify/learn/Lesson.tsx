import Draggable from '@/components/learnify/tolearn/accordianDnD';
import type { CycleWithLessonAndEnrollment } from '@/interfaces/sharetype';
import { Button } from '@heroui/react';
import type { Lesson as LessonType } from '@shared/types/courses/lesson.model';
import { useEffect, useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData } from 'react-router';

function Lessons() {
	const { cycle } = useLoaderData();
	const fetcher = useFetcher();
	// สร้าง state เพื่อเก็บข้อมูล lessons
	// console.log('cycle', cycle);
	const [lessonsState, setLessonsState] = useState<LessonType[]>(cycle?.lessons || []);
	// console.log('lessonsState', lessonsState);
	// อัปเดต state เมื่อข้อมูล cycle เปลี่ยนแปลง
	useEffect(() => {
		if (cycle?.lessons) {
			setLessonsState(cycle.lessons);
		}
	}, [cycle]);

	// ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงบทเรียน
	const handleLessonsUpdate = (updatedLessons: LessonType[]) => {
		setLessonsState(updatedLessons);

		// console.log('formdata', formdata);

		// fetcher.submit(formdata, {
		//   method: 'put',
		//   action: `/action/update/${cycle?.cycle_id}`,
		// });
	};

	return (
		<div className='mx-auto px-4 py-8'>
			<div className='mb-4'>
				<h1 className='text-2xl font-bold'>Course: {cycle?.name}</h1>
			</div>

			<div className='grid p-6 rounded-lg shadow-sm' style={{ gridTemplateColumns: '3fr 1fr' }}>
				<div className='w-'>
					{/* ส่วนแสดงข้อมูลเพิ่มเติมของ cycle */}
					<div>Course ID: {cycle?.course_id}</div>
					<div>Status: {cycle?.status || 'N/A'}</div>
					<div>Enrollment: {cycle?.is_always_enroll ? 'Always Open' : 'Restricted'}</div>
					{/* ข้อมูลอื่นๆ ที่ต้องการแสดง */}
				</div>
				<div>
					{/* {lessonsState.map((lesson) => (
            <div key={lesson.lesson_id} className='mb-4'>
              <h2 className='text-xl font-semibold'>{lesson.name}</h2>
              <p>Lesson ID: {lesson.lesson_id}</p>
            </div>
          ))} */}

					<Draggable
						lessonsData={lessonsState}
						onLessonsChange={handleLessonsUpdate}
						cycle_id={String(cycle?.cycle_id || '')}
					/>
				</div>
			</div>
		</div>
	);
}

export default Lessons;
