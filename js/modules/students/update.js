'use strict';
$scripts.students.update = {
	events: function () {
		$('#update-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'updateStudentClassroom',
				data: data
			});
		});
	}
}

$socket.on('updateStudentClassroom', function (data) {
	console.log(data);
});