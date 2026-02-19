import type { UserWithAvatarType } from '@/interfaces/sharetype';
import { getPublicEnv } from '@/lib/env.server';
import authService from '@/server/api/auth.server';
import { destroySession, getSession } from '@/server/sessions/learnify.server';
import { getAccessToken } from '@/server/token.server';
import { UserRoleSchema } from '@shared/types/users/user.model';
import { Outlet, useOutletContext } from 'react-router';
import { type LoaderFunctionArgs, redirect } from 'react-router';

export interface ParentLoaderData {
	user: UserWithAvatarType | null;
	accessToken: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
	const userService = await import('@/server/service/admUserService');
	const env = getPublicEnv();
	const Token = await getAccessToken(request);
	const session = await getSession(request.headers.get('Cookie'));
	const logoutSession = await destroySession(session);

	if (!Token) {
		return redirect('/login');
	}

	const verifiedAccess = await authService.verifyAccessToken(Token.accessToken);

	if (!verifiedAccess) {
		return redirect('/login');
	}

	if (UserRoleSchema.parse(verifiedAccess.user_role) !== 'ANNOUNCER') {
		console.log('Who dafaq R U');
		return redirect('/login', {
			headers: {
				'Set-Cookie': logoutSession,
			},
		});
	}

	if (UserRoleSchema.parse(verifiedAccess.user_role) === 'ANNOUNCER') {
		console.log('User role is ANNOUNCER');
	}
}

export default function LnfLayout() {
	const loaderData = useOutletContext<ParentLoaderData>();
	return <Outlet context={{ loaderData }} />;
}
