$.students_search = function(me) {

    me.pars = $.extend(true, {
        properties: {
            name: '',
            email: '',
            enrollment: '',
            numberRegistration: '',
            students: [],
            page: null,
            numberPages: null
        },
        element: null,

    }, me.pars);


    /**
     * @description Método construtor
     * @param  Object obj
     */
    me.construct = function (obj) {

        me.setElement(me, obj.element);
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

    /**
     * @description Método para carga inicial do objeto
     * @return me
     */
    me.init = function () {
        me.updateStudentList();
        return me;
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

    /**
     * @description Método para vinculo dos events listener's
     * @param  pars
     */
    me.context = function (pars) {
        pars.searchStudent.evt("keydown", me.searchStudent);
        pars.searchStudentSubmit.evt("click", me.searchStudentSubmit);

        if (pars.alterStudent) {

            pars.alterStudent.find(".cell.name").evt("click", function (e) {
                $routes.changeRoute(["module", "students_register", "update", $(this).data("idx")]);
            });

        }

        if (pars.searchStudent) {

            pars.searchStudent.find(".inner input").evt("keydown", me.searchStudent);

        }

        if (pars.goToPage) {

            pars.goToPage.find(".paginator-link").not("disabled").evt("click", function (e) {
                if (!$(this).hasClass('disabled')) {
                    me.updateStudentList($(this).data('page'));
                }
            });

            pars.goToPage.find(".paginator-input")
                .evt("keydown", function(e) {

                    if (e.keyCode === 13) {
                        e.preventDefault();
                        me.updatePaginatorInput($(this));
                    }
                })
                .evt("change", function (e) {
                    e.preventDefault();
                    me.updatePaginatorInput($(this));
                }
            );
        }


    };


    /**
     * @description Responsável por adicionar ou remover a classe .invalid
     * e retorna os valores que devem ser persistidos no banco
     *
     */
    me.getValues = function () {
        var values = {}, formatedDate = null;
        $(me.pars.element).find("[data-bind]").each(function () {
            values[$(this).data("bind")] = $(this).val();
            $(this).removeClass("invalid");

            if ($factory.validation($(this).val(), $(this).data("type"), $(this).attr("required"))) {
                $(this).addClass("invalid");
            }
        });

        $.extend(true, me.pars.properties, values);

        return me;
    };

    me.updateStudentList = function(skip) {
        me.getValues();

        var req = {
            name: me.pars.properties.name,
            email: me.pars.properties.email,
            enrollment: me.pars.properties.enrollment,
            numberRegistration: me.pars.properties.numberRegistration
        };

        if (skip) {
            req.skip = skip;
        }

        me.pars.model.search(req, function(ret) {
            me.pars.properties.page = (ret.page) + 1;
            me.pars.properties.numberPages = ret.numberPages;
            me.pars.properties.students = [];

            _.map(ret.students, function(num, key){
                if (num.peopleId) {
                    me.pars.properties.students[key] = num;
                    if(!me.pars.properties.students[key].numberRegistration) {
                        me.pars.properties.students[key].numberRegistration = '000.000.000-00';
                    }
                }

            });

            me.update(me);
        });
    }

    me.searchStudent = function (e) {
        if (e.keyCode === 13) {
            me.updateStudentList();
            e.preventDefault();
        }
    };

    me.searchStudentSubmit  = function() {
        me.updateStudentList();
    };

    me.updatePaginatorInput = function(element) {
        var $this = element
            , val = parseInt($this.val(), 10)
            , max = parseInt($this.attr('max'), 10)
            ;

        if (val > max) {
            val = max;
            $this.val(max);
        }

        me.updateStudentList(val - 1);
    };

    return me;

};