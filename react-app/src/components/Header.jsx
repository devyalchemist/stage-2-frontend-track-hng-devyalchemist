// Using icons for the menu toggle
import { HiLogout, HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../contexts/AuthProvider";

// Receives the toggle function and state as props
export default function Header() {
	const { logout, getUser } = useAuth();
	const { user } = getUser();

	console.log(user);
	const { name } = user;
	return (
		// flex-shrink-0: Prevents header from shrinking
		<header className="h-16 bg-white shadow-md flex items-center justify-between px-6 shrink-0">
			{/* Right side: User Profile (example) */}
			<div className="flex items-center">
				<span className="hidden sm:inline mr-3 font-medium text-gray-700">
					Welcome, {name}
				</span>
				<div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
					U
				</div>
			</div>
			<button
				onClick={logout}
				className="flex items-center gap-1 rounded-sm hover:bg-slate-300/30 px-4 py-2">
				<span>
					<HiLogout />
				</span>
				Logout
			</button>
		</header>
	);
}
