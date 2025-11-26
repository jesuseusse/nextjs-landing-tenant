'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/adapters/firebase/client';
import { useCreateSession } from '@/lib/hooks/useSession';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import Link from 'next/link';

type Mode = 'login' | 'register';

function useRedirectTarget() {
	const searchParams = useSearchParams();
	return searchParams.get('from') ?? '/admin';
}

export function AuthContainer({ initialMode }: { initialMode: Mode }) {
	const router = useRouter();
	const nextUrl = useRedirectTarget();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const createSession = useCreateSession();

	const createBackendSession = useCallback(
		async (idToken: string) => {
			await createSession.mutateAsync({ idToken });
		},
		[createSession]
	);

	const handleLogin = useCallback(
		async (values: { email: string; password: string }) => {
			setError(null);
			setLoading(true);
			try {
				const auth = getFirebaseAuth();
				const credential = await signInWithEmailAndPassword(
					auth,
					values.email,
					values.password
				);
				const idToken = await credential.user.getIdToken();
				await createBackendSession(idToken);
				router.replace(nextUrl);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'No se pudo iniciar sesion.'
				);
			} finally {
				setLoading(false);
			}
		},
		[createBackendSession, nextUrl, router]
	);

	const handleRegister = useCallback(
		async (values: { email: string; password: string }) => {
			setError(null);
			setLoading(true);
			try {
				const auth = getFirebaseAuth();
				const credential = await createUserWithEmailAndPassword(
					auth,
					values.email,
					values.password
				);
				const idToken = await credential.user.getIdToken();
				await createBackendSession(idToken);
				router.replace(nextUrl);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'No se pudo crear la cuenta.'
				);
			} finally {
				setLoading(false);
			}
		},
		[createBackendSession, nextUrl, router]
	);

	const handleGoogleAuth = useCallback(async () => {
		setError(null);
		setLoading(true);
		try {
			const auth = getFirebaseAuth();
			const provider = new GoogleAuthProvider();
			const credential = await signInWithPopup(auth, provider);
			const idToken = await credential.user.getIdToken();
			await createBackendSession(idToken);
			router.replace(nextUrl);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'No se pudo autenticar con Google.'
			);
		} finally {
			setLoading(false);
		}
	}, [createBackendSession, nextUrl, router]);

	return (
		<div className='mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border bg-background p-8 shadow-sm'>
			<div className='flex flex-col gap-2'>
				<p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
					ConsultApp
				</p>
				<h1 className='text-2xl font-semibold text-foreground'>
					{initialMode === 'login'
						? 'Inicia sesion en ConsultApp'
						: 'Crea tu cuenta en ConsultApp'}
				</h1>
				<p className='text-sm text-muted-foreground'>
					Accede para crear landings, gestionar servicios y revisar reservas.
				</p>
			</div>

			{initialMode === 'login' ? (
				<LoginForm
					onSubmit={handleLogin}
					onGoogle={handleGoogleAuth}
					serverError={error}
					loading={loading}
				/>
			) : (
				<RegisterForm
					onSubmit={values =>
						handleRegister({ email: values.email, password: values.password })
					}
					onGoogle={handleGoogleAuth}
					serverError={error}
					loading={loading}
				/>
			)}

			<div className='text-sm text-muted-foreground'>
				{initialMode === 'login' ? (
					<Link href='/register' className='text-foreground underline'>
						¿No tienes cuenta? Crea una
					</Link>
				) : (
					<Link href='/login' className='text-foreground underline'>
						¿Ya tienes cuenta? Inicia sesion
					</Link>
				)}
			</div>
		</div>
	);
}
