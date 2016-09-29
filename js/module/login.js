/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.login = function(me) {

    me.pars = $.extend(true, {
        instanceModules:{},
        modules:["students_register","start","curricularBases","class","human_resource","teacher","structure","configSystem","dailyTeachers"],
        properties: {
            username:null,
            password:null
        },
        element: ""
    }, me.pars);

    me.createSession = function(user,pass, call) {

        $model.login.post(user,pass,function(r){
            $factory.lookup = r;
            $factory._session = {
                school:{
                    schoolId:1,
                    schoolName:'Escola Estadual RG Sistemas',
                },
                profile:{
                    username:'jschimidt',
                    profileId:1, // ex.: diretor
                    user:'Julio Schimidt',
                    email:'julioschimidt@gmail.com'
                },
                permissions:{
                    human_resources:{
                        allowFindSchool:0
                    },
                    students_register:{
                        changePhoto:1
                    }
                }
            };
            me.loadModules(call);
        });
    };

    me.loadModules = function(call) {
        var i,inst;
        for (i in me.pars.modules) {
            inst = $factory.createInstance(me.pars.modules[i],me.pars.modules[i],{element:"[data-mod="+ me.pars.modules[i] +"]"},"Base");
            me.pars.instanceModules[me.pars.modules[i]] = inst;
        };
        me.createNav();
        if(call){
            call();
        }

    };

    me.createNav = function() {
        $factory.createInstance("nav","nav",{element:"nav"});
        $factory.execute("nav").init(me.pars.instanceModules);
    };

    return me;

};
