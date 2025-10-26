import AboutApp from "../components/AboutApp";
import AppContainer from "../components/AppContainer";

import Hero from "../components/Hero";
export default function Home() {
	return (
		<>
			<AppContainer>
				<main className="w-full">
					<Hero />

					<AboutApp />
				</main>
			</AppContainer>
		</>
	);
}
