$.fn.setOption = function(data) {
    //your code goes here
    console.log('setOption');
    var list = data.list;
    for(var i=0;i<list.length;i++){
    	this.append(`<option value="`+list[i][data.valueField]+`">`+list[i][data.textField]+`</option>`)
    }
}

$.fn.setVal = function(data) {
    if(this.find("option[value='"+data.value+"']").length==0){
    	this.append(`<option extradata="true" value="`+data.value+`">`+data.text+`</option>`)
    }
    this.val(data.value)
}

$.fn.checkUnusual = function(){
	var selectArr = this.find('select');
	for(var i=0;i<selectArr.length;i++){
		var val = $(selectArr[i]).val();
		if($(selectArr[i]).find("option[value='"+val+"']").attr('extradata')){
			layer.alert('异常元素', {icon: 2});
			$(selectArr[i]).addClass('layui-form-danger');
			$(selectArr[i]).focus();
		}
	}
}