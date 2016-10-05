'use strict';
var load = function (path, script) {
	if (typeof script.render == 'function') {
		script.render(path);
	}
}