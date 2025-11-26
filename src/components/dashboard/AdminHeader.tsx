'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/adapters/firebase/client';
import { useDeleteSession } from '@/lib/hooks/useSession';

type AdminHeaderProps = {
	onToggleMenu?: () => void;
};

export function AdminHeader({ onToggleMenu }: AdminHeaderProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const deleteSession = useDeleteSession();

	const handleLogout = async () => {
		setError(null);
		try {
			const auth = getFirebaseAuth();
			await signOut(auth);
		} catch {
			// Ignore client sign-out errors but still clear the session cookie.
		}

		try {
			await deleteSession.mutateAsync();
			router.replace('/login');
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo cerrar la sesion.'
			);
		}
	};

	return (
		<header className='sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur'>
			<div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4'>
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={onToggleMenu}
						className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-foreground/60 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden'
						aria-label='Abrir menu lateral'
					>
						<svg
							aria-hidden='true'
							viewBox='0 0 24 24'
							className='h-5 w-5'
							stroke='currentColor'
							strokeWidth='1.8'
							fill='none'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<line x1='4' x2='20' y1='7' y2='7' />
							<line x1='4' x2='20' y1='12' y2='12' />
							<line x1='4' x2='14' y1='17' y2='17' />
						</svg>
					</button>
					<span className='text-lg font-semibold text-foreground sm:text-xl'>
						Admin
					</span>
				</div>
				<div className='flex items-center gap-3'>
					{error ? (
						<span className='hidden text-xs text-red-600 sm:inline'>
							{error}
						</span>
					) : null}
					<button
						type='button'
						onClick={handleLogout}
						disabled={deleteSession.isPending}
						className='inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:border-foreground/60 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70'
					>
						{deleteSession.isPending ? 'Saliendo...' : 'Cerrar sesion'}
					</button>
				</div>
			</div>
			{error ? (
				<p className='px-4 pb-3 text-xs text-red-600 sm:hidden'>{error}</p>
			) : null}
		</header>
	);
}
