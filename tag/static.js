
exports.tag = {
	handler(cmd, data, doc) {
		doc.status.t.push(' static ')
		return false
	}
}
