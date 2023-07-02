import sveltekit from "@sveltejs/adapter-auto"
import { defineConfig } from 'vite';

export default defineConfig({
	root : "./",
	server : {
		
	},
	plugins: [sveltekit()]
});
