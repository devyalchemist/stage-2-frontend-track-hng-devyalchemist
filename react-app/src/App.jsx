import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/signup" element={<SignupPage />} />
				<Route element={<AppLayout />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
			</Routes>
			<ToastContainer position="bottom-right" autoClose={3000} theme="light" />
		</BrowserRouter>
	);
}
