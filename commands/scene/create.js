import crypto from 'crypto';
import { default as amain } from "async-main";
import { promisify } from "util";
import fs from "fs";
import { default as storyweb } from "storyweb";

export default {
	command : 'create',
	desc : 'Create a new chapter',
	builder : {},
	handler : argv => {
		const writeFile = promisify(fs.writeFile)
		amain.default(async function main() {
			const filename = `Scene-${storyweb.id()}.md`
			await writeFile(filename, '', { flag : 'wx'})
			console.log(filename)
		})
	}
}
