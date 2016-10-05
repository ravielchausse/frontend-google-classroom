'use strict';
$scripts.courses.listing = {
	properties: {
		courses: null
	},
	template: null,
	render: function (path) {
		var _this = this;
		$.post(path, function (data) {
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
	if (data.error) {
		alert('Code: ' + data.error.code + ' Message: ' + data.message);
		return;
	}
	$scripts.courses.listing.properties.courses = data.courses;
	$scripts.courses.listing.update();
});