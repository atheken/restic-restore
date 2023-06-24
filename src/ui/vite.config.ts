import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server : {
		host : '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://gow:8888',
				changeOrigin: true,
		  	}
		}
	},
	plugins: [sveltekit()]
});
