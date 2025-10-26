<template>
	<div class="max-w-md p-6 mx-auto my-10 bg-white rounded-lg shadow-xl">
		<h2 class="text-2xl font-bold text-chekaa-green">Hello from Vue!</h2>

		<p class="my-4 text-gray-700">
			This component is styled with Tailwind v4. We are using our custom theme
			colors.
		</p>

		<p class="mb-4 text-lg">
			You have clicked the button <strong>{{ count }}</strong> times.
		</p>

		<button
			@click="increment"
			class="px-5 py-2 font-medium text-white rounded-md shadow-md bg-chekaa-orange hover:bg-opacity-80 transition-all">
			Click Me
		</button>
	</div>
</template>

<script setup>
// This is your JavaScript block (note the 'setup' keyword)
import { ref } from "vue";

// 'ref()' creates a reactive variable, just like React's 'useState()'
const count = ref(0);

// This function is automatically available to the template
function increment() {
	// You must use .value to access or change the value of a 'ref'
	count.value++;
}
</script>

<style scoped>
/* This block is for CSS that *only* applies to this component.
  We don't need it now because Tailwind is doing all the work.
*/
</style>
