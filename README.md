# 项目文档生成工具

从JavaScript代码里提取注释生成项目文档。注释规范及示例请移步到 [项目官网](http://mokjs.com/mokdoc) 查阅。

## 安装

    npm install mokdoc

## 使用

* __mokdoc.config.set__(projectName, conf) - 设置项目名称和对应的配置信息。

* __mokdoc.start__(projectName, [callback]) - 开始生成文档。

```javascript
	var mokdoc = require('mokdoc');
	mokdoc.config.set('air', {
		path: 'D:/ws/air/trunk',	//源代码路径
		doc_path: 'D:/zzz',	//文档数据保存到哪里（要放到文档展示包里）
		charset: 'utf8'	//可选。源代码的文件编码
	});
	mokdoc.start('air', function(){
		console.log('Yes, done!');
	});
```
```javascript
	//可以给默认的标签设置别名
	var mokdoc = require('mokdoc');
	mokdoc.config.set('air', {
		path: 'D:/ws/air/trunk',
		doc_path: 'D:/zzz',
		//标签别名与标签的映射
		alias2tagid: {
			'return': 'r',
			'version': 'ver'	//设置后version与ver等效，两个标签都可以使用
		}
	});
```

默认的文档展示包即mokdoc下的mokdoc-view文件夹，拷贝到你的任意磁盘目录下，然后将doc_path指到那里就好了。

## 版本发布记录

请看 [CHANGELOG.md](https://github.com/1144/mokdoc/blob/master/CHANGELOG.md)
