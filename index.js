#!/usr/bin/env node

import yargs from "yargs";
import idCmd from "./commands/id.js";
import sceneCmd from "./commands/scene.js";

const argv = yargs
	.usage('$0 <cmd> [args]')
	.command(idCmd)
	.command(sceneCmd)
	.demandCommand()
	.help()
	.strict()
	.argv
