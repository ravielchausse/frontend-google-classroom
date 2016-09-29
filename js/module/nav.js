$.nav = function (me) {

    me.pars = $.extend(true, {
        instances: [],
        navList: [],
        properties: {
        },
        element: null
    }, me.pars);

    me.construct = function (obj) {
        me.setElement(obj.element);
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

    /**
     * @description Altera em tempo de execução qualquer propriedade do módulo
     * @param String elem Nome do atributo
     * @param Any val Valor para o atributo
     *
     */
    me.setProperty = function (elem, val) {
        me.pars.properties[elem] = val;
    };

    me.setElement = function (sel) {
        me.pars.element = sel;
    };

    me.init = function (modules) {
        me.pars.instances = modules;

        me.pars.navList = [
            {
                name: "start",
                hash: "#module/start",
                icon: "&#xE034"
            },
            {
                name: "students",
                icon: "&#xE02A",
                nav: [
                    {
                        name: "store",
                        hash: "#module/students_register/store"
                    },
                    {
                        name: "search",
                        hash: "#module/students_register/search"
                    },
                    {
                        name: "transfer",
                        hash: "#module/students_register/transfer"
                    }
                ]
            },
            {
                name: "class",
                icon: "&#xE02C",
                nav: [
                    {
                        name: "include",
                        hash: "#module/class/include"
                    },
                    {
                        name:"daily",
                        hash:"#module/dailyTeachers/search",
                        icon:""
                    }
                ]
            },{
                name: "humanResources",
                icon: "&#xE02B",
                nav:[
                    {
                        name: "include",
                        hash: "#module/human_resource/store/"
                    },
                    {
                        name: "search",
                        hash: "#module/human_resource/search/"
                    }
                ]

            },{
                name: "structure",
                icon: "&#xE03C",
                nav:[
                    {
                        name: "include",
                        hash: "#module/structure/store/"
                    },
                    {
                        name: "search",
                        hash: "#module/structure/search"
                    }
                ]

            },
            {
                name: "curricularBases",
                icon: "&#xE038",
                hash: "#module/curricularBases"
            },
            {
                name: "config",
                icon: "&#xE02D",
                hash: "#module/configSystem"
            }
        ];

        me.update();
    };

    me.update = function () {
        var context, element;
        me.pars.properties.dic = me.pars.dic;
        context = me.template(me.pars);
        element = $factory.renderModule(me.pars.element, context);
        $.getContext(element, me.context);

    };

    me.context = function (pars) {
        pars.menu.find(".item").evt("click", me.menuItemClick);
    };

    me.menuItemClick = function () {
        $(this).parent().toggleClass("open");
    };

    return me;
};

