//标识这不是一个function
exports.tag = {
	handler: function(cmd, data, doc){
		doc.status.nf = true;
		return false;
	}
};
