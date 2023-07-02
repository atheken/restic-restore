import sveltekit from "@sveltejs/adapter-auto"
import { defineConfig } from "vite"

export default defineConfig({
	server: {
		host: "0.0.0.0"
	},
	plugins: [sveltekit()]
});
