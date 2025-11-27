'use client';

import { Icon } from '@iconify/react';

type GoogleSignInButtonProps = {
	onClick: () => Promise<void>;
	disabled?: boolean;
};

export function GoogleSignInButton({
	onClick,
	disabled
}: GoogleSignInButtonProps) {
	return (
		<button
			type='button'
			disabled={disabled}
			onClick={onClick}
			className='inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-foreground transition hover:border-foreground/60 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70'
		>
			<Icon icon='mdi:google' className='h-5 w-5' />
			{disabled ? 'Procesando...' : 'Continuar con Google'}
		</button>
	);
}
