import AppContainer from "../components/AppContainer";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Home() {
	return (
		<>
			<AppContainer>
				<header>
					<p className="text-[1.5rem] text-center font-bold	py-4 bg-amber-200">
						Checkerr
					</p>
				</header>
				{/* <Header /> */}
				<Hero />
			</AppContainer>
		</>
	);
}
