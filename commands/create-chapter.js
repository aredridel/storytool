const crypto = require('crypto')

exports.command = 'create-chapter'
exports.desc = 'Create a new chapter'
exports.builder = {}
exports.handler = argv => {
	const run = require('async-main').default
	const { promisify } = require('util')
	const writeFile = promisify(require('fs').writeFile)
	run(async function main() {
		const id = getId()
		const filename = `Chapter ${id}.md`
		await writeFile(filename, '', { flag : 'wx'})
		console.log(filename)
	})
}

function getId() {
    return crypto.randomBytes(4).toString('base64').toUpperCase().replace(/==/, '')
}
