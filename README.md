# 项目文档生成工具

从JavaScript代码里提取注释生成项目文档。注释规范及示例请移步到 [mokdoc项目官网](http://mokjs.com/mokdoc) 查阅。

## 安装

    npm install mokdoc

## 使用

* __mokdoc.config.set__(projectName, conf) - 设置项目名称和对应的配置信息。

* __mokdoc.start__(projectName, [callback]) - 开始生成文档。

下载默认的文档展示包 [mokdoc-view](https://github.com/1144/mokdoc-view) ，放到你的任意磁盘目录下，然后将doc_path指到mokdoc-view里。

```javascript
	var mokdoc = require('mokdoc');
	mokdoc.config.set('air', {
		path: 'D:/ws/air/trunk',	//源代码路径
		doc_path: 'D:/zzz',	//文档数据保存到哪里（要放到文档展示包里）
		exclude_list: ['/test/', '/util/xxx.js']
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

## 配置项说明

* __path__ - 源代码路径

* __doc_path__ - 文档数据保存到哪里（要放到文档展示包里）

* __charset__ - 源代码的文件编码。可选，默认`utf8`

* __alias2tagid__ - 标签别名与标签的映射。可选

* __file_ext__ - 只提取指定类型文件的注释。可选，默认`.js`

* __exclude_list__ - 排除列表（数组），排除文件路径（包含文件名）中出现该列表指定的字符串的文件。可选

## 使用mokdoc生成文档的实例

[nkb 使用文档](https://github.com/1144/nkb/tree/main/docs)

## 版本发布记录

请看 [CHANGELOG.md](https://github.com/1144/mokdoc/blob/master/CHANGELOG.md)
