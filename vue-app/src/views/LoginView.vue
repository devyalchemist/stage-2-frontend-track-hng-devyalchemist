<template>
	<AppContainer>
		<div
			class="flex items-center justify-center min-h-screen bg-gray-100 relative">
			<button
				@click="goBack"
				class="absolute top-6 left-6 md:top-8 md:left-8 text-gray-500 hover:text-checkerr-orange transition-colors"
				aria-label="Go back">
				<v-icon name="hi-arrow-left" scale="1.75" />
			</button>
			<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
				<div class="text-center">
					<h1 class="text-3xl font-bold text-checkerr-green">
						Welcome Back to Checkerr
					</h1>
					<p class="mt-2 text-gray-600">Please sign in to your account.</p>
				</div>
				<Form @submit="onSubmit" class="space-y-6">
					<div>
						<label
							htmlFor="email"
							class="block text-sm font-medium text-gray-700">
							Email Address
						</label>
						<Field
							name="email"
							type="email"
							:rules="validateEmail"
							v-slot="{ field, meta }">
							<input
								v-bind="field"
								id="email"
								:class="[
									'w-full px-3 py-2 mt-1 border rounded-md shadow-sm',
									'focus:outline-none focus:ring-checkerr-orange focus:border-checkerr-orange',
									meta.touched && !meta.valid
										? 'border-red-500'
										: 'border-gray-300',
								]" />
						</Field>
						<ErrorMessage name="email" class="mt-1 text-xs text-red-500" />
					</div>
					<div>
						<label
							htmlFor="password"
							class="block text-sm font-medium text-gray-700">
							Password
						</label>
						<Field
							name="password"
							type="password"
							:rules="validatePassword"
							v-slot="{ field, meta }">
							<input
								v-bind="field"
								id="password"
                                type="password"
								:class="[
									'w-full px-3 py-2 mt-1 border rounded-md shadow-sm',
									'focus:outline-none focus:ring-checkerr-orange focus:border-checkerr-orange',
									meta.touched && !meta.valid
										? 'border-red-500'
										: 'border-gray-300',
								]" />
						</Field>
						<ErrorMessage name="password" class="mt-1 text-xs text-red-500" />
					</div>
					<div>
						<button
							type="submit"
							class="w-full px-4 py-2 font-medium text-white bg-checkerr-orange rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-checkerr-orange focus:ring-offset-2 transition-colors">
							Sign In
						</button>
					</div>
				</Form>
				<p class="text-sm text-center text-gray-600">
					Don't have an account?
					<RouterLink
						to="/auth/signup"
						class="font-medium text-checkerr-orange hover:underline">
						Sign up
					</RouterLink>
				</p>
			</div>
		</div>
	</AppContainer>
</template>

<script setup>
// 1. Import all our tools
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "vue-toastification";
import { Form, Field, ErrorMessage } from "vee-validate";
import AppContainer from "@/components/AppContainer.vue";

// 2. Initialize our tools
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// 3. The 'onSubmit' function. It automatically receives the 'data'
function onSubmit(data) {
	const loginSuccess = authStore.login(data);

	if (loginSuccess) {
		toast.success("Login successful! Redirecting...");
		router.push("/dashboard"); // Navigate on success
	} else {
		toast.error("Invalid email or password.");
	}
}

// 4. Back button function
function goBack() {
	router.go(-1); // Navigates one step back in history
}

// 5. Validation rules for vee-validate
function validateEmail(value) {
	if (!value) return "Email is required";
	if (!/^\S+@\S+$/i.test(value)) return "Invalid email address";
	return true;
}

function validatePassword(value) {
	if (!value) return "Password is required";
	return true;
}
</script>
