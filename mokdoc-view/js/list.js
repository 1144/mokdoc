!function(){
	window.doc || (doc = {});

	var reg_html = /<[^>]+>/g, reg_q = /"/g;

	var actions = {
		_comment: function(){
			var src = ALL_COMMENTS, list = [], descs = {};
			var html = '<div class="ids">', i, len, item;
			var j, id, has = {};
			
			for(i = 0, len = src.length; i < len; i++){ //收集数据
				item = src[i];
				id = item.id;
				if(id){
					descs[id] = item.desc.replace(reg_html, '').replace(reg_q, '');
					j = id.lastIndexOf('.');
					if(j>-1){
						id = id.slice(0, j);
					}
					has.hasOwnProperty(id) || (list.push(id), has[id]=true);
				}
			}
			//排序
			list.sort(function(a, b){
				return a.toLowerCase()>b.toLowerCase() ? 1 : -1;
			});
			var l = len > 0 ? list[0].charAt(0).toLowerCase() : '';
			for(i = 0, len = list.length; i < len; i++){ //生成html
				item = list[i];
				if(item.charAt(0).toLowerCase()!==l){
					html += '<br/><br/>';
					l = item.charAt(0).toLowerCase();
				}
				html += '<a href="detail.html?type=0&id='+item+'" title="' +
					descs[item]+'">'+ item +'</a>';
			}

			return html + '</div>';
		},
		_class: function(){
			var src = ALL_COMMENTS, list = [], descs = {};
			var html = '<ul class="datalist id2desc">', i, len, item;
			
			for(i = 0, len = src.length; i < len; i++){ //收集数据
				item = src[i];
				if(item.t && item.t.indexOf(' class ')>-1){
					list.push(item.id);
					descs[item.id] = item.desc.replace(reg_html, '').replace(reg_q, '');
				}
			}
			list.sort(); //排序
			for(i = 0, len = list.length; i < len; i++){ //生成html
				item = list[i];
				html += '<li>▪ <a href="detail.html?type=0&id='+item+'" title="' +
					descs[item]+'">'+ item +'</a> : '+ descs[item] +'</li>';
			}

			return html + '</ul>';
		},
		_dict: function(){
			var src = DICT_LIST, list = [], descs = {};
			var html = '<ul class="datalist id2desc">', i, len, item;
			
			for(i = 0, len = src.length; i < len; i++){ //收集数据
				item = src[i];
				list.push(item.id);
				descs[item.id] = item.desc.replace(reg_html, '').replace(reg_q, '');
			}
			list.sort(); //排序
			for(i = 0, len = list.length; i < len; i++){ //生成html
				item = list[i];
				html += '<li>▪ <a href="detail.html?type=1&id='+item+'" title="' +
					descs[item]+'">'+ item +'</a> : '+ descs[item] +'</li>';
			}

			return html + '</ul>';
		},
		_know: function(){
			var src = KNOW, list = [], descs = {};
			var html = '<ul class="datalist">', i, len, item;
			
			for(i = 0, len = src.length; i < len; i++){ //收集数据
				item = src[i];
				html += '<li>▪ <a href="detail.html?type=2&id='+encodeURIComponent(item.id)+'">'+
					item.id +'</a></li>';
			}

			return html + '</ul>';
		}
	};
	var list_name = {_comment:'目录', _class:'类', _dict:'字典', _know:'知识库'};

	var type = '_' + Url.getQuery('type'); $('#list-name').html(list_name[type]||'');
	document.title = list_name[type] + ' - ' + document.title;
	var act = actions[type] || function(){};
	var html = act();

	html && $('#list').html(html);

	ALL_COMMENTS = null;
	DICT_LIST = null;
	KNOW = null;
	
}();
