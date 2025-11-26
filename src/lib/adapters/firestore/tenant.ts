import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/adapters/firebase/admin';
import { type ThemeConfig } from '@/lib/types/theme';
import { log } from 'console';

const COLLECTION = 'tenants';

export type TenantDoc = {
	tenantId: string;
	userId: string;
	displayName: string;
	theme: ThemeConfig;
	updatedAt: number;
	createdAt: number;
};

export async function fetchTenantById(tenantId: string) {
	log('fetchTenantById called with tenantId:', tenantId);
	const db = getFirestore(getAdminApp());
	const ref = db.collection(COLLECTION).doc(tenantId);
	const snap = await ref.get();
	if (!snap.exists) return null;
	return snap.data() as TenantDoc;
}

export async function fetchTenantByUser(userId: string) {
	const db = getFirestore(getAdminApp());
	const ref = db.collection(COLLECTION).where('userId', '==', userId).limit(1);
	const snap = await ref.get();
	if (snap.empty) return null;
	return snap.docs[0].data() as TenantDoc;
}

export async function saveTenant(
	tenantId: string,
	payload: Omit<TenantDoc, 'tenantId'>
) {
	const db = getFirestore(getAdminApp());
	const ref = db.collection(COLLECTION).doc(tenantId);
	await ref.set({ tenantId, ...payload }, { merge: true });
	return { tenantId, ...payload } as TenantDoc;
}

export async function deleteTenant(tenantId: string) {
	const db = getFirestore(getAdminApp());
	await db.collection(COLLECTION).doc(tenantId).delete();
}
