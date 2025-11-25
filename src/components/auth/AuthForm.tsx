"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/adapters/firebase/client";

type Mode = "login" | "register";

const titles: Record<Mode, { heading: string; cta: string; alt: string }> = {
  login: {
    heading: "Inicia sesion en ConsultApp",
    cta: "Entrar",
    alt: "¿No tienes cuenta? Crea una",
  },
  register: {
    heading: "Crea tu cuenta en ConsultApp",
    cta: "Crear cuenta",
    alt: "¿Ya tienes cuenta? Inicia sesion",
  },
};

function isFirebaseConfigMissing(error: unknown) {
  return error instanceof Error && error.message.includes("Firebase client config missing");
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      const credential =
        mode === "login"
          ? await signInWithEmailAndPassword(auth, email, password)
          : await createUserWithEmailAndPassword(auth, email, password);

      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la sesion. Revisa la configuracion de Firebase.");
      }

      const next = searchParams.get("from") ?? "/admin";
      router.replace(next);
    } catch (err) {
      if (isFirebaseConfigMissing(err)) {
        setError("Configura las variables NEXT_PUBLIC_FIREBASE_* antes de continuar.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrio un error al autenticar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          ConsultApp
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">{titles[mode].heading}</h1>
        <p className="text-sm text-slate-700">
          Accede para crear landings, gestionar servicios y revisar reservas.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-slate-800">
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none ring-slate-900/10 focus:ring-2"
            placeholder="ejemplo@clinica.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-800">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none ring-slate-900/10 focus:ring-2"
            placeholder="Tu contraseña"
          />
        </label>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-4 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Procesando..." : titles[mode].cta}
        </button>
      </form>

      <div className="text-sm text-slate-700">
        {mode === "login" ? (
          <Link href="/register" className="text-slate-900 underline">
            {titles[mode].alt}
          </Link>
        ) : (
          <Link href="/login" className="text-slate-900 underline">
            {titles[mode].alt}
          </Link>
        )}
      </div>
    </div>
  );
}
