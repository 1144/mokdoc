
exports.tag = {
	handler(cmd, data, doc) {
		doc.status.t.push(' file ')
		return false
	}
}
