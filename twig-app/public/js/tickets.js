// // public/js/tickets.js
const DB_KEY = "ticketapp_tickets";

document.addEventListener("DOMContentLoaded", () => {
	console.log("Tickets JS Loaded");

	// --- Get DOM Elements ---
	const toggleButton = document.getElementById("toggle-form-button");
	const formContainer = document.getElementById("ticket-form-container");
	const ticketListContainer = document.getElementById("ticket-list");
	const toggleIcon = document.getElementById("toggle-form-icon");
	const toggleText = document.getElementById("toggle-form-text");

	// --- State Variables ---
	let isFormVisible = false;
	let editingTicket = null;

	// --- Load User ---
	const userString = localStorage.getItem("ticketapp_user");
	let user = null;
	// ... (Keep the user loading and error handling logic from the previous correct version) ...
	if (userString) {
		try {
			user = JSON.parse(userString);
		} catch (e) {
			/* ... error handling ... */ return;
		}
	}
	if (!user) {
		/* ... error handling ... */ return;
	}

	// --- LocalStorage Helper Functions (Defined FIRST within this scope) ---
	function getTickets() {
		const dbString = localStorage.getItem(DB_KEY);
		// console.log(`Reading ${DB_KEY}:`, dbString); // Keep for debugging if needed
		if (!dbString) {
			return null;
		}
		try {
			const parsed = JSON.parse(dbString);
			return Array.isArray(parsed) ? parsed : [];
		} catch (e) {
			console.error(`Error parsing ${DB_KEY}. Returning empty array.`, e);
			return [];
		}
	}

	function saveTickets(data) {
		if (!Array.isArray(data)) {
			console.error(
				"Attempted to save non-array to tickets localStorage. Aborting.",
				data
			);
			return;
		}
		try {
			// console.log(`Saving to ${DB_KEY}:`, data); // Keep for debugging if needed
			localStorage.setItem(DB_KEY, JSON.stringify(data));
		} catch (e) {
			console.error(`Error saving ${DB_KEY}:`, e);
		}
	}
	// --- End Helpers ---

	// --- Load and Render Tickets Function ---
	function loadAndRenderTickets() {
		const allTickets = getTickets(); // Uses helper
		const userTickets = (allTickets || [])
			.filter((t) => t && t.userId === user.id)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		console.log("Loaded user tickets:", userTickets.length);

		if (ticketListContainer) {
			if (userTickets.length > 0) {
				ticketListContainer.innerHTML = userTickets
					.map((ticket) => createTicketCardHTML(ticket))
					.join("");
			} else {
				if (!isFormVisible) {
					ticketListContainer.innerHTML = `
                        <div class="col-span-1 md:col-span-2 lg:col-span-3 p-10 text-center bg-white rounded-lg shadow-md">
                            <p class="text-gray-500">You have no tickets. Click "Create Ticket" to add one!</p>
                        </div>`;
				} else {
					ticketListContainer.innerHTML = "";
				}
			}
			attachCardEventListeners();
		} else {
			console.error("Ticket list container not found!");
		}
	}

	// --- Form Toggle Logic ---
	if (toggleButton) {
		/* ... Same as before ... */
		toggleButton.addEventListener("click", () => {
			isFormVisible = !isFormVisible;
			if (isFormVisible) {
				editingTicket = null;
				renderForm();
				if (formContainer) formContainer.classList.remove("hidden");
				if (toggleIcon) toggleIcon.textContent = "-";
				if (toggleText) toggleText.textContent = "Hide Form";
				toggleButton.classList.replace("bg-checkerr-orange", "bg-gray-700");
				toggleButton.classList.replace(
					"hover:bg-opacity-80",
					"hover:bg-gray-800"
				);
			} else {
				closeForm();
			}
		});
	}

	function closeForm() {
		/* ... Same as before ... */
		isFormVisible = false;
		editingTicket = null;
		if (formContainer) {
			formContainer.classList.add("hidden");
			formContainer.innerHTML = "<p>Loading form...</p>";
		}
		if (toggleIcon) toggleIcon.textContent = "+";
		if (toggleText) toggleText.textContent = "Create Ticket";
		if (toggleButton) {
			toggleButton.classList.replace("bg-gray-700", "bg-checkerr-orange");
			toggleButton.classList.replace(
				"hover:bg-gray-800",
				"hover:bg-opacity-80"
			);
		}
		loadAndRenderTickets();
	}

	// --- Render Form Function ---
	function renderForm() {
		/* ... Same as before ... */
		if (!formContainer) return;
		formContainer.innerHTML = createTicketFormHTML(editingTicket);
		const ticketForm = document.getElementById("ticket-form");
		if (ticketForm) {
			ticketForm.addEventListener("submit", handleFormSubmit);
		}
		const cancelButton = document.getElementById("cancel-button");
		if (cancelButton) {
			cancelButton.addEventListener("click", closeForm);
		}
	}

	// --- Form Submit Handler ---
	function handleFormSubmit(event) {
		/* ... Same as before ... */
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		console.log("Form submitted with data:", data);

		if (!data.title || !data.title.trim())
			return toastError("Title is mandatory.");
		if (data.title.trim().length < 3)
			return toastError("Title must be at least 3 characters.");
		const validStatus = ["open", "in_progress", "closed"];
		if (!data.status || !validStatus.includes(data.status))
			return toastError("Status is invalid or missing.");

		let result;
		if (editingTicket) {
			result = updateTicketInStorage(editingTicket.id, data);
			if (result.success) toastSuccess("Ticket Updated!");
			else toastError(result.error || "Update failed");
		} else {
			result = createTicketInStorage(data);
			if (result.success) toastSuccess("Ticket Created!");
			else toastError(result.error || "Create failed");
		}

		if (result.success) {
			closeForm();
			loadAndRenderTickets();
		}
	}

	// --- CRUD Functions for localStorage (Uses helpers defined above) ---
	function createTicketInStorage(ticketData) {
		console.log("--- createTicketInStorage START ---", ticketData);
		try {
			if (!user || !user.id)
				throw new Error("User data is missing or invalid.");
			console.log("User ID confirmed:", user.id);

			const newTicket = {
				id: `t-${Date.now()}`,
				userId: user.id,
				title: ticketData.title.trim(),
				description: ticketData.description?.trim() || "",
				status: ticketData.status,
				priority: ticketData.priority || "low",
				createdAt: new Date().toISOString(),
			};
			console.log("Created newTicket object:", newTicket);

			const currentTickets = getTickets() || []; // Use helper, default to []
			console.log("Parsed currentTickets:", currentTickets);

			const newStateTickets = [newTicket, ...currentTickets];
			console.log(
				"Calculated newStateTickets. Length:",
				newStateTickets.length
			);

			saveTickets(newStateTickets); // *** Use helper ***
			console.log("--- createTicketInStorage SUCCESS ---");

			return { success: true, data: newTicket };
		} catch (e) {
			console.error("!!! Error in createTicketInStorage:", e);
			console.log("--- createTicketInStorage FAILED ---");
			return { success: false, error: "Save failed: " + e.message };
		}
	}

	function updateTicketInStorage(ticketId, updatedData) {
		try {
			let ticketUpdated = false;
			const currentTickets = getTickets() || []; // Use helper
			if (!Array.isArray(currentTickets))
				throw new Error("Stored tickets not an array");

			const updatedAllTickets = currentTickets.map((t) => {
				if (t && t.id === ticketId && t.userId === user.id) {
					ticketUpdated = true;
					return {
						...t,
						title: updatedData.title.trim(),
						description: updatedData.description?.trim() ?? t.description,
						status: updatedData.status,
						priority: updatedData.priority ?? t.priority,
					};
				}
				return t;
			});

			if (!ticketUpdated)
				return { success: false, error: "Ticket not found or unauthorized" };

			saveTickets(updatedAllTickets); // *** Use helper ***
			return { success: true };
		} catch (e) {
			console.error("Error in updateTicketInStorage:", e);
			return { success: false, error: "Update failed" };
		}
	}

	function deleteTicketInStorage(ticketId) {
		try {
			const currentTickets = getTickets() || []; // Use helper
			if (!Array.isArray(currentTickets))
				throw new Error("Stored tickets not an array");

			const initialLength = currentTickets.length;
			const updatedAllTickets = currentTickets.filter(
				(t) => !(t && t.id === ticketId && t.userId === user.id)
			);

			if (updatedAllTickets.length === initialLength) {
				return { success: false, error: "Ticket not found or unauthorized" };
			}

			saveTickets(updatedAllTickets); // *** Use helper ***
			return { success: true };
		} catch (e) {
			console.error("Error in deleteTicketInStorage:", e);
			return { success: false, error: "Delete failed" };
		}
	}

	// --- Event Listeners for Edit/Delete on Cards ---
	function handleEditClick(ticketId) {
		/* ... Same as before ... */
		try {
			const allTickets = getTickets() || []; // Use helper
			if (!Array.isArray(allTickets))
				throw new Error("Stored tickets not an array");
			const ticket = allTickets.find(
				(t) => t && t.id === ticketId && t.userId === user.id
			);
			if (ticket) {
				editingTicket = ticket;
				renderForm();
				if (formContainer) formContainer.classList.remove("hidden");
				if (toggleIcon) toggleIcon.textContent = "-";
				if (toggleText) toggleText.textContent = "Hide Form";
				if (toggleButton) {
					toggleButton.classList.replace("bg-checkerr-orange", "bg-gray-700");
					toggleButton.classList.replace(
						"hover:bg-opacity-80",
						"hover:bg-gray-800"
					);
				}
				isFormVisible = true;
				window.scrollTo({ top: 0, behavior: "smooth" });
			} else {
				toastError("Could not find ticket to edit.");
			}
		} catch (e) {
			console.error("Error handling edit click:", e);
			toastError("Error loading ticket data for editing.");
		}
	}
	function handleDeleteClick(ticketId) {
		/* ... Same as before ... */
		if (window.confirm("Are you sure?")) {
			const result = deleteTicketInStorage(ticketId);
			if (result.success) {
				toastSuccess("Ticket Deleted!");
				loadAndRenderTickets();
			} else {
				toastError(result.error || "Delete failed");
			}
		}
	}
	function attachCardEventListeners() {
		/* ... Same as before ... */
		if (!ticketListContainer) return;
		ticketListContainer.removeEventListener("click", handleCardButtonClick);
		ticketListContainer.addEventListener("click", handleCardButtonClick);
	}
	function handleCardButtonClick(event) {
		/* ... Same as before ... */
		const button = event.target.closest("button");
		if (!button) return;
		const ticketId = button.dataset.ticketId;
		if (!ticketId) return;
		if (button.classList.contains("edit-button")) {
			handleEditClick(ticketId);
		} else if (button.classList.contains("delete-button")) {
			handleDeleteClick(ticketId);
		}
	}

	// --- Initial Load ---
	loadAndRenderTickets();

	// --- Helper to create Form HTML (WITH PADDING) ---
	function createTicketFormHTML(ticket = null) {
		/* ... Same as before ... */
		const isEdit = !!ticket;
		return `
			<form id="ticket-form" class="space-y-4 bg-white p-6 rounded-lg shadow-md mb-6">
				<h2 class="text-2xl font-bold text-checkerr-green mb-4">${
					isEdit ? "Edit Ticket" : "Create New Ticket"
				}</h2>
				<div>
					<label for="form-title" class="block text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
					<input type="text" id="form-title" name="title" required class="w-full mt-1 border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-checkerr-orange focus:border-checkerr-orange border-gray-300" value="${escapeHTML(
						ticket?.title || ""
					)}">
				</div>
				<div>
					<label for="form-status" class="block text-sm font-medium text-gray-700">Status <span class="text-red-500">*</span></label>
					<select id="form-status" name="status" required class="w-full mt-1 border rounded-md shadow-sm px-3 py-2 bg-white focus:outline-none focus:ring-checkerr-orange focus:border-checkerr-orange border-gray-300">
						<option value="open" ${
							ticket?.status === "open" ? "selected" : ""
						}>Open</option>
						<option value="in_progress" ${
							ticket?.status === "in_progress" ? "selected" : ""
						}>In Progress</option>
						<option value="closed" ${
							ticket?.status === "closed" ? "selected" : ""
						}>Closed</option>
					</select>
				</div>
				<div>
					<label for="form-priority" class="block text-sm font-medium text-gray-700">Priority</label>
					<select id="form-priority" name="priority" class="w-full mt-1 border rounded-md shadow-sm px-3 py-2 bg-white focus:outline-none focus:ring-checkerr-orange focus:border-checkerr-orange border-gray-300">
						<option value="low" ${
							!ticket?.priority || ticket?.priority === "low" ? "selected" : ""
						}>Low</option>
						<option value="medium" ${
							ticket?.priority === "medium" ? "selected" : ""
						}>Medium</option>
						<option value="high" ${
							ticket?.priority === "high" ? "selected" : ""
						}>High</option>
					</select>
				</div>
				<div>
					<label for="form-description" class="block text-sm font-medium text-gray-700">Description</label>
					<textarea id="form-description" name="description" rows="4" class="w-full mt-1 border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-checkerr-orange focus:border-checkerr-orange border-gray-300">${escapeHTML(
						ticket?.description || ""
					)}</textarea>
				</div>
				<div class="flex justify-end space-x-3">
					<button type="button" id="cancel-button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium">Cancel</button>
					<button type="submit" class="px-4 py-2 text-white bg-checkerr-orange rounded-md hover:bg-opacity-80 font-medium">${
						isEdit ? "Update" : "Create"
					}</button>
				</div>
			</form>
		`;
	}

	// --- Helper to create Ticket Card HTML ---
	function createTicketCardHTML(ticket) {
		/* ... Same as before ... */
		const statusStylesMap = {
			open: { tag: "bg-green-100 text-green-800", border: "border-green-500" },
			in_progress: {
				tag: "bg-yellow-100 text-yellow-800",
				border: "border-yellow-500",
			},
			closed: { tag: "bg-gray-100 text-gray-800", border: "border-gray-500" },
		};
		const priorityStylesMap = {
			high: "bg-red-100 text-red-800",
			medium: "bg-blue-100 text-blue-800",
			low: "bg-gray-100 text-gray-800",
		};
		const currentStatusStyles =
			statusStylesMap[ticket?.status] || statusStylesMap.closed;
		const currentPriorityStyles =
			priorityStylesMap[ticket?.priority] || priorityStylesMap.low;
		let formattedDate = "Invalid Date";
		try {
			formattedDate = new Date(ticket.createdAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch (e) {}
		const priorityIcon = ticket.priority
			? '<span class="mr-1 text-xs">⚠️</span>'
			: "";
		const dateIcon = '<span class="mr-1.5 text-xs">📅</span>';
		const editIcon = "✏️";
		const deleteIcon = "🗑️";
		return `
			<div class="bg-white rounded-lg shadow-md border-l-4 ${
				currentStatusStyles.border
			} flex flex-col">
				<div class="px-6 py-6 grow"><div class="flex justify-between items-start mb-2"><h3 class="text-xl font-bold text-checkerr-green pr-2 break-words">${escapeHTML(
					ticket.title
				)}</h3><span class="px-3 py-1 rounded-full text-xs font-semibold uppercase shrink-0 ${
			currentStatusStyles.tag
		}">${escapeHTML(
			ticket.status?.replace("_", " ") || "N/A"
		)}</span></div><p class="text-gray-700 mt-2 text-sm break-words">${
			ticket.description
				? escapeHTML(ticket.description)
				: '<span class="italic text-gray-500">No description provided.</span>'
		}</p></div>
				 <div class="py-6 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-between items-center"><div class="flex items-center space-x-4 flex-wrap gap-y-2">${
						ticket.priority
							? `<span class="flex items-center px-3 py-1 rounded-full text-xs font-semibold ${currentPriorityStyles}">${priorityIcon}${escapeHTML(
									ticket.priority
							  )}</span>`
							: ""
					}<div class="flex items-center text-sm text-gray-600">${dateIcon}<span>${formattedDate}</span></div></div><div class="flex space-x-1 sm:space-x-2"><button data-ticket-id="${
			ticket.id
		}" class="edit-button p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-checkerr-orange transition-colors" aria-label="Edit ticket">${editIcon}</button><button data-ticket-id="${
			ticket.id
		}" class="delete-button p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-600 transition-colors" aria-label="Delete ticket">${deleteIcon}</button></div></div>
			 </div>`;
	}
	// function createTicketCardHTML(ticket) {
	// 	const statusStylesMap = {
	// 		open: { tag: "bg-green-100 text-green-800", border: "border-green-500" },
	// 		in_progress: {
	// 			tag: "bg-yellow-100 text-yellow-800",
	// 			border: "border-yellow-500",
	// 		},
	// 		closed: { tag: "bg-gray-100 text-gray-800", border: "border-gray-500" },
	// 	};
	// 	const priorityStylesMap = {
	// 		high: "bg-red-100 text-red-800",
	// 		medium: "bg-blue-100 text-blue-800",
	// 		low: "bg-gray-100 text-gray-800",
	// 	};

	// 	const currentStatusStyles =
	// 		statusStylesMap[ticket?.status] || statusStylesMap.closed;
	// 	const currentPriorityStyles =
	// 		priorityStylesMap[ticket?.priority] || priorityStylesMap.low;

	// 	let formattedDate = "Invalid Date";
	// 	try {
	// 		formattedDate = new Date(ticket.createdAt).toLocaleDateString("en-US", {
	// 			year: "numeric",
	// 			month: "short",
	// 			day: "numeric",
	// 		});
	// 	} catch (e) {}

	// 	// Unicode symbols to mimic React icons
	// 	const exclamationIcon = "&#9888;"; // ⚠️
	// 	const calendarIcon = "&#128197;"; // 📅
	// 	const pencilIcon = "&#9998;"; // ✏️
	// 	const trashIcon = "&#128465;"; // 🗑️

	// 	return `
	// 	<div class="bg-white rounded-lg shadow-md border-l-4 ${
	// 		currentStatusStyles.border
	// 	} flex flex-col">
	// 		<div class="p-5 grow">
	// 			<div class="flex justify-between items-start mb-2">
	// 				<h3 class="text-xl font-bold text-green-950 pr-2 break-words">
	// 					${escapeHTML(ticket.title || "Untitled")}
	// 				</h3>
	// 				<span class="px-3 py-1 rounded-full text-xs font-semibold uppercase shrink-0 ${
	// 					currentStatusStyles.tag
	// 				}">
	// 					${escapeHTML(ticket.status?.replace("_", " ") || "N/A")}
	// 				</span>
	// 			</div>

	// 			<p class="text-gray-700 mt-2 text-sm break-words">
	// 				${
	// 					ticket.description
	// 						? escapeHTML(ticket.description)
	// 						: '<span class="italic text-gray-500">No description provided.</span>'
	// 				}
	// 			</p>
	// 		</div>

	// 		<div class="py-5 px-5 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-between items-center">
	// 			<div class="flex items-center space-x-4 flex-wrap gap-y-2">
	// 				${
	// 					ticket.priority
	// 						? `
	// 						<span class="flex items-center px-3 py-1 rounded-full text-xs font-semibold ${currentPriorityStyles}">
	// 							<span class="text-sm mr-1">${exclamationIcon}</span>
	// 							${escapeHTML(ticket.priority)}
	// 						</span>`
	// 						: ""
	// 				}
	// 				<div class="flex items-center text-sm text-gray-600">
	// 					<span class="mr-1.5 text-sm">${calendarIcon}</span>
	// 					<span>${formattedDate}</span>
	// 				</div>
	// 			</div>

	// 			<div class="flex space-x-2">
	// 				<button data-ticket-id="${ticket.id}"
	// 					class="edit-button p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-orange-600 transition-colors"
	// 					aria-label="Edit ticket">
	// 					<span class="text-base">${pencilIcon}</span>
	// 				</button>

	// 				<button data-ticket-id="${ticket.id}"
	// 					class="delete-button p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-600 transition-colors"
	// 					aria-label="Delete ticket">
	// 					<span class="text-base">${trashIcon}</span>
	// 				</button>
	// 			</div>
	// 		</div>
	// 	</div>
	// `;
	// }

	// --- Toast Helpers ---
	function toastSuccess(message) {
		Toastify({
			text: message,
			duration: 2000,
			gravity: "bottom",
			position: "right",
			style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
		}).showToast();
	}
	function toastError(message) {
		Toastify({
			text: message || "An error occurred.",
			duration: 3000,
			gravity: "bottom",
			position: "right",
			style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" },
		}).showToast();
	}

	// --- HTML Escaping Helper ---
	function escapeHTML(str) {
		const stringified = String(str ?? "");
		return stringified.replace(/[&<>"']/g, function (match) {
			return {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			}[match];
		});
	}
});
