'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSaveTenant, useTenant } from '@/lib/hooks/useTenant';
import { TenantDoc } from '@/lib/types/tenant';

function formatTenant(value: string) {
	return value.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

type FormValues = { tenantId: string; displayName: string };

export function TenantUsername({
	initialTenant
}: {
	initialTenant?: TenantDoc;
}) {
	const tenantQuery = useTenant({ initialData: initialTenant });
	const saveTenant = useSaveTenant();
	const form = useForm<FormValues>({
		defaultValues: { tenantId: '', displayName: '' }
	});

	useEffect(() => {
		if (tenantQuery.data) {
			form.reset({
				tenantId: tenantQuery.data.tenantId,
				displayName: tenantQuery.data.displayName
			});
		} else if (tenantQuery.isSuccess && !tenantQuery.data) {
			form.reset({ tenantId: '', displayName: '' });
		}
	}, [form, tenantQuery.data, tenantQuery.isSuccess]);

	const onSubmit = async (values: FormValues) => {
		const tenantId = formatTenant(values.tenantId);
		form.setValue('tenantId', tenantId);
		await saveTenant.mutateAsync({
			method: tenantQuery.data?.tenantId ? 'PUT' : 'POST',
			payload: {
				prevTenantId: tenantQuery.data?.tenantId ?? null,
				tenantId,
				displayName: values.displayName,
				theme: tenantQuery.data?.theme ?? {
					background: '#ffffff',
					foreground: '#171717',
					primary: '#7700d3',
					muted: '#00a891',
					font: 'geist'
				},
				links: tenantQuery.data?.links ?? []
			}
		});
	};

	return (
		<div className='rounded-2xl border border-border bg-background p-6 shadow-sm'>
			<h3 className='text-lg font-semibold text-foreground'>
				Nombre de usuario
			</h3>
			<form
				className='mt-4 grid gap-4 sm:grid-cols-2'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<label className='flex flex-col gap-1 text-sm text-foreground'>
					Nombre visible
					<input
						type='text'
						{...form.register('displayName', { required: true })}
						className='h-11 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
						placeholder='Consultorio Salud Integral'
					/>
				</label>
				<label className='flex flex-col gap-1 text-sm text-foreground'>
					Nombre de usuario
					<input
						type='text'
						{...form.register('tenantId', {
							required: true,
							onChange: e =>
								form.setValue('tenantId', formatTenant(e.target.value))
						})}
						className='h-11 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
						placeholder='mi-consultorio'
					/>
				</label>
				<div className='sm:col-span-2 flex justify-end'>
					<button
						type='submit'
						disabled={saveTenant.isPending}
						className='inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'
					>
						{saveTenant.isPending ? 'Guardando...' : 'Guardar usuario'}
					</button>
				</div>
			</form>
		</div>
	);
}
