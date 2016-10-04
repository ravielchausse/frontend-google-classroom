'use strict';
$scripts.courses.delete = {
	events: function () {
		$('#delete-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteCourseClassroomList',
				data: {}
			});
		});
	}
}

$socket.on('deleteCourseClassroomList', function (data) {
	console.log(data);
});