import { AdminGuard } from "@/components/auth/AdminGuard";
import { ThemeForm } from "@/components/theme/ThemeForm";
import { requireAdminSession } from "@/lib/usecases/auth/session";

export default async function ThemePage() {
  await requireAdminSession();

  return (
    <AdminGuard>
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 text-foreground">
        <div>
          <p className="text-sm text-muted-foreground">Personaliza la landing</p>
          <h1 className="text-3xl font-semibold">Colores, tipografia y nombre visible</h1>
          <p className="text-muted-foreground">
            Ajusta la identidad visual y el nombre del tenant que veran tus pacientes.
          </p>
        </div>
        <ThemeForm />
      </div>
    </AdminGuard>
  );
}
