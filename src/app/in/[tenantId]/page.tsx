import { notFound } from 'next/navigation';
import { getTenantPublicCached } from '@/lib/usecases/tenant/public';

type PageProps = {
	params: Promise<{ tenantId: string }>;
};

export default async function TenantLandingPage({ params }: PageProps) {
	const { tenantId } = await params;
	const tenant = await getTenantPublicCached(tenantId);
	if (!tenant) notFound();

	return (
		<main className='mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12'>
			<h1 className='text-4xl font-semibold'>{tenant.displayName}</h1>
			<p className='text-muted-foreground'>
				Bienvenido a la landing de {tenant.displayName}. Personaliza esta
				seccion con bloques y contenido propio.
			</p>
		</main>
	);
}
