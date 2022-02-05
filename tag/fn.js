// 标识这是一个function
exports.tag = {
	handler(cmd, data, doc) {
		doc.status.fn = true
		return false
	}
}
