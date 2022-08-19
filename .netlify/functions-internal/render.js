const { init } = require('../serverless.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["bars.svg","bars2.svg","favicon.png","navArrow.svg","times.svg","times2.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-a0183377.js","imports":["_app/immutable/start-a0183377.js","_app/immutable/chunks/index-3213c06e.js"],"stylesheets":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/4.js')),
			() => Promise.resolve().then(() => require('../server/nodes/5.js'))
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0],
				leaf: 2
			},
			{
				type: 'page',
				id: "donate",
				pattern: /^\/donate\/?$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0],
				leaf: 4
			},
			{
				type: 'page',
				id: "founders",
				pattern: /^\/founders\/?$/,
				names: [],
				types: [],
				errors: [1],
				layouts: [0],
				leaf: 5
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
