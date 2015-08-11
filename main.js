var PATH = require('path'),
	FS = require('fs'),
	stringifyData = require('./lib/stringifyData'),
	prj_conf,
	doc,
	charset, undef,
	prj_path_len,
	path_data, path_code,
	
	reg_start = /^[\t ]*\/\*--.*/,
	reg_end = /^[\t ]*\*\/.*/,
	reg_tag = /^[\t ]*-\w(.*?)$/,
	reg_left_s = /^[\t ]+/,

	all_tags,
	tag_ids,
	now_tag_data, //收集当前标记的数据
	all_comments, //每个注释块用一个键值对存放在这里
	comment, //记录单个注释块的信息
	collecting; //正在解析某个标记

function init(){
	doc = require('./doc')();
	all_tags = {};
	tag_ids = {};
	now_tag_data = [];
	all_comments = [];
	initTags();
	initStatus();
}

function initTags(){
	FS.readdirSync(__dirname+'/tag').forEach(function(filename){
		if(filename.slice(-3)==='.js'){
			var tag_id = filename.slice(0, -3);
			var tag = require('./tag/'+tag_id).tag;
			if(tag){
				tag.id = tag_id;
				tag_ids[tag_id] = tag_id;
				all_tags[tag_id] = tag;
			}
		}
	});
	var alias2tagid = prj_conf.alias2tagid;
	for(var a in alias2tagid){
		tag_ids[a] || (tag_ids[a] = alias2tagid[a]);
	}
}

function initStatus(){
	collecting = false;
	doc.status = {t:[]};
	comment = {};
}

