import AboutApp from "../components/AboutApp";
import AppContainer from "../components/AppContainer";
import Header from "../components/Header"; // Assuming this is your main navigation header
import Hero from "../components/Hero"; // Assuming this is your main hero section

export default function Home() {
	return (
		<>
			<AppContainer>
				{/* <header className="bg-amber-200 py-4 shadow-md">
					<p className="text-3xl text-center font-extrabold text-gray-800">
						Checkerr
					</p>
				</header> */}

				<main className="w-full">
					<Hero />

					<AboutApp />
				</main>
			</AppContainer>
		</>
	);
}
