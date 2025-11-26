// Firebase Admin helper for verifying ID tokens on the server.
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export function getAdminApp() {
	if (getApps().length) return getApp();

	const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const projectId =
		process.env.FIREBASE_PROJECT_ID ??
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

	const hasServiceAccount = privateKey && clientEmail && projectId;

	if (!hasServiceAccount) {
		throw new Error(
			'Firebase Admin config missing. Set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL y FIREBASE_PROJECT_ID.'
		);
	}

	return initializeApp({
		credential: cert({
			privateKey,
			clientEmail,
			projectId
		}),
		projectId
	});
}

const app = getAdminApp();
const auth = getAuth(app);

export async function verifyIdToken(idToken: string) {
	return auth.verifyIdToken(idToken);
}

export async function createSessionCookie(
	idToken: string,
	options: { expiresIn: number }
) {
	return auth.createSessionCookie(idToken, options);
}

export async function verifySessionCookie(sessionCookie: string) {
	return auth.verifySessionCookie(sessionCookie);
}

export async function revokeRefreshTokens(uid: string) {
	return auth.revokeRefreshTokens(uid);
}
