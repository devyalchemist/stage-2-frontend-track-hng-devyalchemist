import React, { useState } from "react";
import { useTickets } from "../contexts/TicketsProvider";
import { HiMinus, HiPlus } from "react-icons/hi";
import CreateTicketForm from "../features/ticketing/CreateTicketForm";
import TicketCard from "../features/ticketing/TicketCard";
import { toast } from "react-toastify";

export default function TicketsPage() {
	const { tickets, deleteTicket, getTickets } = useTickets();
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [editingTicket, setEditingTicket] = useState(null);

	const handleEdit = (ticket) => {
		setEditingTicket(ticket); // Set the ticket
		setIsFormVisible(true); // Show the form
	};
	const handleDelete = (ticketId) => {
		if (window.confirm("Are you sure you want to delete this ticket?")) {
			const result = deleteTicket(ticketId);
			if (result.success) {
				toast.success("Ticket deleted");
			} else {
				toast.error(result.error);
			}
		}
	};

	const showCreateForm = () => {
		setEditingTicket(null); // Make sure we're not editing
		setIsFormVisible(true);
	};

	// 5. Logic to close the form
	const closeForm = () => {
		setIsFormVisible(false);
		setEditingTicket(null); // Clear editing state
	};
	// const tickets = getTickets();
	return (
		<div className="space-y-6">
			{/* 3. Page Header with Toggle Button */}
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-green-950">Manage Tickets</h1>
				<button
					onClick={isFormVisible ? closeForm : showCreateForm}
					className={`
            flex items-center px-4 py-2 rounded-md text-white font-medium
            shadow-md transition-colors
            ${
							isFormVisible
								? "bg-gray-700 hover:bg-gray-800"
								: "bg-orange-500 hover:bg-orange-600"
						}
          `}>
					{isFormVisible ? (
						<>
							<HiMinus className="w-5 h-5 mr-1" />
							<span>Hide Form</span>
						</>
					) : (
						<>
							<HiPlus className="w-5 h-5 mr-1" />
							<span>Create Ticket</span>
						</>
					)}
				</button>
			</div>

			{/* 4. Conditionally render the form */}
			{/* This unmounts the component when hidden, resetting its state */}
			{isFormVisible && (
				<CreateTicketForm
					editingTicket={editingTicket}
					onClose={() => setIsFormVisible(false)}
				/>
			)}

			{/* 5. Ticket List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{tickets.length > 0
					? tickets.map((ticket) => (
							<TicketCard
								key={ticket.id}
								ticket={ticket}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
					  ))
					: // Show this if the form is hidden and no tickets exist
					  !isFormVisible && (
							<div className="col-span-3 p-10 text-center bg-white rounded-lg shadow-md">
								<p className="text-gray-500">
									You have no tickets. Click "Create Ticket" to add one!
								</p>
							</div>
					  )}
			</div>
		</div>
	);
}
