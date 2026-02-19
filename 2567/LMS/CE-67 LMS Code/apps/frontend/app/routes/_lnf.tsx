import type { UserWithAvatarType } from '@/interfaces/sharetype';
import { Outlet, useOutletContext } from 'react-router';
import { type LoaderFunctionArgs, redirect } from 'react-router';

export interface ParentLoaderData {
	loaderData: Record<string, unknown>;
	user: UserWithAvatarType | null;
	accessToken: string | null;
}

export default function LnfLayout() {
	const loaderData = useOutletContext<ParentLoaderData>();
	return <Outlet context={{ loaderData }} />;
}
