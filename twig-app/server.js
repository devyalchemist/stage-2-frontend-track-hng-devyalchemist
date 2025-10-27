// twig-app/server.js
import express from "express";
import twig from "twig";
import path from "path";
import { fileURLToPath } from "url";

// --- Basic Setup ---
const app = express();
const port = 3000; // Your specified port
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
// Parses form data submitted via POST (useful if needed later)
app.use(express.urlencoded({ extended: true }));
// Parses JSON data (useful if needed later)
app.use(express.json());

// --- Configure Twig ---
app.set("views", path.join(__dirname, "views")); // Tell Express where Twig files are
app.set("view engine", "twig"); // Set Twig as the view engine
app.engine("twig", twig.__express); // Use twig's engine for .twig files

// --- Serve Static Files ---
// Make files in the 'public' folder accessible (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---
// Homepage
app.get("/", (req, res) => {
	res.render("pages/home", {
		pageTitle: "Home - Chekaa (Twig)",
	});
});

// Login Page (GET request)
app.get("/auth/login", (req, res) => {
	res.render("pages/login", {
		pageTitle: "Login - Chekaa (Twig)",
	});
});

// Signup Page (GET request)
app.get("/auth/signup", (req, res) => {
	res.render("pages/signup", {
		pageTitle: "Sign Up - Chekaa (Twig)",
	});
});

// Dashboard Page (GET request) - Will be protected by client-side JS
app.get("/dashboard", (req, res) => {
	res.render("pages/dashboard", {
		pageTitle: "Dashboard - Chekaa (Twig)",
	});
});

// Tickets Page (GET request) - Will be protected by client-side JS
app.get("/tickets", (req, res) => {
	res.render("pages/tickets", {
		pageTitle: "Manage Tickets - Chekaa (Twig)",
	});
});

// --- Start Server ---
app.listen(port, () => {
	console.log(`Twig app server listening on http://localhost:${port}`);
});
