// Component: PageHome
/*----------------------------------------------------------------------------------------------------*/

/*---------- Template ----------*/

// Components: (local)
import Game from '@/components/Game';

/*---------- Template ----------*/

// Default component
export default function PageHome() {
	// Export default
	return (
		<main className="page flex min-h-screen flex-col justify-start items-center p-6 space-y-6 text-center lg:p-8 bg-black text-white">
			<h1 className="font-semibold text-3xl">Birthday Cake Generator</h1>
			<Game />
		</main>
	);
}
