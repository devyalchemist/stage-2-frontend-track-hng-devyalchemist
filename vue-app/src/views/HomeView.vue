<template>
	<AppContainer>
		<main class="w-full">
			<Hero />
			<AboutApp />
		</main>
	</AppContainer>
</template>

<script setup>
// We import the components just like in React
import AppContainer from "../components/AppContainer.vue";
import Hero from "../components/Hero.vue";
import AboutApp from "../components/AboutApp.vue";
</script>
