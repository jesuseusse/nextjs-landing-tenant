import { AuthContainer } from '@/components/auth/AuthContainer';

export default function RegisterPage() {
	return (
		<div className='min-h-screen bg-muted px-6 py-12'>
			<AuthContainer initialMode='register' />
		</div>
	);
}
