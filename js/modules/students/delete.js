'use strict';
$scripts.students.delete = {
	events: function () {
		$('#delete-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteStudentClassroom',
				data: {}
			});
		});
	}
}

$socket.on('deleteStudentClassroom', function (data) {
	console.log(data);
});