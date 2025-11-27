import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode, CSSProperties } from 'react';
import { getTenantPublicCached } from '@/lib/usecases/tenant/public';

export async function generateMetadata({
	params
}: {
	params: Promise<{ tenantId: string }>;
}): Promise<Metadata> {
	const { tenantId } = await params;
	const tenant = await getTenantPublicCached(tenantId);

	if (!tenant) {
		return {
			title: 'Landing no encontrada',
			description: 'El consultorio no existe o fue dado de baja.'
		};
	}
	return {
		title: tenant.displayName,
		description: `Landing de ${tenant.displayName}`
	};
}

export default async function TenantLayout({
	children,
	params
}: {
	children: ReactNode;
	params: Promise<{ tenantId: string }>;
}) {
	const { tenantId } = await params;

	const tenant = await getTenantPublicCached(tenantId);

	if (!tenant) notFound();

	const styleVars: CSSProperties = {
		'--background': tenant.theme.background,
		'--foreground': tenant.theme.foreground,
		'--primary': tenant.theme.primary,
		'--muted': tenant.theme.muted,
		'--font-tenant': tenant.theme.font
	} as CSSProperties;

	return (
		<div style={styleVars}>
			<div className='min-h-screen bg-background text-foreground'>
				{children}
			</div>
		</div>
	);
}
