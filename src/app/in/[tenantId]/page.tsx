import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantPublicCached } from '@/lib/usecases/tenant/public';
import { Icon } from '@iconify/react/dist/iconify.js';
import type { TenantLink } from '@/lib/types/tenant';
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
		<main className='mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12'>
			<h1 className='text-4xl font-semibold'>{tenant.displayName}</h1>
			{links.length ? (
				<section className='space-y-3'>
					<div className='flex flex-wrap gap-2'>
						{links.map(link => (
							<Link
								key={link.id}
								href={link.href}
								target='_blank'
								rel='noreferrer'
								className='w-full inline-flex items-center gap-2 rounded-xl bg-primary p-4 text-sm font-medium text-white transition hover:opacity-90'
							>
								{renderIcon(link)}
								<span>{link.label || link.href}</span>
							</Link>
						))}
					</div>
				</section>
			) : null}
		</main>
	);
}
