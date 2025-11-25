"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/adapters/firebase/client";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/login?from=/admin");
          return;
        }
        setReady(true);
      });
    } catch {
      router.replace("/login?from=/admin");
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-24 items-center justify-center text-slate-700">
        Verificando sesion...
      </div>
    );
  }

  return <>{children}</>;
}
