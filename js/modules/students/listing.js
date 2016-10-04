'use strict';
$scripts.students.listing = {
	events: function () {
		$('#listing-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingStudentClassroom',
				data: {}
			});
		});
	}
}

$socket.on('listingStudentClassroom', function (data) {
	console.log(data);
});