import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// --- 1. Import the main icon component and the icons we need ---
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
	HiMenu,
	HiHome,
	HiTicket,
	HiX,
	HiLogout,
	HiArrowLeft,
} from "oh-vue-icons/icons/hi";

// --- 2. Add the icons to the library ---
addIcons(HiMenu, HiX, HiHome, HiTicket, HiLogout, HiArrowLeft);

import App from "./App.vue";
import "./assets/main.css";
import { useAuthStore } from "./stores/authStore";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);

// --- 3. Register the <v-icon> component globally ---
app.component("v-icon", OhVueIcon);
const authStore = useAuthStore();
// Run the check *before* mounting the app
authStore.checkAuthOnLoad();

app.mount("#app");
