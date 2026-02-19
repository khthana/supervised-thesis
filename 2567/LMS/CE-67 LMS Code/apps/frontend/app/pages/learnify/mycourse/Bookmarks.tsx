import CardPublic from '@/components/learnify/index/CourseCard';
import type { ICourses } from '@/interfaces/course';
import type { ParentLoaderData } from '@/routes/_lnf';
import { courseService } from '@/server/service/courseService';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { useOutletContext } from 'react-router';

export async function loader() {
	const courses = await courseService.getCourses();
	return { courses: courses.courses };
}

function Bookmarks() {
	// const { courses } = useLoaderData<{ courses: ICourses[] }>();
	const [enrolledCourses, setEnrolledCourses] = useState<ICourses[]>([]);
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const userId = loaderData.user?.user_id;

	// useEffect(() => {
	// 	const saved = JSON.parse(
	// 		localStorage.getItem(`bookmarkedCourses_${userId}`) || '[]',
	// 	);
	// 	if (saved.length === 0) {
	// 		return;
	// 	}
	// 	const filtered = courses.filter((course) => saved.includes(course.name));
	// 	setEnrolledCourses(filtered);
	// }, [courses, userId]);

	return (
		<div className='grid px-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{/* {enrolledCourses.map((course) => (
				<CardPublic
					key={course.id}
					Course_name={course.name}
					Url_img={course.cover_image}
					Cat={course.type}
				/>
			))} */}
		</div>
	);
}

export default Bookmarks;
