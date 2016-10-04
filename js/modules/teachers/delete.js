'use strict';
$scripts.teachers.delete = {
	events: function () {
		$('#delete-teachers').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteTeacherClassroom',
				data: {}
			});
		});
	}
}

$socket.on('deleteTeacherClassroom', function (data) {
	console.log(data);
});