import {
	deleteTenant,
	fetchTenantById,
	fetchTenantByUser,
	saveTenant
} from '@/lib/adapters/firestore/tenant';
import { getSessionUser } from '@/lib/usecases/auth/session';
import { type ThemeConfig } from '@/lib/types/theme';
import { TenantDoc, TenantLink } from '@/lib/types/tenant';

type TenantInput = {
	tenantId: string;
	displayName: string;
	theme: ThemeConfig;
	prevTenantId?: string | null;
	links?: TenantLink[];
};

type UpdateTenantInput = {
	tenantId: string;
	displayName?: string;
	theme?: ThemeConfig;
	links?: TenantLink[];
	prevTenantId?: string | null;
};

function ensureSessionUser(
	user: Awaited<ReturnType<typeof getSessionUser>>
): asserts user is NonNullable<Awaited<ReturnType<typeof getSessionUser>>> & {
	uid: string;
} {
	if (!user?.uid) {
		throw Object.assign(new Error('No autorizado'), { status: 401 });
	}
}

async function ensureTenantAvailable(tenantId: string, userId: string) {
	const existing = await fetchTenantById(tenantId);
	if (existing && existing.userId !== userId) {
		throw Object.assign(new Error('Nombre de usuario ya existe'), {
			status: 409
		});
	}
}

export async function getTenantForUser() {
	const user = await getSessionUser();
	ensureSessionUser(user);
	return fetchTenantByUser(user.uid);
}

export async function getTenantById(tenantId: string) {
	const user = await getSessionUser();
	ensureSessionUser(user);
	const tenant = await fetchTenantById(tenantId);
	if (tenant && tenant.userId !== user.uid) {
		throw Object.assign(new Error('No autorizado'), { status: 403 });
	}
	return tenant;
}

export async function createTenant(input: TenantInput) {
	const user = await getSessionUser();
	ensureSessionUser(user);

	if (!input.tenantId?.trim()) {
		throw Object.assign(new Error('tenantId requerido'), { status: 400 });
	}

	await ensureTenantAvailable(input.tenantId, user.uid);

	const now = Date.now();
	const payload: TenantDoc = {
		userId: user.uid,
		tenantId: input.tenantId.trim(),
		displayName: input.displayName.trim(),
		theme: input.theme,
		updatedAt: now,
		createdAt: now,
		links: input.links ?? []
	};

	const saved = await saveTenant(input.tenantId, payload);

	return saved;
}

export async function updateTenant(input: UpdateTenantInput) {
	const user = await getSessionUser();
	ensureSessionUser(user);

	const targetId = input.tenantId?.trim();
	const sourceId = input.prevTenantId?.trim() || targetId;

	if (!targetId || !sourceId) {
		throw Object.assign(new Error('tenantId requerido'), { status: 400 });
	}

	const existing = await fetchTenantById(sourceId);
	if (!existing) {
		throw Object.assign(new Error('Tenant no encontrado'), { status: 404 });
	}

	if (existing.userId !== user.uid) {
		throw Object.assign(new Error('No autorizado'), { status: 403 });
	}

	if (targetId !== sourceId) {
		await ensureTenantAvailable(targetId, user.uid);
	}

	const now = Date.now();
	const payload: Partial<TenantDoc> = {
		tenantId: targetId,
		userId: user.uid,
		displayName: existing.displayName,
		theme: existing.theme,
		links: existing.links ?? [],
		createdAt: existing.createdAt ?? now,
		updatedAt: now
	};

	if (input.displayName?.trim()) payload.displayName = input.displayName.trim();
	if (input.theme) payload.theme = input.theme;
	if (input.links) payload.links = input.links;

	const saved = await saveTenant(targetId, payload);

	// If tenantId changed, remove old doc
	if (sourceId && sourceId !== targetId) {
		const existingSource = await fetchTenantById(sourceId);
		if (existingSource && existingSource.userId === user.uid) {
			await deleteTenant(sourceId);
		}
	}

	return saved;
}

export async function removeTenant(tenantId: string) {
	const user = await getSessionUser();
	ensureSessionUser(user);
	const existing = await fetchTenantById(tenantId);
	if (!existing) return;
	if (existing.userId !== user.uid) {
		throw Object.assign(new Error('No autorizado'), { status: 403 });
	}
	await deleteTenant(tenantId);
}
