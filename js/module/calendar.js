$calendar = {
	name: "calendar"
};

$calendar.init = function(){
	this.update();
};

$calendar.request = function(){

};

$calendar.update = function(){
	$controller.renderPage(this.name,{
		name: "Vitor"
	});
};

$calendar.context = function(pars){
	pars.test.evt("click", $calendar.buttonClick,{
		test: "teste"
	});
};

$calendar.buttonClick = function(e){
	console.log(e);
}