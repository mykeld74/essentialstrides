const { init } = require('../serverless.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["bars.svg","favicon.png","navArrow.svg","times.png","times.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		entry: {"file":"start-f9b41969.js","js":["start-f9b41969.js","chunks/index-33b36d9c.js"],"css":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js'))
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "founders",
				pattern: /^\/founders\/?$/,
				names: [],
				types: [],
				path: "/founders",
				shadow: null,
				a: [0,3],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
