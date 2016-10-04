'use strict';
$scripts.courses.listing = {
	events: function () {
		$('#listing-courses').click(function () {
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingCourseClassroom',
				data: {}
			});
		});
	}
}

$socket.on('listingCourseClassroom', function (data) {
	console.log(data);
	if (data.error) {
		alert('Code: ' + data.error.code + ' Message: ' + data.message);
		return;
	}
	var courses = data.courses;
	var listing = $('#div-listing-courses');
	var tpl = '';

	for (var i = 0; i < courses.length; i++) {
		tpl += `<tr><td>${courses[i].id}</td>
		<td>${courses[i].name}</td></tr>`;
	}
	listing.html('<table><tr><th>ID</th><th>Name</th></tr>' + tpl + '</table>');
	console.log(courses);
});