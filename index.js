/*--
	文档生成工具，提取代码注释生成文档。
	-site http://mokjs.com/mokdoc/
*/
var mokdoc = {};

mokdoc.config = {
	_projects: {},
	set: function(projectName, conf){
		this._projects[projectName] = conf;
	}
};

mokdoc.start = function(projectName, callback){
	var config = this.config._projects[projectName];
	if(!config){
		console.log('没有配置项目，生成文档失败');
		return;
	}
	var main = require('./main');
	main.start(config, false);
	typeof callback === 'function' && callback();
};

module.exports = mokdoc;
