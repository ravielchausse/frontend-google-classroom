$.teacher_availability = function (me) {

    me.pars = $.extend(true, {
        model: $model.humanResource.availability,
        person_data: null,
        properties: {
            /*Elementos de Apoio*/
            activeTab: 1,
            disabledTab: {
            },
            postData: {},
            screenMode: 1,
            permissions:$factory._session.permissions['human_resources'],
            schoolList:null,
            dayWeekList:$factory.lookup.dayWeek,
            schoolYearList:$factory.lookup.schoolYear,
            availabilityList:[],
            /*Elementos de persistência */
            employedName:null,
            schoolName:null,
            schoolEnrollmentId:null,
            schoolYearId:null,
            employeesId: null,
            enrollmentId:null,
            dayWeekId:null,
            startTime:null,
            endTime:null,
            functionTypeName:null,
            enrollmentNumber:null,
            availabilityId:null,
            functionEnrollmentId: null
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

                var inst = $factory.execute('availability_employees_list');
                if (!inst) {
                    inst = $factory.createInstance('availability_employees_list','employees_list',{
                        attrs:[
                            {attr:'asSubMod',val:true}
                        ]
                    },me);

                }
                inst.setElement(inst,'#mod_employees_list').init().update(inst);

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
        if (pars.newAvailability) {
            pars.newAvailability.evt('click',function() {
                me.pars.properties.screenMode = 3;
                console.log(me);
                me.updateInPopup(me);
            });
        }

        if (pars.cancelAvailability) {
            pars.cancelAvailability.evt('click', function() {
                me.pars.properties.screenMode = 2;
                me.updateInPopup(me);
            });
        }

        if (pars.cadAvailability) {
            pars.cadAvailability.evt('click',me.persistAvailability);
        }

        if (pars.availabilityList) {
            pars.availabilityList.find('[data-delete]').evt('click', function() {
                var $this     = $(this)
                    , scaleId = parseInt($this.data('delete'))
                    ;

                var data = {
                    scaleId: scaleId
                    , schoolEnrollmentId: me.pars.properties.schoolEnrollmentId
                    , functionEnrollmentId: me.pars.properties.functionEnrollmentId
                };

                me.pars.model.delete(data, function(ret) {
                    me.pars.properties.availabilityList = ret;
                    me.updateInPopup(me);
                });
            });
        }
    };

    me.cancel = function() {
        me.pars.properties.screenMode = 1;
        me.updateInPopup(me);
    };

    me.next = function(item) {
        $routes.changeRoute(["module", "human_resource", "availability", item.schoolEnrollmentId]);
    };

    me.setSchool = function (school) {
        me.pars.properties.schoolId = school.schoolId;
        me.pars.properties.schoolName = school.name;
        me.pars.properties.screenMode = 1;
        me.pars.properties.schoolList = null;
        me.updateInPopup(me);
    };

    me.findSchool = function () {
        var data = {name: $(this).parent().find('input').val()};
        $model.legalEntity.school.getByName(data, function (ret) {
            me.pars.properties.schoolList = ret;
            me.updateInPopup(me);
        });
    };

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

    me.persistAvailability = function() {
        me.getValues('#teacherAvailability',me.pars.properties);
        var data = {
            scaleId: me.pars.properties.availabilityId
            , scaleStartTime: me.pars.properties.startTime
            , scaleEndTime: me.pars.properties.endTime
            , schoolEnrollmentId: me.pars.properties.schoolEnrollmentId
            , dayWeekId: me.pars.properties.dayWeekId
            , schoolYearId: me.pars.properties.schoolYearId
            , functionEnrollmentId: me.pars.properties.functionEnrollmentId
        };

        me.pars.model.post(data,function(ret){
            me.pars.properties.screenMode = 2;
            me.pars.properties.availabilityList = ret;
            $.msg('Disponibilidade adicionada com sucesso', 'success');
            me.updateInPopup(me);
        });
    };

    me.get = function (id) {
        me.pars.properties.screenMode = 2;
        me.pars.model.get({id: id}, function (ret) {
            me.pars.properties.schoolName = ret.schoolEnrollment.schoolName;
            me.pars.properties.functionTypeName = ret.schoolEnrollment.functionTypeName;
            me.pars.properties.employedName = ret.schoolEnrollment.peopleName;
            me.pars.properties.enrollmentNumber = ret.schoolEnrollment.enrollmentNumber;
            me.pars.properties.availabilityId = ret.schoolEnrollment.itemId;
            me.pars.properties.schoolEnrollmentId = ret.schoolEnrollment.schoolEnrollmentId;
            me.pars.properties.availabilityList = ret.scales;
            me.showPage(me).updateInPopup(me);
        });
        return me;
    };

    return me;

};