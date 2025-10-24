// Using icons for the menu toggle
import { HiMenu, HiX } from "react-icons/hi";

// Receives the toggle function and state as props
export default function Header({ onToggleSidebar, isSidebarOpen }) {
	return (
		// flex-shrink-0: Prevents header from shrinking
		<header className="h-16 bg-white shadow-md flex items-center justify-between px-6 shrink-0">
			{/* Left side: Toggle Button */}
			<button
				onClick={onToggleSidebar}
				className="text-gray-600 hover:text-orange-500 focus:outline-none"
				aria-label="Toggle sidebar">
				{/* Show 'X' icon when open, 'Menu' icon when closed */}
				{isSidebarOpen ? <HiX size={28} /> : <HiMenu size={28} />}
			</button>

			{/* Right side: User Profile (example) */}
			<div className="flex items-center">
				<span className="hidden sm:inline mr-3 font-medium text-gray-700">
					Welcome, User
				</span>
				<div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
					U
				</div>
			</div>
		</header>
	);
}
