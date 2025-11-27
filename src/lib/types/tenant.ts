import { ThemeConfig } from './theme';

export type TenantDoc = {
	tenantId: string;
	displayName: string;
	theme: ThemeConfig;
	links?: TenantLink[];
	userId: string;
	createdAt: number;
	updatedAt: number;
};

export type TenantLink = {
	id: string;
	label: string | null;
	href: string;
	type: string;
};
