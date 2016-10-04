'use strict';
$scripts.courses.update = {
	events: function () {
		$('#update-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'updateCourseClassroom',
				data: data
			});
		});
	}
}

$socket.on('updateCourseClassroom', function (data) {
	console.log(data);
	$('.form-courses').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-courses').html('');
	alert(data.message);
});