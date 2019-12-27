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
	},
	handler : (argv) => {}
};
