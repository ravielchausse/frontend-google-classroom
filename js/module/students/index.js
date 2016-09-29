
$.students_register = function (me) {

    me.pars = $.extend(true, {
        model: $model.student,
        properties: {
        },
        element: null,
        studentForm: null,
        studentSearch: null
    }, me.pars);

    me.construct = function (obj) {

        me.setElement(me, obj.element);
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

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
            instance.init().setElement(instance, "#students_register").showPage(instance).update(instance);
        }

        switch (action) {
            case 'store':
            case 'edit':
            case 'update':
                instance.updateStudentForm();
                if (attr) {
                    var studentForm  = instance.pars.studentForm;

                    studentForm.pars.properties.studentId = attr;

                    studentForm.init().get(attr)
                        .showPage(instance)
                        .update(instance);
                }

                break;

            case 'search':
                instance.updateStudentSearch();
                break;
        }

    };

    me.updateStudentForm = function () {
        var instance = me.pars.studentForm;
        instance = (instance) ? instance: $factory.createInstance("students_form", "students_form", {}, me);
        me.pars.studentForm = instance;
        instance.setElement(instance, "#studentForm")
            .init()
            .update(instance)
            .updatePersonData();

        return me;
    };

    me.updateStudentSearch = function () {
        var instance = me.pars.studentSearch;
        instance = (instance) ? instance : $factory.createInstance("students_search", "students_search", {}, me);
        me.pars.studentSearch = instance;
        instance.setElement(instance, "#studentSearch").update(instance).init();
        return me;
    };

    return me;

};



