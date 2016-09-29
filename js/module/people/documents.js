/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.documents = function(me) {

    me.pars = $.extend(true, {
        properties: {
            individualId:null,
            ufList:$factory.lookup.states,
            birthCertificate:{
                annexId:null,
                bicDocumentTypeId:1,
                bicDocumentPeopleId:null,
                bicDocumentId:null,
                peopleId:null,
                numberRegistration:null, //Matricula varchar 32
                numberTerm:null,
                page:null,
                book:null,
                emissionDate:null,
                registry:null,
                ufRegistry:null,
                disableCityRegistry:"disabled",
                cityRegistryList:[],
                cityRegistry:null,
                annexes:[]
            },
            overallRecord: { //identidade
                annexId:null,
                ovrDocumentTypeId:3,
                ovrDocumentPeopleId:null,
                ovrDocumentId:null,
                peopleId:null,
                ovrNumber:null,
                complement:null,
                ufIdentity:null,
                emissionOrgan:null,
                emissionDate:null,
                annexes: []
            },
            driverLicense:{
                annexId:null,
                driDocumentTypeId:4,
                driDocumentPeopleId:null,
                driDocumentId:null,
                peopleId:null,
                number:null,
                category:null,
                validityDate:null,
                firstEnableDate:null,
                annexes:[]
            },
            postData:{}
        },
        element: ""
    }, me.pars);

    me.construct = function (obj) {
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr,obj.attrs[i].val);
            }
        }
    };

    me.getValues = function () {
        var values = {}, formatedDate = null, docName;
        $(me.pars.element).find("[data-doc]").each(function () {
            docName = $(this).data("doc");
            values[docName] = {};
            $(this).find("[data-bind]").each(function () {

                values[docName][$(this).data("bind")] = $(this).val();

                $(this).removeClass("invalid");
                if ($factory.validation($(this).val(), $(this).data("type"), $(this).attr("required"))) {
                    $(this).addClass("invalid");
                }
            });
        });

        values.birthCertificate.peopleId = me.pars.properties.birthCertificate.peopleId;  //relacional documento x pessoa
        values.birthCertificate.bicDocumentTypeId = me.pars.properties.birthCertificate.bicDocumentTypeId; //identificador do tipo de documento
        values.birthCertificate.bicDocumentPeopleId = me.pars.properties.birthCertificate.bicDocumentPeopleId; //identificador do tipo de documento
        values.birthCertificate.bicDocumentId = me.pars.properties.birthCertificate.bicDocumentId; // id do registro para edição
        values.birthCertificate.emissionDate = me.pars.properties.functions.formatDate(values.birthCertificate.emissionDate,'DD/MM/YYYY','YYYY-MM-DD');


        values.overallRecord.peopleId = me.pars.properties.overallRecord.peopleId;
        values.overallRecord.ovrDocumentTypeId = me.pars.properties.overallRecord.ovrDocumentTypeId;
        values.overallRecord.ovrDocumentPeopleId = me.pars.properties.overallRecord.ovrDocumentPeopleId;
        values.overallRecord.ovrDocumentId = me.pars.properties.overallRecord.ovrDocumentId;
        values.overallRecord.emissionDate = me.pars.properties.functions.formatDate(values.overallRecord.emissionDate,'DD/MM/YYYY','YYYY-MM-DD');

        values.driverLicense.peopleId = me.pars.properties.driverLicense.peopleId;
        values.driverLicense.driDocumentTypeId = me.pars.properties.driverLicense.driDocumentTypeId;
        values.driverLicense.driDocumentPeopleId = me.pars.properties.driverLicense.driDocumentPeopleId;
        values.driverLicense.driDocumentId = me.pars.properties.driverLicense.driDocumentId;
        values.driverLicense.firstEnableDate = me.pars.properties.functions.formatDate(values.driverLicense.firstEnableDate,'DD/MM/YYYY','YYYY-MM-DD');
        values.driverLicense.validityDate = me.pars.properties.functions.formatDate(values.driverLicense.validityDate,'DD/MM/YYYY','YYYY-MM-DD');

        $.extend(true,me.pars.properties.postData,values);
        $.extend(true,me.pars.properties,values);

        return me;
    };

    me.init = function(obj) {
        me.call = obj.call;
        if (obj.peopleId) {
            me.setPeopleId(obj.peopleId);
        }
        return me;
    };

    me.setPeopleId = function(id) {
        me.pars.properties.birthCertificate.peopleId = id;
        me.pars.properties.overallRecord.peopleId = id;
        me.pars.properties.driverLicense.peopleId = id;
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

    me.context = function (pars) {
        pars.ufRegistry.evt("change", function () {
            var uf = $(this).val(), idUf;
            idUf = me.pars.properties.ufList.filter(function(f){
                return f.name == uf;
            })[0].id;
            me.getValues().loadCityRegistryList(idUf,me.update);
        });

        pars.submit.evt("click",function(){
            me.getValues().submit();
        });

        pars.addBicAnnex.find('a').getFile(me.addAnnex);
        pars.addOvrAnnex.find('a').getFile(me.addAnnex);
        pars.addDriAnnex.find('a').getFile(me.addAnnex);
    };

    me.addAnnex = function(base64, el){
        me.getValues();
        var data = {},documentId,documentPeopleId,typeId,
            name = el.parent().find('input').val(),
            annexId, ext;


        switch (el.data("tpannex")) {
            case "birthCertificate" :
                documentId = me.pars.properties[el.data("tpannex")].bicDocumentId;
                documentPeopleId = me.pars.properties[el.data("tpannex")].bicDocumentPeopleId;
                typeId = me.pars.properties[el.data("tpannex")].bicDocumentTypeId;
                annexId = me.pars.properties[el.data("tpannex")].annexId;
                break;
            case "overallRecord":
                documentId = me.pars.properties[el.data("tpannex")].ovrDocumentId;
                documentPeopleId = me.pars.properties[el.data("tpannex")].ovrDocumentPeopleId;
                typeId = me.pars.properties[el.data("tpannex")].ovrDocumentTypeId;
                annexId = me.pars.properties[el.data("tpannex")].annexId;
                break;
            case "driverLicense":
                documentId = me.pars.properties[el.data("tpannex")].driDocumentId;
                documentPeopleId = me.pars.properties[el.data("tpannex")].driDocumentPeopleId;
                typeId = me.pars.properties[el.data("tpannex")].driDocumentTypeId;
                annexId = me.pars.properties[el.data("tpannex")].annexId;
                break;
        }

        ext = base64.split(";")[0].split(":")[1].split("/")[0];

        data = {
            base64: base64
            , annexItemName: name
            , documentId: documentId
            , peopleId: documentPeopleId
            , typeId: typeId
            , annexId: annexId
        }

        if(ext == "image"){
            $.processingImage(base64, function(base64){
                data["base64"] = base64;
                $model.people.annexDocuments.post(data,function(ret){
                    $factory.execute("annex").loadData(ret.annexes).update($factory.execute("annex"));
                    el.parent().find('input').val(null);
                    me.submit();
                    me.update(me);
                });
            }, {
                ratio: false
            });
        }else{
            $model.people.annexDocuments.post(data,function(ret){
                $factory.execute("annex").loadData(ret.annexes).update($factory.execute("annex"));
                el.parent().find('input').val(null);
                me.submit();
                me.update(me);
            });

        }


    };

    me.loadCityRegistryList = function(id,call) {
        $model.getCities(id, function (data) {
            me.pars.properties.birthCertificate.cityRegistryList = data;
            me.pars.properties.birthCertificate.disableCityRegistry = "";
            call(me);
        });
    };

    /**
     * @description Recebe os dados para edição de um registro, sobrescreve me.pars.properties e monta o html preenchido
     * @param Json obj Equivalente ao properties
     *
     */
    me.loadData = function (obj,call) {
        if (obj.birthCertificate && Object.keys(obj.birthCertificate).length > 0 && obj.birthCertificate.ufRegistry) {
            var ufRegistry = me.pars.properties.ufList.filter(function(f){
                return f.name == obj.birthCertificate.ufRegistry;
            })[0].id;
            me.loadCityRegistryList(ufRegistry,me.update);
        }

        // $.extend(true, me.pars.properties, obj);

        me.pars.properties.birthCertificate = obj.birthCertificate;
        me.pars.properties.overallRecord    = obj.overallRecord;
        me.pars.properties.driverLicense    = obj.driverLicense;

        if (typeof call === 'function') {
            call();
        }
    };

    me.submit = function() {
        var sel = $(me.pars.element).find(".invalid");

        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
            me.call(me.pars.properties.postData);
        }
    };

    return me;
};
