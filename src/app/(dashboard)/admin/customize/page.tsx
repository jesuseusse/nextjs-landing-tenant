'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTenant, useSaveTenant } from '@/lib/hooks/useTenant';
import { useUserProfileContext } from '@/components/providers/UserProfileContext';

const themeSchema = z.object({
	background: z.string().nonempty('Requerido'),
	foreground: z.string().nonempty('Requerido'),
	primary: z.string().nonempty('Requerido'),
	muted: z.string().nonempty('Requerido'),
	radius: z.number().min(0).max(50),
	font: z.string().nonempty('Requerido')
});

const formSchema = z.object({
	tenantId: z.string().min(3, 'Minimo 3 caracteres').max(50),
	displayName: z.string().min(2, 'Minimo 2 caracteres'),
	theme: themeSchema
});

type FormValues = z.infer<typeof formSchema>;

function formatTenant(value: string) {
	return value.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export default function ThemePage() {
	const profile = useUserProfileContext();
	const tenantQuery = useTenant();
	const saveTenant = useSaveTenant();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tenantId: '',
			displayName: '',
			theme: {
				background: '#ffffff',
				foreground: '#171717',
				primary: '#7700d3',
				muted: '#00a891',
				radius: 12,
				font: 'geist'
			}
		}
	});

	// Hydrate form when data loads
	useEffect(() => {
		if (tenantQuery.data) {
			const t = tenantQuery.data;
			form.reset({
				tenantId: t.tenantId,
				displayName: t.displayName,
				theme: t.theme
			});
		} else if (tenantQuery.isSuccess && !tenantQuery.data) {
			form.reset();
		}
	}, [form, tenantQuery.data, tenantQuery.isSuccess]);

	const onSubmit = async (values: FormValues) => {
		const tenantId = formatTenant(values.tenantId);
		form.setValue('tenantId', tenantId);
		await saveTenant.mutateAsync({
			tenantId,
			displayName: values.displayName,
			theme: values.theme
		});
	};

	return (
		<div className='mx-auto flex w-full max-w-4xl flex-col gap-8 text-foreground'>
			<div>
				<h1 className='text-3xl font-semibold'>Personaliza la landing</h1>
				<p className='text-muted-foreground'>
					Define nombre, usuario y tema visual.
				</p>
			</div>

			<form
				className='flex flex-col gap-6'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<input type='hidden' value={profile.uid} readOnly />
				<div className='grid gap-4 sm:grid-cols-2'>
					<label className='flex flex-col gap-2 text-sm text-foreground'>
						Nombre visible
						<input
							type='text'
							{...form.register('displayName')}
							className='h-11 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
							placeholder='Consultorio Salud Integral'
						/>
						{form.formState.errors.displayName ? (
							<span className='text-xs text-red-600'>
								{form.formState.errors.displayName.message}
							</span>
						) : null}
					</label>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					<label className='flex flex-col gap-2 text-sm text-foreground'>
						Nombre de usuario
						<input
							type='text'
							{...form.register('tenantId', {
								onChange: e =>
									form.setValue('tenantId', formatTenant(e.target.value))
							})}
							className='h-11 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
							placeholder='mi-consultorio'
						/>
						{form.formState.errors.tenantId ? (
							<span className='text-xs text-red-600'>
								{form.formState.errors.tenantId.message}
							</span>
						) : null}
					</label>
					<label className='flex flex-col gap-2 text-sm text-foreground'>
						Fuente
						<select
							{...form.register('theme.font')}
							className='h-11 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
						>
							<option value='geist'>Geist</option>
							<option value='serif'>Serif</option>
							<option value='mono'>Monoespaciada</option>
						</select>
					</label>
				</div>

				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{(
						[
							{ key: 'background', label: 'Fondo' },
							{ key: 'foreground', label: 'Texto' },
							{ key: 'primary', label: 'Primario' },
							{ key: 'muted', label: 'Secundario' }
						] as const
					).map(field => (
						<label
							key={field.key}
							className='flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-foreground'
						>
							<span>{field.label}</span>
							<input
								type='color'
								{...form.register(`theme.${field.key}`)}
								className='h-10 w-16 cursor-pointer rounded border border-border bg-white'
							/>
						</label>
					))}
				</div>

				<label className='flex flex-col gap-2 text-sm text-foreground'>
					Radio de bordes (px)
					<input
						type='number'
						min={0}
						max={50}
						{...form.register('theme.radius', { valueAsNumber: true })}
						className='h-11 rounded-lg border border-border bg-white px-3 text-foreground outline-none ring-primary/10 focus:ring-2'
					/>
				</label>

				{saveTenant.isError ? (
					<p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
						{saveTenant.error instanceof Error
							? saveTenant.error.message
							: 'No se pudo guardar'}
					</p>
				) : null}
				{saveTenant.isSuccess ? (
					<p className='text-sm text-green-700'>Guardado correctamente.</p>
				) : null}

				<button
					type='submit'
					disabled={saveTenant.isPending}
					className='inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'
				>
					{saveTenant.isPending ? 'Guardando...' : 'Guardar configuracion'}
				</button>
			</form>
		</div>
	);
}
