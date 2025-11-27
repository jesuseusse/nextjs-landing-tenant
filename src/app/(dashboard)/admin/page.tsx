'use client';
import Link from 'next/link';
import { useUserProfileContext } from '@/components/providers/UserProfileContext';
import { LandingLinks } from '@/components/landing/LandingLinks';
import { TenantUsername } from '@/components/landing/TenantUsername';
import { useTenant } from '@/lib/hooks/useTenant';
import { useCallback, useMemo, useState } from 'react';

export default function AdminHome() {
	const profile = useUserProfileContext();
	const tenant = useTenant();
	const [copied, setCopied] = useState(false);

	const landingUrl = useMemo(() => {
		if (!tenant.data?.tenantId) return null;
		const base = process.env.NEXT_PUBLIC_URL ?? process.env.PUBLIC_URL ?? '';
		if (!base) return null;
		return `${base}/in/${tenant.data.tenantId}`;
	}, [tenant.data?.tenantId]);

	const handleCopy = useCallback(() => {
		if (!landingUrl) return;
		navigator.clipboard
			.writeText(landingUrl)
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			})
			.catch(() => {
				setCopied(false);
			});
	}, [landingUrl]);

	return (
		<div className='flex flex-col gap-6'>
			{landingUrl ? (
				<div className='flex justify-end gap-2'>
					<Link
						href={landingUrl}
						target='_blank'
						rel='noreferrer'
						className='inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90'
					>
						Ver tu landing page |{' '}
						<span className='underline ml-2'>{landingUrl} </span>
					</Link>
					{}
					<button
						type='button'
						onClick={handleCopy}
						className='inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted/50'
					>
						{copied ? 'Copiado' : 'Copiar link'}
					</button>
				</div>
			) : null}
			<section className='grid gap-4'>
				<h1 className='text-lg font-semibold text-foreground'>
					{profile.email}
				</h1>

				<TenantUsername initialTenant={tenant.data ?? undefined} />
				{tenant.data && (
					<>
						<LandingLinks initialTenant={tenant.data} />
						<div className='rounded-2xl border border-border bg-background p-6 shadow-sm'>
							<h2 className='text-lg font-semibold text-foreground'>
								Tarjeta digital
							</h2>
							<p className='text-sm text-muted-foreground'>
								Crea, edita y configura colores, tipografia y dominios.
							</p>
							<Link
								href='/admin/customize'
								className='w-full mt-4 inline-flex h-11 items-center justify-center rounded bg-primary px-4 text-white font-bold transition hover:opacity-90'
							>
								Personaliza tu landing page
							</Link>
						</div>
						<div className='rounded-2xl border border-border bg-background p-6 shadow-sm'>
							<h2 className='text-lg font-semibold text-foreground'>
								Reservas
							</h2>
							<p className='text-sm text-muted-foreground'>
								Revisa reservas recientes y asigna staff o salas segun
								disponibilidad.
							</p>
							<div className='w-full text-sm text-center text-primary border-primary rounded-l border-2 p-2 mt-4'>
								<span>Disponible próximamente</span>
							</div>
						</div>
					</>
				)}
			</section>
		</div>
	);
}
