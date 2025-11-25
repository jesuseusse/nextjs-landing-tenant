import { requireAdminSession } from "@/lib/usecases/auth/session";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default async function AdminHome() {
  const user = await requireAdminSession();

  return (
    <AdminGuard>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-slate-600">Panel administrativo</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Bienvenido, {user.email ?? "administrador"}
          </h1>
          <p className="text-slate-700">
            Gestiona tenants, landings, servicios y reservas desde este panel.
          </p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Tenants</h2>
            <p className="text-sm text-slate-700">
              Crea, edita y configura colores, tipografia y dominios.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Reservas</h2>
            <p className="text-sm text-slate-700">
              Revisa reservas recientes y asigna staff o salas segun disponibilidad.
            </p>
          </div>
        </section>
      </div>
    </AdminGuard>
  );
}
