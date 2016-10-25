'use strict';
$mods.teachers = {
	properties: {
		cls: 'googleClassroom',
		action: null,
		courses: null,
		course: {},
		teachers: null,
		teacher: {}
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
			var course = $('form').getForm();
			$.extend(true, $mods.teachers.properties.course, $mods.teachers.properties.courses[course.idx]);
			$socket.emit('execute', {
				cls: $mods.teachers.properties.cls,
				action: 'createTeacherByCourseId',
				data: {courseId: $mods.teachers.properties.course.id, userId: $mods.teachers.properties.teacher.id}
			});
		});

		$('#listing-courses').click(function () {
			$socket.emit('execute', {
				cls: $mods.teachers.properties.cls,
				action: 'listingCourseForTeachers',
				data: {pageSize: 50}
			});
		});
	}
}

$socket.on('createTeacherByCourseId', function (data) {
	$socket.emit('execute', {
		cls: $mods.courses.properties.cls,
		action: 'listingTeacherByCourseId',
		data: {courseId: $mods.teachers.properties.course.id}
	});
});

$socket.on('listingCourseForTeachers', function (data) {
	$mods.teachers.properties.courses = data.courses;
	$mods.teachers.update();
});