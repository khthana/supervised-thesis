import { createCookieSessionStorage, redirect } from 'react-router';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
	type: ToastType;
	message: string;
	duration?: number;
};

const toastSession = createCookieSessionStorage({
	cookie: {
		name: 'learnify_toast',
		secrets: ['toasted'],
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		maxAge: 10, // ลดอายุลงเหลือแค่ 10 วินาที
		secure: process.env.NODE_ENV === 'production',
	},
});

export const { getSession, commitSession, destroySession } = toastSession;

export async function getToast(request: Request) {
	const cookieHeader = request.headers.get('Cookie');
	const session = await getSession(cookieHeader);

	// ใช้ key 'toast' ในการเข้าถึงข้อมูล
	const toast = session.get('toast') as Toast | undefined;

	return { toast: toast || null };
}

export async function redirectWithToast(
	url: string,
	{ type, message, duration = 5000 }: { type: ToastType; message: string; duration?: number },
) {
	const session = await getSession();

	// เก็บ toast ใน session ด้วย key 'toast'
	session.set('toast', { type, message, duration });

	// ใช้ flash แทน เพื่อให้แน่ใจว่า toast จะถูกลบหลังจากใช้ครั้งแรก
	session.flash('_timestamp', Date.now());

	return redirect(url, {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	});
}

// ฟังก์ชันใหม่สำหรับสร้าง cookie ที่หมดอายุทันที
export async function getExpiredToastCookie() {
	const session = await getSession();
	session.unset('toast');
	return destroySession(session);
}

export default toastSession;
