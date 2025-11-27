'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm, useWatch } from 'react-hook-form';
import { useSaveTenant, useTenant } from '@/lib/hooks/useTenant';
import { TenantDoc, TenantLink } from '@/lib/types/tenant';

type LinkType =
	| 'instagram'
	| 'waze'
	| 'google-maps'
	| 'tiktok'
	| 'facebook'
	| 'x'
	| 'whatsapp'
	| 'otro';

function typeIcon(type: LinkType) {
	switch (type) {
		case 'instagram':
			return 'mdi:instagram';
		case 'waze':
			return 'mdi:waze';
		case 'google-maps':
			return 'mdi:google-maps';
		case 'tiktok':
			return 'mdi:tiktok';
		case 'facebook':
			return 'mdi:facebook';
		case 'x':
			return 'mdi:twitter';
		case 'whatsapp':
			return 'mdi:whatsapp';
		default:
			return 'mdi:link-variant';
	}
}

export function LandingLinks({ initialTenant }: { initialTenant?: TenantDoc }) {
	const tenantQuery = useTenant({ initialData: initialTenant });
	const saveTenant = useSaveTenant();
	const [error, setError] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<string | null>(null);
	const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(
		null
	);
	const [countdown, setCountdown] = useState<number | null>(null);
	const deleteInterval = useRef<NodeJS.Timeout | null>(null);

	const links = useMemo<TenantLink[]>(() => {
		return tenantQuery.data?.links ?? [];
	}, [tenantQuery.data]);

	const { register, handleSubmit, reset, setValue, control } = useForm<
		Omit<TenantLink, 'id'>
	>({
		defaultValues: { label: '', href: '', type: 'otro' }
	});

	const selectedType = useWatch({
		control,
		name: 'type'
	});

	const defaultsByType: Record<LinkType, string> = {
		instagram: 'https://instagram.com/',
		waze: 'https://waze.com/ul?ll=',
		'google-maps': 'https://maps.google.com/?q=',
		tiktok: 'https://www.tiktok.com/@',
		facebook: 'https://facebook.com/',
		x: 'https://x.com/',
		whatsapp: 'https://wa.me/',
		otro: 'https://'
	};

	const onTypeChange = (value: LinkType) => {
		setValue('type', value);
		setValue('href', defaultsByType[value]);
	};

	const onSubmit = async (values: Omit<TenantLink, 'id'>) => {
		if (!tenantQuery.data?.tenantId) {
			setError('Guarda primero el tenant y vuelve a intentar.');
			return;
		}
		setError(null);
		const newLink: TenantLink = {
			id: crypto.randomUUID(),
			type: values.type,
			href: values.href,
			label: values.label?.trim() || null
		};
		const nextLinks = [...links, newLink];
		try {
			await saveTenant.mutateAsync({
				method: 'PUT',
				payload: {
					tenantId: tenantQuery.data.tenantId,
					links: [...nextLinks]
				}
			});
			reset({ label: '', href: '', type: values.type });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo guardar el link'
			);
		}
	};

	const cancelPendingDelete = () => {
		if (deleteTimeout) {
			clearTimeout(deleteTimeout);
			setDeleteTimeout(null);
		}
		if (deleteInterval.current) {
			clearInterval(deleteInterval.current);
			deleteInterval.current = null;
		}
		setCountdown(null);
		setPendingDelete(null);
	};

	const confirmDelete = (id: string) => {
		if (!tenantQuery.data?.tenantId) return;
		const nextLinks = links.filter(link => link.id !== id);
		saveTenant
			.mutateAsync({
				method: 'PUT',
				payload: {
					tenantId: tenantQuery.data.tenantId,
					links: [...nextLinks]
				}
			})
			.catch(err => {
				setError(
					err instanceof Error ? err.message : 'No se pudo eliminar el link'
				);
			});
		setPendingDelete(null);
		setCountdown(null);
		if (deleteInterval.current) {
			clearInterval(deleteInterval.current);
			deleteInterval.current = null;
		}
		setDeleteTimeout(null);
	};

	const startDeleteCountdown = (id: string) => {
		cancelPendingDelete();
		setPendingDelete(id);
		setCountdown(5);
		const intervalId = setInterval(() => {
			setCountdown(prev => {
				if (prev === null) return null;
				if (prev <= 1) {
					clearInterval(intervalId);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		deleteInterval.current = intervalId;
		const timeoutId = setTimeout(() => {
			confirmDelete(id);
		}, 5000);
		setDeleteTimeout(timeoutId);
	};

	useEffect(() => {
		return () => {
			cancelPendingDelete();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!tenantQuery.data?.tenantId) {
		return null;
	}

	return (
		<div className='rounded-2xl border border-border bg-background p-6 shadow-sm'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold text-foreground'>
					Links de la landing
				</h3>
			</div>
			<ul className='mt-4 space-y-2'>
				{links.map(link => (
					<li
						key={link.id}
						className='w-full h-12 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground'
					>
						<div className='flex items-center gap-2'>
							<Icon
								icon={typeIcon(link.type as LinkType)}
								width={24}
								height={24}
							/>
							{pendingDelete !== link.id && (
								<div className='flex flex-col'>
									<span className='font-semibold'>{link.label}</span>
									<a
										href={link.href}
										className='text-lg text-primary underline'
										target='_blank'
										rel='noreferrer'
									>
										{link.href.replace(/^(https?:\/\/)?(www\.)?/, '')}
									</a>
								</div>
							)}
						</div>
						{pendingDelete === link.id ? (
							<div className='flex items-center gap-2 text-right justify-end'>
								<span className='text-xs text-muted-foreground'>
									Se elimina en {countdown ?? 5}s
								</span>
								<button
									type='button'
									onClick={cancelPendingDelete}
									className='text-xs font-semibold text-red-600 hover:underline'
								>
									Cancelar
								</button>
							</div>
						) : (
							<button
								type='button'
								onClick={() => startDeleteCountdown(link.id)}
								className='text-xs font-semibold text-red-600 hover:underline'
								aria-label='Eliminar link'
							>
								Eliminar
							</button>
						)}
					</li>
				))}
				{!links.length ? (
					<p className='text-sm text-muted-foreground'>Aun no agregas links.</p>
				) : null}
			</ul>
			<form
				className='mt-4 grid gap-3 sm:grid-cols-4'
				onSubmit={handleSubmit(onSubmit)}
			>
				<label className='flex flex-col gap-1 text-sm text-foreground'>
					Tipo
					<select
						{...register('type')}
						onChange={e => onTypeChange(e.target.value as LinkType)}
						className='h-10 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
					>
						<option value='instagram'>Instagram</option>
						<option value='waze'>Waze</option>
						<option value='google-maps'>Google Maps</option>
						<option value='tiktok'>TikTok</option>
						<option value='facebook'>Facebook</option>
						<option value='x'>X</option>
						<option value='whatsapp'>WhatsApp</option>
						<option value='otro'>Otro</option>
					</select>
				</label>
				{selectedType ? (
					<>
						<label className='flex flex-col gap-1 text-sm text-foreground'>
							URL
							<input
								type='url'
								{...register('href', { required: true })}
								className='h-10 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
								placeholder={defaultsByType[selectedType as LinkType]}
							/>
						</label>
						<label className='flex flex-col gap-1 text-sm text-foreground'>
							Texto (opcional)
							<input
								type='text'
								{...register('label')}
								className='h-10 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
								placeholder='Instagram'
							/>
						</label>
					</>
				) : null}
				<div className='flex items-end'>
					<button
						type='submit'
						disabled={saveTenant.isPending}
						className='inline-flex h-10 w-full items-center justify-center rounded bg-primary px-4 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'
					>
						{saveTenant.isPending ? 'Guardando...' : 'Agrega Link'}
					</button>
				</div>
			</form>
			{error ? <p className='mt-2 text-sm text-red-700'>{error}</p> : null}
		</div>
	);
}
