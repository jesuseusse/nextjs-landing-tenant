import { AdminHeader } from '@/components/dashboard/AdminHeader';
import { UserProfileProvider } from '@/components/providers/UserProfileContext';
import { getCurrentUserProfileServer } from '@/lib/usecases/user/profile';
import type { ReactNode } from 'react';

export default async function DashboardLayout({
	children
}: {
	children: ReactNode;
}) {
	const profile = await getCurrentUserProfileServer();

	return (
		<UserProfileProvider profile={profile}>
			<div className='min-h-screen bg-muted text-foreground'>
				<AdminHeader />
				<main className='mx-auto flex max-w-6xl flex-col gap-10 bg-muted px-6 py-10'>
					{children}
				</main>
			</div>
		</UserProfileProvider>
	);
}
