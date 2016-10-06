'use strict';
$mods.users = {
	properties: {
		users: null,
		action: null
	},
	template: null,
	templatePath: "template/users/index.html",
	render: function (action) {
		var _this = this;
		$mods.users.properties.action = action;
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
		$('#create-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'createUserClassroom',
				data: data
			});
		});

		$('#delete-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'deleteUserClassroom',
				data: {}
			});
		});

		$('#listing-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'listingUserClassroom',
				data: data
			});
		});

		$('#update-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleClassroom',
				action: 'updateUserClassroom',
				data: data
			});
		});
	}
}

$socket.on('createUserClassroom', function (data) {
	console.log(data);
});

$socket.on('deleteUserClassroom', function (data) {
	console.log(data);
});

$socket.on('listingUserClassroom', function (data) {
	console.log(data);
	$users = data.users;
	if (data.error) {
		alert('Code: ' + data.error.code + ' Message: ' + data.message);
		return;
	}
	var listing = $('#div-listing-users');
	var tpl = '';

	for (var i = 0; i < $users.length; i++) {
		tpl += `<tr>
		<td>${$users[i].name.fullName}</td>
		<td>${$users[i].primaryEmail}</td>
		<td><a data-idx="${i}" data-id="${$users[i].id}"> X </a></td>
		</tr>`;
	}
	listing.html('<table><tr><th>Name</th><th>E-mail</th><th></th></tr>' + tpl + '</table>').find('a').click(function () {
		console.log({
			id: $(this).attr('data-id'),
			data: $users[$(this).attr('data-idx')]
		});
		// $socket.emit('execute', {
		// 	cls: 'googleClassroom',
		// 	action: 'deleteUserClassroomById',
		// 	data: {id: $(this).data('id')}
		// });
	});
	console.log($users);
});

$socket.on('updateUserClassroom', function (data) {
	console.log(data);
	$('.form-users').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-users').html('');
	alert(data.message);
});