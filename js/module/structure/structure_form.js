$.structure_form = function(me) {

    me.pars = $.extend(true, {
        model: $model.structure,
        properties: {
            structureId: null,
            structureTypeId: null,
            structureName: null,
            structureSquareMeters: null,
            structureNumberPeople: null,
            structureDescription: null,
            postData: {},
            activeTab: 1,
            listMode: true,
            disabledTab: {
                structure: false,
                patrimony: true,
                accessibility: true
            }
        },
        element: null

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
        pars.saveStructure.evt("click", function () {
            me.getValues().persistStructure();
        });
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
        $.extend(true, me.pars.properties.postData, values);

        return me;
    };

    me.persistStructure = function () {
        var data = me.pars.properties.postData;
        data.schoolId = me.pars.properties.schoolId;

        if (me.pars.properties.structureId) {
            data.structureId = me.pars.properties.structureId;
        }

        me.pars.model.post(data, function (id) {
            $routes.changeRoute(["module", "structure", "update", id]);
            $.msg("Estrutura salva com sucesso!","success");
        });
    }

    me.get = function(id) {

        me.pars.model.get({id:id}, function(ret) {
            me.pars.properties.structureId           = ret.structureId;
            me.pars.properties.structureTypeId       = ret.structureTypeId;
            me.pars.properties.structureName         = ret.structureName;
            me.pars.properties.structureSquareMeters = ret.structureSquareMeters;
            me.pars.properties.structureNumberPeople = ret.structureNumberPeople;
            me.pars.properties.structureDescription  = ret.structureDescription;
            me.update(me);
        });

        return me;
    };

    return me;

};