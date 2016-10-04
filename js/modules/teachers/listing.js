'use strict';
$scripts.teachers.listing = {
	events: function () {
		$('#listing-teachers').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingTeacherClassroom',
				data: data
			});
		});
	}
}

$socket.on('listingTeacherClassroom', function (data) {
	console.log(data);
	if (data.error) {
		alert('Code: ' + data.error.code + ' Message: ' + data.message);
		return;
	}
	var teachers = data.teachers;
	var listing = $('#div-listing-teachers');
	var tpl = '';

	for (var i = 0; i < teachers.length; i++) {
		tpl += `<tr>
		<td>${teachers[i].profile.name.fullName}</td>
		<td>${teachers[i].profile.emailAddress}</td>
		<td><a data-course-id="${teachers[i].courseId}" data-user-id="${teachers[i].profile.id}"> X </a></td></tr>`;
	}
	listing.html('<table><tr><th>Name</th><th>E-mail</th><th>DEL</th></tr>' + tpl + '</table>').find('a').click(function () {
		var data = {
			courseId: $(this).attr('data-course-id'),
			userId: $(this).attr('data-user-id')
		};
		console.log(data);
		$socket.emit('execute', {
			cls: 'googleClassroom',
			action: 'deleteTeacherClassroomById',
			data: data
		});
	});
	console.log(teachers);
});