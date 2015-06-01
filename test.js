
	var mokdoc = require('./index');

	mokdoc.config.set('air', {
		path: 'D:/1144/air/air/',	//源代码路径
		doc_path: 'D:/mokjs/air-api/',	//文档数据保存到哪里（要放到文档展示包里）
		exclude_list: ['/test/', '/util/xxx.js']
	});

	mokdoc.start('air', function(){
		console.log('done!');
	});
