'use strict';
$scripts.users.create = {
	events: function () {
		$('#create-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createUserClassroom',
				data: data
			});
		});
	}
}

$socket.on('createUserClassroom', function (data) {
	console.log(data);
});