import { NextResponse } from "next/server";
import { getTenantThemeServer, updateTenantThemeServer } from "@/lib/usecases/tenant/theme";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId");
  if (!tenantId) return errorResponse("tenantId requerido");

  try {
    const theme = await getTenantThemeServer(tenantId);
    return NextResponse.json({ theme });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    const message = error instanceof Error ? error.message : "Error al obtener tema";
    return errorResponse(message, status);
  }
}

export async function POST(request: Request) {
  try {
    const { tenantId, displayName, theme } = await request.json();
    if (!tenantId || !displayName || !theme) {
      return errorResponse("tenantId, displayName y theme son requeridos");
    }
    const updated = await updateTenantThemeServer(tenantId, { displayName, theme });
    return NextResponse.json({ ok: true, theme: updated });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    const message = error instanceof Error ? error.message : "Error al actualizar tema";
    return errorResponse(message, status);
  }
}
