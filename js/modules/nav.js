'use strict';
$(document).ready(function(){
	$('nav ul li a').click(function() {
		$(this).parent().toggleClass('open');
		$(this).parent().find('li a').click(function (evt) {
			evt.preventDefault();
			var cls = $(this).attr('data-cls');
			var action = $(this).attr('data-action');
			var script = $mods[cls];
			script.render(action);
		});
	});
});