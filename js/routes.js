$routes = {
    init: function (pars) {
        $factory.startByRoute(function(){

            $factory.execute("start").update();   

        },"start");
        
    },
    module: function (pars) {
        $factory.startByRoute(function(){

            $factory.execute(pars[1]).setState(pars[2],pars[3], pars);   
            
        },pars[1]);
    },
    photo: function (pars) {

    },
    changeRoute:function(pars,obj) {
        $routes.post = obj;
        $factory.preventChangeHash = true;
        window.location.hash = "#" + pars.join("/");
        $factory.preventChangeHash = false;
        //$routes.module(pars);
    }
};