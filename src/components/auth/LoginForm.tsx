"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleSignInButton } from "./GoogleSignInButton";

const loginSchema = z.object({
  email: z.string().email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSubmit: (values: LoginValues) => Promise<void>;
  onGoogle: () => Promise<void>;
  serverError?: string | null;
  loading?: boolean;
};

export function LoginForm({ onSubmit, onGoogle, serverError, loading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
          placeholder="Tu contraseña"
          autoComplete="current-password"
        />
        {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
      </label>

      {serverError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-primary px-4 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Procesando..." : "Entrar"}
      </button>
      <GoogleSignInButton onClick={onGoogle} disabled={loading} />
    </form>
  );
}
