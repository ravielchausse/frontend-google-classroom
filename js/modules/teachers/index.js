'use strict';
$mods.teachers = {
	properties: {
		teachers: null,
		action: null
	},
	template: null,
	templatePath: "template/teachers/index.html",
	render: function (action) {
		var _this = this;
		$mods.teachers.properties.action = action;
		$.post(this.templatePath, function (data) {
			_this.template = _.template(data);
			_this.update();
		});
	},
	update: function(){
		var tpl = this.template(this.properties);
		$("#load").html(tpl);
		this.events();
	},
	events: function () {
		$('#create-teachers').click(function () {
			var data = $('form').getForm();
			console.log(data);
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createTeacherClassroom',
				data: {
					courseId: data.courseId,
					personData: data
				}
			});
		});

		$('#delete-teachers').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteTeacherClassroom',
				data: {}
			});
		});

		$('#listing-teachers').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingTeacherClassroom',
				data: data
			});
		});

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

$socket.on('createTeacherClassroom', function (data) {
	console.log(data);
});

$socket.on('deleteTeacherClassroom', function (data) {
	console.log(data);
});

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

$socket.on('updateTeacherClassroom', function (data) {
	console.log(data);
	$('.form-teachers').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-teachers').html('');
	alert(data.message);
});