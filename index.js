#!/usr/bin/env node

import yargs from "yargs";
import idCmd from "./commands/id.js";
import sceneCmd from "./commands/scene.js";
import mapCmd from "./commands/map.js";

const argv = yargs
	.usage('$0 <cmd> [args]')
	.command(idCmd)
	.command(sceneCmd)
	.command(mapCmd)
	.demandCommand()
	.help()
	.strict()
	.argv
