
exports.tag = {
	handler(cmd, data, doc) {
		doc.status.t.push(' class ')
		return false
	}
}
