// Firestore adapter for tenant theme persistence.
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/adapters/firebase/admin';
import { ThemeConfig } from '@/lib/types/theme';

const COLLECTION = 'tenantThemes';

export type TenantThemeDoc = {
	tenantId: string;
	userUid: string;
	displayName: string;
	theme: ThemeConfig;
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

export async function fetchTenantThemeByUserUid(userUid: string) {
	const db = getFirestore(getAdminApp());
	const ref = db
		.collection(COLLECTION)
		.where('userUid', '==', userUid)
		.limit(1);
	const snap = await ref.get();
	if (snap.empty) return null;
	const doc = snap.docs[0];
	return doc.data() as TenantThemeDoc;
}

export async function saveTenantTheme(
	tenantId: string,
	payload: Omit<TenantThemeDoc, 'tenantId'>
) {
	const db = getFirestore(getAdminApp());
	const ref = db.collection(COLLECTION).doc(tenantId);
	await ref.set({ tenantId, ...payload }, { merge: true });
	return { tenantId, ...payload };
}
