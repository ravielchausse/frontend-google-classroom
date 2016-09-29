$.structure = function(me) {

    me.pars = $.extend(true, {
        model: $model.structure,
        properties: {
            schoolId: 1,
            structureTypeId: null,
            structuresTypeList: $factory.lookup.structures
        },
        element: null,
        structureForm: null,
        structure_search: null

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

    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function (action, attr) {
        var instance = (attr) ? me : $factory.resetInstance(me);

        if (!attr) {
            instance.init().setElement(instance, "#structure").showPage(instance).update(instance);
        }

        switch(action) {
            case 'store':
            case 'update':
                instance.updateStructureForm();

                if (attr) {
                    var structureForm = instance.pars.structureForm;
                    structureForm.init().get(attr).showPage(instance).update(instance);
                }


                break;

            case 'search':
                instance.updateStructureSearch();
                break;
        }
    };


    me.updateStructureForm = function () {
        var instance = me.pars.structureForm;
        instance = (instance) ? instance : $factory.createInstance("structure_form", "structure_form", {}, me);
        me.pars.structureForm = instance;
        instance.setElement(instance, "#structureForm")
            .init()
            .update(instance);
        return me;
    };

    me.updateStructureSearch = function () {
        var instance = me.pars.structure_search;
        instance = (instance) ? instance : $factory.createInstance("structure_search", "structure_search", {}, me);
        me.pars.structure_search = instance;
        instance.setElement(instance, "#structureSearch").update(instance).init();

        return me;
    };

    return me;

};