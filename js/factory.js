'use strict';
var $socket = io('http://127.0.0.1:3000');
var $factory = {
	modules: {}
};

$socket.on('log', function (data) {
	console.log(data);
});

$socket.on('Exceptions', function (data) {
	console.log(data);
	alert('Code: ' + data.exception.code + ' Message: ' + data.exception.exceptionMessage);
});

var $mods = $factory.modules;