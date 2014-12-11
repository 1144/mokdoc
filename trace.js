
var trace = {
	log: function(msg){
		console.log(msg);
	},
	ok: function(msg){
		console.log('\033[1m\033[32m' + msg + '\033[0m');
	},
	warn: function(msg){
		console.log('\033[1m\033[33m' + msg + '\033[0m');
	},
	error: function(msg){
		console.log('\033[1m\033[31m' + msg + '\033[0m');
	}
};

module.exports = trace;

//trace.log(1)
//trace.ok(2)
//trace.warn(3)
//trace.error(4)
