const crypto = require('crypto')

exports.command = 'insert <pos> <chapter>'

exports.desc = 'Insert a chapter before or after another and link it'

exports.builder = yargs => {
	yargs.positional('pos', {
		describe: 'Where to put the new chapter',
		choices: ['before', 'after']

	}).positional('chapter', {
		describe: 'Chapter to precede or follow'
	})
}

exports.handler = argv => {
	const run = require('async-main').default
	const { promisify } = require('util')
	const writeFile = promisify(require('fs').writeFile)
	run(async function main() {
		// Create new as mid
		// For after:
			// Parse chapter as prev
			// If there is a Next in prev, parse it as after
		// For before:
			// Parse chapter as after
			// IF there is a Prev in after, parse it as prev
		// Add link to prev from mid as Prev
		// Add link to after from mid as Next
		// Add link to mid from prev as Next
		// Add link to mid from after as Prev
		console.log(argv)
		const id = getId()
		const filename = `Chapter-${id}.md`
		console.log(filename)
	})
}

function getId() {
    return crypto.randomBytes(4).toString('base64').toUpperCase().replace(/==/, '')
}
