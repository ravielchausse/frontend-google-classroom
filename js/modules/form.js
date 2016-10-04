$.fn.getForm = function(){
	var obj = {};
	$(this).find("[persist]").each(function(){
		if($(this).attr("type") == "checkbox"){
			if($(this).is(":checked")){
				obj[$(this).attr("name")] = $(this).val();
			}
		}else if($(this).attr("type") == "radio"){
			if($(this).is(":checked")){
				obj[$(this).attr("name")] = $(this).val();
			}
		}else{
			obj[$(this).attr("name")] = $(this).val() || $(this).attr("data-value");
		}
	});
	return obj;
};