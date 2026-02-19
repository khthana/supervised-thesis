import { type LoaderFunctionArgs, redirect } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
	return redirect('/management/dashboard');
}
