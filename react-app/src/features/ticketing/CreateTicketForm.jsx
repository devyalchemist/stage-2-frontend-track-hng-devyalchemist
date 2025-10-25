// src/components/TicketForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTickets } from "../../contexts/TicketsProvider";

/**
 * A form for CREATING or EDITING a ticket.
 * @param {object} props
 * @param {function} props.onClose - Function to call to close/hide the form.
 * @param {object | null} props.editingTicket - The ticket to edit, or null if creating.
 */
export default function TicketForm({ onClose, editingTicket }) {
	const { createTicket, updateTicket } = useTickets();

	// 1. Check if we are in "edit mode"
	const isEditMode = Boolean(editingTicket);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		// 2. Set default values based on mode
		defaultValues: {
			title: editingTicket?.title || "",
			description: editingTicket?.description || "",
			status: editingTicket?.status || "open",
			priority: editingTicket?.priority || "low",
		},
	});

	// 3. Pre-fill the form if editingTicket changes
	// This handles when the user clicks "Edit" on a card
	useEffect(() => {
		if (isEditMode) {
			reset(editingTicket);
		}
	}, [editingTicket, isEditMode, reset]);

	// 4. Smart submit handler
	const onSubmit = (data) => {
		let result;
		if (isEditMode) {
			// --- UPDATE LOGIC ---
			result = updateTicket(editingTicket.id, data);
			if (result.success) {
				toast.success("Ticket updated successfully!");
			} else {
				toast.error(`Error: ${result.error}`);
			}
		} else {
			// --- CREATE LOGIC ---
			result = createTicket(data);
			if (result.success) {
				toast.success("Ticket created successfully!");
			} else {
				toast.error(`Error: ${result.error}`);
			}
		}

		// 5. Close form on success
		if (result.success) {
			reset(); // Clear the form
			onClose(); // Close the collapsible section
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-6">
			{/* 6. Dynamic title */}
			<h2 className="text-2xl font-bold text-green-950 mb-4">
				{isEditMode ? "Edit Ticket" : "Create New Ticket"}
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Title (Mandatory) */}
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700">
						Title <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						{...register("title", { required: "Title is mandatory" })}
						className={`w-full mt-1 border rounded-md shadow-sm p-2 
                        focus:outline-none focus:ring-orange-500 focus:border-orange-500
                        ${errors.title ? "border-red-500" : "border-gray-300"}`}
					/>
					{errors.title && (
						<p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
					)}
				</div>

				{/* ... (Your other fields: status, priority, description) ... */}
				{/* (They don't need to change) */}

				{/* Status (Mandatory) */}
				<div>
					<label
						htmlFor="status"
						className="block text-sm font-medium text-gray-700">
						Status <span className="text-red-500">*</span>
					</label>
					<select
						id="status"
						{...register("status", { required: "Status is mandatory" })}
						className={`w-full mt-1 border rounded-md shadow-sm p-2 
                        bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500
                        ${
													errors.status ? "border-red-500" : "border-gray-300"
												}`}>
						<option value="open">Open</option>
						<option value="in_progress">In Progress</option>
						<option value="closed">Closed</option>
					</select>
					{errors.status && (
						<p className="mt-1 text-xs text-red-500">{errors.status.message}</p>
					)}
				</div>

				{/* Priority (Optional) */}
				<div>
					<label
						htmlFor="priority"
						className="block text-sm font-medium text-gray-700">
						Priority
					</label>
					<select
						id="priority"
						{...register("priority")}
						className="w-full mt-1 border rounded-md shadow-sm p-2 
                        bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500">
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>

				{/* Description (Optional) */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<textarea
						id="description"
						rows="4"
						{...register("description")}
						className="w-full mt-1 border rounded-md shadow-sm p-2 
                        focus:outline-none focus:ring-orange-500 focus:border-orange-500"></textarea>
				</div>

				{/* 7. Dynamic action buttons */}
				<div className="flex justify-end space-x-3">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium">
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 font-medium">
						{isEditMode ? "Update" : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
}
