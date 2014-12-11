
	var Tab = function(opt){
		var setting = {
			tabCont: '',
			tabClass: '', //选项卡的class
			tabActiveClass: 'active',
			cardCont: '',
			cardClass: 'li', //卡片的class
			cardActiveClass: 'active',
			switchEvent: 'click', //或者 mouseover
			onSwitch: function(index, $tab, $card){}
		};
		for(var k in opt){
			opt.hasOwnProperty(k) && (setting[k] = opt[k]);
		}
		this.$tabCont = typeof setting.tabCont==='string' ? $(setting.tabCont) : setting.tabCont;
		if(!this.$tabCont.length){return}
		this.$cardCont = setting.cardCont ? $(setting.cardCont) : false;
		this.setting = setting;
		this.onSwitch = setting.onSwitch;

		var _this = this;
		this.tabCount = this.$tabCont.on(setting.switchEvent, function(e){
			var $tab = $(e.target);
			if(!$tab.hasClass(setting.tabClass)){
				$tab = $tab.parents('.'+setting.tabClass);
			}
			if($tab.length){
				var index = $tab.attr('data-index');
				if(index!==_this.index){
					_this.switchTo(index, $tab);
				}
			}
		}).find('.'+setting.tabClass).each(function(i){
			this.setAttribute('data-index', i);
		}).length;
		opt = null;
	};
	Tab.prototype = {
		index: 0, //当前选中的选项卡
		tabCount: 0, //选项卡总数
		/*--
			切换到指定Tab项
			-p number index 要切换到的Tab项的下标
			-p jQuery [$tab] 要切换到的Tab项
		*/
		switchTo: function(index, $tab){
			index = parseInt(index);
			if(index<0){
				index += this.tabCount;
				index<0 && (index = 0); //还小于0就设置为0了
			}

			var setting = this.setting;
			var activeClass = setting.tabActiveClass, $card;
			this.$tabCont.find('.'+activeClass).removeClass(activeClass);
			$tab || ($tab = this.$tabCont.find('.'+setting.tabClass).eq(index));
			$tab.addClass(activeClass);
			if(this.$cardCont){
				var activeClass = this.setting.cardActiveClass;
				this.$cardCont.find('.'+activeClass).removeClass(activeClass);
				$card = this.$cardCont.find('.'+setting.cardClass).eq(index);
				$card.addClass(activeClass);
			}
			this.onSwitch(index, $tab, $card);
			this.index = index;
		}
	};

	var Cookie = {
		set: function(name, value){
			var t = new Date();
			t.setTime(t.getTime() + 5184000000); //two months: 2*30*24*60*60*1000
			document.cookie = name+'='+escape(value)+';path=/;expires='+t.toGMTString();
		},
		get: function(name){
			name += '=';
			var c = document.cookie, val = '', nl = name.length;
			if(c){
				c = c.replace(/\s/g, '').split(';');
				var i = c.length;
				while(i--){
					if(c[i].slice(0, nl)===name){
						val = unescape(c[i].slice(nl));
						break;
					}
				}
			}
			return val;
		}
	};

