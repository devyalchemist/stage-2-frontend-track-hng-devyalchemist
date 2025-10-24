import { useState } from "react";
import Header from "./Header"; // We will create this
import Sidebar from "./Sidebar"; // We will create this
import AppContainer from "./AppContainer";

export default function AppLayout({ children }) {
	// State to manage the sidebar's open/closed status
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Function to toggle the sidebar
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		// Outermost container: flex layout, full screen height, hidden overflow
		<AppContainer>
			<div className="flex h-screen overflow-hidden bg-gray-100">
				{/* Sidebar Component */}
				{/* We pass the state to it so it knows whether to be wide or narrow */}
				<Sidebar isSidebarOpen={isSidebarOpen} />
				{/* Main Content Area */}
				{/* flex-1: allows this area to grow and fill remaining space */}
				{/* flex-col: stacks the Header and main content vertically */}
				{/* overflow-hidden: prevents the whole area from scrolling */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Header Component */}
					{/* We pass the toggle function and current state to the header */}
					<Header
						onToggleSidebar={toggleSidebar}
						isSidebarOpen={isSidebarOpen}
					/>
					{/* Page Content ({children}) */}
					{/* main: semantic tag for main content */}
					{/* flex-1: allows this area to grow, pushing footer down */}
					{/* overflow-auto: makes ONLY this area scrollable if content is long */}
					{/* p-6: adds padding around your page content */}
					<main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
				</div>
			</div>
		</AppContainer>
	);
}
