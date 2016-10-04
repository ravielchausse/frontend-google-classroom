'use strict';
$scripts.classes.finalize = {
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