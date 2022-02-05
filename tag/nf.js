// 标识这不是一个 function
exports.tag = {
	handler(cmd, data, doc) {
		doc.status.nf = true
		return false
	}
}
