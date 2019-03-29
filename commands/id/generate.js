const crypto = require('crypto')

const { id } = require('storyweb')

exports.command = 'generate'
exports.desc = 'Generate a new ID'
exports.builder = {}
exports.handler = argv => {
	console.log(id())
}
