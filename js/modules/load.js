'use strict';
var load = function (path, script) {
	var parent = $('#load');
	$.post(path, function (data) {
		var tpl = _.template(data);
		parent.html(tpl());
		if (typeof script.events == 'function') {
			script.events();
		}
	});
}