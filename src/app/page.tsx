import Link from 'next/link';

const featureItems = [
	{
		title: 'Contacto y WhatsApp',
		desc: 'Muestra telefono, WhatsApp y formulario de contacto para que te encuentren rapido.'
	},
	{
		title: 'Agenda y reservas',
		desc: 'Conecta tu calendario y deja que los pacientes elijan un horario disponible.'
	},
	{
		title: 'Ubicacion y mapa',
		desc: 'Agrega direccion, indicaciones, estacionamiento y enlaces rapidos a mapas o transporte.'
	},
	{
		title: 'Servicios y precios',
		desc: 'Destaca especialidades, duraciones y precios con llamados a la accion claros.'
	}
];

const steps = [
	'Crea tu cuenta en ConsultApp',
	'Elige colores, bordes y tipografia por consultorio',
	'Agrega contacto, WhatsApp, calendario y ubicacion',
	'Publica tu landing para cada sede o especialidad'
];

export default function Home() {
	return (
		<div className='bg-muted text-foreground'>
			<main className='mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-16'>
				<header className='flex flex-col gap-8'>
					<div className='inline-flex items-center gap-2 self-start rounded bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white'>
						ConsultApp
					</div>
					<div className='flex flex-col gap-6 lg:w-3/4'>
						<h1 className='text-4xl font-semibold leading-tight sm:text-5xl'>
							Lanza una landing para tu consultorio en minutos.
						</h1>
						<p className='text-lg leading-8 text-primary-foreground/90'>
							Dueños y staff pueden crear paginas a medida por consultorio o
							especialidad con contacto, WhatsApp, agenda y ubicacion, todo con
							la identidad de cada marca. Los pacientes mantienen un solo login;
							tu controlas la experiencia.
						</p>
					</div>
					<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
						<Link
							href='/register'
							className='inline-flex h-12 items-center justify-center rounded bg-primary px-6 text-white transition hover:opacity-90'
						>
							Crear mi landing
						</Link>
						<Link
							href='#features'
							className='inline-flex h-12 items-center justify-center rounded border-2 border-primary px-6 text-primary transition hover:border-foreground/60 hover:bg-background'
						>
							Ver como funciona
						</Link>
					</div>
				</header>

				<section
					id='features'
					className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
				>
					{featureItems.map(item => (
						<div
							key={item.title}
							className='rounded-2xl border border-border bg-background p-6 shadow-sm'
						>
							<h3 className='text-lg font-semibold text-foreground'>
								{item.title}
							</h3>
							<p className='mt-3 text-sm leading-6 text-muted-foreground'>
								{item.desc}
							</p>
						</div>
					))}
				</section>

				<section
					id='get-started'
					className='rounded-3xl border border-border bg-background p-8 shadow-sm'
				>
					<h2 className='text-2xl font-semibold text-foreground'>
						Configura tu primera landing
					</h2>
					<p className='mt-2 text-muted-foreground'>
						Pasos claros para estar en linea y recibir reservas.
					</p>
					<ol className='mt-6 space-y-4'>
						{steps.map((step, idx) => (
							<li
								key={step}
								className='flex items-center gap-3 rounded-4xl border border-border bg-muted p-2'
							>
								<span className='flex h-6 w-6 p-2 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm'>
									{idx + 1}
								</span>
								<span className='text-foreground'>{step}</span>
							</li>
						))}
					</ol>
					<div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
						<Link
							href='/login'
							className='inline-flex h-11 items-center justify-center rounded from-primary to-[#7c3aed] px-5 text-white transition hover:opacity-95'
						>
							Empezar ahora
						</Link>
						<span className='text-sm text-muted-foreground'>
							¿Necesitas ayuda? Configuramos tu primera pagina por ti.
						</span>
					</div>
				</section>
			</main>
		</div>
	);
}
