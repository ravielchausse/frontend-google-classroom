
$.person_data = function (me) {

    me.pars = $.extend(true, {
        properties: {
            genderList: $factory.lookup.genders,
            maritalStatusList: $factory.lookup.maritalStatus,
            ufList: $factory.lookup.states,
            disabledAddressCity: "disabled",
            cityAddressList: [],
            zoneList: $factory.lookup.zones,
            disabledNaturalnessCities: "disabled",
            cityNaturalnessList: [],
            studentId: null,
            postData: {},
            peopleId: null,
            name: null,
            maritalStatusId: null,
            stateId: null,
            birth: null,
            individualId: null,
            genderId: null,
            father: null,
            mother: null,
            streetId: null,
            street: null,
            number: null,
            complement: null,
            reference: null,
            neighborhood: null,
            zoneId: null,
            zipcode: null,
            phoneId: null,
            phonePeople: null,
            phone: null,
            cellPhoneId: null,
            cellPhonePeople: null,
            cellPhone: null,
            cityId: null,
            emailId: null,
            emailPeople: null,
            email: null,
            nationality: null,
            naturalnessId: null,
            naturalnessStateId: null,
            profession: null,
            inrDocumentId: null, //cpf
            inrDocumentTypeId: 2, //cpf
            inrDocumentPeopleId: null, //cpf
            numberRegistration: null, //cpf
            inep: null,
            nis: null,
            schoolbus: 1
        },
        element: ""
    }, me.pars);

    me.construct = function (obj) {
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

    me.init = function (obj) {
        return me;
    };

    /**
     * @description Recebe os dados para edição de um registro, sobrescreve me.pars.properties e monta o html preenchido
     * @param Json obj Equivalente ao properties
     * 
     */
    me.loadData = function (obj) {
        me.loadCitiesAddress(obj.stateId, me.update);
        me.loadCitiesNaturalness(obj.naturalnessStateId, me.update);
        $.extend(true, me.pars.properties, obj);
        return me;
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

        values.studentId = me.pars.properties.studentId;
        values.peopleId = me.pars.properties.peopleId;
        values.individualId = me.pars.properties.individualId;
        values.phoneId = me.pars.properties.phoneId;
        values.phonePeople = me.pars.properties.phonePeople;
        values.cellPhoneId = me.pars.properties.cellPhoneId;
        values.cellPhonePeople = me.pars.properties.cellPhonePeople;
        values.emailId = me.pars.properties.emailId;
        values.emailPeople = me.pars.properties.emailPeople;
        values.streetId = me.pars.properties.streetId;

        values.inrDocumentId = me.pars.properties.inrDocumentId;
        values.inrDocumentTypeId = me.pars.properties.inrDocumentTypeId;
        values.inrDocumentPeopleId = me.pars.properties.inrDocumentPeopleId;
        values.birth = me.pars.properties.functions.formatDate(values.birth,'DD/MM/YYYY','YYYY-MM-DD');

        $.extend(true, me.pars.properties.postData, values);
        $.extend(true, me.pars.properties, values);

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
     * @description Método Padrão que adiciona os listener de eventos no html
     * @param data-bind pars 
     * 
     */
    me.context = function (pars) {

        pars.uf.evt("change", function (e) {
            me.getValues().loadCitiesAddress(parseInt(e.target.value), me.update);
        });

        pars.naturalnessuf.evt("change", function (e) {
            me.getValues().loadCitiesNaturalness(parseInt(e.target.value), me.update);
        });

        pars.submit.evt("click", function (e) {
            me.getValues().submit();
        });
        
        if (!me.pars.properties.studentId) {
            pars.searchPeople.autocomplete({
                source: function (request, response) {
                    var term = request.term;

                    $model.people.personData.search({name: term}, function (ret) {
                        response(ret);
                    });

                },
                focus: function (event, ui) {
                    pars.searchPeople.val(ui.item.peo_name);
                    return false;
                },
                select: function (event, ui) {
                    pars.searchPeople.val(ui.item.peo_name);
                    $model.people.individual.get({id: ui.item.ind_id}, function(ret){
                        me.loadSearchPeople(ret,me);
                    });
                    return false;
                }
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                        .append("<a>" + item.peo_name + "</a>")
                        .appendTo(ul);
            };        
        }

    };

    /**
     * 
     * @description Método Específico para carregar as cidades de um determinado estado para preenchimento do Endereço
     * 
     */
    me.loadCitiesAddress = function (id, call) {
        $model.getCities(id, function (data) {
            me.pars.properties.cityAddressList = data;
            me.pars.properties.disabledAddressCity = "";
            if (call) {
                call(me);
            }
        });
    };

    /**
     * 
     * @description Método Específico para carregar as cidades de um determinado estado para preenchimento da Cidade Natal
     * 
     */
    me.loadCitiesNaturalness = function (id, call) {
        $model.getCities(id, function (data) {
            me.pars.properties.cityNaturalnessList = data;
            me.pars.properties.disabledNaturalnessCities = "";
            if (call) {
                call(me);
            }
        });
    };

    me.setCallback = function (call) {
        if (call && typeof call === 'function') {
            me.call = call;
        }
        return me;
    };

    /**
     * 
     * @description Responsável por submeter os dados preenchidos no form para serem persistidos no banco
     * 
     */
    me.submit = function () {
        var sel = $(me.pars.element).find(".invalid");
        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
//            me.persistStudent(me.pars.properties.postData);
            me.call(me.pars.properties.postData);
        }

    };

    return me;

};
