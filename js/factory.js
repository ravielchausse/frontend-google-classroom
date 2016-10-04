var $socket = io('http://127.0.0.1:3000');
var $scripts = {};

$scripts.classes = {};
$scripts.users = {};
$scripts.courses = {};
$scripts.teachers = {};
$scripts.students = {};

$socket.on('log', function (data) {
	console.log(data);
});

$socket.on('Exceptions', function (data) {
	console.log(data);
	alert('Code: ' + data.exception.code + ' Message: ' + data.exception.exceptionMessage);
});