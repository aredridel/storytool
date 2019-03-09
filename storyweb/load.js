const parser = require('./parser')

const { promisify } = require('util');
const readFile = promisify(require('fs').readFile)
const url = require('url')

module.exports = async function (u) {
	const path = url.fileURLToPath(u)
	const file = await readFile(path, 'utf-8')
    const ast = parser.parse(file)
    return { type: 'file', url: u, ast }
}
