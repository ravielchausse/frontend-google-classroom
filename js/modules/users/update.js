'use strict';
$scripts.users.update = {
	events: function () {
		$('#update-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'updateUserClassroom',
				data: data
			});
		});
	}
}

$socket.on('updateUserClassroom', function (data) {
	console.log(data);
	$('.form-users').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-users').html('');
	alert(data.message);
});