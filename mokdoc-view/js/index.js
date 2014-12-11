!function(){
	var src = ALL_COMMENTS; //缓存到局部
	var $idlist = $('#idlist'), $dragbar = $('.dragbar'), $detailWrap = $('.detail-wrap');

	var openFolder = function(folder){
		var hasParent = !!folder;
		var parentFoler = folder + '/';
		var x = parentFoler.length;
		var i, len, j, item, filepath;
		var folderList = [], folderMap = {},
			fileList = [], fileMap = {};
		var html = '';
		//普通注释
		for(i = 0, len = src.length; i < len; i++){
			item = src[i]; //按文件夹分
			filepath = item.f; //按文件夹分
			if(hasParent){
				if(filepath.slice(0, x)!==parentFoler){
					continue;
				}
				filepath = filepath.slice(x);
			}
			j = filepath.indexOf('/');
			if(j>0){
				filepath = filepath.slice(0, j);
				if(!folderMap[filepath]){
					folderList.push(filepath);
					folderMap[filepath] = true;
				}
			}else{
				if(item.id){
					filepath = item.id;
					j = filepath.lastIndexOf('.');
					j>0 && (filepath = filepath.slice(0, j));
				}
				if(!fileMap.hasOwnProperty(filepath)){
					fileList.push(filepath);
					fileMap[filepath] = i;
				}
			}
		}
		if(!hasParent){parentFoler = ''}
		folderList.sort(function(a, b){
			return a.toLowerCase()>b.toLowerCase() ? 1 : -1;
		});
		var blank = new Array(parentFoler.split('/').length).join('<i></i>');
		for(i = 0, len = folderList.length; i < len; i++){ //生成html
			item = folderList[i];
			html += '<li folder="'+folder+'">'+blank+
				'<i class="tree-node" cpo-name="open-tree-node">+</i>' +
				'<a href="javascript:;" data-folder="'+parentFoler+item+
				'" cpo-name="open-folder">'+item +'</a></li>';
		}
		fileList.sort(function(a, b){
			return a.toLowerCase()>b.toLowerCase() ? 1 : -1;
		});
		//blank += '<i></i>';
		for(i = 0, len = fileList.length; i < len; i++){ //生成html
			item = fileList[i];
			html += '<li folder="'+folder+'"><i></i>'+ blank +
				'<a class="id" href="javascript:;"' + // data-index="'+fileMap[item]+
				'" cpo-name="show-detail">'+ item +'</a></li>';
		}
		dragbarHeight();
		return html;
	};
	
	$idlist.html( openFolder('') );

	Cpo.on('open-tree-node', function(ctar){
		Cpo.emit('open-folder', ctar.nextSibling);
	});
	Cpo.on('open-folder', function(ctar){
		var folder = ctar.getAttribute('data-folder');
		var $label = $(ctar).prev('i');
		if($label.html()==='+'){
			$label.html('─');
			var html = openFolder(folder);
			//$ctar.parent().after(html); //jQuery2.1插入不了有bug
			ctar.parentNode.insertAdjacentHTML('AfterEnd', html);
		}else{
			$label.html('+');
			var fp = folder + '/', fpl = fp.length;
			var $lis = $idlist.find('li'), i = $lis.length, f;
			while(i--){
				f = $lis[i].getAttribute('folder');
				if(f===folder || f.slice(0,fpl)===fp){
					$lis[i].parentNode.removeChild($lis[i]);
				}
			}
		}
	});

	var detail = $('#detail')[0], $doc = $(document);
	var idlistTop = $idlist.offset().top;
	Cpo.on('show-detail', function(ctar){
		detail.style.visibility = 'hidden';
		detail.style.marginTop = '0px';
		doc.showDetail(ctar.innerHTML, 0);
		setTimeout(function(){
			$dragbar.css('height', Math.max(350, $idlist.height(), $detailWrap.height()));
			var top = $doc.scrollTop();
			detail.style.marginTop = top>idlistTop ? (top-idlistTop+5)+'px' : '0px';
			detail.style.visibility = 'visible';
		}, 15);
		//dragbarHeight();
	});

	function dragbarHeight(){
		//$dragbar.css('height', 350);
		setTimeout(function(){
			$dragbar.css('height', Math.max(350, $idlist.height(), $detailWrap.height()));
		}, 15);
	}

	!function(){ //左右拖拽
		var MIN_X = 234, MAX_X = 600;
		var offsetLeft = 0; //拖拽条的left值减去鼠标起始x
		var $doc = $(window.document.documentElement);
		var idlist = $idlist.parent()[0], dragbar = $dragbar[0],
			detailWrap = $detailWrap[0];

		var mouseMove = function(e){
			var x = e.pageX + offsetLeft; //鼠标移动时，offsetLeft+鼠标x便是新的left值
			if(x>MAX_X){
				x = MAX_X;
			}else if(x<MIN_X){
				x = MIN_X;
			}
			var y = String(x + 6) + 'px';
			idlist.style.width = y; //相差6，看样式表算出来的
			dragbar.style.marginLeft = x + 'px';
			detailWrap.style.marginLeft = '-' + y;
			detail.style.marginLeft = y;
		};
		var mouseUp = function(){
			$doc.off('mousemove', mouseMove);
			$doc.off('mouseup', mouseUp);
			document.onselectstart = function(){return true};
		};

		$dragbar.on('mousedown', function(e){
			document.onselectstart = function(){return false};
			e.preventDefault();
			offsetLeft = parseInt($dragbar.css('marginLeft')) - e.pageX;

			$doc.on('mousemove', mouseMove);
			$doc.on('mouseup', mouseUp);
		});
	}();

	$('#detail').html('Version: '+CONF.version.slice(1)+'　Update: '+CONF.date);
	
}();
