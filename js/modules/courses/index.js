'use strict';
$mods.courses = {
	properties: {
		courses: null,
		action: null
	},
	template: null,
	templatePath: "template/courses/index.html",
	render: function (action) {
		var _this = this;
		$mods.courses.properties.action = action;
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

		$('#create-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createCourseClassroom',
				data: data
			});
		});

		$('#delete-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteCourseClassroomList',
				data: data
			});
		});

		$('#listing-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingCourseClassroom',
				data: data
			});
		});

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

$socket.on('createCourseClassroom', function (data) {
	console.log(data);
});

$socket.on('deleteCourseClassroomList', function (data) {
	console.log(data);
});

$socket.on('listingCourseClassroom', function (data) {
	if (data.error) {
		alert('Code: ' + data.error.code + ' Message: ' + data.message);
		return;
	}
	$mods.courses.properties.courses = data.courses;
	$mods.courses.update();
});

$socket.on('updateCourseClassroom', function (data) {
	console.log(data);
	$('.form-courses').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-courses').html('');
	alert(data.message);
});