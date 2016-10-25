'use strict';
$mods.courses = {
	properties: {
		cls: 'googleClassroom',
		action: null,
		courses: null,
		course: {
			alternateLink: null,
			courseGroupEmail: null,
			courseState: null,
			creationTime: null,
			enrollmentCode: null,
			guardiansEnabled: false,
			id: null,
			name: null,
			ownerId: null,
			section: null,
			teacherFolder: {
				alternateLink: null,
				id: null,
				title: null,
			},
			teacherGroupEmail: null,
			updateTime: null
		}
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

		$('#submit-courses').click(function () {
			var course = $('form').getForm();

			$.extend(true, $mods.courses.properties.course, course);

			console.log({course: $mods.courses.properties.course});

			if ($mods.courses.properties.course.id) {
				$socket.emit('execute', {
					cls: $mods.courses.properties.cls,
					action: 'updateCourseClassroom',
					data: $mods.courses.properties.course
				});
			} else {
				$socket.emit('execute', {
					cls: $mods.courses.properties.cls,
					action: 'createCourseClassroom',
					data: $mods.courses.properties.course
				});
			}
			return;
		});

		$('#delete-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: $mods.courses.properties.cls,
				action: 'deleteCourseClassroomList',
				data: data
			});
		});

		$('#listing-courses').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: $mods.courses.properties.cls,
				action: 'listingCourseClassroom',
				data: data
			});
		});

		$('#menu-courses').find('.edit').click(function (evt) {
			evt.preventDefault();
			var idx = $(this).attr('data-idx');
			$.extend(true, $mods.courses.properties.course, $mods.courses.properties.courses[idx]);
			$mods.courses.properties.action = 'form';
			$mods.courses.update();
			return;
		});

		$('#menu-courses').find('.teacher').click(function (evt) {
			evt.preventDefault();
			var idx = $(this).attr('data-idx');
			$socket.emit('execute', {
				cls: $mods.courses.properties.cls,
				action: 'listingTeacherByCourseId',
				data: {courseId: $mods.courses.properties.courses[idx].id}
			});
			return;
		});

		$('#menu-courses').find('.student').click(function (evt) {
			evt.preventDefault();
			var idx = $(this).attr('data-idx');
			$socket.emit('execute', {
				cls: $mods.courses.properties.cls,
				action: 'listingStudentByCourseId',
				data: {courseId: $mods.courses.properties.courses[idx].id}
			});
			return;
		});

		$('#menu-courses').find('.del').click(function (evt) {
			evt.preventDefault();
			var id = $(this).attr('data-id');
			$socket.emit('execute', {
				cls: $mods.courses.properties.cls,
				action: 'deleteCourseClassroomById',
				data: {id: id}
			});
			// $mods.courses.properties.courses = null;
			// $mods.courses.update();
			$("li").has($(this)).remove();
			return;
		});

		$('#menu-teachers').find('.del').click(function (evt) {
			evt.preventDefault();
			var courseId = $(this).attr('data-course-id');
			var userId = $(this).attr('data-user-id');
			$socket.emit('execute', {
				cls: $mods.courses.properties.cls,
				action: 'deleteTeacherClassroomById',
				data: {courseId: courseId, userId: userId}
			});
			$("li").has($(this)).remove();
			return;
		});
	}
}

$socket.on('createCourseClassroom', function (data) {
	console.log(data);
});

$socket.on('deleteCourseClassroomList', function (data) {
	console.log(data);
});

$socket.on('deleteCourseClassroomById', function (data) {
	console.log(data);
});

$socket.on('deleteTeacherClassroomById', function (data) {
	console.log(data);
});

$socket.on('listingCourseClassroom', function (data) {
	$mods.courses.properties.courses = data.courses;
	$mods.courses.update();
});

$socket.on('updateCourseClassroom', function (data) {
	$('.form-courses').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-courses').html('');
	alert(data.message);
	$mods.courses.properties.action = 'listing';
	$mods.courses.properties.courses = null;
	$mods.courses.update();
});

$socket.on('listingTeacherByCourseId', function (data) {
	$mods.courses.properties.teachers = data.teachers;
	if ($mods.courses.template) {
		$mods.courses.properties.action = 'listing-teachers';
		$mods.courses.update();
	} else {
		$mods.courses.render('listing-teachers');
	}
});

$socket.on('listingStudentByCourseId', function (data) {
	$mods.courses.properties.students = data.students;
	if ($mods.courses.template) {
		$mods.courses.properties.action = 'listing-students';
		$mods.courses.update();
	} else {
		$mods.courses.render = 'listing-students';
	}
});