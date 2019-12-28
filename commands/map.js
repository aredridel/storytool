import { WikiMap, mapToDot } from "storymap";
// File handling
import url from 'url';

export default {
	command : "map <command>",
	desc : "Story Map Commands",
	builder: yargs => {
		yargs.command({
			command: 'generate <files...>',
			desc: "Generate Story Map",
			handler: async argv => {
				try {
					const st = argv.files.map(x => url.pathToFileURL(x));
					const map = new WikiMap();
					const loaded = await map.run(st)
					console.log(await mapToDot(url.pathToFileURL('.'), loaded))
				} catch (e) {
					console.warn(e);
					process.exit(1);
				}
			}
		});
		yargs.command({
			command: "plot-over-time <files...>",
			desc: "Generate a plot over time diagram",
			handler: async argv => {
				try {
					const urls = argv.files.map(x => url.pathToFileURL(x));
					const map = new WikiMap();
					const loaded = await map.run(urls)

					const inverse = Object.entries(loaded).reduce((a, [k, v]) => {
						v.children.forEach(ch => {
							if (!a[ch.url]) a[ch.url] = [];
							a[ch.url].push(v);
						})
						return a;
					}, {});

					const roots = Object.keys(loaded).filter(x => !inverse[x]);

					function addPlotDepth(node, seen = new Set, plotDepth = 0) {
						if (!node) return;
						if (seen.has(node) && node.plotDepth <= plotDepth) return;
						seen.add(node);
						node.plotDepth = plotDepth;
						node.children.forEach(x => {
							addPlotDepth(loaded[x.url], seen, plotDepth + (/Next/.test(x.text) ? 1 : 0.001));
						});
					}

					function addOrder(node, seen = new Set, order = 0) {
						if (!node) return;
						if (seen.has(node) && node.order != null && node.order <= order) return;
						seen.add(node);
						node.order = order;
						node.children.forEach(x => {
							addOrder(loaded[x.url], seen, order + (/Later/.test(x.text) ? 1 : 0));
						});
					}

					roots.forEach(x => addPlotDepth(loaded[x]));
					roots.forEach(x => addOrder(loaded[x]));

					const minimized = Object.entries(loaded).reduce((a, [k, v]) => {
						if (v.order == 0 && v.plotDepth == 0 && !v.children.length) return a;
						a[k] = v;
						return a;
					}, {});

					const rankedByPlotDepth = Object.keys(minimized).sort((a, b) => {
						if (minimized[a].plotDepth > minimized[b].plotDepth) {
							return 1;
						} else if (minimized[a].plotDepth < minimized[b].plotDepth) {
							return -1;
						} else {
							return 0
						}
					});

					function orderTrunc(o) {
						return Math.floor(o.order * 100000);
					}

					const orderRanks = Object.keys(Object.values(minimized).reduce((a, e) => {
						a[orderTrunc(e)] = true;
						return a;
					}, {})).reduce((a, e, i) => {
						a[e] = Number(i);
						return a;
					}, {});

					const rankedByOrder = Object.keys(minimized).sort((a, b) => {
						const arank = orderRanks[orderTrunc(minimized[a])];
						const brank = orderRanks[orderTrunc(minimized[b])];
                        if (arank > brank) {
                            return 1;
                        } else if (arank < brank) {
                            return -1;
						} else {
							return 0
                        }
                    })

					Object.keys(minimized).forEach((e, i) => {
						minimized[e].orderRank = orderRanks[orderTrunc(minimized[e])];
					});
					rankedByPlotDepth.forEach((e, i) => {
						minimized[e].plotDepthRank = i;
					});

					const gridP = 1000 / rankedByPlotDepth.length;
					const gridO = 1000 / Object.keys(orderRanks).length;

					console.log(`
						<svg width="1000px" height="1000px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							${Object.entries(minimized).map(([k, v]) => {
								return `<circle cy="${v.orderRank * gridO}px" cx="${v.plotDepthRank * gridP}px" r="3" fill="#000000"><title>${v.brief} ${v.orderRank} ${v.plotDepth}</title></circle>`;
							}).join("\n")}
						</svg>
					`);

				} catch (e) {
					console.warn(e);
					process.exit(1);
				}
			}
		});
	},
	handler : (argv) => {}
};
