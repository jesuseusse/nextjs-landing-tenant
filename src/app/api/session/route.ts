import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/adapters/firebase/admin';
import { sessionCookieName } from '@/lib/usecases/auth/session';

export async function POST(request: Request) {
	try {
		const { idToken } = await request.json();
		if (!idToken) {
			return NextResponse.json({ error: 'idToken requerido' }, { status: 400 });
		}

		const decoded = await verifyIdToken(idToken);
		const maxAge = 60 * 60 * 24 * 7; // 7 days

		const response = NextResponse.json({
			ok: true,
			uid: decoded.uid,
			email: decoded.email ?? null
		});

		response.cookies.set({
			name: sessionCookieName,
			value: idToken,
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge
		});

		return response;
	} catch (error) {
		return NextResponse.json(
			{ error: 'Token invalido o config faltante' },
			{ status: 401 }
		);
	}
}

export async function DELETE() {
	const response = NextResponse.json({ ok: true });
	response.cookies.delete(sessionCookieName);
	return response;
}
