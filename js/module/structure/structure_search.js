$.structure_search = function(me) {

    me.pars = $.extend(true, {
        properties: {
            name: '',
            structures: null,
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
        me.updateStructureList();
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
        pars.searchStructure.evt("keydown", me.searchStructure);
        pars.searchStructureSubmit.evt("click", me.searchStructureSubmit);

        if (pars.alterStructure) {
            pars.alterStructure.find(".name").evt("click", function () {
                $routes.changeRoute(["module", "structure", "update", $(this).data("idx")]);
            });

        }

        if (pars.goToPage) {

            pars.goToPage.find(".paginator-link").not("disabled").evt("click", function (e) {
                if (!$(this).hasClass('disabled')) {
                    me.updateStructureList($(this).data('page'));
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

    me.updateStructureList = function(skip) {
        me.getValues();

        var req = {
            id: me.pars.properties.schoolId,
            name: me.pars.properties.name,
            typeId: me.pars.properties.structureTypeId
        };

        if (skip) {
            req.skip = skip;
        }

        me.pars.model.search(req, function(ret) {
            me.pars.properties.page = (ret.page) + 1;
            me.pars.properties.numberPages = ret.numberPages;
            me.pars.properties.structures = ret.structures;
            me.pars.properties.structureType = me.pars.properties.structureType
            me.update(me);
        });
    }

    me.searchStructure = function (e) {
        if (e.keyCode === 13) {
            me.updateStructureList();
            e.preventDefault();
        }
    };

    me.searchStructureSubmit  = function() {
        me.updateStructureList();
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

        me.updateStructureList(val - 1);
    };

    return me;

};