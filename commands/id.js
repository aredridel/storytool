import generateCmd from "./id/generate.js";

export default {
	command: "id <command>",
	desc: "Generate IDs",
	builder: yargs => yargs.command(generateCmd),
	handler: (argv) => {}
}
