import CourseCard from '@/components/learnify/index/CourseCard';
import type { CourseWithAvatarType } from '@/interfaces/sharetype';
import { Button } from '@heroui/react';
import type { Course } from '@shared/types/courses/course.model';
import { useNavigate } from 'react-router';

interface CreatedProps {
	courses: CourseWithAvatarType[];
}

function Created({ courses }: CreatedProps) {
	const navigate = useNavigate();

	const toCreateCourse = () => {
		navigate('/create_course');
	};

	return (
		<div className='h-full'>
			<Button
				onPress={toCreateCourse}
				style={{
					position: 'fixed',
					right: '10px',
				}}
				color='primary'
			>
				+ Create Course
			</Button>

			<div className={'grid px-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
				{courses.map((course) => (
					<CourseCard
						key={course.course_id}
						Course_name={course.name}
						Cat={'sec'}
						Course_id={course.course_id}
						Url_img={course.avatar?.url}
					/>
				))}
			</div>
		</div>
	);
}

export default Created;
