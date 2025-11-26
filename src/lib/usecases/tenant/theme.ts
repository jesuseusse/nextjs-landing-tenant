import {
	fetchTenantTheme,
	fetchTenantThemeByUserUid,
	saveTenantTheme,
	type TenantThemeDoc
} from '@/lib/adapters/firestore/tenantTheme';
import { getSessionUser } from '@/lib/usecases/auth/session';
import { type ThemeConfig } from '@/lib/types/theme';

type ThemeInput = {
	tenantId: string;
	displayName: string;
	theme: ThemeConfig;
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

async function assertTenantAvailable(tenantId: string, userUid: string) {
	const existing = await fetchTenantTheme(tenantId);
	if (existing && existing.userUid !== userUid) {
		throw Object.assign(new Error('Nombre de usuario ya existe'), {
			status: 409
		});
	}
}

export async function getTenantThemeServer(tenantId: string) {
	const user = await getSessionUser();
	ensureSessionUser(user);
	const doc = await fetchTenantTheme(tenantId);
	if (doc && doc.userUid !== user.uid) {
		throw Object.assign(new Error('No puedes ver este landing'), {
			status: 403
		});
	}
	return doc;
}

export async function getTenantThemeByUserServer(userUid?: string) {
	const user = await getSessionUser();
	ensureSessionUser(user);
	if (userUid && user.uid !== userUid) {
		throw Object.assign(new Error('No puedes ver este landing'), {
			status: 403
		});
	}
	return fetchTenantThemeByUserUid(user.uid);
}

export async function updateTenantThemeServer(
	userUid: string,
	input: ThemeInput
) {
	const user = await getSessionUser();
	ensureSessionUser(user);
	if (user.uid !== userUid) {
		throw Object.assign(new Error('No puedes editar este landing'), {
			status: 403
		});
	}

	if (!input.displayName?.trim()) {
		throw Object.assign(new Error('displayName requerido'), { status: 400 });
	}

	if (!input.tenantId?.trim()) {
		throw Object.assign(new Error('tenantId requerido'), { status: 400 });
	}

	await assertTenantAvailable(input.tenantId, user.uid);

	const now = Date.now();
	const payload: Omit<TenantThemeDoc, 'tenantId'> = {
		userUid: user.uid,
		displayName: input.displayName.trim(),
		theme: {
			background: input.theme.background,
			foreground: input.theme.foreground,
			primary: input.theme.primary,
			muted: input.theme.muted,
			radius: input.theme.radius,
			font: input.theme.font
		},
		updatedAt: now,
		updatedBy: user?.uid ?? 'unknown'
	};

	return saveTenantTheme(input.tenantId, payload);
}
