'use strict';
$scripts.users.delete = {
	events: function () {
		$('#delete-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteUserClassroom',
				data: {}
			});
		});
	}
}

$socket.on('deleteUserClassroom', function (data) {
	console.log(data);
});