$.employees_list = function(me) {

    me.pars = $.extend(true, {
        properties: {
            employees: [],
            page: null,
            numberPages: null,
            asSubMod:null,
            search:{
                name: '',
                email: '',
                enrollment: '',
                numberRegistration: ''
            }
        },
        element: null,
        model:$model.humanResource

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
        me.updateEmployedList();
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
        //previnir tecla enter
        pars.searchEmployed.evt("keydown", me.searchEmployed);

        //submit da busca através do botão
        pars.searchEmployedSubmit.evt("click", function(){
            me.updateEmployedList();
        });

        //ao clicar em algum funcionário
        if (pars.alterEmployees) {

            pars.alterEmployees.find(".cell.name").evt("click", function (e) {
                var item = me.pars.properties.employees[$(this).data('idx')];
                me.next(item);

            });

        }

        //paginação
        if (pars.goToPage) {

            pars.goToPage.find(".paginator-link").not("disabled").evt("click", function (e) {
                if (!$(this).hasClass('disabled')) {
                    me.updateEmployedList($(this).data('page'));
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

        if (pars.backSubMod) {
            pars.backSubMod.evt('click',function(){
                me.cancel();
            });
        }

    };


    /**
     * @description Responsável por adicionar ou remover a classe .invalid
     * e retorna os valores que devem ser persistidos no banco
     *
     */
    me.getValues = function (from,to) {
        var values = {}, formatedDate = null;
        $(from).find("[data-bind]").each(function () {
            values[$(this).data("bind")] = $(this).val();
            $(this).removeClass("invalid");

            if ($factory.validation($(this).val(), $(this).data("type"), $(this).attr("required"))) {
                $(this).addClass("invalid");
            }
        });

        $.extend(true, to, values);

        return me;
    };

    me.updateEmployedList = function(skip) {

        me.getValues('#formSearchEmployees',me.pars.properties.search);

        var req = {
            name: me.pars.properties.search.name,
            email: me.pars.properties.search.email,
            enrollment: me.pars.properties.search.enrollment,
            numberRegistration: me.pars.properties.search.numberRegistration,
            enrollmentRequired:me.pars.properties.asSubMod
        };

        if (skip) {
            req.skip = skip;
        }

        me.pars.model.search(req, function(ret) {
            me.pars.properties.page = (ret.page) + 1;
            me.pars.properties.numberPages = ret.numberPages;

            _.map(ret.employees, function(num, key){
                if (num.peopleId) {
                    me.pars.properties.employees[key] = num;
                    if(!me.pars.properties.employees[key].numberRegistration) {
                        me.pars.properties.employees[key].numberRegistration = '000.000.000-00';
                    }
                }

            });

            me.update(me);
        });
    }

    me.searchEmployed = function (e) {
        if (e.keyCode === 13) {
            me.updateEmployedList();
            e.preventDefault();
        }
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

        me.updateEmployedList(val - 1);
    };

    return me;

};