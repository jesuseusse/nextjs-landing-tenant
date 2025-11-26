// React Query hooks for tenant theme management.
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { type ThemeConfig } from '@/lib/types/theme';

type ThemePayload = {
	tenantId: string;
	userUid: string;
	displayName: string;
	theme: ThemeConfig;
};

type ThemeUpdatePayload = Omit<ThemePayload, 'userUid'>;

async function fetchTheme() {
	const res = await fetch(`/api/admin/tenant-theme`, {
		credentials: 'include'
	});
	if (!res.ok) throw new Error('No se pudo obtener el tema');
	const data = await res.json();
	return data.theme as ThemePayload | null;
}

async function updateTheme(userUid: string, payload: ThemeUpdatePayload) {
	const res = await fetch('/api/admin/tenant-theme', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ userUid, ...payload })
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error ?? 'No se pudo guardar el tema');
	}
	return (await res.json()).theme as ThemePayload;
}

export function useTenantTheme(options?: {
	onSuccess?: (data: ThemePayload | null) => void;
	enabled?: boolean;
}) {
	return useQuery({
		queryKey: ['tenant-theme'],
		queryFn: fetchTheme,
		...options
	});
}

export function useUpdateTenantTheme(userUid: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: ThemeUpdatePayload) => updateTheme(userUid, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tenant-theme'] });
		}
	});
}
