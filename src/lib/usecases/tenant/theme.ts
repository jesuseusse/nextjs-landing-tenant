import { fetchTenantTheme, saveTenantTheme, type TenantThemeDoc } from "@/lib/adapters/firestore/tenantTheme";
import { getSessionUser } from "@/lib/usecases/auth/session";

type ThemeInput = {
  displayName: string;
  theme: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    radius: number;
    font?: string;
  };
};

function ensureAdmin(user: Awaited<ReturnType<typeof getSessionUser>>) {
  const roles = (user?.roles as string[] | undefined) ?? [];
  if (!user || (!roles.includes("admin") && roles !== "admin")) {
    throw Object.assign(new Error("No autorizado"), { status: 403 });
  }
}

export async function getTenantThemeServer(tenantId: string) {
  const user = await getSessionUser();
  ensureAdmin(user);
  return fetchTenantTheme(tenantId);
}

export async function updateTenantThemeServer(tenantId: string, input: ThemeInput) {
  const user = await getSessionUser();
  ensureAdmin(user);

  if (!input.displayName?.trim()) {
    throw Object.assign(new Error("displayName requerido"), { status: 400 });
  }

  const now = Date.now();
  const payload: Omit<TenantThemeDoc, "tenantId"> = {
    displayName: input.displayName.trim(),
    theme: {
      background: input.theme.background,
      foreground: input.theme.foreground,
      primary: input.theme.primary,
      primaryForeground: input.theme.primaryForeground,
      muted: input.theme.muted,
      mutedForeground: input.theme.mutedForeground,
      border: input.theme.border,
      radius: input.theme.radius,
      font: input.theme.font,
    },
    updatedAt: now,
    updatedBy: user?.uid ?? "unknown",
  };

  return saveTenantTheme(tenantId, payload);
}
