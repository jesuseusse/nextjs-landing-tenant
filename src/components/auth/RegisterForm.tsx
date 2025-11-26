"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleSignInButton } from "./GoogleSignInButton";

const registerSchema = z
  .object({
    email: z.string().email("Correo invalido"),
    password: z.string().min(6, "Minimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Minimo 6 caracteres"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type RegisterValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSubmit: (values: RegisterValues) => Promise<void>;
  onGoogle: () => Promise<void>;
  serverError?: string | null;
  loading?: boolean;
};

export function RegisterForm({ onSubmit, onGoogle, serverError, loading }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col gap-2 text-sm text-foreground">
        Correo
        <input
          type="email"
          {...register("email")}
          className="h-11 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
          placeholder="ejemplo@clinica.com"
          autoComplete="email"
        />
        {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground">
        Contraseña
        <input
          type="password"
          {...register("password")}
          className="h-11 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
          placeholder="Minimo 6 caracteres"
          autoComplete="new-password"
        />
        {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground">
        Confirmar contraseña
        <input
          type="password"
          {...register("confirmPassword")}
          className="h-11 rounded-lg border border-border px-3 text-foreground outline-none ring-primary/10 focus:ring-2"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
        />
        {errors.confirmPassword ? (
          <span className="text-xs text-red-600">{errors.confirmPassword.message}</span>
        ) : null}
      </label>

      {serverError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-primary px-4 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Procesando..." : "Crear cuenta"}
      </button>
      <GoogleSignInButton onClick={onGoogle} disabled={loading} />
    </form>
  );
}
