import { Link } from "react-router-dom";

export default function Hero() {
	return (
		// relative is CRUCIAL for positioning the circles and wave
		// bg-green-950 sets your dark green background
		// overflow-hidden contains the decorative elements
		// pb-20 makes space at the bottom for the wave to "cut into"
		<section className="relative w-full bg-green-950 text-white overflow-hidden pb-20">
			{/* Decorative Circle 1 (Orange, low opacity) */}
			{/* Hides on small screens (md:block) */}
			<div className="absolute z-0 -top-20 -left-40 w-96 h-96 bg-orange-500 rounded-full opacity-10 md:block hidden"></div>

			{/* Decorative Circle 2 (Orange, low opacity) */}
			{/* Hides on small screens (md:block) */}
			<div className="absolute z-0 -bottom-40 -right-20 w-[500px] h-[500px] bg-orange-500 rounded-full opacity-10 md:block hidden"></div>

			{/* Main Content Wrapper */}
			{/* relative z-10 ensures this content is ON TOP of the circles */}
			{/* max-w-[1440px] and mx-auto center the content */}
			<div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
				{/* Headline */}
				<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
					Welcome to Checkerr
				</h1>

				{/* Catchy Description */}
				<p className="mt-6 text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
					Your all-in-one solution for managing tickets efficiently. Built for
					speed, collaboration, and seamless workflows.
				</p>

				{/* Call-to-Action Buttons */}
				<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link
						to="/auth/login"
						className="w-full sm:w-auto inline-block px-8 py-3 rounded-md text-lg font-medium shadow-lg 
                       bg-orange-500 text-white 
                       hover:bg-orange-600 transition-colors duration-200">
						Login
					</Link>
					<Link
						to="/auth/signup"
						className="w-full sm:w-auto inline-block px-8 py-3 rounded-md text-lg font-medium shadow-lg
                       bg-white text-green-950 
                       hover:bg-gray-100 transition-colors duration-200">
						Get Started
					</Link>
				</div>
			</div>

			{/* Wavy Background SVG */}
			{/* This SVG is positioned at the bottom and filled with a light gray color
          to match the likely background of the *next* section, creating the "wave" effect.
      */}
			<div className="absolute bottom-0 left-0 w-full h-auto z-0">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					{/* Assumes your main page background is gray-100 (#f3f4f6).
              If your page bg is white, change fill to #ffffff
          */}
					<path
						fill="#f3f4f6"
						fillOpacity="1"
						d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,138.7C960,117,1056,107,1152,117.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
				</svg>
			</div>
		</section>
	);
}
