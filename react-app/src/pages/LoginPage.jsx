import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi"; // 1. Import the icon
import AppContainer from "../components/AppContainer";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthProvider";

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate(); // 2. Get the navigate function

	// const onSubmit = (data) => {
	// 	console.log("Login data:", data);

	// 	if (data.email === "user@example.com" && data.password === "password123") {
	// 		localStorage.setItem("ticketapp_session", `mock-token-${Date.now()}`);
	// 		navigate("/dashboard");
	// 	} else {
	// 		console.error("Invalid credentials");
	// 		// TODO: Add toast notification
	// 	}
	// };

	// In LoginPage's onSubmit ========================
	// const onSubmit = async (data) => {
	// 	try {
	// 		// 1. Fetch ALL users from your db.json
	// 		const response = await fetch(
	// 			`http://localhost:3001/users?email=${data.email}`
	// 		);
	// 		const users = await response.json();

	// 		// 2. Check if a user with that email exists
	// 		if (users.length === 0) {
	// 			throw new Error("User not found");
	// 		}

	// 		const user = users[0];

	// 		// 3. Manually check the password
	// 		if (user.password === data.password) {
	// 			// 4. Create mock token and store session (per spec)
	// 			const mockToken = `mock-token-${Date.now()}`;
	// 			localStorage.setItem("ticketapp_session", mockToken);
	// 			localStorage.setItem("ticketapp_user", JSON.stringify(user));

	// 			toast.success("Login successful! Redirecting...");
	// 			navigate("/dashboard");
	// 		} else {
	// 			throw new Error("Invalid password");
	// 		}
	// 	} catch (error) {
	// 		toast.error(error.message || "Invalid email or password.");
	// 		console.error(error);
	// 	}
	// };

	//last resolution for local
	const { login } = useAuth(); // 2. Get the login function

	const onSubmit = (data) => {
		// 3. Mock the check
		if (data.email === "user@example.com" && data.password === "password123") {
			// 4. Call context login function
			login(data);

			toast.success("Login successful! Redirecting...");
			navigate("/dashboard");
		} else {
			toast.error("Invalid email or password.");
		}
	};
	return (
		// 3. Add 'relative' to the container
		<AppContainer>
			<div className="flex w-full items-center justify-center min-h-screen bg-gray-100 relative">
				{/* 4. Add the Back Button */}
				<button
					onClick={() => navigate(-1)} // Goes back one page in history
					className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-500 hover:text-orange-600 transition-colors"
					aria-label="Go back">
					<HiArrowLeft size={28} />
				</button>
				{/* Auth Card */}
				<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-green-950">
							Welcome Back to Chekaa
						</h1>
						<p className="mt-2 text-gray-600">
							Please sign in to your account.
						</p>
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^\S+@\S+$/i,
										message: "Invalid email address",
									},
								})}
								className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm 
                                      focus:outline-none focus:ring-orange-500 focus:border-orange-500
                                      ${
																				errors.email
																					? "border-red-500"
																					: "border-gray-300"
																			}`}
							/>
							{errors.email && (
								<p className="mt-1 text-xs text-red-500">
									{errors.email.message}
								</p>
							)}
						</div>
						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								id="password"
								type="password"
								{...register("password", {
									required: "Password is required",
								})}
								className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm 
                                      focus:outline-none focus:ring-orange-500 focus:border-orange-500
                                      ${
																				errors.password
																					? "border-red-500"
																					: "border-gray-300"
																			}`}
							/>
							{errors.password && (
								<p className="mt-1 text-xs text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>
						<div>
							<button
								type="submit"
								className="w-full px-4 py-2 font-medium text-white bg-orange-500 rounded-md 
                                     hover:bg-orange-600 focus:outline-none focus:ring-2 
                                     focus:ring-orange-500 focus:ring-offset-2 transition-colors">
								Sign In
							</button>
						</div>
					</form>
					<p className="text-sm text-center text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/auth/signup"
							className="font-medium text-orange-500 hover:underline">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</AppContainer>
	);
}
