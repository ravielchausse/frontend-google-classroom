'use strict';
$(document).ready(function(){
	$('nav ul li a').click(function() {
		$(this).parent().toggleClass('open');
		$(this).parent().find('li a').click(function (e) {
			e.preventDefault();
			var path = $(this).attr('href');
			var cls = $(this).attr('data-cls');
			var module = $(this).attr('data-script');

			var script = (cls) ? $scripts[cls][module] : $scripts[module];

			load(path, script);
		});
	});
});