import { NextRequest, NextResponse } from 'next/server';
import { sessionCookieName } from '@/lib/usecases/auth/session';
import {
	createSessionCookie,
	revokeRefreshTokens,
	verifyIdToken,
	verifySessionCookie
} from '@/lib/adapters/firebase/admin';

export async function POST(request: Request) {
	try {
		const { idToken } = await request.json();
		if (!idToken) {
			return NextResponse.json({ error: 'idToken requerido' }, { status: 400 });
		}

		// 1. Verificar el token y obtener los claims
		const decoded = await verifyIdToken(idToken);

		if (!decoded.uid) {
			return NextResponse.json({ error: 'No Autorizado' }, { status: 403 });
		}

		const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 días
		const maxAgeMilliseconds = maxAgeSeconds * 1000;

		// 2. CREAR el Session Cookie de LARGA DURACIÓN
		const sessionCookie = await createSessionCookie(idToken, {
			expiresIn: maxAgeMilliseconds
		});

		// 3. Respuesta con la cookie HTTP-only
		const response = NextResponse.json({
			ok: true,
			uid: decoded.uid,
			email: decoded.email ?? null
		});

		response.cookies.set({
			name: sessionCookieName,
			value: sessionCookie,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
			maxAge: maxAgeSeconds // maxAge en segundos
		});

		return response;
	} catch (error) {
		console.error('POST /api/session error', error);
		const message =
			error instanceof Error ? error.message : 'Token inválido o configuración faltante';
		return NextResponse.json(
			{ error: message },
			{ status: 401 }
		);
	}
}

// --- DELETE (LOGOUT) ---
export async function DELETE(request: NextRequest) {
	const sessionCookie = request.cookies.get(sessionCookieName)?.value;

	const response = NextResponse.json({ ok: true });

	// 1. Eliminar la cookie del navegador
	response.cookies.delete(sessionCookieName);

	// 2. ¡CRÍTICO! Revocar la sesión en Firebase
	if (sessionCookie) {
		try {
			const decodedClaims = await verifySessionCookie(sessionCookie);
			// Revocar todos los tokens de sesión de este UID
			await revokeRefreshTokens(decodedClaims.sub);
		} catch (error) {
			console.error(
				'Error al revocar la sesión (puede estar ya expirada):',
				error
			);
		}
	}

	return response;
}
