
exports.tag = {
	multiple: true,
	handler(cmd, data, doc) {
		return cmd.slice(1).join(' ') + doc.stringify(data)
	}
}
