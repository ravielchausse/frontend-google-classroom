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
		return;
	},
	update: function(){
		var tpl = this.template(this.properties);
		$("#load").html(tpl);
		this.events();
		return;
	},
	events: function () {
		$('#create-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleUsers',
				action: 'createUserGoogle',
				data: data
			});
			return;
		});

		$('#delete-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleUsers',
				action: 'deleteUserGoogle',
				data: {
					
				}
			});
			return;
		});

		$('#listing-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleUsers',
				action: 'listingUserGoogle',
				data: data
			});
			return;
		});

		$('#update-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'googleUsers',
				action: 'updateUserGoogle',
				data: data
			});
			return;
		});

		$('#delete-users-id').find('a').click(function (evt) {
			evt.preventDefault();
			var id = $(this).attr('data-id');
			$socket.emit('execute', {
				cls: 'googleUsers',
				action: 'deleteUserGoogleById',
				data: {id: id}
			});
			// $mods.users.properties.users = null;
			// $mods.users.update();
			$("li").has($(this)).remove();
			return;
		});
	}
}

$socket.on('createUserGoogle', function (data) {
	console.log(data);
});

$socket.on('deleteUserGoogle', function (data) {
	console.log(data);
});

$socket.on('deleteUserGoogleById', function (data) {
	console.log(data);
	// $('#listing-users').click();
	// $('#listing-users').trigger('click');
});

$socket.on('listingUserGoogle', function (data) {
	console.log(data);
	$mods.users.properties.users = data.users;
	$mods.users.update();
});

$socket.on('updateUserGoogle', function (data) {
	console.log(data);
	$('.form-users').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-users').html('');
	alert(data.message);
});