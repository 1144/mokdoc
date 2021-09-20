/**
 * 把 mokdoc 格式的注释翻译为 jsdoc 格式的注释
 */
const Fs = require('fs')
const doc = require('./doc')

const regCommentStart = /^[ \t]*\/\*(?:\*|-)-.*/
const regCommentEnd = /^[ \t]*\*\/.*/
const regTagStart = /^[ \t]*-\w(.*?)$/
const regLeadingString = /^[ \t]*/ // 至少是空字符串
const regLeadingBlanks = /^[ \t]+/
const regBlanks = /[ \t]+/
const regBreakLineChar = /\r?\n/g
const tagIds = Object.create(null)
const tags = Object.create(null)
const docCtx = doc()

function initTags() {
	Fs.readdirSync(__dirname + '/tag').forEach(filename => {
		if (filename.endsWith('.js')) {
			const tagId = filename.slice(0, -3)
			const tag = require('./tag/' + tagId).tag
			if (tag) {
				tag.id = tagId
				tagIds[tagId] = tagId
				tags[tagId] = tag
			}
		}
	})
}

function translate(mokComment) {
  const leadingString = mokComment.match(regLeadingString)[0]
  const jdComment = formatJsDocComment(parseComment(mokComment), leadingString)
  return jdComment || mokComment
}

function translateDir(dir) {

}

function formatJsDocComment(comment, leadingString) {
  if (!comment) {
    return ''
  }

  const res = ['/**', ` * ${comment.desc}`]
  if (comment.p) {
    comment.p.forEach(param => {
      res.push(` * @param ${param.name} ${param.desc}`)
    })
  }
  if (comment.eg) {
    res.push(' * @example')
    comment.eg.forEach(line => {
      res.push(` *   ${line}`)
    })
  }
  res.push(' */')

  if (leadingString) {
    return res.map(item => leadingString + item).join('\r\n')
  }

  return res.join('\r\n')
}

function parseComment(src) {
  const comment = {}
  const lines = src.split(regBreakLineChar)
  let parsing = false // 正在解析
  let tagData

  lines.forEach(line => {
    if (parsing) {
      if (regTagStart.test(line)) {
        hanldeTag(comment, tagData)
        tagData = [line.replace(regLeadingBlanks, '').slice(1)]
      } else if (regCommentEnd.test(line)) {
        hanldeTag(comment, tagData)
      } else {
        tagData.push(line)
      }
    } else if (regCommentStart.test(line)) {
      parsing = true
      tagData = ['desc'] // 第一行是描述
    }
  })

  return comment.desc ? comment : null
}

function hanldeTag(comment, tagData) {
  if (!tagData) {
    return
  }
  const cmdLine = tagData[0].split(regBlanks)
  const tagId = tagIds[cmdLine[0]]
  const tag = tags[tagId]
  if (tag) {
    const res = tag.handler(cmdLine, tagData, docCtx)
    if (res) { // 有执行结果才添加
      if (tag.multiple) {
        (comment[tagId] || (comment[tagId] = [])).push(res)
      } else {
        comment[tagId] = res
      }
    }
  }
}

initTags()

exports.parseComment = parseComment
exports.translate = translate
exports.translateDir = translateDir
