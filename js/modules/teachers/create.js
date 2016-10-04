'use strict';
$scripts.teachers.create = {
	events: function () {
		$('#create-teachers').click(function () {
			var data = $('form').getForm();
			console.log(data);
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createTeacherClassroom',
				data: {
					courseId: data.courseId,
					personData: data
				}
			});
		});
	}
}

$socket.on('createTeacherClassroom', function (data) {
	console.log(data);
});