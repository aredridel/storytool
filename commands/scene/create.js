const crypto = require('crypto')

const { id } = require('../../storyweb.js')

exports.command = 'create'
exports.desc = 'Create a new chapter'
exports.builder = {}
exports.handler = argv => {
	const run = require('async-main').default
	const { promisify } = require('util')
	const writeFile = promisify(require('fs').writeFile)
	run(async function main() {
		const filename = `Chapter-${id()}.md`
		await writeFile(filename, '', { flag : 'wx'})
		console.log(filename)
	})
}
