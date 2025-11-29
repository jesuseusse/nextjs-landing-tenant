import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantPublicCached } from '@/lib/usecases/tenant/public';
import { Icon } from '@iconify/react/dist/iconify.js';
import type { TenantLink } from '@/lib/types/tenant';
import accountIcon from '@iconify/icons-mdi/account-circle';
import mapMarkerIcon from '@iconify/icons-mdi/map-marker';
import instagramIcon from '@iconify/icons-mdi/instagram';
import facebookIcon from '@iconify/icons-mdi/facebook';
import twitterIcon from '@iconify/icons-mdi/twitter';
import wazeIcon from '@iconify/icons-mdi/waze';
import googleMapsIcon from '@iconify/icons-mdi/google-maps';
import whatsappIcon from '@iconify/icons-mdi/whatsapp';
import linkIcon from '@iconify/icons-mdi/link-variant';
import tiktokIcon from '@iconify/icons-simple-icons/tiktok';

type PageProps = {
	params: Promise<{ tenantId: string }>;
};

export default async function TenantLandingPage({ params }: PageProps) {
	const { tenantId } = await params;
	const tenant = await getTenantPublicCached(tenantId);
	if (!tenant) notFound();
	const links = tenant.links ?? [];

	const renderIcon = (link: TenantLink) => {
		switch (link.type) {
			case 'instagram':
				return <Icon icon={instagramIcon} width={14} />;
			case 'facebook':
				return <Icon icon={facebookIcon} width={14} />;
			case 'x':
				return <Icon icon={twitterIcon} width={14} />;
			case 'tiktok':
				return <Icon icon={tiktokIcon} width={14} />;
			case 'waze':
				return <Icon icon={wazeIcon} width={14} />;
			case 'google-maps':
				return <Icon icon={googleMapsIcon} width={14} />;
			case 'whatsapp':
				return <Icon icon={whatsappIcon} width={14} />;
			default:
				return <Icon icon={linkIcon} width={14} />;
		}
	};

	return (
		<main className='min-h-screen bg-background'>
			<div className='mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-background text-foreground shadow-xl'>
				<div
					className='h-48 w-full'
					style={{
						backgroundColor: tenant.theme.primary
					}}
				/>

				<div className='-mt-16 flex justify-center'>
					<div className='flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-muted/40 shadow-md'>
						<Icon
							icon={accountIcon}
							className='h-16 w-16 text-muted-foreground'
						/>
					</div>
				</div>

				<div className='space-y-4 px-6 pb-8 pt-4 text-center'>
					<div className='space-y-1'>
						<h1 className='text-2xl font-semibold'>{tenant.displayName}</h1>
						<p className='text-sm font-semibold text-primary'>
							Servicios y reservas
						</p>
						<p className='flex items-center justify-center gap-1 text-xs text-muted-foreground'>
							<Icon icon={mapMarkerIcon} className='h-4 w-4' />
							<span>Disponible en linea</span>
						</p>
					</div>

					<Link
						href='/login'
						className='inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90'
					>
						Agenda o contáctanos
					</Link>

					{links.length ? (
						<div className='space-y-3'>
							<p className='text-xs font-semibold tracking-wide text-muted-foreground'>
								LET&apos;S CONNECT
							</p>
							<div className='flex flex-wrap items-center justify-center gap-3'>
								{links.map(link => (
									<Link
										key={link.id}
										href={link.href}
										target='_blank'
										rel='noreferrer'
										className='flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow'
										style={{ color: tenant.theme.primary }}
										aria-label={link.label || link.type}
									>
										{renderIcon(link)}
									</Link>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</main>
	);
}
