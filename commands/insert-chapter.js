const crypto = require('crypto')

exports.command = 'insert-chapter <pos> <chapter>'

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
		console.log(argv)
		const id = getId()
		const filename = `Chapter ${id}.md`
		console.log(filename)
	})
}

function getId() {
    return crypto.randomBytes(4).toString('base64').toUpperCase().replace(/==/, '')
}
