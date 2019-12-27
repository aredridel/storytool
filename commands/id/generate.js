import crypto from "crypto";
import { default as storyweb } from "storyweb";

export default {
	command : 'generate',
	desc : 'Generate a new ID',
	builder : {},
	handler : argv => {
		console.log(storyweb.id())
	}
};