function collectTag(line){
	//console.log(line);
	if(now_tag_data.length){
		var x = now_tag_data[0].split(/\s+/),
			tag_id = tag_ids[x[0]],
			tag = all_tags[tag_id];
		if(tag){
			x = tag.handler(x, now_tag_data, doc);
			if(x){ //有执行结果才添加
				tag.multiple ? (comment[tag_id] || (comment[tag_id]=[])).push(x) :
					(comment[tag_id] = x);
			}
		}
		now_tag_data = [];
	}
	if(line){
		now_tag_data.push(line.replace(reg_left_s, '').slice(1));
	}
}
function parseNextline(line){
	var status = doc.status, id;
	//判断是不是function，简单粗暴，99.9%正确就行了。。不是的话打上nf标记(not function)
	status.fn || line.indexOf('function')>-1 || (comment.nf = 1);
	status.nf && (comment.nf = 1); //或者直接被打上了nf标记
	if(status.as){
		id = status.as;
	}else{
		//var abc = ...
		//function bcd(){...}
		//cde: ...
		//xyz.def = ...
		//efg = ...
		id = line.replace(/^var |function /, '').replace(/\s/g,
			'').match(/^([\w\$\.]+)([(=:])?/);
		if(id){
			if(id[2]===':'){
				line = status.ns || doc.scope.ns;
				id = line ? line + '.' + id[1] : false; //没有命名空间，直接抛弃
			}else{
				//__req('xxx');
				if(id[2]==='(' && line.indexOf('function ')!==0){return}
				id = status.ns ? status.ns+'.'+id[1].slice(id[1].indexOf('.')+1) : id[1];
				doc.scope.ns = id; //设置接下来的命名空间
			}
		}else{
			//用单双引号包着属性名的，只收集属性名匹配\w+的
			//也就是不收集如'.,dj ;'，'abc"def'这样的属性
			//瞎命名就该“惩罚”。。
			id = line.match(/^['"](.+?)['"]\s*:/);
			if(id && /^\w+$/.test(id[1])){ 
				line = status.ns || doc.scope.ns;
				line && (id = line + '.' + id[1]);
			}else{
				id = false;
			}
		}
	}
	//console.log(id);
	id && (comment.id = id);
}
function collectText(line){
	//console.log(line);
	now_tag_data.push(line);
}
function stopCollect(nextline){
	collectTag(false);
	if(comment.desc){ //必须有描述
		comment.f = doc.scope.f;
		if(doc.status.know){
			comment.id = comment.know;
			comment.know = undef;
			doc.db.know.push(comment);
		}else{
			parseNextline(nextline.replace(reg_left_s,''));
			doc.status.t.length && (comment.t = doc.status.t.join(','));
			all_comments.push(comment);
		}
	}
	initStatus();
}

function readAllFiles(root) {
	var file_ext = prj_conf.file_ext || '.js',
		ext_len = -1 * file_ext.length,
		exclude_list = prj_conf.exclude_list || [],
		ex_len = exclude_list.length;
	var readFiles = function (path) {
		FS.readdirSync(path).forEach(function (filename) {
			var file = path+'/'+filename;
			if (ex_len>0) {
				var f = file+'/';
				for (var j = 0; j < ex_len; j++) {
					if (f.indexOf(exclude_list[j])>-1) {
						return;
					}
				}
			}
			if (FS.statSync(file).isFile()) {
				if(filename.slice(ext_len)===file_ext){
					doc.scope.f = file.slice(prj_path_len);
					doc.scope.ns = '';
					var fc = FS.readFileSync(file, charset), fd;
					fd = FS.openSync(path_code + doc.scope.f, 'w', '0666');
					FS.writeSync(fd, fc, 0, charset); //复制文件到代码文件夹下
					FS.closeSync(fd);

					var lines = fc.replace(/\r/g,'').split('\n'),
						i = 0, len = lines.length, line;
					for(; i < len; i++){
						line = lines[i];
						if(collecting){
							if(reg_tag.test(line)){
								collectTag(line);
							}else if(reg_end.test(line)){
								stopCollect(lines[i+1]);
							}else{
								collectText(line);
							}
						}else if(reg_start.test(line)){
							collectTag('-desc'); //第一行是描述
							collecting = true;
						}
					}
				}
			} else if (filename[0]!=='.') { //.svn .github
				var dir = path_code+file.slice(prj_path_len);
				FS.existsSync(dir) || FS.mkdirSync(dir);
				readFiles(file);
			}
		});
	};
	readFiles(root);
}

function outputData(){
	var fd = FS.openSync(path_data+'ALL_COMMENTS.js', 'w', '0666');
	FS.writeSync(fd, 'var ALL_COMMENTS = '+stringifyData(all_comments)+';\r\n', 0, 'utf8');
	FS.closeSync(fd);
	var db = doc.db, table;
	for(table in db){
		if(db.hasOwnProperty(table)){
			fd = FS.openSync(path_data+table.toUpperCase()+'.js', 'w', '0666');
			FS.writeSync(fd, 'var '+table.toUpperCase()+' = '+
				stringifyData(db[table])+';\r\n', 0, 'utf8');
			FS.closeSync(fd);
		}
	}
}

function makeDir(doc_path){
	doc_path.slice(-1)==='/' || (doc_path += '/');
	path_data = doc_path + 'data/';
	path_code = doc_path + 'code/';
	FS.existsSync(doc_path) || FS.mkdirSync(doc_path);
	FS.existsSync(path_data) || FS.mkdirSync(path_data);
	FS.existsSync(path_code) || FS.mkdirSync(path_code);
}

exports.start = function(config){
	var trace = require('./lib/trace');
	prj_conf = config;
	if(!prj_conf.doc_path){
		trace.error('MOKDOC-002: 没有配置保存文档数据的路径。');
		return;
	}
	var start_time = Date.now();
	charset = prj_conf.charset || 'utf8';
	prj_path_len = prj_conf.path.length;
	makeDir(prj_conf.doc_path);
	init();

	trace.log('=== 正在从文件里提取注释 ...');
		prj_conf.path[prj_path_len-1]==='/' ? readAllFiles(prj_conf.path.slice(0, -1)) :
			(prj_path_len+=1, readAllFiles(prj_conf.path));
	trace.ok('=== 提取完毕');
	if(doc.err_log.length){
		var err_log = doc.err_log, k;
		trace.error('\n发生错误：');
		for(k = 0; k < err_log.length; k++){
			trace.error(err_log[k]);
		}
		response.end('\n====== 囧，生成文档失败了 TAT...');
		return;
	}
	trace.log('\n====== 正在保存数据 ...');
		outputData(prj_conf.doc_path);
	trace.ok('====== 保存成功！');
	trace.ok('\n====== 生成文档成功！');
	trace.log('====== 文档保存目录：'+prj_conf.doc_path);
	trace.log('\n总共用时：'+(Date.now()-start_time)/1000+' s.');
};
