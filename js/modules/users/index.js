'use strict';
$mods.users = {
	properties: {
		cls: 'googleUsers',
		action: null,
		users: null,
		user: {
			agreedToTerms: null,
			changePasswordAtNextLogin: null,
			creationTime: null,
			customerId: null,
			emails: [],
			id: null,
			includeInGlobalAddressList: null,
			ipWhitelisted: null,
			isAdmin: null,
			isDelegatedAdmin: null,
			isMailboxSetup: null,
			kind: null,
			lastLoginTime: null,
			name: {
				givenName: null,
				familyName: null,
				fullName: null
			},
			nonEditableAliases: [],
			primaryEmail: null,
			suspended: false
		}
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
		$('#submit-users').click(function () {
			var user = $('form').getForm();

			$.extend(true, $mods.users.properties.user, user);

			console.log({user: $mods.users.properties.user});
			if ($mods.users.properties.user.id) {
				$socket.emit('execute', {
					cls: $mods.users.properties.cls,
					action: 'updateUserGoogle',
					data: $mods.users.properties.user
				});
			} else {
				$socket.emit('execute', {
					cls: $mods.users.properties.cls,
					action: 'createUserGoogle',
					data: $mods.users.properties.user
				});
			}
			return;
		});

		$('#listing-users').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: $mods.users.properties.cls,
				action: 'listingUserGoogle',
				data: data
			});
			return;
		});

		$('#menu-users').find('.edit').click(function (evt) {
			evt.preventDefault();
			var idx = $(this).attr('data-idx');
			$.extend(true, $mods.users.properties.user, $mods.users.properties.users[idx]);
			$mods.users.properties.action = 'form';
			$mods.users.update();
			return;
		});

		$('#menu-users').find('.teacher').click(function (evt) {
			evt.preventDefault();
			var idx = $(this).attr('data-idx');
			$.extend(true, $mods.teachers.properties.teacher, $mods.users.properties.users[idx]);
			$mods.teachers.render('create');
			return;
		});

		$('#menu-users').find('.student').click(function (evt) {
			evt.preventDefault();
			var idx = $(this).attr('data-idx');
			console.log({student: $mods.users.properties.users[idx]});
			return;
		});

		$('#menu-users').find('.del').click(function (evt) {
			evt.preventDefault();
			var id = $(this).attr('data-id');
			$socket.emit('execute', {
				cls: $mods.users.properties.cls,
				action: 'deleteUserGoogleById',
				data: {id: id}
			});
			$mods.users.properties.users = null;
			$mods.users.update();
			$("li").has($(this)).remove();
			return;
		});
	}
}

$socket.on('createUserGoogle', function (data) {
	console.log(data);
});

$socket.on('deleteUserGoogleById', function (data) {
	console.log(data);
	// $('#listing-users').click();
	// $('#listing-users').trigger('click');
});

$socket.on('listingUserGoogle', function (data) {
	$mods.users.properties.users = data.users;
	$mods.users.update();
});

$socket.on('updateUserGoogle', function (data) {
	$('.form-users').find('input').each(function () {
		$(this).val(null);
	});
	$('#div-listing-users').html('');
	alert(data.message);
	$mods.users.properties.action = 'listing';
	$mods.users.properties.users = null;
	$mods.users.update();
});

$socket.on('listingTeacherClassroom', function (data) {
	console.log({teachers: data});
});