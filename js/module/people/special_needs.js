/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.special_needs = function (me) {

    me.pars = $.extend(true, {
        properties: {
//            functions:{
//                formatDate:$.formatDate
//            },
            postData:{},
            listMode:true,
            individualId:null,
            typeId: null,
            typeCode:null,
            type:null,
            specialNecessityId:null,
            specialNecessityIndividualId:null,
            needList: $factory.lookup.specialNecessity,
            educationalSupport: null,
            educationalSupportList: [
                {id: 1, name: "Com Apoio Pedagógico"},
                {id: 0, name: "Sem Apoio Pedagógico"}
            ],
            diagnosisTypeId: null,
            diagnosisTypeList: $factory.lookup.diagnostic,
            emissionDate: null,
            specialneeds: []
        },
        element: null
    }, me.pars);

    me.construct = function (obj) {
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr,obj.attrs[i].val);
            }
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

        values.individualId = me.pars.properties.individualId;
        values.specialNecessityId = me.pars.properties.specialNecessityId;
        values.specialNecessityIndividualId = me.pars.properties.specialNecessityIndividualId;

        values.emissionDate = me.pars.properties.functions.formatDate(values.emissionDate,'DD/MM/YYYY','YYYY-MM-DD');

        $.extend(me.pars.properties,values);
        $.extend(me.pars.properties.postData,values);

        return me;
    };

    /**
     * @description Grava a função que será executada no submit e chama o update de tela
     * @param json obj {call:call}
     *
     */
    me.init = function (obj) {
        me.call = obj.call;

        //não vou fazer isso pq esse módulo nunca é carregado sozinho, ele é instanciado pelo estudante
        /*
        $model.people.specialNeeds.get({id:me.pars.properties.studentId},function(ret){
            me.pars.properties.specialneeds = ret;
        });
        */

        return me;
    };

    /**
     * @description Método Padrão que adiciona os listener de eventos no html
     * @param data-bind pars
     *
     */
    me.context = function (pars) {
        if (pars.alterSpecialneed) {
            pars.alterSpecialneed.find(".cell.need").evt("click", me.loadSpecialneedToUpdate);
            pars.alterSpecialneed.find(".cell.remove").evt("click", me.deleteSpecialneed);
        }
        pars.cadSpecialNeed.evt("click", function(){
            me.pars.properties.listMode = false;
            me.update(me);
        });
        pars.cancel.evt("click", me.cancelSpecialneedUpdate);
        pars.submit.evt("click", function(){
            me.getValues().submit();
        });
    };

    /**
     * @description Altera em tempo de execução qualquer propriedade do módulo
     * @param String elem Nome do atributo
     * @param Any val Valor para o atributo
     *
     */
    me.setProperty = function (elem,val) {
        me.pars.properties[elem] = val;
    };

    /**
     * @description Recebe os dados para edição de um registro, sobrescreve me.pars.properties e monta o html preenchido
     * @param Json obj Equivalente ao properties
     *
     */
    me.loadData = function (obj) {
        me.pars.properties.specialneeds = obj;
        return me;
    };

    me.deleteSpecialneed = function(id) {
        var data = {id: $(this).data("id")};

        $.alert({
            title: "Atenção",
            msg: "Confirma a remoção desta necessidade?",
            option1: {
                label: "Sim",
                call: function (element) {
                    $model.people.specialNeeds.delete(data, function (ret) {
                        if (ret) {
                            me.pars.properties.specialneeds.splice(me.pars.properties.specialneeds.map(function (el) {
                                return el.specialNecessityId;
                            }).indexOf(data.id), 1);

                            me.update(me);
                        }
                    });
                    element.remove();
                }
            },
            option2: {
                label: "Não",
                call: function(element) {
                    element.remove();
                }
            }
        });

    };

    me.loadSpecialneedToUpdate = function () {
        var need, valor;
        valor = $(this).data("id");
        need = me.pars.properties.specialneeds.filter(function (f) {
            return f.specialNecessityId === valor;
        })[0];

        me.pars.properties.listMode = false;
        me.pars.properties.typeId = need.typeId;
        me.pars.properties.specialNecessityId = need.specialNecessityId;
        me.pars.properties.educationalSupport = need.educationalSupport;
        me.pars.properties.diagnosisTypeId = need.diagnosisTypeId;
        me.pars.properties.emissionDate = need.emissionDate;
        me.pars.properties.individualId = need.individualId;
        me.update(me);

    };

    me.cancelSpecialneedUpdate = function () {
        me.pars.properties.listMode = true;
        me.pars.properties.typeId = null;
        me.pars.properties.specialNecessityId = null;
        me.pars.properties.educationalSupport = null;
        me.pars.properties.diagnosisTypeId = null;
        me.pars.properties.emissionDate = null;
        me.pars.properties.individualId = null;
        me.update(me);
    };

    me.submit = function () {
        var sel = $(me.pars.element).find(".invalid");
        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
            $model.people.specialNeeds.post(me.pars.properties.postData,function(ret){
                me.pars.properties.specialneeds = ret;
                me.pars.properties.listMode = true;
                me.update(me);
            });

        }
    };

    return me;

};