import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/adapters/firebase/admin';
import { TenantDoc } from '@/lib/types/tenant';

const COLLECTION = 'tenants';

let db: Firestore | null = null;
function getDb() {
	if (!db) {
		db = getFirestore(getAdminApp());
	}
	return db;
}

export async function fetchTenantById(tenantId: string) {
	const ref = getDb().collection(COLLECTION).doc(tenantId);
	const snap = await ref.get();
	if (!snap.exists) return null;
	return snap.data() as TenantDoc;
}

export async function fetchTenantByUser(userId: string) {
	const ref = getDb()
		.collection(COLLECTION)
		.where('userId', '==', userId)
		.limit(1);
	const snap = await ref.get();
	if (snap.empty) return null;
	return snap.docs[0].data() as TenantDoc;
}

export async function saveTenant(
	tenantId: string,
	payload: Partial<TenantDoc>
) {
	const ref = getDb().collection(COLLECTION).doc(tenantId);
	await ref.set({ tenantId, ...payload });
	return { tenantId, ...payload } as TenantDoc;
}

export async function deleteTenant(tenantId: string) {
	await getDb().collection(COLLECTION).doc(tenantId).delete();
}
