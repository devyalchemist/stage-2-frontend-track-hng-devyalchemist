import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import AppContainer from "../components/AppContainer";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthProvider";

export default function SignupPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();
	const navigate = useNavigate();
	const { signup } = useAuth();
	const password = watch("password");

	const onSubmit = (data) => {
		try {
			signup(data);

			toast.success("Account created successfully! Redirecting...");
			navigate("/dashboard");
		} catch (err) {
			toast.error("Signup failed. Please try again.");
			console.log(err);
		}
	};

	return (
		<AppContainer>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
				<button
					onClick={() => navigate(-1)}
					className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-500 hover:text-orange-600 transition-colors"
					aria-label="Go back">
					<HiArrowLeft size={28} />
				</button>

				<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-green-950">
							Create your Checkerr Account
						</h1>
						<p className="mt-2 text-gray-600">
							Get started in just a few steps.
						</p>
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
