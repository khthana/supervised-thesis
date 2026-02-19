import { type LoaderFunctionArgs, redirect } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
	const course_id = params.course_id;
	// return redirect(`/courses/${course_id}/learn/lesson`);

	return redirect('/mycourse');
}
