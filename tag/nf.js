//��ʶ�ⲻ��һ��function
exports.tag = {
	handler: function(cmd, data, doc){
		doc.status.nf = true;
		return false;
	}
};
