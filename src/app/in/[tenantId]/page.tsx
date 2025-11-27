import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
	UilInstagram,
	UilFacebook,
	UilTwitter,
	UilLink,
	UilMapMarker,
	UilMap
} from '@iconscout/react-unicons';
import { getTenantPublicCached } from '@/lib/usecases/tenant/public';
import { Icon } from '@iconify/react';
import tiktokIcon from '@iconify/icons-simple-icons/tiktok';

import type { TenantLink } from '@/lib/types/tenant';

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
				return <UilInstagram className='h-4 w-4' />;
			case 'facebook':
				return <UilFacebook className='h-4 w-4' />;
			case 'x':
				return <UilTwitter className='h-4 w-4' />;
			case 'tiktok':
				return <Icon icon={tiktokIcon} width={14} />;
			case 'waze':
				return <UilMap className='h-4 w-4' />;
			case 'google-maps':
				return <UilMapMarker className='h-4 w-4' />;
			default:
				return <UilLink className='h-4 w-4' />;
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
