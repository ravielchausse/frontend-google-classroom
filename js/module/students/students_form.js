
$.students_form = function (me) {

    me.pars = $.extend(true, {
        model: $model.student,
        person_data: null,
        guardianship_data: null,
        specialneeds_data: null,
        annex_data: null,
        properties: {
            action: null,
            studentId: null,
            peopleId:null,
            studentImageBase64: null,
            student_name: null,
            student_class: "502",
            progress: 35,
            activeTab: 1,
            disabledTab: {
                persondata: false,
                student_data: true,
                student_docs: true,
                student_anexo: true,
                student_accessibility: true
            }

        },
        element: ""
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

        //me.pars.properties.dic = me.pars.dic;

        //Dados Básicos do Indivíduo: 1ª aba
        me.pars.person_data = null;
        me.pars.person_data = $factory.createInstance("student_data", "person_data", {
            attrs: [
                //{attr: "element",val:"#persondata"}
            ]
        }, me);

        me.pars.person_data.setCallback(me.persistStudent);

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

    me.updatePersonData = function () {
        var instance = me.pars.person_data;
        instance.setElement(instance, "#persondata").update(instance);
    };

    me.persistStudent = function (data) {
        $model.student.personData.post(data, function (id) {

            $routes.changeRoute(["module", "students_register", "update", id]);

            $.alert({
                title: me.pars.dic.messages.personData.save.success.title,
                msg: me.pars.dic.messages.personData.save.success.msg,
                option1: {
                    label: "Ok",
                    call: function (element) {
                        element.remove();
                    }
                }
            });

        });
    };

    me.persistDocuments = function (data) {
        var docs = $factory.execute("documents");
        $model.people.documents.post(data, function (r) {
            docs.loadData(r,function(){
                docs.update(docs);
            });
            $.msg(me.pars.dic.messages.documents.save.success.msg, "success");
        });
    };

    me.persistAnnex = function(_me, call) {
        var docs = $factory.execute("documents");
        $model.people.annex.post(_me.pars.properties.postData,function(ret){
            _me.pars.properties.screenMode = 1;

            _me.pars.properties.items     = null;
            _me.pars.properties.annexId   = null;
            _me.pars.properties.annexName = null;
            _me.pars.properties.annexObs  = null;

            _me.pars.properties.annexesList = ret.annexes;
            docs.loadData(ret.documents,function(){
                docs.update(docs);
            });

            _me.update(_me);

            if (typeof call === 'function') {
                call(ret.annex);
            }
        });

    };

    me.persistAnnexItem = function(_me,base64,elem, call){
        var data = {},
            documentPeopleId,
            typeId,
            name = elem.val(),
            annexId,
            docs = $factory.execute("documents");

            data = {
                base64: base64
                , annexItemName: name
                , peopleId: _me.pars.properties.peopleId
                , typeId : _me.pars.properties.typeId
                , annexId : _me.pars.properties.annexId
                , annexName : _me.pars.properties.annexName
                , annexObs : _me.pars.properties.annexObs
            }

            $model.people.annex.post(data,function(ret){
                _me.pars.properties.screenMode = 1;
                _me.pars.properties.annexesList = ret.annexes;
                docs.loadData(ret.documents, function() {
                    docs.update(docs);
                });

                elem.val(null);
                _me.update(_me);

                if (typeof call === 'function') {
                    call(ret.annexes);
                }

            });

    };

    me.deleteAnnexes = function(_me, data, call) {
        var docs = $factory.execute("documents");

        $.alert({
            title: "Atenção",
            msg: "Confirma a remoção deste anexo com todos os arquivos?",
            option1: {
                label: "Sim",
                call: function (element) {
                    $model.people.annex.remove(data, function(ret) {
                        if (ret) {
                            _me.pars.properties.annexesList = ret.annexes;
                            _me.pars.properties.annexId = null;
                            _me.pars.properties.screenMode = 1;

                            docs.loadData(ret.documents, function() {
                                docs.update(docs);
                            });

                            _me.update(_me);
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

        if (typeof call === 'function') {
            call(_me);
        }
    }

    me.deleteAnnexItem = function(_me, data, call) {
        var docs = $factory.execute("documents");

        $.alert({
            title: "Atenção",
            msg: "Confirma a remoção deste anexo?",
            option1: {
                label: "Sim",
                call: function (element) {

                    $model.people.annex.deleteAnnexItem(data, function(ret) {
                        _me.pars.properties.screenMode  = 1;
                        _me.pars.properties.annexesList = ret.annexes;

                        var item = _me.pars.properties.annexesList.filter(function(f) {
                            return f.annexId === _me.pars.properties.annexId;
                        });

                        _me.pars.properties.items = item[0].items;

                        docs.loadData(ret.documents, function() {
                            docs.update(docs);
                        });

                        _me.update(_me);

                        if (typeof call === 'function') {
                            _me.pars.properties.screenMode  = 2;
                            call(_me);
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

    me.loadSearchPeople = function (ret,_me) {

        if (ret.individual.studentId) {
            $routes.changeRoute(["module","students_register","update",ret.individual.studentId]);
        } else {
            ret.individual.inrDocumentId = ret.documents.individualRegistration.inrDocumentId;
            ret.individual.inrDocumentPeopleId = ret.documents.individualRegistration.inrDocumentPeopleId;
            ret.individual.numberRegistration = ret.documents.individualRegistration.numberRegistration;
            _me.loadData(ret.individual);
        }

    };

    me.context = function (pars) {
        pars.upl.getFile(function (base64) {
            me.file(base64);
        });

        pars.cam.evt("click",me.cam);
    };

    me.cam = function(){
        $.webCam(function (base) {
           me.pars.properties.studentImageBase64 = base;
            me.update(me);
            $model.people.photo.post({
                id: me.pars.properties.peopleId,
                photo: base
            }, function () {
                me.get(me.pars.properties.studentId);
            });
        });
    };

    me.file = function (base64) {
        $.processingImage(base64, function (base) {
            //me.pars.properties.studentImageBase64 = base;
            me.update(me);
            $model.people.photo.post({
                id: me.pars.properties.peopleId,
                photo: base,
                oldPath:me.pars.properties.studentImageBase64
            }, function () {
                me.get(me.pars.properties.studentId);
            });
        },{
            ratio: "3/4"
        });
    };

    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    // me.setState = function (action, attr) {
    //     var newInstance;
    //     if (attr) {
    //         me.pars.properties.action = action;
    //         me.pars.properties.studentId = attr;
    //         me.init().get(attr).showPage(me);
    //     } else {

    //         newInstance = $factory.resetInstance(me);
    //         newInstance.init().setElement(newInstance, "#students_register").showPage(newInstance).update(newInstance);
    //         newInstance.updatePersonData();


    //     }
    // };

    me.get = function (id) {

        var guardianship_data, documents, annex_data, specialneeds_data;

        me.pars.properties.disabledTab = {
            persondata: false,
            student_data: false,
            student_docs: false,
            student_anexo: false,
            student_accessibility: false
        };

        me.pars.model.get(id, function (ret) {

            me.pars.properties.studentId = ret.student.studentId;
            me.pars.properties.peopleId = ret.student.peopleId;
            me.pars.properties.student_name = ret.student.name;
            me.pars.properties.studentImageBase64 = ret.student.photoPath;


            //guardianship_data
            guardianship_data = $factory.createInstance("guardianship_data", "guardianship", {
            }, me);

            //document
            documents = $factory.createInstance("documents", "documents", {
            }, me);


            //annex
            annex_data = $factory.createInstance("annex", "annex", {
                attrs:[
                    {attr:"peopleId",val:ret.student.peopleId},
                    {attr:"studentId",val:ret.student.studentId}
                ]
            }, me);

            //need special
            //Dados da aba de Necessidades Especiais
            specialneeds_data = $factory.createInstance("specialneeds_data", "special_needs", {
                attrs: [
                    {attr: "individualId", val: ret.student.individualId}
                ]
            }, me);

            me.update(me);

            //person data
            me.pars.person_data
                    .setElement(me.pars.person_data, "#persondata")
                    .loadData(ret.student)
                    .update(me.pars.person_data);

            var guardianshipParams = {responsibles: ret.responsibles, studentId: ret.student.studentId};
            guardianship_data
                    .setElement(guardianship_data, "#guardianship_data")
                    .loadData(guardianshipParams)
                    .update(guardianship_data);

            documents
                    .setElement(documents, "#student_docs")
                    .init({call: me.persistDocuments, peopleId: ret.student.peopleId})
                    .loadData(ret.documents,function(){
                        documents.update(documents);
                    });


            annex_data
                    .setElement(annex_data, "#student_anexo")
                    .loadData(ret.annexes)
                    .update(annex_data);


            specialneeds_data
                    .setElement(specialneeds_data, "#specialneeds")
                    .loadData(ret.specialNecessity)
                    .update(specialneeds_data);

        });
        return me;
    };

    return me;

};



