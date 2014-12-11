
	var mokdoc = require('./index');
	mokdoc.config.set('air', {
		path: 'D:/ws/air/trunk',	//源代码路径
		doc_path: 'D:/zzz',	//文档数据保存到哪里（要放到文档展示包里）
		charset: 'utf8'	//可选。源代码的文件编码
	});
	mokdoc.start('air', function(){
		console.log('done!');
	});
