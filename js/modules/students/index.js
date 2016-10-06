'use strict';
$mods.students = {
	properties: {
		students: null,
		action: null
	},
	template: null,
	templatePath: "template/students/index.html",
	render: function (action) {
		var _this = this;
		$mods.students.properties.action = action;
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
		$('#create-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createStudentClassroomList',
				data: {id: 1}
			});
		});

		$('#delete-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteStudentClassroom',
				data: {}
			});
		});

		$('#listing-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingStudentClassroom',
				data: {}
			});
		});

		$('#update-students').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'updateStudentClassroom',
				data: data
			});
		});
	}
}

$socket.on('createStudentClassroom', function (data) {
	console.log(data);
});

$socket.on('deleteStudentClassroom', function (data) {
	console.log(data);
});

$socket.on('listingStudentClassroom', function (data) {
	console.log(data);
});

$socket.on('updateStudentClassroom', function (data) {
	console.log(data);
});