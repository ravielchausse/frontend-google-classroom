'use strict';
$scripts.courses.create = {
	events: function () {
		$('#create-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createCourseClassroom',
				data: data
			});
		});
	}
}

$socket.on('createCourseClassroom', function (data) {
	console.log(data);
});