'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { type UserProfile } from '@/lib/types/user';

const UserProfileContext = createContext<UserProfile>({} as UserProfile);

export function UserProfileProvider({
	children,
	profile
}: {
	children: ReactNode;
	profile: UserProfile;
}) {
	return (
		<UserProfileContext.Provider value={profile}>
			{children}
		</UserProfileContext.Provider>
	);
}

export function useUserProfileContext() {
	return useContext(UserProfileContext);
}
