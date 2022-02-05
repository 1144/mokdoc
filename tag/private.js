
exports.tag = {
	handler(cmd, data, doc) {
		doc.status.t.push(' private ')
		return false
	}
}
