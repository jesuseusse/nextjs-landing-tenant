// React Query hooks for tenant management.
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ThemeConfig } from "@/lib/types/theme";

type TenantPayload = {
  tenantId: string;
  displayName: string;
  theme: ThemeConfig;
};

async function fetchTenant() {
  const res = await fetch("/api/tenant", { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "No se pudo obtener el tenant");
  }
  return (await res.json()).tenant as TenantPayload | null;
}

async function saveTenant(payload: TenantPayload & { prevTenantId?: string | null }) {
  const method = "PUT";
  const res = await fetch("/api/tenant", {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "No se pudo guardar el tenant");
  }
  return (await res.json()).tenant as TenantPayload;
}

export function useTenant() {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: fetchTenant,
  });
}

export function useSaveTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveTenant,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
}
