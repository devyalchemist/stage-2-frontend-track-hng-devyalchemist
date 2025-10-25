import { Link } from "react-router-dom";
// Using icons from react-icons
import {
	HiMenu,
	HiOutlineHome,
	HiOutlineTicket,
	HiOutlineUser,
	HiX,
} from "react-icons/hi";

// Receives the state as a prop
export default function Sidebar({ onToggleSidebar, isSidebarOpen }) {
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
			<button
				onClick={onToggleSidebar}
				className="text-gray-600 hover:text-orange-500 focus:outline-none m-[1rem_auto] w-fit"
				aria-label="Toggle sidebar ">
				{/* Show 'X' icon when open, 'Menu' icon when closed */}
				{isSidebarOpen ? <HiX size={28} /> : <HiMenu size={28} />}
			</button>
			{/* <div className="h-16 flex items-center justify-center border-b border-green-800 shrink-0">
				<span className="text-2xl font-bold text-orange-500">
					{isSidebarOpen ? "Chekaa" : "C"}
				</span>
			</div> */}

			{/* Navigation Links */}
			<nav className="flex-1 overflow-y-auto p-4 space-y-2">
				<NavLink
					icon={<HiOutlineHome size={24} />}
					text="Dashboard"
					to="/dashboard"
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={onToggleSidebar}
				/>
				<NavLink
					icon={<HiOutlineTicket size={24} />}
					text="Tickets"
					to="/tickets"
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={onToggleSidebar}
				/>
			</nav>
		</div>
	);
}

// A helper component to build the nav links
function NavLink({ icon, text, to, isSidebarOpen, onToggleSidebar }) {
	return (
		<Link
			to={to}
			onClick={isSidebarOpen && onToggleSidebar}
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
