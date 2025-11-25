// Server-side session helpers for admin protection.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '@/lib/adapters/firebase/admin';

const SESSION_COOKIE = 'consultapp_session';

export async function getSessionUser() {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!token) return null;
	try {
		const decoded = await verifyIdToken(token);
		return {
			uid: decoded.uid,
			email: decoded.email ?? null,
			roles: decoded.roles ?? decoded.role ?? null
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
