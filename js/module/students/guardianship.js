/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.guardianship = function (me) {

    me.pars = $.extend(true, {
        properties: {
            _bkp: false, //utilizo o bkp para checar se existe alguma alguma alteração não persistida no banco
            postData: {}, // dados que seguirão no submit()
            listMode: true,
            peopleId: null,
            name: null,
            genderList: $factory.lookup.genders,
            maritalStatusList: $factory.lookup.maritalStatus,
            maritalStatusId: null,
            ufList: $factory.lookup.states,
            stateId: null,
            disabledAddressCity: "disabled",
            cityAddressList: [],
            birth: null,
            genderId: null,
            mother: null,
            streetId: null,
            street: null,
            number: null,
            neighborhood: null,
            phoneId: null,
            phonePeople: null,
            phone: null,
            cellPhoneId: null,
            cellPeople: null,
            cellPhone: null,
            cityId: null,
            emailId: null,
            emailPeople: null,
            email: null,
            studentId: null,
            responsableId: null,
            responsableType: null,
            responsableTypeId: null,
            individualId: null,
            guardianshipTypeList: $factory.lookup.responsibles,
            ovrDocumentTypeId: 3,
            ovrDocumentPeopleId: null,
            ovrDocumentId: null,
            ovrNumber: null,
            inrDocumentId: null, //cpf
            inrDocumentTypeId: 2, //cpf
            inrDocumentPeopleId: null, //cpf
            numberRegistration: null, //cpf
            guardianships: null,
            sameStudentAddress: false
        },
        element: null
    }, me.pars);

    me.construct = function (obj) {
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

    /**
     * @description Grava a função que será executada no submit e chama o update de tela
     * @param json obj {call:call}
     *
     */
    me.init = function (obj) {
        return me;
    };

    me.loadSearchPeople = function (ret) {
        var studentId = me.pars.properties.studentId;
        me.getValues();

        if (ret)
            me.pars.properties._bkp = ret.individual;

        me.pars.properties._bkp.studentId = studentId;

        $.extend(me.pars.properties, me.pars.properties._bkp);

        me.pars.properties.studentId = studentId;

        me.loadCitiesAddress(me.pars.properties.stateId, me.update);
    };

    /**
     * @description Método Padrão que adiciona os listener de eventos no html
     * @param data-bind pars
     *
     */
    me.context = function (pars) {
        pars.cadGuardianship.evt("click", me.cadGuardianship);

        pars.cancel.evt("click", me.cancel);
        if (pars.alterGuardianship) {

            pars.alterGuardianship.find(".cell.name").evt("click", function (e) {

                me.pars.properties._bkp = me.pars.properties.guardianships[$(this).data("idx")];

                me.pars.properties.listMode = false;

                me.loadSearchPeople();

            });

            pars.alterGuardianship.find(".cell.remove").evt("click", me.deleteGuardianship);
        }

        pars.submit.evt("click", me.submit);

        pars.uf.evt("change", me.updateCities);

        pars.searchGuardianship.autocomplete({
            source: function (request, response) {
                var term = request.term;

                $model.people.personData.search({name: term}, function (ret) {
                    response(ret);
                });

            },
            focus: function (event, ui) {
                pars.searchGuardianship.val(ui.item.peo_name);
                return false;
            },
            select: function (event, ui) {
                pars.searchGuardianship.val(ui.item.peo_name);
                $model.people.individual.get({id: ui.item.ind_id}, me.loadSearchPeople);
                return false;
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                    .append("<a>" + item.peo_name + "</a>")
                    .appendTo(ul);
        };

        if (pars.getResponsableNameByTypeId) {
            pars.getResponsableNameByTypeId.evt('change', function() {
                var $this        = $(this)
                    , val        = parseInt($this.val())
                    , personData = $factory.execute('student_data')
                    ;

                me.pars.properties.responsableTypeId = val;

                switch (val) {
                    case 1:
                        me.pars.properties.name = personData.pars.properties.father;
                        break;

                    case 2:
                        me.pars.properties.name = personData.pars.properties.mother;
                        break;

                    default:
                        me.pars.properties.name = null;
                        break;
                }

                me.update(me)
            });
        }

        if (pars.getAddressFromStudent) {
            pars.getAddressFromStudent.evt("click", function() {
                var $this        = $(this)
                    , personData = $factory.execute('student_data')
                    , p      = me.pars.properties
                    ;

                me.pars.properties.sameStudentAddress = !me.pars.properties.sameStudentAddress;

                if (me.pars.properties.sameStudentAddress) {

                    me.pars.properties.stateId      = personData.pars.properties.stateId;
                    me.pars.properties.street       = personData.pars.properties.street;
                    me.pars.properties.number       = personData.pars.properties.number;
                    me.pars.properties.neighborhood = personData.pars.properties.neighborhood;
                    me.pars.properties.phone        = personData.pars.properties.phone;

                    me.loadCitiesAddress(me.pars.properties.stateId, function(me) {
                        me.pars.properties.cityId = personData.pars.properties.cityId;
                        me.update(me);

                    });
                }
                else {
                    me.pars.properties.stateId         = null;
                    me.pars.properties.street          = null;
                    me.pars.properties.number          = null;
                    me.pars.properties.neighborhood    = null;
                    me.pars.properties.phone           = null;
                    me.pars.properties.cityAddressList = [];
                    me.pars.properties.cityId          = null;

                    me.update(me);

                }


            });
        }

    };

    me.updateCities = function (id, call) {
        var values = me.getValues(), vl = $(this).val();
        $.extend(me.pars.properties, values);
        me.loadCitiesAddress(parseInt(vl), me.update);

    };

    /**
     *
     * @description Método Específico para carregar as cidades de um determinado estado para preenchimento do Endereço
     *
     */
    me.loadCitiesAddress = function (id, call) {
        $model.getCities(id, function (data) {
            me.pars.properties.cityAddressList = data;
            me.pars.properties.stateId = parseInt(id);
            me.pars.properties.disabledAddressCity = "";
            if (call) {
                call(me);
            }
        });
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
        values.phone = values['phone'].replace(/\D/g, '');
        values.cellPhone = values['cellPhone'].replace(/\D/g, '');
        values.streetId = me.pars.properties.streetId;
        values.peopleId = me.pars.properties.peopleId;
        values.emailId = me.pars.properties.emailId;
        values.emailPeople = me.pars.properties.emailPeople;
        values.phoneId = me.pars.properties.phoneId;
        values.phonePeople = me.pars.properties.phonePeople;
        values.cellPhoneId = me.pars.properties.cellPhoneId;
        values.cellPeople = me.pars.properties.cellPeople;
        values.rgId = me.pars.properties.rgId;
        values.rgIndividual = me.pars.properties.rgIndividual;
        values.cpfId = me.pars.properties.cpfId;
        values.cpfIndividual = me.pars.properties.cpfIndividual;
        values.studentId = me.pars.properties.studentId;
        values.responsableId = me.pars.properties.responsableId;
        values.individualId = me.pars.properties.individualId;
        values.birth = me.pars.properties.functions.formatDate(values.birth, 'DD/MM/YYYY', 'YYYY-MM-DD');

        $.extend(true, me.pars.properties, values);
        $.extend(true, me.pars.properties.postData, values);

        return me;
    };

    /**
     * @description Recebe os dados para edição de um registro, sobrescreve me.pars.properties e monta o html preenchido
     * @param Json obj Equivalente ao properties
     *
     */
    me.loadData = function (obj) {
        me.pars.properties.studentId = obj.studentId;
        me.pars.properties.guardianships = obj.responsibles;
        return me;
    };

    me.setGuardianships = function (arr) {
        var newInstance;
        newInstance = $factory.resetInstance(me);
        newInstance.pars.properties.guardianships = arr;
        newInstance.setElement(newInstance, "#guardianship_data").update(newInstance);
    };

    me.cadGuardianship = function () {
        me.pars.properties.listMode = !me.pars.properties.listMode;
        me.update(me);
    };

    me.deleteGuardianship = function () {
        var data = {id: $(this).data("id")};

        $.alert({
            title: "Atenção",
            msg: "Confirma a remoção deste responsável?",
            option1: {
                label: "Sim",
                call: function (element) {
                    $model.student.guardianship.remove(data, function (ret) {
                        if (ret) {
                            me.pars.properties.guardianships.splice(me.pars.properties.guardianships.map(function (el) {
                                return el.responsableId;
                            }).indexOf(data.id), 1);
                            me.update(me);
                        }
                    });
                    element.remove();
                }
            },
            option2: {
                label: "Não",
                call: function (element) {
                    element.remove();
                }
            }
        });

    };

    me.cancel = function () {
        var i, different = false, newInstance,
                guardianships = _.clone(me.pars.properties.guardianships),
                studentId = me.pars.properties.studentId;

        me.getValues();

        if (me.pars.properties._bkp) {
            for (i in me.pars.properties._bkp) {
                if ((me.pars.properties._bkp[i] || '') != (me.pars.properties[i] || '')) {
                    console.log('<>',i,me.pars.properties._bkp[i],me.pars.properties[i]);
                    different = true;
                }
            }

            if (different) {
                $.alert(
                        {
                            title: "Atenção!",
                            msg: "Algumas alterações não foram salvas.  Clique em Ok para descartar essas alterações.",
                            option1: {
                                label: "Ok",
                                call: function (element) {
                                    newInstance = $factory.resetInstance(me);
                                    newInstance.setElement(newInstance, "#guardianship_data");
                                    newInstance.pars.properties.studentId = studentId;
                                    newInstance.pars.properties.guardianships = guardianships;
                                    newInstance.update(newInstance);
                                    element.remove();
                                }
                            },
                            option2: {
                                label: "Cancelar",
                                call: function (element) {
                                    element.remove();
                                }
                            }
                        }
                );
            } else {
                newInstance = $factory.resetInstance(me);
                newInstance.setElement(newInstance, "#guardianship_data");
                newInstance.pars.properties.studentId = studentId;
                newInstance.pars.properties.guardianships = guardianships;
                newInstance.update(newInstance);
            }
        } else {
            me.pars.properties.listMode = !me.pars.properties.listMode;
            me.update(me);
        }

    };

    me.submit = function () {
        var sel = $(me.pars.element).find(".invalid");
        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
            me.getValues();
            $model.student.guardianship.post(me.pars.properties.postData, function (ret) {
                me.setGuardianships(ret);
            });

        }
    };

    return me;

};
