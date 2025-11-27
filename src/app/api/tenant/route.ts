import { NextRequest, NextResponse } from 'next/server';
import {
	createTenant,
	getTenantById,
	getTenantForUser,
	removeTenant,
	updateTenant
} from '@/lib/usecases/tenant/tenant';

function errorResponse(message: string, status = 400) {
	return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const tenantId = searchParams.get('tenantId');
	try {
		const tenant = tenantId
			? await getTenantById(tenantId)
			: await getTenantForUser();
		return NextResponse.json({ tenant });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const status = (error as any)?.status ?? 500;
		const message =
			error instanceof Error ? error.message : 'Error al obtener tenant';
		return errorResponse(message, status);
	}
}

export async function POST(request: Request) {
	try {
		const { tenantId, displayName, theme, prevTenantId } = await request.json();
		if (!tenantId || !displayName || !theme) {
			return errorResponse('tenantId, displayName y theme son requeridos');
		}
		const tenant = await createTenant({
			tenantId,
			displayName,
			theme,
			prevTenantId
		});
		return NextResponse.json({ ok: true, tenant });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const status = (error as any)?.status ?? 500;
		const message =
			error instanceof Error ? error.message : 'Error al crear tenant';
		return errorResponse(message, status);
	}
}

export async function PUT(request: Request) {
	try {
		const { tenantId, ...rest } = await request.json();
		if (!tenantId) {
			return errorResponse('tenantId es requerido');
		}

		const tenant = await updateTenant({
			tenantId,
			...rest
		});

		return NextResponse.json({ ok: true, tenant });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const status = (error as any)?.status ?? 500;
		const message =
			error instanceof Error ? error.message : 'Error al actualizar tenant';
		return errorResponse(message, status);
	}
}

export async function DELETE(request: Request) {
	try {
		const { tenantId } = await request.json();
		if (!tenantId) return errorResponse('tenantId requerido');
		await removeTenant(tenantId);
		return NextResponse.json({ ok: true });
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const status = (error as any)?.status ?? 500;
		const message =
			error instanceof Error ? error.message : 'Error al eliminar tenant';
		return errorResponse(message, status);
	}
}
