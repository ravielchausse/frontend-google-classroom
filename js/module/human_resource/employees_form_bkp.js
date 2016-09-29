$.employees_form = function (me) {

    me.pars = $.extend(true, {
        model: $model.humanResource,
        person_data: null,
        properties: {
            /*Elementos de Apoio*/
            activeTab: 1,
            disabledTab: {
                persondata: false,
                documents: true,
                specialneeds: true,
                annex: true,
                skill: true, //competências
                enrollment: true, //matriculas
                availability: true, //funções e escala
                employedFunctions:true
            },
            postData: {},
            screenMode: {
                enrollment: 1,
                availability: 1,
                skill: 1,
                employedFunctions: 1
            },
            permissions:$factory._session.permissions['human_resources'],
            schoolList: null,
            employeesTypeList: $factory.lookup.employees,
            skillsList: $factory.lookup.skillAbilitiesType,
            employeesFunctions: $factory.lookup.functions,
            isTeacher:false,
            curricularBaseList:[],
            curricularComponentList:[],
            employeesEnrollments: [],
            employedFunctions:[],
            availabilities: [],
            skills: [],
            /*Elementos de persistência */
            enrollment: {
                enrollmentId: null,
                enrollmentNumber: null,
                enrollmentYearContest: null,
                enrollmentSchoolId: null,
                enrollmentSchoolName: null,
                enrollmentTypeId: null
            },
            availability: {
                availabilitySchoolName: null,
                availabilitySchoolId: null,
                availabilityEnrollmentId: null,
                availabilityId: null,
                availabilityCurricularBaseId:null,
                availabilityComponentId:null,
                availabilityFunctionId:null
            },
            skill: {
                skillId: null,
                skillEnrollmentId: null,
                skillAbilityTypeId: null,
                skillDescription: null,
                skillStartYear: null,
                skillConclusionYear: null,
                skillInstitution: null
            },
            employedFunction:{
                functionEnrollmentId:null,
                functionEnrollmentName:null,
                functionSchoolId:null,
                functionSchoolName:null,
                functionId:null,
                functionTypeId:null,
                functionCurricularBaseId:null
            },
            employeesId: null
        },
        element: null

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

        //Dados Básicos do Indivíduo: 1ª aba
        $factory.createInstance("employed_data", "person_data", {
            attrs: [
                //{attr: "element",val:"#persondata"}
            ]
        }, me);

        $factory.execute("employed_data").setCallback(me.persistEmployed);


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

        /* COMPETÊNCIAS */
        
        if (pars.newSkill) {
            pars.newSkill.evt('click', function () {
                me.pars.properties.activeTab = 5;
                me.pars.properties.screenMode.skill = 2;
                me.update(me);
                me.updateOtherModules();
            });
        }

        if (pars.cancelSkill) {
            pars.cancelSkill.evt('click', function () {
                me.pars.properties.skill.skillId = null;
                me.pars.properties.skill.skillEnrollmentId = null;
                me.pars.properties.skill.skillAbilityTypeId = null;
                me.pars.properties.skill.skillDescription = null;
                me.pars.properties.skill.skillStartYear = null;
                me.pars.properties.skill.skillConclusionYear = null;
                me.pars.properties.skill.skillInstitution = null;
                me.pars.properties.screenMode.skill = 1;
                me.update(me);
                me.updateOtherModules();
            });
        }

        if (pars.cadSkill) {
            pars.cadSkill.evt('click', function () {
                me.getValues('#formSkill', me.pars.properties.skill);
                me.persistSkill();
            });
        }

        if (pars.skillManager) {
            pars.skillManager.find('.cell.name').evt('click', function () {
                var item = me.pars.properties.skills[$(this).data('idx')];
                me.pars.properties.skill.skillId = item.skillId;
                me.pars.properties.skill.skillEnrollmentId = item.skillEnrollmentId;
                me.pars.properties.skill.skillAbilityTypeId = item.abilityTypeId;
                me.pars.properties.skill.skillDescription = item.skillDescription;
                me.pars.properties.skill.skillStartYear = item.skillStartYear;
                me.pars.properties.skill.skillConclusionYear = item.skillConclusionYear;
                me.pars.properties.skill.skillInstitution = item.skillInstitution;
                me.pars.properties.screenMode.skill = 2;
                me.pars.properties.activeTab = 5;
                me.update(me);
                me.updateOtherModules();
            });
        }
        
        /* MATRICULAS */
        
          //habilitar pesquisa de escola na aba de matrícula
        if (pars.enrollmentFindSchool) {
            pars.enrollmentFindSchool.evt('click', function () {
                me.pars.properties.screenMode['enrollment'] = 3;
                me.pars.properties.activeTab = 6;
                me.getValues('#employeesEnrollment', me.pars.properties.enrollment).update(me);
            });
        }
        
        //quando estou editando uma matricula
        if (me.pars.properties.screenMode['enrollment'] === 2) {

            if (pars.cancelEnrollment) {
                pars.cancelEnrollment.evt('click', function () {
                    me.pars.properties.enrollment.enrollmentId = null;
                    me.pars.properties.enrollment.enrollmentYearContest = null;
                    me.pars.properties.enrollment.enrollmentNumber = null;
                    me.pars.properties.enrollment.enrollmentEmployeesId = null;
                    me.pars.properties.enrollment.enrollmentSchoolId = null;
                    me.pars.properties.enrollment.enrollmentSchoolName = null;
                    me.pars.properties.screenMode['enrollment'] = 1;
                    me.update(me);
                    me.updateOtherModules();
                });
            }

            if (pars.cadEnrollment) {
                pars.cadEnrollment.evt('click', me.persistEnrollment);
            }

        }        
        
        if (pars.newEnrollment) {
            pars.newEnrollment.evt('click', function () {
                me.pars.properties.activeTab = 6;
                me.pars.properties.screenMode['enrollment'] = 2;
                me.update(me);
                me.updateOtherModules();
            });
        }

        if (pars.selEnrollment) {
            pars.selEnrollment.find('.cell.name').evt('click', function () {
                var item = me.pars.properties.employeesEnrollments[$(this).data('idx')];
                me.pars.properties.screenMode['enrollment'] = 2;
                me.pars.properties.activeTab = 6;
                me.pars.properties.enrollment.enrollmentId = item.enrollmentId;
                me.pars.properties.enrollment.enrollmentYearContest = item.enrollmentYearContest;
                me.pars.properties.enrollment.enrollmentNumber = item.enrollmentNumber;
                me.pars.properties.enrollment.enrollmentEmployeesId = item.enrollmentEmployeesId;
                me.pars.properties.enrollment.enrollmentSchoolId = item.enrollmentSchoolId;
                me.pars.properties.enrollment.enrollmentSchoolName = item.enrollmentSchoolName;
                me.pars.properties.enrollment.enrollmentTypeId = item.enrollmentTypeId;
                me.update(me);
                me.updateOtherModules();
            });
        }
        
        /* FUNÇÕES */
        
        if (pars.newFunction) {
            pars.newFunction.evt('click',function(){
                console.log('teste');
                me.pars.properties.activeTab = 7;
                me.pars.properties.screenMode.employedFunctions = 2;
                me.update(me);
                me.updateOtherModules();
            });
        }
        
        if (pars.employedFunctionCancel) {
            pars.employedFunctionCancel.evt('click',function(){
                
                me.pars.properties.employedFunction.functionEnrollmentId = null;
                me.pars.properties.employedFunction.functionSchoolId = null;
                me.pars.properties.employedFunction.functionSchoolName = null;
                me.pars.properties.employedFunction.functionId = null;
                me.pars.properties.employedFunction.functionTypeId = null;
                me.pars.properties.screenMode.employedFunctions = 1;
                me.update(me);
                me.updateOtherModules();
                
            });
        }
        
        if (pars.employedFunctionEnrollmentChange) {
            pars.employedFunctionEnrollmentChange.evt('change',function(){
                
                var typeId = $(this).find(':selected').data('tpenrollment'), 
                      schoolId = $factory._session.school.schoolId, //$(this).find(':selected').data('school');
                      schoolName = $factory._session.school.schoolName;
                      

                me.getValues('#employedFunctionsForm',me.pars.properties.employedFunction);

                me.pars.properties.isTeacher = ($(this).find(':selected').data('tpenrollment') == 1);
                me.pars.properties.employedFunction.functionSchoolId = schoolId;
                me.pars.properties.employedFunction.functionSchoolName = schoolName;
                
                me.pars.properties.employeesFunctions = $factory.lookup.functions.filter(function(f){
                    return f.typeId === typeId ;
                });
                
                if (typeId === 1) {//se for um professor
                    
                    $model.conf.curricularBases.getBasesByClass({id:schoolId},function(ret){

                        me.pars.properties.curricularBaseList = ret;
                        me.update(me);
                        me.updateOtherModules();                        
                        
                        
                    });
                } else {
                    
                    me.update(me);
                    me.updateOtherModules();                    
                    
                }                         
                
            });
        }
        
        if (pars.employedFunctionSubmit) {
            pars.employedFunctionSubmit.evt('click',me.persistEmployedFunction);
        }
        
        if (pars.selFunction) {
            pars.selFunction.find('.cell.name').evt('click',function(){
                var item = me.pars.properties.employedFunctions[$(this).data('idx')];
                me.pars.properties.employedFunction.functionEnrollmentId = item.enrollmentId;
                me.pars.properties.employedFunction.functionSchoolId = item.schoolEnrollmentSchoolId;
                me.pars.properties.employedFunction.functionSchoolName = item.schoolName;
                me.pars.properties.employedFunction.functionId = item.schoolEnrollmentId;
                me.pars.properties.employedFunction.functionTypeId = item.functionTypeId;
                me.pars.properties.employedFunction.functionCurricularBaseId = item.baseId;
                me.pars.properties.isTeacher = (item.employedTypeId === 1);
                me.pars.properties.screenMode.employedFunctions = 2;
                me.pars.properties.activeTab = 7;
                
                //carregar as bases curriculares
                $model.conf.curricularBases.getAllByIdSchool({id:item.schoolEnrollmentSchoolId},function(ret){

                    me.pars.properties.curricularBaseList = ret;
                    me.update(me);
                    me.updateOtherModules();                        


                });                
                
                //me.update(me);
                //me.updateOtherModules();                
            });
        }
        
        /* HABILITAÇÕES */
        
        //habilitar pesquisa de escola na aba de disponibilidade
        if (pars.availabilityFindSchool) {
            pars.availabilityFindSchool.evt('click', function () {
                me.pars.properties.screenMode['availability'] = 2;
                me.pars.properties.activeTab = 8;
                me.getValues('#formAvailability', me.pars.properties.availability).update(me);
            });
        }

        //Salvar relacional entre matricula + escola + função
        if (pars.submitAvailability) {
            pars.submitAvailability.evt('click', me.persistAvailability);
        }

        if (pars.availabilityEnrollmentChange) {
            pars.availabilityEnrollmentChange.evt('change',function(){
                
                var typeId = $(this).find(':selected').data('tpenrollment'), 
                      schoolId = $factory._session.school.schoolId, //$(this).find(':selected').data('school');
                      schoolName = $factory._session.school.schoolName;
                      

                me.getValues('#formAvailability',me.pars.properties.availability);

                me.pars.properties.isTeacher = ($(this).find(':selected').data('tpenrollment') == 1);
                me.pars.properties.availability.availabilitySchoolId = schoolId;
                me.pars.properties.availability.availabilitySchoolName = schoolName;
                me.pars.properties.activeTab = 8;
                
                me.pars.properties.employeesFunctions = $factory.lookup.functions.filter(function(f){
                    return f.typeId === typeId ;
                });
                
                me.pars.properties.isTeacher = (typeId === 1);
                
                if (typeId === 1) {//se for um professor
                    
                    
                    
                    $model.conf.curricularComponents.get({},function(ret){
                        
                        me.pars.properties.curricularComponentList = ret;
                        me.update(me);
                        me.updateOtherModules();
                        
                    });                    
                    
//                    $model.conf.curricularBases.getBasesByClass({id:schoolId},function(ret){
//
//                        me.pars.properties.curricularBaseList = ret;
//                        me.update(me);
//                        me.updateOtherModules();                        
//                        
//                        
//                    });
                } else {
                    
                    me.update(me);
                    me.updateOtherModules();                    
                    
                }                
                

            });
        }

//        if (pars.availabilityCurricularBaseChange) {
//            
//            pars.availabilityCurricularBaseChange.evt('change',function(){
//                me.getValues('#formAvailability',me.pars.properties.availability);
//                
//                $model.conf.curriculum.getComponentsJoinBasesByIdBase({id:me.pars.properties.availability.availabilityCurricularBaseId},function(ret){
//                    
//                    me.pars.properties.curricularComponentList = ret;
//                    me.update(me);
//                    me.updateOtherModules();
//                    
//                });
//                
//
//            });
//            
//        }

        if (pars.newAvailability) {
            pars.newAvailability.evt('click', function () {
                me.pars.properties.activeTab = 8;
                me.pars.properties.screenMode.availability = 3;
                me.update(me);
                me.updateOtherModules();
            });
        }

        if (pars.availabilityManager) {
            pars.availabilityManager.find('.cell.name').evt('click', function () {
                var item = me.pars.properties.availabilities[$(this).data('idx')];
                me.pars.properties.availability.availabilityEnrollmentId = item.enrollmentId;
                
                me.pars.properties.availability.availabilityId = item.qualificationId;
                //me.pars.properties.availability.availabilitySchoolName = item.schoolName;
                me.pars.properties.availability.availabilityFunctionId = item.enrollmentEmployedTypeId;
                //me.pars.properties.availability.availabilitySchoolId = item.schoolId;
                me.pars.properties.availability.availabilityCurricularBaseId = item.qualificationBaseId;
                me.pars.properties.availability.availabilityComponentId = item.qualificationComponentId;

                me.pars.properties.isTeacher = (item.enrollmentEmployedTypeId == 1);
                me.pars.properties.activeTab = 8;
                me.pars.properties.screenMode.availability = 3;
                
                $model.conf.curricularComponents.get({},function(ret){

                    me.pars.properties.curricularComponentList = ret;
                    me.update(me);
                    me.updateOtherModules();

                });                   
                
                //buscar bases e componentes curriculares
//                me.getBasesAndComponents(item.enrollmentSchoolId,item.qualificationBaseId,function(){
//                    me.update(me);
//                    me.updateOtherModules();                    
//                });

            });
        }

        if (pars.cancelAvailability) {
            pars.cancelAvailability.evt('click', function () {
                
                me.pars.properties.availability.availabilityEnrollmentId = null;
                me.pars.properties.availability.availabilityId = null;
                me.pars.properties.availability.availabilitySchoolId = null;
                me.pars.properties.availability.availabilitySchoolName = null;
                me.pars.properties.availability.availabilityFunctionId = null;
                me.pars.properties.availability.availabilityCurricularBaseId = null;
                me.pars.properties.availability.availabilityComponentId = null;
                me.pars.properties.availability.availabilityFunctionId = null;
                me.pars.properties.activeTab = 8;
                me.pars.properties.screenMode.availability = 1;
                me.update(me);
                me.updateOtherModules();
                
            });
        }

        /* FORM SCHOOL */

        pars.generalEvent.find('.formSchool .findSchool').evt('click', me.findSchool);

        pars.generalEvent.find('.formSchool .findSchoolCancel').evt('click', function () {
            me.pars.properties.schoolList = null;
            if (pars.generalEvent.find('.formSchool').data('method') == 'setSchoolAvailability') {
                me.pars.properties.screenMode['availability'] = 1;
            } else {
                me.pars.properties.screenMode['enrollment'] = 2;
            }
            me.update(me);
            me.updateOtherModules();
        });

        pars.generalEvent.find('.formSchool .selSchool').find(".cell.name").evt('click', function () {
            var school = me.pars.properties.schoolList[$(this).data('idx')],
                    call = pars.generalEvent.find('.formSchool').data('method');
            me[call](school);
        });
        
        pars.generalEvent.find('.formSchool .inputFindSchool').evt('keydown', function(e){
            if (e.keyCode === 13) {
                e.preventDefault();
            }                
        });        

    };

    me.setSchoolEnrollment = function (school) {
        me.pars.properties.enrollment.enrollmentSchoolId = school.schoolId;
        me.pars.properties.enrollment.enrollmentSchoolName = school.name;
        me.pars.properties.screenMode['enrollment'] = 2;
        me.pars.properties.schoolList = null;
        me.update(me);
        me.updateOtherModules();
    };

    me.setSchoolAvailability = function (school) {
        me.pars.properties.availability.availabilitySchoolId = school.schoolId;
        me.pars.properties.availability.availabilitySchoolName = school.name;
        me.pars.properties.screenMode['availability'] = 1;
        me.pars.properties.schoolList = null;

                    $model.conf.curricularBases.getBasesByClass({id:school.schoolId},function(ret){
                        me.pars.properties.curricularBaseList = ret;
                        me.update(me);
                        me.updateOtherModules();                        
                        
                    });


    };
    
    me.getBasesAndComponents = function(schoold,baseId,call) {
        
        $model.conf.curricularBases.getBasesByClass({id:schoold},function(ret){
            me.pars.properties.curricularBaseList = ret;

            $model.conf.curriculum.getComponentsJoinBasesByIdBase({id:baseId},function(ret2){

                        me.pars.properties.curricularComponentList = ret2;
                        call();

                    });

            });        
        
    };

    me.updatePersonData = function () {
        var instance = $factory.execute("employed_data");
        instance.setElement(instance, "#persondata2").update(instance);
        instance.update(instance);
    };

    me.updateOtherModules = function () {
        var documents = $factory.execute("employed_documents"),
                specialNeeds = $factory.execute("employed_specialneeds"),
                annexes = $factory.execute("employed_annex"),
                personData = $factory.execute("employed_data");

        documents.setElement(documents, "#documents2").update(documents);
        specialNeeds.setElement(specialNeeds, "#specialneeds2").update(specialNeeds);
        annexes.setElement(annexes, "#annex2").update(annexes);
        personData.setElement(personData, "#persondata2").update(personData);

    };

    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function (action, attr) {
        var newInstance;
        if (attr) {
            me.pars.properties.action = action;
            //me.updatePersonData();
            me.init().get(attr).showPage(me).update(me);
        } else {

            newInstance = $factory.resetInstance(me);

            newInstance.init().setElement(newInstance, "#human_resource").showPage(newInstance).update(newInstance);
//            newInstance.showPage(newInstance).update(newInstance);
            newInstance.updatePersonData();

        }
    };

    /**
     * @description Responsável por adicionar ou remover a classe .invalid 
     * e retorna os valores que devem ser persistidos no banco
     * 
     */
    me.getValues = function (from, to) {

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

    me.loadSearchPeople = function (ret, _me) {

        if (ret.individual.employeesId) {
            $routes.changeRoute(["module", "human_resource", "update", ret.individual.employeesId]);
        } else {
            ret.individual.inrDocumentId = ret.documents.individualRegistration.inrDocumentId;
            ret.individual.inrDocumentPeopleId = ret.documents.individualRegistration.inrDocumentPeopleId;
            ret.individual.numberRegistration = ret.documents.individualRegistration.numberRegistration;
            _me.loadData(ret.individual);
        }

    };

    me.persistEmployed = function (data) {
        data.employeesId = me.pars.properties.employeesId;
        me.pars.model.post(data, function (id) {
            $routes.changeRoute(["module", "human_resource", "update", id]);
            $.msg("Sucesso!","success");
        });
    };

    me.persistDocuments = function (data) {
        var docs = $factory.execute("employed_documents");
        $model.people.documents.post(data, function (r) {
            docs.loadData(r, function () {
                docs.update(docs);
            });
            $.msg(me.pars.dic.messages.documents.save.success.msg,"success");
        });
    };

    me.persistAnnex = function (_me) {
        var docs = $factory.execute("employed_documents");
        $model.people.annex.post(_me.pars.properties.postData, function (ret) {
            _me.pars.properties.screenMode['enrollment'] = 1;

            _me.pars.properties.items = null;
            _me.pars.properties.annexId = null;
            _me.pars.properties.annexName = null;
            _me.pars.properties.annexObs = null;

            _me.pars.properties.annexesList = ret.annexes;
            docs.loadData(ret.documents, function () {
                docs.update(docs);
            });
            _me.update(_me);
        });

    };

    me.persistAnnexItem = function (_me, base64, elem) {

        var data = {},
                documentPeopleId,
                typeId,
                name = elem.val(),
                annexId,
                docs = $factory.execute("employed_documents");

        data["base64"] = base64;
        data["itemName"] = name;
        data["peopleId"] = _me.pars.properties.peopleId;
        data["typeId"] = _me.pars.properties.typeId;
        data["annexId"] = _me.pars.properties.annexId;
        $model.people.annex.post(data, function (ret) {
            _me.pars.properties.screenMode['enrollment'] = 1;
            _me.pars.properties.annexesList = ret.annexes;
            docs.loadData(ret.documents, function () {
                docs.update(docs);
            });
            elem.val(null);
            _me.update(_me);
        });

    };

    me.persistEnrollment = function () {

        me.getValues('#employeesEnrollment', me.pars.properties.enrollment);

        var sel = $('#employeesEnrollment').find(".invalid");

        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {

            var data = {
                enrollmentId: me.pars.properties.enrollment.enrollmentId,
                enrollmentYearContest: me.pars.properties.enrollment.enrollmentYearContest,
                enrollmentNumber: me.pars.properties.enrollment.enrollmentNumber,
                employeesId: me.pars.properties.employeesId,
                schoolId: me.pars.properties.enrollment.enrollmentSchoolId,
                typeId:me.pars.properties.enrollment.enrollmentTypeId
            };

            me.pars.model.enrollment.post(data, function (ret) {
                me.pars.properties.enrollment.enrollmentId = null;
                me.pars.properties.enrollment.enrollmentNumber = null;
                me.pars.properties.enrollment.enrollmentYearContest = null;
                me.pars.properties.enrollment.enrollmentSchoolId = null;
                me.pars.properties.enrollment.enrollmentSchoolName = null;
                me.pars.properties.enrollment.enrollmentTypeId = null;
                me.pars.properties.employeesEnrollments = ret;
                me.pars.properties.screenMode['enrollment'] = 1;
                me.update(me);
                me.updateOtherModules();
            });
        }
    };

    me.persistAvailability = function () {

        me.getValues('#formAvailability', me.pars.properties.availability);

        var sel = $('#formAvailability').find(".invalid");

        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {

            var data = {
                employeesId: me.pars.properties.employeesId,
                enrollmentId: me.pars.properties.availability.availabilityEnrollmentId,
                schoolEnrollmentId: me.pars.properties.availability.availabilityId,
                baseId:me.pars.properties.availability.availabilityCurricularBaseId,
                componentId:me.pars.properties.availability.availabilityComponentId
            };

            me.pars.model.qualifications.post(data, function (ret) {

                me.pars.properties.availability.availabilitySchoolId = null;
                me.pars.properties.availability.availabilityFunctionId = null;
                me.pars.properties.availability.availabilityId = null;
                me.pars.properties.availability.availabilityCurricularBaseId = null;
                me.pars.properties.availability.availabilityComponentId = null;

                me.pars.properties.availabilities = ret;
                me.pars.properties.activeTab = 8;
                me.pars.properties.screenMode.availability = 1;
                me.update(me);
                me.updateOtherModules();
            });
        }
    };

    me.persistEmployedFunction = function () {

        me.getValues('#employedFunctionsForm', me.pars.properties.employedFunction);

        var sel = $('#employedFunctionsForm').find(".invalid");

        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {

            var data = {
                employeesId: me.pars.properties.employeesId,
                enrollmentId: me.pars.properties.employedFunction.functionEnrollmentId,
                schoolId: me.pars.properties.employedFunction.functionSchoolId,
                functionEmployedId: me.pars.properties.employedFunction.functionTypeId,
                schoolEnrollmentId: me.pars.properties.employedFunction.functionId,
                baseId: me.pars.properties.employedFunction.functionCurricularBaseId
            };
            //console.log(data); return;
            me.pars.model.schoolEnrollment.post(data, function (ret) {

                me.pars.properties.employedFunction.functionEnrollmentId = null;
                me.pars.properties.employedFunction.functionEnrollmentName = null;
                me.pars.properties.employedFunction.functionSchoolId = null;
                me.pars.properties.employedFunction.functionId = null;
                me.pars.properties.employedFunction.functionTypeId = null;
                me.pars.properties.screenMode.employedFunctions = 1;

                me.pars.properties.employedFunctions = ret;
                me.pars.properties.activeTab = 7;
                me.pars.properties.screenMode.employedFunctions = 1;
                me.update(me);
                me.updateOtherModules();
            });
        }
    };

    me.persistSkill = function () {
        var data = {
            employeesId: me.pars.properties.employeesId,
            skillId: me.pars.properties.skill.skillId,
            //enrollmentId:me.pars.properties.skill.skillEnrollmentId,
            abilityTypeId: me.pars.properties.skill.skillAbilityTypeId,
            skillDescription: me.pars.properties.skill.skillDescription,
            skillStartYear: me.pars.properties.skill.skillStartYear,
            skillConclusionYear: me.pars.properties.skill.skillConclusionYear,
            skillInstitution: me.pars.properties.skill.skillInstitution
        };

        me.pars.model.skillAbilities.post(data, function (ret) {
            me.pars.properties.skills = ret;
            me.pars.properties.screenMode.skill = 1;
            me.update(me);
            me.updateOtherModules();
        });

    };

    me.findSchool = function () {
        var data = {name: $(this).parent().find('input').val()};
        $model.legalEntity.school.getByName(data, function (ret) {
            me.pars.properties.schoolList = ret;
            me.update(me);
        });
    };

    me.get = function (id) {

        var documents, annex_data, specialneeds_data, person_data = $factory.execute("employed_data");
        me.pars.properties.disabledTab.persondata = false;
        me.pars.properties.disabledTab.documents = false;
        me.pars.properties.disabledTab.specialneeds = false;
        me.pars.properties.disabledTab.annex = false;
        me.pars.properties.disabledTab.timesheet = false;
        me.pars.properties.disabledTab.skill = false;
        me.pars.properties.disabledTab.enrollment = false;
        me.pars.properties.disabledTab.employedFunctions = false;

        me.pars.model.get({id: id}, function (ret) {
            me.pars.properties.employeesId = ret.employed.employeesId;
            me.pars.properties.peopleId = ret.employed.peopleId;
            me.pars.properties.employeesEnrollments = ret.enrollments;
            me.pars.properties.employedFunctions = ret.schoolEnrollment || [];
            me.pars.properties.skills = ret.skillAbilities;
            me.pars.properties.availabilities = ret.qualifications;
            //documents
            documents = $factory.createInstance("employed_documents", "documents", {
            }, me);

            //annex
            annex_data = $factory.createInstance("employed_annex", "annex", {
                attrs: [
                    {attr: "peopleId", val: ret.employed.peopleId},
                    {attr: "studentId", val: ret.employed.employeesId}
                ]
            }, me);

            //need special
            specialneeds_data = $factory.createInstance("employed_specialneeds", "special_needs", {
                attrs: [
                    {attr: "individualId", val: ret.employed.individualId}
                ]
            }, me);

            me.update(me).showPage(me);

            person_data
                    .setElement(person_data, "#persondata2")
                    .loadData(ret.employed)
                    .update(person_data);

            documents.setElement(documents, "#documents2")
                    .init({call: me.persistDocuments, peopleId: me.pars.properties.peopleId})
                    .loadData(ret.documents, function () {
                        documents.update(documents);
                    });

            annex_data
                    .setElement(annex_data, "#annex2")
                    .loadData(ret.annexes)
                    .update(annex_data);

            specialneeds_data
                    .setElement(specialneeds_data, "#specialneeds2")
                    .loadData(ret.specialNecessity)
                    .update(specialneeds_data);

        });
        return me;
    };

    return me;

};