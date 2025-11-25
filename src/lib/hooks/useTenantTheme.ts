// React Query hooks for tenant theme management.
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ThemePayload = {
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

async function fetchTheme(tenantId: string) {
  const res = await fetch(`/api/admin/tenant-theme?tenantId=${encodeURIComponent(tenantId)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo obtener el tema");
  const data = await res.json();
  return data.theme as ThemePayload | null;
}

async function updateTheme(tenantId: string, payload: ThemePayload) {
  const res = await fetch("/api/admin/tenant-theme", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tenantId, ...payload }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "No se pudo guardar el tema");
  }
  return (await res.json()).theme as ThemePayload;
}

export function useTenantTheme(tenantId: string) {
  return useQuery({
    queryKey: ["tenant-theme", tenantId],
    queryFn: () => fetchTheme(tenantId),
    enabled: Boolean(tenantId),
  });
}

export function useUpdateTenantTheme(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ThemePayload) => updateTheme(tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-theme", tenantId] });
    },
  });
}
