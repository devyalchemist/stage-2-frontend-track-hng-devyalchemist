<template>
	<div class="m-[0_auto] max-w-[1440px] overflow-hidden">
		<slot />

		<Footer />
	</div>
</template>

<script setup>
// We import the Footer just like in React
import Footer from "./Footer.vue";
</script>
