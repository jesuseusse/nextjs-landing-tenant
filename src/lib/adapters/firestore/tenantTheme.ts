// Firestore adapter for tenant theme persistence.
import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/adapters/firebase/admin";

const COLLECTION = "tenantThemes";

export type TenantThemeDoc = {
  tenantId: string;
  displayName: string;
  theme: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    radius: number;
    font?: string;
  };
  updatedAt: number;
  updatedBy: string;
};

export async function fetchTenantTheme(tenantId: string) {
  const db = getFirestore(getAdminApp());
  const ref = db.collection(COLLECTION).doc(tenantId);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return snap.data() as TenantThemeDoc;
}

export async function saveTenantTheme(tenantId: string, payload: Omit<TenantThemeDoc, "tenantId">) {
  const db = getFirestore(getAdminApp());
  const ref = db.collection(COLLECTION).doc(tenantId);
  await ref.set({ tenantId, ...payload }, { merge: true });
  return { tenantId, ...payload };
}
