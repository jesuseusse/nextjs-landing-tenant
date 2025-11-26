import { cache } from 'react';
import {
	fetchTenantById,
	type TenantDoc
} from '@/lib/adapters/firestore/tenant';

export const getTenantPublicCached = cache(
	async (tenantId: string): Promise<TenantDoc | null> => {
		if (!tenantId?.trim()) return null;
		console.log('paso trim');
		const t = await fetchTenantById(tenantId.trim());
		console.log('despues fetch', t);
		return t;
	}
);
