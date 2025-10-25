// src/components/TicketCard.jsx

import React from "react";
import {
	HiPencil,
	HiTrash,
	HiCalendar,
	HiExclamationCircle,
} from "react-icons/hi";

// --- Dynamic Style Lookups ---
// This is the clean way to map status/priority to Tailwind classes
// as required by the project spec.

const statusStyles = {
	open: {
		tag: "bg-green-100 text-green-800", // Green tone
		border: "border-green-500",
	},
	in_progress: {
		tag: "bg-yellow-100 text-yellow-800", // Amber tone
		border: "border-yellow-500",
	},
	closed: {
		tag: "bg-gray-100 text-gray-800", // Gray tone
		border: "border-gray-500",
	},
};

const priorityStyles = {
	high: "bg-red-100 text-red-800",
	medium: "bg-blue-100 text-blue-800",
	low: "bg-gray-100 text-gray-800",
};
// --- End of Styles ---

/**
 * A single card component to display ticket information.
 * @param {object} props
 * @param {object} props.ticket - The ticket object to display
 * @param {function} props.onEdit - Function to call when Edit is clicked. Passes the ticket.
 * @param {function} props.onDelete - Function to call when Delete is clicked. Passes the ticket id.
 */
export default function TicketCard({ ticket, onEdit, onDelete }) {
	const { id, title, status, description, priority, createdAt } = ticket;

	// Get the correct style classes for the current ticket's status
	// Default to 'closed' styles if status is invalid
	const currentStatusStyles = statusStyles[status] || statusStyles.closed;

	// Get styles for priority, default to 'low'
	const currentPriorityStyles = priorityStyles[priority] || priorityStyles.low;

	// Format the date for display
	const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		// Card-style box with shadow, rounded corners, and dynamic left border
		<div
			className={`
        bg-white rounded-lg shadow-md 
        border-l-4 ${currentStatusStyles.border}
        flex flex-col
      `}>
			{/* --- Main Card Content --- */}
			<div className="p-5 flex-grow">
				{/* Card Header: Title and Status Tag */}
				<div className="flex justify-between items-start mb-2">
					<h3 className="text-xl font-bold text-green-950 pr-2">{title}</h3>
					{/* Status Tag */}
					<span
						className={`
              px-3 py-1 rounded-full text-xs font-semibold
              uppercase flex-shrink-0 ${currentStatusStyles.tag}
            `}>
						{status.replace("_", " ")}
					</span>
				</div>

				{/* Description */}
				<p className="text-gray-700 mt-2 text-sm">
					{description || (
						<span className="italic text-gray-500">
							No description provided.
						</span>
					)}
				</p>
			</div>

			{/* --- Card Footer: Metadata and Actions --- */}
			<div className="p-5 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-between items-center">
				{/* Left Side: Metadata (Priority & Date) */}
				<div className="flex items-center space-x-4">
					{/* Priority Tag */}
					{priority && (
						<span
							className={`
                flex items-center px-3 py-1 rounded-full 
                text-xs font-semibold ${currentPriorityStyles}
              `}>
							<HiExclamationCircle className="w-4 h-4 mr-1" />
							{priority}
						</span>
					)}

					{/* Date */}
					<div className="flex items-center text-sm text-gray-600">
						<HiCalendar className="w-4 h-4 mr-1.5" />
						<span>{formattedDate}</span>
					</div>
				</div>

				{/* Right Side: Action Buttons */}
				<div className="flex space-x-2">
					<button
						onClick={() => onEdit(ticket)}
						className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-orange-600 transition-colors"
						aria-label="Edit ticket">
						<HiPencil className="w-5 h-5" />
					</button>
					<button
						onClick={() => onDelete(id)}
						className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-600 transition-colors"
						aria-label="Delete ticket">
						<HiTrash className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}
