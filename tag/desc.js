
exports.tag = {
	multiple: false,
	handler(cmd, data, doc) {
		return doc.stringify(data)
	}
}
