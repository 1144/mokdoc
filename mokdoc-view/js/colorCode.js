/*-author hahaboy*/
/* css: k=key word, o=operation, s=string, m=method, n=number, c=comment, t=tab
.eg .k{color:#00F}
.eg .o{color:#F9263E}
.eg .s{color:#CC9900}
.eg .m{color:#00CCFF}
.eg .n{color:#00CC66}
.eg .c{color:#999}
.eg .t{display:inline-block; width:8px;}
*/
~function (window) {
	var WORD2CLS = {}; //词与样式名的hash映射
	var addWords = function (className, words) {
		words = words.split(',');
		var i = words.length;
		while (i--) {
			WORD2CLS[words[i]] = className;
		}
	};
	addWords('o', 'if,else,while,new,return,=,+,-,*,%,+=,-=,*=,%=,++,--,'+
		'&amp;&amp;,||,===,==,&lt;=,&gt;=,continue,break,&amp;,|,&lt;,&gt;,window');
	addWords('k', 'var,function,this,require,true,false,exports');
	addWords('m', 'push,length,indexOf,log,alert,slice,split,splice,'+
		'setTimeout,setInterval,clearTimeout,clearInterval');

	var reg_num = /^\d+$/;
	var colorIt = function (word) {
		if (word) { //console.log('"%s"',word);
			var cls = WORD2CLS[word];
			if (cls) {
				return '<i class="'+cls+'">'+word+'</i>';
			} else if (reg_num.test(word)) {
				return '<i class="n">'+word+'</i>';
			}
		}
		return word;
	};
	
	var special_rep = {'  ':' &nbsp;', '\t':'<i class="t"></i> &nbsp; &nbsp;',
		'\n':'<br/>', '<':'&lt;', '>':'&gt;', '&':'&amp;'};
	var reg_c = [/[\w\$]/, /[=+<>\|&%-.*]/];
	var findRi = function (c) {
		var i = reg_c.length;
		while (i--) {
			if (reg_c[i].test(c)) {
				return i;
			}
		}
		return -1;
	};
	var colorCode = function (code) {
		code = '!'+code; //if (a>b) {c = a.length/b}
		var r = '', w = '', c, ri = -1, q = '',
			i = 1, l = code.length;
		for (; i < l; i++) {
			c = code.charAt(i);
			if (c==='\n') {
				if (q===1) {
					r += '<i class="c">'+w+'</i><br/>';
				} else {
					r += colorIt(w)+'<br/>';
				}
				q = w = '';
			} else if (q===1) { //用q=1标识注释状态
				w += (special_rep[c] || c);
			} else if (c==='"' || c==="'") {
				if (c===q && code.charAt(i - 1)!=='\\') { //字符串结束
					r += '<i class="s">'+w+q+'</i>';
					q = w = '';
				} else { 
					if (q==='') { //字符串开头
						r += colorIt(w);
						q = w = c;
					} else {
						w += c; //字符串里的单双引号
					}
				}
			} else if (q==='') { //不在字符串里
				if (c===' ') {
					if (w===' ') { //连续的两个空格
						r += ' &nbsp;'; //替换后一个为实体空格
						w = '';
					} else {
						r += colorIt(w);
						w = ' ', ri = -1;
					}
				} else if (c==='\t') {
					r += colorIt(w)+'<i class="t"></i> &nbsp; &nbsp;';
					w = '';
				} else if (c==='/') { //除号或进入注释状态
					r += colorIt(w);
					if (code.charAt(i + 1)==='/') {
						q = 1; //用q=1标识注释状态
						w = '//';
						i++;
					} else {
						r += (code.charAt(i - 1)==='\\' ? '/' : '<i class="o">/</i>');
						w = '';
					}
				} else {
					if (ri>-1 && reg_c[ri].test(c)) { //同一类字符里
						if (ri===1) {c = special_rep[c] || c}
						w += c;
					} else {
						if (w) {
							r += (w===' ' ? w : colorIt(w));
							w = '';
						}
						ri = findRi(c);
						if (ri===1) {
							w = (special_rep[c] || c);
						} else if (ri>-1) {
							w = c;
						} else {
							r += c;
						}
					}
				}
			} else { //字符串收集ing
				w += (special_rep[c] || c);
			}
			//r += c;
		}
		if (w) {
			r += (q===1 ? '<i class="c">'+w+'</i>' : colorIt(w));
		}
		return r;
	};

	//格式化代码块，用于格式化注释或一个代码库
	var formatText = function (text) {
		return text.replace(/\t|  |\n|<|>|&/g, function ($0) {
			return special_rep[$0];
		});
	};

	window.colorCode = colorCode;
	window.formatText = formatText;

}(window);
