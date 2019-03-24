const { promisify } = require('util')
const findDown = promisify(require('vfile-find-down').all)

class Repo {
	constructor(root) {
		this.root = root
	}

	files() {
		return findDown('.md', [this.root])
	}
}

module.exports = Repo
