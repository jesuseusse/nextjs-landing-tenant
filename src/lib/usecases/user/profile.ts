import { getSessionUser } from '@/lib/usecases/auth/session';
import { type UserProfile } from '@/lib/types/user';

export async function getCurrentUserProfileServer(): Promise<UserProfile> {
	const sessionUser = await getSessionUser();
	if (!sessionUser?.uid) {
		throw Object.assign(new Error('No autorizado'), { status: 401 });
	}

	return {
		uid: sessionUser.uid,
		email: sessionUser.email ?? null,
		displayName: null,
		photoURL: null,
		phoneNumber: null,
		provider: null,
		locale: null
	};
}
