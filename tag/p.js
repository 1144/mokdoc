const regLeadingBlanks = /^[ \t]+/

exports.tag = {
	multiple: true,
	handler(cmd, data, doc) {
		if (cmd.length < 2) {
      return false
    }
    const desc = cmd.slice(2).join(' ') + this.stringify(data)
		const res = {
			name: cmd[1],
			desc,
		};
		return res
	},
	stringify(data) {
		let res = ''
    data.slice(1).forEach(line => {
      res += line.replace(regLeadingBlanks, '')
    })
		return res;
	}
}
