import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi"; // 1. Import the icon
import AppContainer from "../components/AppContainer";
import { useAuth } from "../contexts/AuthProvider";

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const { login } = useAuth();

	const onSubmit = (data) => {
		if (data.email && data.password) {
			login(data);
		}
	};
	return (
		<AppContainer>
			<div className="flex w-full items-center justify-center min-h-screen bg-gray-100 relative">
				<button
					onClick={() => navigate(-1)}
					className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-500 hover:text-orange-600 transition-colors"
					aria-label="Go back">
					<HiArrowLeft size={28} />
				</button>
				<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-green-950">
							Welcome Back to Checkerr
						</h1>
						<p className="mt-2 text-gray-600">
							Please sign in to your account.
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
