
exports.tag = {
	handler(cmd, data, doc) {
		if (cmd.length > 1) {
			doc.status.ns = cmd[1]
		}
		return false
	}
}
