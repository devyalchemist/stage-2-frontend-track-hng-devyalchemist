import { createRouter, createWebHistory } from "vue-router";

// Import Layouts & Public Pages
import AppLayout from "../components/AppLayout.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";

// This is our <ProtectedRoute> equivalent
const authGuard = (to, from, next) => {
	const token = localStorage.getItem("ticketapp_session");

	if (token) {
		// User is authenticated, allow them to proceed
		next();
	} else {
		// No token. Redirect to login.
		next({ name: "login" });
	}
};

const routes = [
	// --- 1. PUBLIC ROUTES ---
	// These routes DO NOT have the authGuard
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/auth/login",
		name: "login",
		component: LoginView,
	},
	{
		path: "/auth/signup",
		name: "signup",
		component: SignupView,
	},

	// --- 2. PROTECTED ROUTES ---
	// This parent route groups all protected pages under the AppLayout
	// The 'beforeEnter: authGuard' protects ALL children.
	{
		path: "/", // This was the missing piece
		component: AppLayout,
		beforeEnter: authGuard,
		children: [
			{
				path: "/dashboard", // The full path
				name: "dashboard",
				component: () => import("../views/DashboardView.vue"),
			},
			{
				path: "/tickets", // The full path
				name: "tickets",
				component: () => import("../views/TicketsView.vue"),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
