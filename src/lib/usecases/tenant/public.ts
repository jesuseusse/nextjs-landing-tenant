import { cache } from 'react';
import { fetchTenantById } from '@/lib/adapters/firestore/tenant';
import { TenantDoc } from '@/lib/types/tenant';

export const getTenantPublicCached = cache(
	async (tenantId: string): Promise<TenantDoc | null> => {
		if (!tenantId?.trim()) return null;
		const t = await fetchTenantById(tenantId.trim());
		return t;
	}
);
