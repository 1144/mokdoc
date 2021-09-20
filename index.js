/*--
	文档生成工具，提取代码注释生成文档。
	-site http://mokjs.com/mokdoc/
*/
var mokdoc = {};

mokdoc.config = {
	_projects: {},
	set: function (projectName, conf) {
		this._projects[projectName] = conf;
	}
};

mokdoc.start = function (projectName, callback) {
	var config = this.config._projects[projectName];
	if (!config) {
		console.error('MOKDOC-001: 没有配置项目，生成文档失败');
		return;
	}
	require('./main').start(config);
	typeof callback==='function' && callback();
};

mokdoc.regMokComment = /[ \t]*\/\*(?:\*|-)-[\d\D]+?\*\/[ \t]*/g
mokdoc.translator = require('./translator')

//捕获漏网的异常
process.on('uncaughtException', function (err) {
	console.error('\nMOKDOC-003: 发生异常，生成文档失败：\n'+err.stack);
});

module.exports = mokdoc;
