import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
	server: {
		proxy : {
			"/api/.*" : "http://127.0.0.1:8888"
		},
		host: "0.0.0.0",
		port: 5174
	},
	
	plugins: [sveltekit()]
});
