export default function Footer() {
	return (
		<footer className="w-full bg-green-950 text-gray-400">
			{/* This inner div still enforces the 1440px max-width */}
			<div className=" mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="text-sm">
						&copy; {new Date().getFullYear()} Chekaa. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
