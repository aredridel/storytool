import createCmd from "./scene/create.js";

export default {
	command : "scene <command>",
	desc : "Manage scenes",
	builder : yargs => yargs.command(createCmd),
	handler : (argv) => {}
}
