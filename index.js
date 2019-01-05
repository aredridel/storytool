#!/usr/bin/env node

const argv = require('yargs')
	.usage('$0 <cmd> [args]')
	.commandDir('commands')
	.demandCommand()
	.help()
	.strict()
	.argv
