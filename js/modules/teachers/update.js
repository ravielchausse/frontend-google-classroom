'use strict';
$scripts.teachers.update = {
	events: function () {
		$('#update-teachers').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'updateTeacherClassroom',
				data: data
			});
		});
	}
}

$socket.on('updateTeacherClassroom', function (data) {
	console.log(data);
	$('.form-teachers').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-teachers').html('');
	alert(data.message);
});