import { Link } from "react-router-dom";
// Using icons from react-icons
import { HiOutlineHome, HiOutlineTicket, HiOutlineUser } from "react-icons/hi";

// Receives the state as a prop
export default function Sidebar({ isSidebarOpen }) {
	return (
		// flex-shrink-0: Prevents the sidebar from shrinking
		// transition-all: Smoothly animates the width change
		// w-60: (240px) when open
		// w-20: (80px) when closed
		<div
			className={`
shrink-0 bg-green-950 text-white flex flex-col
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-60" : "w-20"}
      `}>
			{/* Logo Section */}
			<div className="h-16 flex items-center justify-center border-b border-green-800 shrink-0">
				<span className="text-2xl font-bold text-orange-500">
					{/* Show full logo when open, 'C' when closed */}
					{isSidebarOpen ? "Chekaa" : "C"}
				</span>
			</div>

			{/* Navigation Links */}
			<nav className="flex-1 overflow-y-auto p-4 space-y-2">
				<NavLink
					icon={<HiOutlineHome size={24} />}
					text="Dashboard"
					to="/dashboard"
					isSidebarOpen={isSidebarOpen}
				/>
				<NavLink
					icon={<HiOutlineTicket size={24} />}
					text="Tickets"
					to="/tickets"
					isSidebarOpen={isSidebarOpen}
				/>
				<NavLink
					icon={<HiOutlineUser size={24} />}
					text="Profile"
					to="/profile"
					isSidebarOpen={isSidebarOpen}
				/>
			</nav>
		</div>
	);
}

// A helper component to build the nav links
function NavLink({ icon, text, to, isSidebarOpen }) {
	return (
		<Link
			to={to}
			className={`
        flex items-center p-3 rounded-lg text-gray-300
        hover:bg-green-800 hover:text-white
        ${isSidebarOpen ? "justify-start" : "justify-center"}
      `}>
			{icon}
			{/* Hide text when sidebar is closed */}
			<span
				className={`
          ml-4 font-medium transition-opacity
          ${isSidebarOpen ? "opacity-100" : "opacity-0 absolute"}
        `}>
				{text}
			</span>
		</Link>
	);
}
