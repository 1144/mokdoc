
exports.tag = {
	handler(cmd, data, doc) {
		if (cmd.length > 1) {
			doc.scope.ns = cmd[1]
		}
		return false
	}
}
