// src/contexts/TicketsContext.jsx

import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthProvider";

// --- LocalStorage Helper Functions ---
const DB_KEY = "ticketapp_tickets";
// ... (getInitialMockData, getTicketsDatabase, saveTicketsDatabase helpers are here) ...
// ... (See previous answer for these helper functions) ...

const initialState = {
	tickets: [],
	isLoading: true,
};

function getTickets() {
	const tickets = JSON.parse(localStorage.getItem(DB_KEY));
	return tickets;
}
function saveTickets(data) {
	localStorage.setItem(DB_KEY, data);
}

const ticketsReducer = (state, action) => {
	switch (action.type) {
		// This is the action that sets the state from localStorage
		case "SET_TICKETS":
			return {
				...state,
				tickets: action.payload,
				isLoading: false,
			};
		// All other CRUD actions update the state *and* localStorage
		case "CREATE_TICKET":
			const newTickets_create = [action.payload, ...state.tickets];
			saveTickets(newTickets_create); // Sync with localStorage
			return {
				...state,
				tickets: newTickets_create,
			};
		case "UPDATE_TICKET":
			const newTickets_update = state.tickets.map((t) =>
				t.id === action.payload.id ? action.payload : t
			);
			saveTickets(newTickets_update); // Sync with localStorage
			return {
				...state,
				tickets: newTickets_update,
			};
		case "DELETE_TICKET":
			const newTickets_delete = state.tickets.filter(
				(t) => t.id !== action.payload
			);
			saveTickets(newTickets_delete); // Sync with localStorage
			return {
				...state,
				tickets: newTickets_delete,
			};
		default:
			return state;
	}
};

const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(ticketsReducer, initialState);
	const { user, isAuthenticated } = useAuth();

	// THIS IS THE LOGIC YOU WANTED:
	// "load from localStorage and set as initial state"
	useEffect(() => {
		if (isAuthenticated && user) {
			// 1. Fetch from localStorage
			const allTickets = getTickets();
			const userTickets = allTickets
				?.filter((t) => t.userId === user.id)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			// 2. Set as the initial state for the context
			dispatch({ type: "SET_TICKETS", payload: userTickets });
		} else {
			// If user logs out, clear the tickets
			dispatch({ type: "SET_TICKETS", payload: [] });
		}
	}, [isAuthenticated, user]);

	// --- Public CRUD functions ---
	// These functions now *only* need to dispatch.
	// The reducer handles the state update AND the localStorage sync.

	const createTicket = (ticketData) => {
		// const error = validateTicket(ticketData);
		// if (error) return { success: false, error };

		const newTicket = {
			...ticketData,
			id: `t-${Date.now()}`,
			userId: user.id,
			createdAt: new Date().toISOString(),
		};

		dispatch({ type: "CREATE_TICKET", payload: newTicket });
		return { success: true, data: newTicket };
	};

	const updateTicket = (ticketId, updatedData) => {
		// const error = validateTicket(updatedData);
		// if (error) return { success: false, error };

		const ticketToUpdate = state.tickets.find((t) => t.id === ticketId);
		if (!ticketToUpdate || ticketToUpdate.userId !== user.id) {
			return { success: false, error: "Ticket not found" };
		}

		const updatedTicket = { ...ticketToUpdate, ...updatedData };
		dispatch({ type: "UPDATE_TICKET", payload: updatedTicket });
		return { success: true, data: updatedTicket };
	};

	const deleteTicket = (ticketId) => {
		const ticketToDelete = state.tickets.find((t) => t.id === ticketId);
		if (!ticketToDelete || ticketToDelete.userId !== user.id) {
			return { success: false, error: "Ticket not found" };
		}

		dispatch({ type: "DELETE_TICKET", payload: ticketId });
		return { success: true, data: ticketToDelete };
	};

	return (
		<TicketsContext.Provider
			value={{
				...state,
				createTicket,
				updateTicket,
				deleteTicket,
			}}>
			{children}
		</TicketsContext.Provider>
	);
};

export const useTickets = () => {
	const context = useContext(TicketsContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
