$factory = {
    instances: {},
    numberId: 1,
    modules: {
        login: {
            reference: $.login,
            templatePath: "template/login.html"
        },
        Base: {
            controllerPath: "js/module/Base.js"
        },
        start: {
            templatePath: "template/start.html",
            controllerPath: "js/module/start.js",
            stylePath: "css/module/start.css"
        },
        nav: {
            templatePath: "template/nav.html",
            controllerPath: "js/module/nav.js"
        },
        person_data: {
            templatePath: "template/people/person_data.html",
            controllerPath: "js/module/people/person_data.js"
        },
        documents: {
            templatePath: "template/people/documents.html",
            controllerPath: "js/module/people/documents.js",
            stylePath: "css/module/documents.css"
        },
        annex: {
            templatePath: "template/people/annex.html",
            controllerPath: "js/module/people/annex.js",
            stylePath: "css/module/annex.css"
        },
        students_register: {
            templatePath: "template/students/index.html",
            controllerPath: "js/module/students/index.js",
            stylePath: "css/module/students_register.css"
        },
        students_form: {
            templatePath: "template/students/students_form.html",
            controllerPath: "js/module/students/students_form.js"
        },
        students_search: {
            templatePath: "template/students/students_search.html",
            controllerPath: "js/module/students/students_search.js"
        },
        special_needs: {
            templatePath: "template/people/special_needs.html",
            controllerPath: "js/module/people/special_needs.js"
        },
        guardianship: {
            templatePath: "template/students/guardianship.html",
            controllerPath: "js/module/students/guardianship.js"
        },
        curricularBases: {
            templatePath: "template/config/curricularBases/curricularBases.html",
            controllerPath: "js/module/config/curricularBases.js",
            stylePath: "css/module/curricularBases.css"
        },
        class: {
            templatePath: "template/class/class.html",
            controllerPath: "js/module/class/class.js",
            stylePath: "css/module/class.css"
        },
        teacher: {
            templatePath: "template/teacher/teacher.html",
            controllerPath: "js/module/teacher/teacher.js"
        },
        human_resource: {
            controllerPath: "js/module/human_resource/index.js",
            stylePath: "css/module/humanResources.css"
        },
        employees_form:{
            templatePath: "template/human_resource/human_resource.html",
            controllerPath: "js/module/human_resource/employees_form.js"            
        },
        employees_list:{
            templatePath: "template/human_resource/employees_list.html",
            controllerPath: "js/module/human_resource/employees_list.js"            
        },
        teacher_availability:{
            templatePath: "template/human_resource/teacher_availability.html",
            controllerPath: "js/module/human_resource/teacher_availability.js"            
        },
        structure: {
            templatePath: "template/structure/index.html",
            controllerPath: "js/module/structure/index.js"
        },
        structure_form: {
            templatePath: "template/structure/structure_form.html",
            controllerPath: "js/module/structure/structure_form.js"
        },
        structure_search: {
            templatePath: "template/structure/structure_search.html",
            controllerPath: "js/module/structure/structure_search.js"
        },
        configSystem: {
          templatePath: "template/config/config_system.html",
          controllerPath: "js/module/config/config_system.js",
          stylePath: "css/module/config_system.css"
        },
        dailyTeachers:{
            controllerPath: "js/module/dailyTeachers/index.js",
            stylePath: "css/module/daily.css"
        },
        daily:{
            templatePath: "template/dailyTeachers/list.html",            
            controllerPath: "js/module/dailyTeachers/daily.js"
        },
        presence_modal:{
            templatePath: "template/dailyTeachers/presence_modal.html",            
            controllerPath: "js/module/dailyTeachers/presence_modal.js"
        }
    },
    lookup: [],
    init: function () {
        //$factory.loadLogin();
    },

    startByRoute: function(call, module) {
        if($factory.instances[module]){
            call();
        }else{
            $factory.loadLogin(call);
        }
    },

    loadLogin: function (call) {
        $factory.loadM(function () {
            if (!$factory.instances.login) {
                $factory.createInstance("login", "login").createSession("admin", "123456", function(){
                     if (call) {
                        call();
                    }
                });
            }

        });
    },
    /* Método que carrega os arquivos .js, .html e .css para a memória */
    loadM: function (call) {
        var count = 0, leng = Object.keys($factory.modules).length;

        _.each($factory.modules, function (v, k) {

            if (v.templatePath) {
                $.post(v.templatePath, function (data) {
                    $factory.modules[k].template = _.template(data);
                });
            }

             if (v.controllerPath) {
                $.getScript(v.controllerPath, function (data) {
                    v.reference = $[k];
                    count += 1;
                    if (count === leng - 1) {
                        if (call) {
                            call();
                        }
                    }
                });
            }

            if (v.stylePath) {
                var css = $("<link />").appendTo("head");
                css.attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: v.stylePath
                });
            }

        });
    },
    getTemplate: function(path, call){
        $.post(path, function (data) {
            var tpl = _.template(data);
            call(tpl);
        });
    },
    renderModule: function (sel, ctx) {
        var elem = $(sel);
        elem.html(ctx);
        elem.find(".tabs-group").setTabs();
        elem.find("[data-mask]").each(function () {
            $(this).find("input").mask($(this).data("mask"));
        });
            
        elem.find(".disabled").each(function () {
            $(this).find("input, select").attr("disabled", "disabled");
        });
        elem.find(".input-group").has("[required]").find("label").appendTo("*");

        return elem;
    },
    renderPage: function (sel, ctx) {
        $("[data-mod]").hide();
        $(sel).show();
        return $factory.renderModule(sel, ctx);
    },
    initDefault: function (obj, extendModName) {
        var inst, me;
        inst = $factory.createInstance("*", extendModName);

        me = $.extend({}, obj({}), $factory.instances[inst].instance);

        return me;

    },
    createInstance: function (instanceName, modName, obj, modExtend) {
        var instance, instance2, x, y;

        $factory.numberId++;

        if (instanceName === "*") {
            instanceName = modName + $factory.numberId;
        }
        ;
        instance = $.extend(true, {}, $factory.modules[modName].reference({}));

        if (modExtend) {

            if(typeof modExtend === "object"){
                y = modExtend;
            }else{
                y = $factory.modules[modExtend].reference({});
            }

            instance2 = $.extend(true, {}, y);
            instance = $.extend(true, {}, instance2, instance );
        }

        instance.template = $factory.modules[modName].template;
        instance.pars.dic = $dictionary;
        $factory.instances[instanceName] = {
            instance: instance,
            modName: modName
        };
        if (typeof instance.construct === "function") {
            this.execute(instanceName).construct(obj);
        }

        $factory.execute(instanceName).pars.instance = {
            instanceName: instanceName,
            modName: modName,
            extendInstance: modExtend,
            instanceId: $factory.numberId
        };

        return $factory.execute(instanceName);
    },
    resetInstance: function(instance,obj){
        var instanceName = instance.pars.instance.instanceName,
            modName = instance.pars.instance.modName,
            extendInstance = instance.pars.instance.extendInstance;
            obj = obj || {};
        return $factory.createInstance(instanceName,modName,obj,extendInstance);
    },
    execute: function (instanceName) {
        var instance = $factory.instances[instanceName] || null, r;
        if (!instance) {
            return null;
        }
        r = $factory.modules[instance.modName].reference(instance.instance);
        return r;
    },
    validation: function (val, type, req) {

        var formatedDate = null, x = false;
        if (req && !val) {
            x = true;
        } else {
            switch (type) {
                case "date" :
                    formatedDate = moment(val, 'DD/MM/YYYY');
                    if (val && !formatedDate.isValid()) {
                        x = true;
                    }
                    break;
                default:
                    //
                    break;
            }
        }

        return x;

    }

};