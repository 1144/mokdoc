
exports.tag = {
	handler(cmd, data, doc) {
		if (cmd.length > 1) {
      // 所以as同时会改变下文命名空间
			doc.scope.ns = doc.status.as = cmd[1]
		}
		return false
	}
}
