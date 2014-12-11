!function(){
	var DATA = []; //构建搜索数据仓库，搜索的时候遍历查找就ok
	//与DATA一一对应，存放{type:0, i:0}，type就是来自哪个数据源，i就是DATA在数据源里的下标
	var DATA_INFO = [];
	var TYPE2SRC = [ALL_COMMENTS, DICT_LIST, KNOW], TYPES = ['', '[字典] ', '[知识] '];
	var reg_html = /<[^>]+>/g;
	var i, len, j, n, item, text, dict;
	//普通注释
	for(i = 0, len = ALL_COMMENTS.length; i < len; i++){
		item = ALL_COMMENTS[i];
		text = (item.id||'') +' ' + item.desc.replace(reg_html, '');
		if(item.p){
			for(j = 0, n = item.p.length; j < n; j++){
				text += ' ' + item.p[j].name + ':' + item.p[j].desc.replace(reg_html, '');
			}
		}
		if(item.note){
			for(j = 0, n = item.note.length; j < n; j++){
				text += ' ' + item.note[j].replace(reg_html, '');
			}
		}
		//item.r && (text += ' ' + item.r.replace(reg_html, ''));
		DATA.push(text);
		DATA_INFO.push({type:0, i:i, id:item.id});
	}
	//数据字典
	for(i = 0, len = DICT_LIST.length; i < len; i++){
		item = DICT_LIST[i];
		text = item.id+ ' ' + item.desc.replace(reg_html, '');
		dict = DICT_CONTENT[item.id];
		if(dict){
			for(j = 0, n = dict.length; j < n; j++){
				text += ' ' + dict[j].val + ':' + dict[j].desc.replace(reg_html, '');
			}
		}
		DATA.push(text);
		DATA_INFO.push({type:1, i:i});
	}
	//知识库
	for(i = 0, len = KNOW.length; i < len; i++){
		DATA.push(KNOW[i].id + ' ' + KNOW[i].desc.replace(reg_html, ''));
		DATA_INFO.push({type:2, i:i});
	}
	

	var menu = new Tab({
		tabCont: '#menu',
		tabClass: 'j-menu',
		tabActiveClass: 'active',
		cardCont: '#content-wrap',
		cardClass: 'j-content',
		cardActiveClass: 'content-active',
		switchEvent: 'click', //或者 mouseover
		onSwitch: function(index, $tab, $card){
			if(index===0){ //历史查看
				showHistory();
			}
		}
	});
	doc.menu = menu;

	var $kw = $('#kw');
	doc.doSearch = function(){
		var kw = $.trim($kw.val());
		if(kw){
			menu.switchTo(1);
			var reg_kw = new RegExp(kw.replace(/([-.*+?^${}()|[\]\/\\])/g,'\\$1'), 'ig'),
				html = '', id, desc, info;
			for(i = 0, len = DATA.length; i < len; i++){
				if(DATA[i].indexOf(kw)>-1){
					info = DATA_INFO[i];
					item = TYPE2SRC[info.type][info.i];//console.log(info.type,item)
					id = item.id;
					if(id){
						desc = DATA[i].slice(id.length+1); //去掉数据开头的id或字典名字
						id = id.replace(reg_kw, function(m){return '<em>'+m+'</em>'});
					}else{
						desc = DATA[i];
						id = item.f;
					}
					html += '<dl>' +
						'<dt>'+TYPES[info.type]+'<a href="javascript:;" data-index="' +
							info.i+'" data-type="'+info.type+'" cpo-name="show-detail">'+id+
						'</a></dt>' +
						'<dd>'+desc.replace(reg_kw,
							function(m){return '<em>'+m+'</em>'})+'</dd>' +
					'</dl>';
				}
			}
			$('#search-res').html(html || '没有找到 <em>'+kw+
				'</em> 相关的文档，请缩短关键词试试。搜索是区分大小写的。');
		}
	};
	Cpo.on('show-detail', function(ctar){
		var item,
			type = parseInt(ctar.getAttribute('data-type'))||0,
			id = ctar.getAttribute('data-index');
		if(id){
			item = TYPE2SRC[type][ parseInt(id)||0 ];
		}else{
			id = ctar.getAttribute('data-id');
			var src = TYPE2SRC[type] || [],
				j = src.length;
			while(j--){
				if(src[j].id===id){
					item = src[j];
					break;
				}
			}
		}
		if(item){
			menu.switchTo(2);
			doc.showDetail(item, type);
		}
	});

	//显示历史查看
	function showHistory(){
		var his = Cookie.get('hist');
		if(his){
			his = his.split(',');
			var i = his.length, item, html = '';
			while(i--){
				item = his[i].slice(1);
				html += '<a data-id="'+ item +'" data-type="'+ his[i].charAt(0) +
					'" href="javascript:;" cpo-name="show-detail">'+ item +'</a>';
			}
			html && $('#history').html(html);
		}
	}
	showHistory();

	//是否有关键词
	var _kw = Url.getQuery('kw');
	_kw && ($kw.val(_kw), doc.doSearch());
	
}();
