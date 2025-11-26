"use client";

import { useMutation } from "@tanstack/react-query";

type CreateSessionInput = { idToken: string };

async function createSession({ idToken }: CreateSessionInput) {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "No se pudo crear la sesion.");
  }
  return res.json();
}

async function deleteSession() {
  const res = await fetch("/api/session", {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cerrar la sesion.");
  return res.json();
}

export function useCreateSession() {
  return useMutation({ mutationFn: createSession });
}

export function useDeleteSession() {
  return useMutation({ mutationFn: deleteSession });
}
