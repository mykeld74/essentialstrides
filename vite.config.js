import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$css: path.resolve('./src/css'),
			$components: path.resolve('./src/components'),
			$data: path.resolve('./src/data'),
			$img: path.resolve('./src/images')
		}
	},
	css: {
		preprocessorOptions: {
			scss: {}
		}
	}
};

export default config;
