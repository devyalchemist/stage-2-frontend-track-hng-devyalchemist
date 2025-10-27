import express from "express";
import twig from "twig";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "twig"); 
app.engine("twig", twig.__express); 


app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
	res.render("pages/home", {
		pageTitle: "Home - Chekaa (Twig)",
	});
});


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
