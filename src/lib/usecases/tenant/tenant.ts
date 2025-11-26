import {
  deleteTenant,
  fetchTenantById,
  fetchTenantByUser,
  saveTenant,
  type TenantDoc,
} from "@/lib/adapters/firestore/tenant";
import { getSessionUser } from "@/lib/usecases/auth/session";
import { type ThemeConfig } from "@/lib/types/theme";

type TenantInput = {
  tenantId: string;
  displayName: string;
  theme: ThemeConfig;
};

function ensureSessionUser(
  user: Awaited<ReturnType<typeof getSessionUser>>,
): asserts user is NonNullable<Awaited<ReturnType<typeof getSessionUser>>> & { uid: string } {
  if (!user?.uid) {
    throw Object.assign(new Error("No autorizado"), { status: 401 });
  }
}

async function ensureTenantAvailable(tenantId: string, userId: string) {
  const existing = await fetchTenantById(tenantId);
  if (existing && existing.userId !== userId) {
    throw Object.assign(new Error("Nombre de usuario ya existe"), { status: 409 });
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
    throw Object.assign(new Error("No autorizado"), { status: 403 });
  }
  return tenant;
}

export async function upsertTenant(input: TenantInput) {
  const user = await getSessionUser();
  ensureSessionUser(user);

  if (!input.tenantId?.trim()) {
    throw Object.assign(new Error("tenantId requerido"), { status: 400 });
  }
  if (!input.displayName?.trim()) {
    throw Object.assign(new Error("displayName requerido"), { status: 400 });
  }

  await ensureTenantAvailable(input.tenantId, user.uid);

  const now = Date.now();
  const payload: Omit<TenantDoc, "tenantId"> = {
    userId: user.uid,
    displayName: input.displayName.trim(),
    theme: input.theme,
    updatedAt: now,
    createdAt: now,
  };

  return saveTenant(input.tenantId, payload);
}

export async function removeTenant(tenantId: string) {
  const user = await getSessionUser();
  ensureSessionUser(user);
  const existing = await fetchTenantById(tenantId);
  if (!existing) return;
  if (existing.userId !== user.uid) {
    throw Object.assign(new Error("No autorizado"), { status: 403 });
  }
  await deleteTenant(tenantId);
}
