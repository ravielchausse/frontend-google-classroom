'use strict';
$scripts.students.create = {
	events: function () {
		$('#create-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createStudentClassroomList',
				data: {id: 1}
			});
		});
	}
}

$socket.on('createStudentClassroom', function (data) {
	console.log(data);
});
