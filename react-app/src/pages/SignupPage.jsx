import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi"; // 1. Import the icon
import AppContainer from "../components/AppContainer";
import { toast } from "react-toastify";

export default function SignupPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();
	const navigate = useNavigate(); // 2. Get the navigate function
	const password = watch("password");

	// const onSubmit = (data) => {
	// 	console.log("Signup data:", data);
	// 	localStorage.setItem("ticketapp_session", `mock-token-${Date.now()}`);
	//     // createServerModuleRunner
	// 	navigate("/dashboard");
	// };
	const onSubmit = async (data) => {
		try {
			// 1. Check if user already exists
			const checkResponse = await fetch(
				`http://localhost:3001/users?email=${data.email}`
			);
			const existingUsers = await checkResponse.json();

			if (existingUsers.length > 0) {
				throw new Error("An account with this email already exists.");
			}

			// 2. Create the new user object
			const newUser = {
				name: data.email.split("@")[0], // Create a default name
				email: data.email,
				password: data.password, // In a real app, hash this!
			};

			// 3. POST the new user to the /users endpoint
			const createResponse = await fetch("http://localhost:3001/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newUser),
			});

			if (!createResponse.ok) {
				throw new Error("Failed to create account.");
			}

			const createdUser = await createResponse.json();

			// 4. Create mock token and store session (per spec)
			const mockToken = `mock-token-${Date.now()}`;
			localStorage.setItem("ticketapp_session", mockToken);
			localStorage.setItem("ticketapp_user", JSON.stringify(createdUser));

			toast.success("Account created successfully! Redirecting...");
			navigate("/dashboard");
		} catch (error) {
			toast.error(error.message || "Signup failed. Please try again.");
			console.error(error);
		}
	};
	// const onSubmit = async (data) => {
	// 	try {
	// 		const response = await fetch("http://localhost:3001/login", {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify(data),
	// 		});

	// 		const result = await response.json();

	// 		if (!response.ok) {
	// 			throw new Error(result);
	// 		}

	// 		// Auth was successful! json-server-auth sends back a token and user
	// 		// { "accessToken": "...", "user": { ... } }

	// 		// 1. Store the token in localStorage (as required by the spec)
	// 		localStorage.setItem("ticketapp_session", result.accessToken);

	// 		// 2. Store the user object (your original idea)
	// 		localStorage.setItem("ticketapp_user", JSON.stringify(result.user));

	// 		// 3. Update your AuthContext
	// 		// login(result.user); // (If you're using Context)

	// 		toast.success("Login successful!");
	// 		navigate("/dashboard");
	// 	} catch (error) {
	// 		toast.error("Invalid email or password.");
	// 		console.error(error);
	// 	}
	// };

	return (
		// 3. Add 'relative' to the container
		<AppContainer>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
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
							Create your Chekaa Account
						</h1>
						<p className="mt-2 text-gray-600">
							Get started in just a few steps.
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
									minLength: {
										value: 6,
										message: "Password must be at least 6 characters",
									},
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
						{/* Confirm Password Field */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								{...register("confirmPassword", {
									required: "Please confirm your password",
									validate: (value) =>
										value === password || "Passwords do not match",
								})}
								className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm 
                                      focus:outline-none focus:ring-orange-500 focus:border-orange-500
                                      ${
																				errors.confirmPassword
																					? "border-red-500"
																					: "border-gray-300"
																			}`}
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-xs text-red-500">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
						<div>
							<button
								type="submit"
								className="w-full px-4 py-2 font-medium text-white bg-orange-500 rounded-md 
                                     hover:bg-orange-600 focus:outline-none focus:ring-2 
                                     focus:ring-orange-500 focus:ring-offset-2 transition-colors">
								Create Account
							</button>
						</div>
					</form>
					<p className="text-sm text-center text-gray-600">
						Already have an account?{" "}
						<Link
							to="/auth/login"
							className="font-medium text-orange-500 hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</AppContainer>
	);
}
