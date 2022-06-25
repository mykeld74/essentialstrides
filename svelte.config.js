import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			scss: {}
		})
	],

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$lib: path.resolve('./src/lib'),
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
		}
	}
};

export default config;
