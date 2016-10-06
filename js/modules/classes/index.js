'use strict';
$mods.classes = {
	properties: {
		classes: null,
		action: null
	},
	template: null,
	templatePath: "template/classes/index.html",
	render: function (action) {
		var _this = this;
		$mods.classes.properties.action = action;
		$.post(this.templatePath, function (data) {
			_this.template = _.template(data);
			_this.update();
		});
	},
	update: function(){60
		var tpl = this.template(this.properties);
		$("#load").html(tpl);
		this.events();
	},
	events: function () {
		$('#finalize-classes').click(function () {
			var data = $('form').getForm();
			$socket.emit('execute', {
				cls: 'classes',
				action: 'finalizeClassById',
				data: data
			});
		});
	}
}

$socket.on('finalizeClassById', function (data) {
	console.log(data);
});