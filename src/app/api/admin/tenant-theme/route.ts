import { NextResponse } from 'next/server';
import {
	getTenantThemeByUserServer,
	updateTenantThemeServer
} from '@/lib/usecases/tenant/theme';

function errorResponse(message: string, status = 400) {
	return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
	try {
		const theme = await getTenantThemeByUserServer();
		return NextResponse.json({ theme });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const status = (error as any)?.status ?? 500;
		const message =
			error instanceof Error ? error.message : 'Error al obtener tema';
		return errorResponse(message, status);
	}
}

export async function POST(request: Request) {
	try {
		const { tenantId, displayName, theme, userUid } = await request.json();
		if (!tenantId || !displayName || !theme || !userUid) {
			return errorResponse(
				'tenantId, displayName, theme y userUid son requeridos'
			);
		}
		const updated = await updateTenantThemeServer(userUid, {
			tenantId,
			displayName,
			theme
		});
		return NextResponse.json({ ok: true, theme: updated });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const status = (error as any)?.status ?? 500;
		const message =
			error instanceof Error ? error.message : 'Error al actualizar tema';
		return errorResponse(message, status);
	}
}