!function(window){
	if(window.Cpo){
		return;
	}
	function toJSON(str){
		try{
			return (new Function('return '+str))();
		}catch(e){return ''}
	}
	var _handlers = {}, //函数池
		_needlock = {}, //需要锁定的事件池，这些事件只允许单进程执行
		_busy = {}, //繁忙的事件池，在此池中的事件不允许再执行
		_kid = 1, //为需要锁定的事件动态分配一个值，解决“单进程”事件对不同元素可以同时执行的问题
		_bubble = true, //是否冒泡
		_KID = '_Cpo_8s1hj29c3x';

	window.Cpo = {
		//kname 事件名或事件集对象，支持“伪”命名空间。例如：feed.reblog
		on: function(kname, handler){
			if(handler){
				if(kname.charAt(0)==='-'){
					kname = kname.substr(1);
					_handlers[kname] || (_needlock[kname] = true);
				}
				//_handlers[kname] ? trace.err('Click handler "'+kname+'" has been defined!')
				//	: (_handlers[kname] = handler);
				_handlers[kname] || (_handlers[kname] = handler);
			}else{
				for(var k in kname){
					kname.hasOwnProperty(k) && this.on(k, kname[k]);
				}
			}
		},
		//从函数池中删除指定名称的处理函数，也可起到取消事件绑定的效果
		del: function(kname){
			delete _handlers[kname];
			delete _needlock[kname];
		},
		//给节点绑定事件
		click: function(elem, kname, handler){
			var kn = elem.getAttribute('cpo-name'),
				n = kname;
			kname.charAt(0)==='-' && (kname = kname.substr(1));
			if(!kn){
				elem.setAttribute('cpo-name', kname);
			}else if( (' '+kn+' ').indexOf(' '+kname+' ')<0 ){
				elem.setAttribute('cpo-name', kn+' '+kname);
			}
			if(handler){
				this.on(n, handler);
			}
		},
		//取消某节点上的事件绑定，取消绑定不会从函数池中删除处理函数，因为可能其它节点也在用
		off: function(elem, kname){
			var kn = elem.getAttribute('cpo-name');
			if(!kname || kn===kname){
				elem.removeAttribute('cpo-name');
			}else if(kn){
				elem.setAttribute('cpo-name', (' '+kn+' ').replace(' '+kname+' ', ' ').replace(/^\s|\s$/g, ''));
			}
		},
		//触发事件
		//ktarget, target, event参数可选（当然也可以是其他意义的参数，JS形参类型不固定哦）
		emit: function(kname, ktarget, target, event){
			if( _needlock[kname] && ktarget){
				ktarget[_KID] || (ktarget[_KID]=' '+(_kid++));
				if( _busy[kname+ktarget[_KID]] ){return}
				_busy[kname+ktarget[_KID]] = true;
			}
			var handler = _handlers[kname];
			handler && handler(ktarget, target, event);
		},
		data: function(elem, data){
			var kdata = elem.getAttribute('cpo-data'),
				newtype = typeof data;
			
			if(newtype==='undefined'){
				return kdata ? kdata.charAt(0)==='{' ? toJSON(kdata) : kdata : '';
			}else if(newtype==='object'){
				if(data===null){
					elem.setAttribute('cpo-data', '');
					return;
				}
				var k, v;
				if(kdata && kdata.charAt(0)==='{'){
					kdata = toJSON(kdata);
					if(kdata){
						for(k in data){
							kdata[k] = data[k];
						}
					}else{
						kdata = data;
					}
				}else{
					kdata = data;
				}
				data = [];
				for(k in kdata){
					v = kdata[k];
					data.push(k + ":" + (typeof v==="string" ? "'" + v.replace(/'/g, "\\\'") + "'" : v));
				}
				data = "{" + data.join(",") + "}";
			}
			elem.setAttribute('cpo-data', data);
		},
		//释放繁忙的事件（free 请翻译成“空闲的”。。）
		free: function(ktarget, kname){
			ktarget && delete _busy[kname+ktarget[_KID]];
		},
		//阻止Cpo事件向上冒泡
		stop: function(){_bubble=false}
	};
	
var addEvent = document.addEventListener ? function(elem, type, handler){
	if( elem && elem.addEventListener ){
		elem.addEventListener(type, handler, false);
	}
} : function(elem, type, handler){
	if( elem && elem.attachEvent ){
		elem.attachEvent('on'+type, handler);
	}
};
$(function(){
	//一切从这里开始
	addEvent(document.body, 'click', function(event){
		event || (event=window.event);
		var target = event.target || event.srcElement,
			ktarget = target,
			kname;
		
		while( ktarget && ktarget.nodeType===1 && _bubble ){
			kname = ktarget.getAttribute('cpo-name');
			if(kname){
				if( _needlock[kname] ){
					ktarget[_KID] || (ktarget[_KID]=' '+(_kid++));
					if( _busy[kname+ktarget[_KID]] ){
						ktarget = ktarget.parentNode;
						continue;
					}
					_busy[kname+ktarget[_KID]] = true;
				}
				var handler = _handlers[kname];
				if(handler){
					handler(ktarget, target, event);
				}else{
					var knames = kname.split(' '),
						i = 0, len = knames.length;
					for(; i<len; i++){
						kname = knames[i];
						if( _needlock[kname] ){
							ktarget[_KID] || (ktarget[_KID]=' '+(_kid++));
							if( _busy[kname+ktarget[_KID]] ){continue}
							_busy[kname+ktarget[_KID]] = true;
						}
						handler = _handlers[kname];
						handler && handler(ktarget, target, event);
					}
				}
			} //if kname end
			ktarget = ktarget.parentNode;
		}

		_bubble = true;
	});
});
	window.$007 = _handlers; //方便调试时查看函数列表，也可注释掉
}(window);

	var Url = {
		//私有属性
		_query: null,
		getQuery: function(name){
			var query = this._query;
			if(query===null){
				query = this._query = this.parseQuery(window.location.search.slice(1));
			}
			return name ? (query[name.toLowerCase()] || '') : query;
		},
		/*--
			解析URL参数格式的字符串
			-p string url 可以是url但不一定是url
		*/
		parseQuery: function(url){
			if(url.indexOf('?')>0){
				url = url.split('?')[1];
			}
			url = url.split('&');
			var query = {},
				i = url.length,
				p, j;
			while(i--){
				p = url[i];
				if(p){
					j = p.indexOf('=');
					v = p.slice(j+1);
					v && j>0 && (query[p.slice(0,j).toLowerCase()] = decodeURIComponent(v));
				}
			}
			return query;
		}
	};

	//业务级功能开始
	var doc = {};

	!function(){
		var pagename = window.location.href.match(/\/(\w+)\.html/)[1];
		var type = Url.getQuery('type');
		$('#nav-'+pagename+ (type?'-'+type:'') ).addClass('cur');
	}();

	doc.search = function(){
		if(doc.doSearch){
			doc.doSearch();
		}else{
			window.location.href = './search.html?kw=' + $('#kw').val();
		}
	};
