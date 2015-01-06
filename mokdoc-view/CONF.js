
var CONF = {
	version: '?0.0.2', //文档版本号，注意以问号开头
	date: '2015-01-01 22:20', //文档数据提取时间
	title: 'air组件库各组件API',
	//logo: '<img src="images/lejs.png" />'
	logo: 'air'
};



!function(conf){
	$('#ver').html('Version: '+conf.version.slice(1)+'　Update: '+conf.date);
	$('#logo').attr('title', conf.title).html(conf.logo);
	document.title = conf.title;
}(CONF);

var __loadjs = function(js){
	document.write('<script type="text/javascript" src="'+js+CONF.version+'"></script>');
};
