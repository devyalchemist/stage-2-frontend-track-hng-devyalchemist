// import { ref, computed } from "vue";
// import { defineStore } from "pinia";
// import { useRouter } from "vue-router";

// // 'defineStore' is how you create a "slice" or "context"
// // We name it 'auth'
// export const useAuthStore = defineStore("auth", () => {
// 	// --- 1. State ---
// 	// ref() is Vue's useState(). This is our state.
// 	const user = ref(null);

// 	// --- 2. Getters (Computed Properties) ---
// 	// computed() is Vue's useMemo().
// 	// This automatically updates when 'user.value' changes.
// 	const isAuthenticated = computed(() => !!user.value);
// 	const userInitial = computed(
// 		() => user.value?.name?.[0]?.toUpperCase() || "U"
// 	);

// 	// We need the router to redirect on logout
// 	const router = useRouter();

// 	// --- 3. Actions (Functions) ---

// 	// This function will be called by our login page
// 	function login(userData) {
// 		const db = getUserDatabase();
// 		const userInDb = db.find((u) => u.email === userData.email);

// 		if (!userInDb || userInDb.password !== userData.password) {
// 			console.error("Login Error: Invalid credentials");
// 			return false;
// 		}

// 		const mockToken = `mock-token-${Date.now()}`;
// 		const userToSession = {
// 			id: userInDb.id,
// 			email: userInDb.email,
// 			name: userInDb.name,
// 		};

// 		localStorage.setItem("ticketapp_session", mockToken);
// 		localStorage.setItem("ticketapp_user", JSON.stringify(userToSession));

// 		// Set the state
// 		user.value = userToSession;
// 		return true;
// 	}

// 	// This function will be called by our signup page
// 	function signup(userData) {
// 		const db = getUserDatabase();
// 		if (db.find((u) => u.email === userData.email)) {
// 			console.error("Signup Error: User already exists");
// 			return false;
// 		}

// 		const newUser = {
// 			id: `u-${Date.now()}`,
// 			email: userData.email,
// 			password: userData.password,
// 			name: userData.email.split("@")[0],
// 		};

// 		db.push(newUser);
// 		localStorage.setItem("ticketapp_users_db", JSON.stringify(db));
// 		return login(userData);
// 	}

// 	function logout() {
// 		localStorage.removeItem("ticketapp_session");
// 		localStorage.removeItem("ticketapp_user");
// 		user.value = null;
// 		// Redirect to login page
// 		router.push("/auth/login");
// 	}

// 	// This runs when the app loads, like your AuthProvider's useEffect
// 	function checkAuthOnLoad() {
// 		const token = localStorage.getItem("ticketapp_session");
// 		const userFromStorage = localStorage.getItem("ticketapp_user");

// 		if (token && userFromStorage) {
// 			user.value = JSON.parse(userFromStorage);
// 		}
// 	}

// 	// --- 4. Helper (same as React) ---
// 	function getUserDatabase() {
// 		const db = localStorage.getItem("ticketapp_users_db");
// 		if (!db) {
// 			const defaultUser = [
// 				{
// 					id: "u-default",
// 					email: "user@example.com",
// 					password: "password123",
// 					name: "Test User",
// 				},
// 			];
// 			localStorage.setItem("ticketapp_users_db", JSON.stringify(defaultUser));
// 			return defaultUser;
// 		}
// 		return JSON.parse(db);
// 	}

// 	// --- 5. Return everything ---
// 	// This is what components can accessp
// 	return {
// 		user,
// 		isAuthenticated,
// 		userInitial,
// 		login,
// 		signup,
// 		logout,
// 		checkAuthOnLoad,
// 	};
// });

import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

// 'defineStore' is how you create a "slice" or "context"
export const useAuthStore = defineStore("auth", () => {
	// --- 1. State ---
	// ref() is Vue's useState(). This is our state.
	// We initialize it to null instead of an empty object.
	const user = ref(null);

	// --- 2. Getters (Computed Properties) ---
	// This replaces your 'isAuthenticated' state. It's always
	// derived from whether the 'user' object exists.
	const isAuthenticated = computed(() => !!user.value);
	// This creates the 'U' initial from the user's name
	const userInitial = computed(
		() => user.value?.name?.[0]?.toUpperCase() || "U"
	);

	const router = useRouter();

	// --- 3. Helper Function (Same as your React code) ---
	// Gets the single user object from localStorage
	function getSavedUser() {
		const db = localStorage.getItem("ticketapp_user");
		return db ? JSON.parse(db) : null;
	}

	// --- 4. Actions (Functions) ---

	// Translated 'signup' function
	function signup(userData) {
		// Creates the user object, including password and isAuthenticated,
		// just like your React code.
		const newUser = {
			id: userData.email,
			email: userData.email,
			name: userData.email.split("@")[0],
			password: userData.password,
			isAuthenticated: true, // As per your React code
		};

		// Overwrites the 'ticketapp_user' with the new user
		localStorage.setItem("ticketapp_user", JSON.stringify(newUser));
		localStorage.setItem("ticketapp_tickets", JSON.stringify([]));

		// Now, log the new user in by setting the session and state
		const mockToken = `mock-token-${Date.now()}`;
		localStorage.setItem("ticketapp_session", mockToken);

		// Set the state
		user.value = newUser;
		return true; // Success
	}

	// Translated 'login' function
	function login(userData) {
		const savedUser = getSavedUser();

		// Validates against the single saved user
		if (
			savedUser &&
			savedUser.email === userData.email &&
			savedUser.password === userData.password
		) {
			// Password matches! Create session.
			const mockToken = `mock-token-${Date.now()}`;
			localStorage.setItem("ticketapp_session", mockToken);

			// Set the state
			user.value = savedUser;
			return true; // Success
		} else {
			// Failed login
			return false;
		}
	}

	// Translated 'logout' function
	function logout() {
		// Clears all three items, just like your React code
		localStorage.removeItem("ticketapp_session");
		localStorage.removeItem("ticketapp_user");
		localStorage.removeItem("ticketapp_tickets");

		// Set state
		user.value = null;

		// Redirect to home, per your React code
		router.push("/");
	}

	// Translated 'useEffect'
	function checkAuthOnLoad() {
		const token = localStorage.getItem("ticketapp_session");
		const userFromStorage = localStorage.getItem("ticketapp_user");

		if (token && userFromStorage) {
			// Sets the state from localStorage on app load
			user.value = JSON.parse(userFromStorage);
		}
	}

	// --- 5. Return everything ---
	return {
		user,
		isAuthenticated,
		userInitial,
		login,
		signup,
		logout,
		checkAuthOnLoad,
	};
});
