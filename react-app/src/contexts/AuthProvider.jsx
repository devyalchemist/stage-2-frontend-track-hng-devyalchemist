// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
const getUserDatabase = () => {
	const db = localStorage.getItem("ticketapp_user");
	return db ? JSON.parse(db) : [];
};
// --- 3. Create The Provider Component ---
export const AuthProvider = ({ children }) => {
	const [{ isAuthenticated, user }, dispatch] = useReducer(
		authReducer,
		initialState
	);
	const navigate = useNavigate();

	// 4. Check localStorage on app load
	useEffect(() => {
		const token = localStorage.getItem("ticketapp_session");
		const user = localStorage.getItem("ticketapp_user");
		console.log("this is the token and the user: ", token, user);

		if (token && user) {
			dispatch({
				type: "LOGIN",
				payload: JSON.parse(user),
			});
			// navigate("/dashboard");
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
			password: userData.password,
		};

		localStorage.setItem("ticketapp_session", mockToken);
		const savedUser = getUserDatabase();
		if (
			savedUser.email === user.email &&
			savedUser.password === savedUser.password
		) {
			dispatch({
				type: "LOGIN",
				payload: user,
			});
			toast.success("Login successful! Redirecting...");
			navigate("/dashboard");
		} else {
			toast.error("Invalid email or password.");
		}
	};
	const getUser = () => {
		const user = localStorage.getItem("ticketapp_user");
		const value = {
			user: user
				? {
						...JSON.parse(user),
						isAuthenticated: JSON.parse(user).isAuthenticated || false,
				  }
				: {},
		};
		console.log(value);
		return value;

		// return { isAuthenticated: JSON.parse(user)?.isAuthenticated || false };
	};
	const signup = (userData) => {
		// Signup logic is the same as login for this mock
		const user = {
			id: userData.email, // Use email as ID for this mock
			email: userData.email,
			name: userData.email.split("@")[0],
			password: userData.password,
			isAuthenticated: true,
		};
		localStorage.setItem("ticketapp_tickets", JSON.stringify([]));
		localStorage.setItem("ticketapp_user", JSON.stringify(user));
		login(user);
	};

	const logout = () => {
		localStorage.removeItem("ticketapp_session");
		localStorage.removeItem("ticketapp_user");
		localStorage.removeItem("ticketapp_tickets");
		dispatch({
			type: "LOGOUT",
		});
		navigate("/", { replace: true });
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				getUser,
				user,
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
