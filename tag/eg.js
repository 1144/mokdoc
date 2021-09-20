const regLeadingString = /^[ \t]*/

exports.tag = {
	multiple: false,
	handler(cmd, data, doc) {
    if (data.length < 2) {
      return []
    }

    const leadingBlanks = data[1].match(regLeadingString)[0]
    const leadingLen = leadingBlanks.length

    return leadingLen ? data.slice(1).map(line => {
      if (line.startsWith(leadingBlanks)) {
        return line.slice(leadingLen)
      }
      return line
    }) : data.slice(1)
	}
}
