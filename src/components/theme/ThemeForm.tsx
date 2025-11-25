"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTenantTheme, useUpdateTenantTheme } from "@/lib/hooks/useTenantTheme";

const defaultTheme = {
  background: "#ffffff",
  foreground: "#0f172a",
  primary: "#0f172a",
  primaryForeground: "#f8fafc",
  muted: "#f1f5f9",
  mutedForeground: "#475569",
  border: "#e2e8f0",
  radius: 12,
  font: "geist",
};

export function ThemeForm() {
  const searchParams = useSearchParams();
  const [tenantId, setTenantId] = useState(searchParams.get("tenantId") ?? "");

  const { data, isLoading } = useTenantTheme(tenantId || "");
  const mutation = useUpdateTenantTheme(tenantId || "");

  const [displayName, setDisplayName] = useState("");
  const [theme, setTheme] = useState(defaultTheme);

  // Sync fetched data into local form state
  useEffect(() => {
    if (!isLoading && data && tenantId) {
      setDisplayName(data.displayName ?? "");
      setTheme({ ...defaultTheme, ...(data.theme as any) });
    }
  }, [data, isLoading, tenantId]);

  const handleChange = (field: keyof typeof theme, value: string | number) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    await mutation.mutateAsync({
      displayName,
      theme: {
        background: theme.background,
        foreground: theme.foreground,
        primary: theme.primary,
        primaryForeground: theme.primaryForeground,
        muted: theme.muted,
        mutedForeground: theme.mutedForeground,
        border: theme.border,
        radius: Number(theme.radius),
        font: theme.font,
      },
    });
  };

  return (
    <form className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-foreground">
          Tenant ID (slug o ID)
          <input
            required
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            className="h-10 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
            placeholder="clinic-123"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-foreground">
          Nombre visible (amigable)
          <input
            required
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="h-10 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
            placeholder="Clínica Centro Salud"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { key: "background", label: "Fondo" },
          { key: "foreground", label: "Texto principal" },
          { key: "primary", label: "Primario" },
          { key: "primaryForeground", label: "Texto primario" },
          { key: "muted", label: "Mutado" },
          { key: "mutedForeground", label: "Texto mutado" },
          { key: "border", label: "Borde" },
        ].map(item => (
          <label key={item.key} className="flex flex-col gap-2 text-sm text-foreground">
            {item.label}
            <input
              type="color"
              value={theme[item.key as keyof typeof theme] as string}
              onChange={e => handleChange(item.key as keyof typeof theme, e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-border bg-white"
            />
          </label>
        ))}
        <label className="flex flex-col gap-2 text-sm text-foreground">
          Radio (px)
          <input
            type="number"
            min={0}
            value={theme.radius}
            onChange={e => handleChange("radius", Number(e.target.value))}
            className="h-10 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-foreground">
          Tipografía
          <select
            value={theme.font}
            onChange={e => handleChange("font", e.target.value)}
            className="h-10 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
          >
            <option value="geist">Geist</option>
            <option value="geist-mono">Geist Mono</option>
            <option value="system">Sistema</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!tenantId || mutation.isLoading}
          className="inline-flex h-11 items-center justify-center rounded bg-primary px-4 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isLoading ? "Guardando..." : "Guardar cambios"}
        </button>
        {mutation.isSuccess ? (
          <span className="text-sm text-foreground">Configuración guardada.</span>
        ) : null}
        {mutation.isError ? (
          <span className="text-sm text-red-600">No se pudo guardar. Intenta de nuevo.</span>
        ) : null}
      </div>
    </form>
  );
}
