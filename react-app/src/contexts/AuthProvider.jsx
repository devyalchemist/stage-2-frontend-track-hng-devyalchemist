// src/contexts/AuthContext.jsx

import { createContext, useContext, useReducer, useEffect } from "react";

// --- 1. Define Initial State & Reducer ---

const initialState = {
	isAuthenticated: false,
	user: null,
};

const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				isAuthenticated: true,
				user: action.payload,
			};
		case "LOGOUT":
			return {
				...state,
				isAuthenticated: false,
				user: null,
			};
		default:
			return state;
	}
};

// --- 2. Create The Context ---
const AuthContext = createContext();

// --- 3. Create The Provider Component ---
export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// 4. Check localStorage on app load
	useEffect(() => {
		const token = localStorage.getItem("ticketapp_session");
		const user = localStorage.getItem("ticketapp_user");

		if (token && user) {
			dispatch({
				type: "LOGIN",
				payload: JSON.parse(user),
			});
		}
	}, []);

	// 5. Define public functions
	const login = (userData) => {
		// This is the mock login logic
		const mockToken = `mock-token-${Date.now()}`;
		const user = {
			id: userData.email, // Use email as ID for this mock
			email: userData.email,
			name: userData.email.split("@")[0],
		};

		localStorage.setItem("ticketapp_session", mockToken);
		localStorage.setItem("ticketapp_user", JSON.stringify(user));

		dispatch({
			type: "LOGIN",
			payload: user,
		});
	};

	const signup = (userData) => {
		// Signup logic is the same as login for this mock
		login(userData);
	};

	const logout = () => {
		localStorage.removeItem("ticketapp_session");
		localStorage.removeItem("ticketapp_user");
		dispatch({
			type: "LOGOUT",
		});
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				signup,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

// --- 6. Create The Custom Hook ---
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
