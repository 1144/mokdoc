
var CONF = {
	version: '?0.0.1', //文档版本号，注意以问号开头
	date: '2014-08-15 11:20', //文档数据提取时间
	title: 'lejs文档',
	//logo: '<img src="images/lejs.png" />'
	logo: 'lejs'
};



!function(conf){
	$('#ver').html('Version: '+conf.version.slice(1)+'　Update: '+conf.date);
	$('#logo').attr('title', conf.title).html(conf.logo);
	document.title = conf.title;
}(CONF);

var __loadjs = function(js){
	document.write('<script type="text/javascript" src="'+js+CONF.version+'"></script>');
};
