// React Query hooks for tenant management.
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TenantDoc } from '../types/tenant';

async function fetchTenant() {
	const res = await fetch('/api/tenant', { credentials: 'include' });
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error ?? 'No se pudo obtener el tenant');
	}
	return (await res.json()).tenant as TenantDoc | null;
}

type SaveTenantInput = {
	payload: Partial<TenantDoc> & { prevTenantId?: string | null };
	method: 'POST' | 'PUT';
};

async function saveTenant({ payload, method }: SaveTenantInput) {
	const res = await fetch('/api/tenant', {
		method,
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(payload)
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error ?? 'No se pudo guardar el tenant');
	}
	return (await res.json()).tenant as TenantDoc;
}

export function useTenant(options?: { initialData?: TenantDoc | null }) {
	return useQuery({
		queryKey: ['tenant'],
		queryFn: fetchTenant,
		initialData: options?.initialData
	});
}

export function useSaveTenant() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: saveTenant,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['tenant'] });
		}
	});
}
