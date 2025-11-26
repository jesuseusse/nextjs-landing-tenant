// Server-side session helpers for admin protection.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/adapters/firebase/admin';
import { SESSION_COOKIE } from '@/lib/constants/cookies';

export async function getSessionUser() {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!token) return null;
	try {
		const decoded = await verifySessionCookie(token);
		return {
			...decoded
		};
	} catch {
		return null;
	}
}

export async function requireAdminSession() {
	const user = await getSessionUser();
	if (!user) {
		redirect('/login?from=admin');
	}
	return user;
}

export const sessionCookieName = SESSION_COOKIE;
