    /*
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */

    $.class = function ( me ) {

        me.pars = $.extend( true, {
            properties: {
                elementId: 1,
                postData: { },
                disabledStep: "disabled",
                activeTab: 2,
                disabledTab: {
                    class: false,
                    timesheet: true,
                    student: true
                },
                dayWeek: $factory.lookup.dayWeek,
                interval: { },
                /* 1ª aba */
                baseList: [
                ],
                stepList: [
                ],
                structureList: [
                ],
                schoolYearList: $factory.lookup.schoolYear,
                dependenceList: [
                    { id: 1, name: "Teste 1" },
                    { id: 2, name: "Teste 2" },
                    { id: 3, name: "Teste 3" }
                ],
                classId: null, //*
                className: null,
                classInep: null,
                baseId: null,
                curricularId: null,
                classNumberVacancies: null,
                classStartTime: null,
                classEndTime: null,
                classEducationTime: null,
                schoolYearId: null,
                structureId: null,
                /* 2ª aba */
                timesheet: {
                    conf: {
                        qtyTimes: [
                        ],
                        startTime: null,
                        endTime: null,
                        firstDay: null,
                        lastDay: null,
                        educationTime: null,
                        components: [
                        ]
                    },
                    properties: {
                        data: { }
                    }
                },
                studentId: null,
                studentName: null,
                studentImageBase64: null,
                studentList: [
                ]
            },
            element: "",
            teacherList: [
            ],
            teacherunavailable: false,
            teacherallocated: false,
            style: null
        }, me.pars );

        me.construct = function ( obj ) {
            var i;
            if ( obj && obj.attrs ) {
                for ( i in obj.attrs ) {
                    me.setProperty( obj.attrs[i].attr, obj.attrs[i].val );
                }
            }

        };

        me.init = function ( call ) {

            socket.on( 'checkAvailability', function ( ret ) {
                me.changeCssClassOneTimesheetComponent( $( '[data-name=' + ret.elementId + ' ]' ), ret.style );
                me.pars.style = ret.style;
            } );

            socket.on( 'getUnavailabilityInAttributes', function ( ret ) {
                me.applyClassCssAllTimesheetComponents();
            } );

            socket.on( 'getUnavailabilityByTeacherId', function ( ret ) {

            } );

            $model.conf.curricularBases.getBasesByClass( { id: 1 }, function ( ret ) { //id da escola
                me.pars.properties.baseList = ret;
                $model.structure.getAllByIdSchool( { id: $factory._session.school.schoolId }, function ( ret2 ) {
                    me.pars.properties.structureList = ret2;
                    call();
                } );
            } );
        };

        me.setFake = function () {


            var obj = { "07:00": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA" }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA", "component": { "curriculumId": 1, "curriculumCurricularId": 1, "curriculumComponentId": 1, "numberEducationTime": 3, "componentsId": 1, "abbreviation": "POR", "componentsName": "PORTUGUÊS" } }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA", "component": { "curriculumId": 1, "curriculumCurricularId": 1, "curriculumComponentId": 1, "numberEducationTime": 3, "componentsId": 1, "abbreviation": "POR", "componentsName": "PORTUGUÊS" } }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA", "component": { "curriculumId": 2, "curriculumCurricularId": 1, "curriculumComponentId": 2, "numberEducationTime": 3, "componentsId": 2, "abbreviation": "MAT", "componentsName": "MATEMÁTICA" } }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA", "component": { "curriculumId": 2, "curriculumCurricularId": 1, "curriculumComponentId": 2, "numberEducationTime": 3, "componentsId": 2, "abbreviation": "MAT", "componentsName": "MATEMÁTICA" } }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" }, "07:50": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA", "component": { "curriculumId": 5, "curriculumCurricularId": 1, "curriculumComponentId": 5, "numberEducationTime": 3, "componentsId": 5, "abbreviation": "FIS", "componentsName": "FÍSICA" } }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA", "component": { "curriculumId": 5, "curriculumCurricularId": 1, "curriculumComponentId": 5, "numberEducationTime": 3, "componentsId": 5, "abbreviation": "FIS", "componentsName": "FÍSICA" } }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA", "component": { "curriculumId": 6, "curriculumCurricularId": 1, "curriculumComponentId": 6, "numberEducationTime": 3, "componentsId": 6, "abbreviation": "QUI", "componentsName": "QUÍMICA" } }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA", "component": { "curriculumId": 4, "curriculumCurricularId": 1, "curriculumComponentId": 4, "numberEducationTime": 3, "componentsId": 4, "abbreviation": "GEO", "componentsName": "GEOGRAFIA" } }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA", "component": { "curriculumId": 3, "curriculumCurricularId": 1, "curriculumComponentId": 3, "numberEducationTime": 3, "componentsId": 3, "abbreviation": "HIS", "componentsName": "HISTÓRIA" } }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" }, "08:40": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA", "component": { "curriculumId": 7, "curriculumCurricularId": 1, "curriculumComponentId": 7, "numberEducationTime": 3, "componentsId": 7, "abbreviation": "ART", "componentsName": "ARTES" } }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA", "component": { "curriculumId": 10, "curriculumCurricularId": 1, "curriculumComponentId": 10, "numberEducationTime": 3, "componentsId": 10, "abbreviation": "ATC", "componentsName": "ATIVIDADES COMPLEMENTARES" } }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA", "component": { "curriculumId": 9, "curriculumCurricularId": 1, "curriculumComponentId": 9, "numberEducationTime": 3, "componentsId": 9, "abbreviation": "LNG", "componentsName": "LINGUA ESTRANGEIRA" } }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA", "component": { "curriculumId": 8, "curriculumCurricularId": 1, "curriculumComponentId": 8, "numberEducationTime": 3, "componentsId": 8, "abbreviation": "EDF", "componentsName": "EDUCAÇÃO FÍSICA" } }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA", "component": { "curriculumId": 7, "curriculumCurricularId": 1, "curriculumComponentId": 7, "numberEducationTime": 3, "componentsId": 7, "abbreviation": "ART", "componentsName": "ARTES" } }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" }, "09:30": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA" }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA" }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA" }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA" }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA" }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "interval", "duration": 15 }, "09:45": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA", "component": { "curriculumId": 9, "curriculumCurricularId": 1, "curriculumComponentId": 9, "numberEducationTime": 3, "componentsId": 9, "abbreviation": "LNG", "componentsName": "LINGUA ESTRANGEIRA" } }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA", "component": { "curriculumId": 10, "curriculumCurricularId": 1, "curriculumComponentId": 10, "numberEducationTime": 3, "componentsId": 10, "abbreviation": "ATC", "componentsName": "ATIVIDADES COMPLEMENTARES" } }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA", "component": { "curriculumId": 3, "curriculumCurricularId": 1, "curriculumComponentId": 3, "numberEducationTime": 3, "componentsId": 3, "abbreviation": "HIS", "componentsName": "HISTÓRIA" } }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA", "component": { "curriculumId": 4, "curriculumCurricularId": 1, "curriculumComponentId": 4, "numberEducationTime": 3, "componentsId": 4, "abbreviation": "GEO", "componentsName": "GEOGRAFIA" } }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA", "component": { "curriculumId": 8, "curriculumCurricularId": 1, "curriculumComponentId": 8, "numberEducationTime": 3, "componentsId": 8, "abbreviation": "EDF", "componentsName": "EDUCAÇÃO FÍSICA" } }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" }, "10:35": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA", "component": { "curriculumId": 10, "curriculumCurricularId": 1, "curriculumComponentId": 10, "numberEducationTime": 3, "componentsId": 10, "abbreviation": "ATC", "componentsName": "ATIVIDADES COMPLEMENTARES" } }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA", "component": { "curriculumId": 9, "curriculumCurricularId": 1, "curriculumComponentId": 9, "numberEducationTime": 3, "componentsId": 9, "abbreviation": "LNG", "componentsName": "LINGUA ESTRANGEIRA" } }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA", "component": { "curriculumId": 3, "curriculumCurricularId": 1, "curriculumComponentId": 3, "numberEducationTime": 3, "componentsId": 3, "abbreviation": "HIS", "componentsName": "HISTÓRIA" } }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA", "component": { "curriculumId": 6, "curriculumCurricularId": 1, "curriculumComponentId": 6, "numberEducationTime": 3, "componentsId": 6, "abbreviation": "QUI", "componentsName": "QUÍMICA" } }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA", "component": { "curriculumId": 7, "curriculumCurricularId": 1, "curriculumComponentId": 7, "numberEducationTime": 3, "componentsId": 7, "abbreviation": "ART", "componentsName": "ARTES" } }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" }, "11:25": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA", "component": { "curriculumId": 6, "curriculumCurricularId": 1, "curriculumComponentId": 6, "numberEducationTime": 3, "componentsId": 6, "abbreviation": "QUI", "componentsName": "QUÍMICA" } }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA", "component": { "curriculumId": 5, "curriculumCurricularId": 1, "curriculumComponentId": 5, "numberEducationTime": 3, "componentsId": 5, "abbreviation": "FIS", "componentsName": "FÍSICA" } }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA", "component": { "curriculumId": 4, "curriculumCurricularId": 1, "curriculumComponentId": 4, "numberEducationTime": 3, "componentsId": 4, "abbreviation": "GEO", "componentsName": "GEOGRAFIA" } }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA", "component": { "curriculumId": 8, "curriculumCurricularId": 1, "curriculumComponentId": 8, "numberEducationTime": 3, "componentsId": 8, "abbreviation": "EDF", "componentsName": "EDUCAÇÃO FÍSICA" } }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA", "component": { "curriculumId": 2, "curriculumCurricularId": 1, "curriculumComponentId": 2, "numberEducationTime": 3, "componentsId": 2, "abbreviation": "MAT", "componentsName": "MATEMÁTICA" } }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" }, "12:15": { "start": "2016-07-29T16:25:00.000Z", "DOM": { "id": 1, "abbreviation": "DOM", "name": "DOMINGO" }, "SEG": { "id": 2, "abbreviation": "SEG", "name": "SEGUNDA-FEIRA" }, "TER": { "id": 3, "abbreviation": "TER", "name": "TERÇA-FEIRA" }, "QUA": { "id": 4, "abbreviation": "QUA", "name": "QUARTA-FEIRA" }, "QUI": { "id": 5, "abbreviation": "QUI", "name": "QUINTA-FEIRA" }, "SEX": { "id": 6, "abbreviation": "SEX", "name": "SEXTA-FEIRA" }, "SAB": { "id": 7, "abbreviation": "SAB", "name": "SÁBADO" }, "type": "educationTime" } };
            _.each( obj, function ( v, k ) {
                v.start = moment( v.start );
            } );
            me.pars.properties.timesheet.properties.data = obj;

            return me;
        };

        /**
         * @description Altera em tempo de execução qualquer propriedade do módulo
         * @param String elem Nome do atributo
         * @param Any val Valor para o atributo
         *
         */
        me.setProperty = function ( elem, val ) {
            me.pars.properties[elem] = val;
        };

        me.loadSteps = function ( id, call ) {
            $model.conf.curricularSteps.getByBase( { id: id }, function ( ret ) {
                me.pars.properties.baseId = id;
                me.pars.properties.disabledStep = "";
                me.pars.properties.stepList = ret;
                if ( call ) {
                    call( me );
                }
            } );
        };

        me.createNodejsInstance = function ( teacherId ) {
            socket.emit( "execute", {
                action: "getUnavailabilityByTeacherId",
                data: {
                    id: teacherId
                }
            } );
        };

        me.selectComponent = function ( component, structure, teacher ) {
            var context, data;

            me.pars.modal = { dic: me.pars.dic };

            data = {
                baseId: me.pars.properties.baseId, //a base pertence a uma escola
                componentId: component,
                schoolYearId: me.pars.properties.schoolYearId
            };

            $model.class.getAvailabilityTeacher( data, function ( ret ) {
                me.pars.modal.structureId = structure || me.pars.properties.structureId;
                me.pars.modal.teacherId = teacher;
                me.pars.modal.teacherList = ret;
                me.pars.modal.structureList = me.pars.properties.structureList;
                me.pars.modal.value = component;

                $.curtain( function ( content, self ) {
                    $factory.getTemplate( "template/class/components-props.html", function ( foo ) {
                        context = foo( me.pars.modal );
                        content = $factory.renderModule( content, context );
                        $.getContext( content, me.addComponentsListener );
                    } );
                } );

            } );

        };

        me.addComponentsListener = function ( pars ) {
            if ( pars.cancel ) {
                pars.cancel.evt( "click", function () {
                    $( ".popup" ).has( $( this ) ).remove();
                } );
            }

            if ( pars.submit ) {
                pars.submit.evt( "click", function ( e ) {
                    var postData = { };
                    me.getValues( '#componentsProps', [
                        postData
                    ] );

                    me.createNodejsInstance( postData.teacherId );

                    $( '#timesheet' ).find( "[data-component=" + me.pars.modal.value + "]" ).each( function () {
                        $( this ).attr( 'data-structure', postData.structureId );
                        $( this ).attr( 'data-teacher', postData.teacherId );
                    } );
                    var teacherList = me.pars.modal.teacherList.filter( function ( f ) {
                        return f.teacherId == postData.teacherId;
                    } )[0];
                    me.pars.teacherList.push( teacherList );
                    me.reclassifyClassCssAfterRedefineTeacher( me.pars.modal.value, postData.teacherId );
                    if ( Object.keys( postData ).length > 0 ) {
                        me.interateTimesheet();
                    }

                    $( ".popup" ).remove();
                    
                } );
            }
        };

        /**
         * @description Testa a disponibilidade do professor para um determinado dia/hora e retorna qual a classe css que deverá ser usada
         */
        me.setClass = function ( teacher, timer, dayweek, dayweekId, elem ) {

            var style,
                        prof,
                        availabilities,
                        occupied,
                        startTime = moment().utcOffset( 0 ),
                        endTime = moment().utcOffset( 0 ),
                        dataRef = moment().utcOffset( 0 ),
                        array,
                        busyTime = moment().utcOffset( 0 ),
                        busyStartTime = moment().utcOffset( 0 ),
                        busyEndTime = moment().utcOffset( 0 ),
                        noteacher = false,
                        teacherbusy = false,
                        teacherallocated = false,
                        teacherunavailable = false,
                        i = 0,
                        j = 0,
                        elementId;

            array = timer.split( ':' );
            dataRef.set( { hour: array[0], minute: array[1], second: 0, millisecond: 0 } );

            if ( !teacher ) {
                me.pars.style = 'noteacher';
            } else {

                prof = me.pars.teacherList.filter( function ( f ) {
                    return f.teacherId == teacher;
                } )[0];

                //já garanto que só vou trabalhar com os ítens de disponibilidade referentes ao dia da semana
                if ( prof.availabilities.length > 0 ) {
                    availabilities = prof.availabilities.filter( function ( f ) {
                        return f.dayWeekAbbreviation == dayweek;
                    } );
                } else {
                    availabilities = [
                    ];
                }

                if ( prof.occupied.length > 0 ) {
                    occupied = prof.occupied.filter( function ( f ) {
                        return f.dayWeekAbbreviation == dayweek;
                    } );
                } else {
                    occupied = [
                    ];
                }

                if ( availabilities.length > 0 ) {

                    while ( !me.pars.teacherunavailable && i < availabilities.length ) {

                        array = availabilities[i].scaleStartTime.split( ':' );
                        startTime.set( { hour: array[0], minute: array[1], second: array[2], millisecond: 0 } );
                        array = availabilities[i].scaleEndTime.split( ':' );
                        endTime.set( { hour: array[0], minute: array[1], second: array[2], millisecond: 0 } );

                        if ( dataRef.isBetween( startTime.subtract( 1, 'seconds' ), endTime.add( 1, 'seconds' ) ) ) {

                            elementId = me.pars.properties.elementId++;
                            elem.attr( 'data-name', elementId );
                            socket.emit( "execute", {
                                action: "checkAvailability",
                                data: {
                                    timer: timer,
                                    dayWeekId: dayweekId,
                                    startTime: timer,
                                    duration: me.pars.properties.classEducationTime,
                                    teacherId: teacher,
                                    schoolId: $factory._session.school.schoolId,
                                    classId: me.pars.properties.classId,
                                    className: me.pars.properties.className,
                                    elementId: elementId
                                }
                            });
                            
                            me.pars.teacherunavailable = true;

                            /*                            
                             //me.pars.teacherunavailable = true;
                             
                             //                                if (occupied.length > 0) {
                             //                                    
                             //                                    while (!teacherallocated && j < occupied.length) {
                             //                                        array = occupied[j].startTime.split(':');
                             //                                        busyStartTime.set({hour: array[0], minute: array[1], second: array[2], millisecond: 0});
                             //                                        busyEndTime.set({hour: array[0], minute: array[1], second: array[2], millisecond: 0});
                             //                                        busyEndTime.add(occupied[j].duration,'minutes');
                             //                                        
                             //                                        if (dataRef.isBetween(busyStartTime.subtract(1, 'seconds'),busyEndTime.add(1,'seconds'))) {
                             //                                            style = 'teacherbusy';
                             //                                            teacherallocated = true;
                             //                                        } else {
                             //                                            style = 'teacherallocated';
                             //                                        }
                             //                                        j++;
                             //                                    }
                             //                                    
                             //                                } else {
                             //                                    style = 'teacherallocated';
                             //                                    teacherunavailable = true;
                             //                                }
                             */

                        } else {
                            me.pars.style = 'teacherunavailable';
                        }
                        i++;

                    }

                } else {
                    me.pars.style = 'teacherunavailable';
                }
            }

            me.pars.teacherallocated = false;
            me.pars.teacherunavailable = false;

            me.changeCssClassOneTimesheetComponent( elem, me.pars.style );

        };

        /**
         * @description Troca a Classe Css de todos os pesos de um mesmo componente quando troca o professor regente
         */
        me.reclassifyClassCssAfterRedefineTeacher = function ( component, teacher ) {
            var timer, dayweek, dayweekId, style, elem;
            $( ".connectedSortable" ).find( "[data-component= " + component + "]" ).each( function ( k, v ) {
                elem = $( this );
                dayweek = elem.parent().attr( 'data-dayweek' );
                dayweekId = elem.parent().attr( 'data-dayweekId' );
                timer = $( elem.parent() ).parent().attr( 'data-timer' );
                
                me.setClass( teacher, timer, dayweek, dayweekId, elem );
                
            } );
        };

        /**
         * @description Define a classe css para um componente arrastado no timesheet
         */
        me.changeCssClassOneTimesheetComponent = function ( elem, v ) {
            $( elem ).removeClass( 'noteacher' );
            $( elem ).removeClass( 'teacherallocated' );
            $( elem ).removeClass( 'teacherunavailable' );
            $( elem ).removeClass( 'teacherbusy' );
            elem.addClass( v );
        };

        me.context = function ( pars ) {

            pars.saveTimesheet.evt( 'click', function () {
                var data = { classId: me.pars.properties.classId, timesheet: me.pars.properties.timesheet.properties.data };
                $model.class.timesheet( data, function ( ret ) {
                    $.msg( 'Salvo com Sucesso!', 'success' );
                } );
            } );

            var x, z, l = true;

            //1ª aba
            pars.base.evt( "change", function () {
                me.getValues( "#formClassData", [
                    me.pars.properties, me.pars.properties.postData
                ] ).loadSteps( $( this ).val(), me.update );
            } );

            pars.saveClass.evt( "click", function () {
                me.getValues( "#formClassData", [
                    me.pars.properties, me.pars.properties.postData
                ] ).submit( "#formClassData", me.persistClass );
            } );

            //2ª aba
            pars.timesheet.delegate( '.sel', 'dblclick', function () {
                me.selectComponent( $( this ).data( 'component' ), $( this ).data( 'structure' ), $( this ).data( 'teacher' ) );
            } );

            //Realiza o arrasto dos componentes dentro do timesheet
            function drag( y ) {
                y.draggable( {
                    helper: 'clone',
                    appendTo: pars.timesheet,
                    start: function ( e, f ) {
                        x = z = $( this );
                        l = false;
                        $( this ).css( "opacity", "0.5" );
                        $( f.helper ).css( "z-index", "2" );
                    },
                    stop: function () {
                        $( this ).css( "opacity", "1" );
                        me.interateTimesheet();
                    }
                } );
            }
            ;

            function resize( y ) {
                y.resizable( {
                    grid: [
                        10, 10
                    ],
                    handles: "n,s",
                    minHeight: 30,
                    maxHeight: me.pars.properties.classMaxDuration * 30 / 15,
                    resize: function ( event, ui ) {
                        var t, s = 1;
                        t = ( $( this ).height() / 10 ) * 5;
                        $( this ).attr( "data-duration", t );
                        me.interateTimesheet();
                    }
                } );
            }

            //Realiza o arrasto inicial dos componentes para o timesheet
            pars.connectedDraggable.find( ".sel" ).draggable( {
                helper: 'clone',
                start: function () {
                    z = $( this );
                    l = true;
                    x = z.clone();
                    x.removeAttr( "data-total" );
                    drag( x );
                }
            } );

            //Trata o arrasto inicial do intervalo para o timesheet
            if ( pars.connectedDraggable ) {
                pars.connectedDraggable.sortable( {
                    connectWith: ".listSort",
                    items: ".interval",
                    stop: function ( event, ui ) {
                        var y = $( '<li class="interval" ></li>' );
                        resize( y );
                        $( ui.item ).replaceWith( y );
                        me.interateTimesheet();
                        $( this ).append( $( ui.item ).clone() );
                    }
                } ).disableSelection();
            }

            pars.connectedSortable.find( '.sel' ).each( function () {
                var y = pars.connectedDraggable.find( '[data-component = ' + $( this ).data( 'component' ) + ']' );
                y.attr( 'data-total', y.attr( 'data-total' ) - 1 );
            } );

            pars.timesheet.delegate( ".sel", "mouseover", function () {
                pars.timesheet.find( "[data-component=" + $( this ).attr( "data-component" ) + "]" ).addClass( "overed" );
            } ).evt( "mouseout", function () {
                pars.timesheet.find( ".sel" ).removeClass( "overed" );
            } );

            pars.connectedSortable.find( ".sel" ).each( function () {
                drag( $( this ) );
            } );

            pars.connectedSortable.find( ".interval" ).each( function () {
                resize( $( this ) );
            } );

            //Trata o arrasto interno do intervalo
            if ( pars.connectedSortable ) {
                pars.connectedSortable.sortable( {
                    axis: "y",
                    containment: ".connectedSortable",
                    connectWith: ".listSort",
                    items: 'li:not(".header")',
                    cancel: 'li:not(".interval")',
                    stop: function () {
                        me.interateTimesheet();
                    }
                } ).disableSelection();
            }

            //Trata o evento que Recebe todos os Componentes arrastados
            pars.timesheet.find( "ul.connectedSortable li span" ).droppable( {
                drop: function ( ev, ui ) {

                    if ( z ) {
                        var timelabel = ( $( this ).parent() ) ? $( this ).parent().attr( "data-timer" ) : "07:00",
                                    dayweek = $( this ).attr( "data-dayweek" );

                        me.pars.properties.timesheet.properties.data[timelabel][dayweek]["componentId"] = z.attr( 'data-component' );
                        me.pars.properties.timesheet.properties.data[timelabel][dayweek]["componentAbbreviation"] = z.attr( 'data-abbreviation' );

                    }

                    if ( x ) {
                        me.setClass( z.attr( 'data-teacher' ), $( this ).parent().attr( 'data-timer' ), $( this ).attr( 'data-dayweek' ), $( this ).attr( 'data-dayweekId' ), x );

                        var count = z.attr( "data-total" );
                        z.attr( "data-total", parseInt( count ) - 1 );
                        if ( z.attr( "data-total" ) == 0 ) {
                            z.draggable( { disabled: true } )
                        }

                        x.appendTo( $( this ) );
                        x = null;
                    }
                },
                out: function () {
                    if ( x ) {
                        if ( x.hasClass( "interval" ) ) {
                            var u = $( this ).index();
                        }
                    }

                }
            } );

            pars.searchPeople.autocomplete( {
                source: function ( request, response ) {
                    var data = {
                        name: request.term,
                        email: null,
                        enrollment: null,
                        numberRegistration: null
                    };

                    $model.student.search( data, function ( ret ) {
                        response( ret.students.slice( 0, 3 ) );
                    } );

                },
                focus: function ( event, ui ) {
                    pars.searchPeople.val( ui.item.name );
                    return false;
                },
                select: function ( event, ui ) {
                    $( '#studentId' ).val( ui.item.studentId );
                    pars.searchPeople.val( ui.item.name );
                    me.addStudentToClass( pars );
                    return false;
                }
            } ).autocomplete( "instance" )._renderItem = function ( ul, item ) {
                var $innerphoto = $( '<div/>' ).addClass( 'inner' ).css( "background-image", "url(" + item.photoPath + ")" );

                var $picture = $( '<div />' ).addClass( 'picture' );

                if ( item.photoPath !== null ) {
                    $picture.append( $innerphoto );
                }

                return $( "<li>" )
                            .addClass( 'class-autocomplete' )
                            .append( $picture )
                            .append( "<a>" + item.name + "</a>" )
                            .append( "<a class='email'>" + item.email + "</a>" )
                            .appendTo( ul );
            };

            pars.handleStudentsToClass.evt( 'click', me.handleStudentsToClass );

            pars.studentList.delegate( '.class-studentlist-remove', 'click', me.removeStudent );

            pars.tabsGroup.delegate( '[data-link=students]', 'click', function () {
                if ( me.pars.properties.studentList.length === 0 ) {
                    me.getAllStudentsByClassId();
                }
            } );
        };

        /**
         * @description Reconstroi o objeto de persistencia do timesheet a partir de interações no DOM
         */
        me.interateTimesheet = function () {
            var arr = [
            ], tt, data = { },
                        t = moment().utcOffset( 0 ),
                        init = me.pars.properties.timesheet.conf.starTime,
                        time = me.pars.properties.timesheet.conf.educationTime;

            init = init.split( ":" );
            t.set( { hour: init[0], minute: init[1], second: 0, millisecond: 0 } );

            $( ".connectedSortable" ).find( "li" ).not( ".header" ).each( function ( k, v ) {

                var x, obj = { };

                data[t.format( "HH:mm" )] = { };

                x = { h: t.format( "HH:mm" ) };
                obj[t.format( "HH:mm" )] = { };
                obj[t.format( "HH:mm" )]["start"] = t;
                _.each( me.pars.properties.dayWeek, function ( v, k ) {
                    var aux = { };
                    aux[v["abbreviation"]] = { dayWeekId: v.id };
                    $.extend( true, obj[t.format( "HH:mm" )], aux );
                    $.extend( true, data, obj );
                } );

                if ( $( this ).hasClass( "interval" ) ) {
                    data[t.format( "HH:mm" )]["type"] = "interval";
                    data[t.format( "HH:mm" )]["duration"] = $( this ).attr( "data-duration" ) || 15;
                    tt = parseInt( $( this ).attr( "data-duration" ) ) || 15;
                    t.add( tt, "minutes" );
                } else {
                    data[t.format( "HH:mm" )]["type"] = "educationTime";
                    data[t.format( "HH:mm" )]["duration"] = me.pars.properties.classEducationTime;
                    t.add( time, "minutes" );
                }
                arr.push( x );

            } );

            t.set( { hour: init[0], minute: init[1], second: 0, millisecond: 0 } );
            $( ".connectedSortable" ).find( "li" ).not( ".header" ).each( function ( k, v ) {

                _.each( $( this ).find( "span" ), function ( item, x ) {
                    if ( $( item ).find( ".sel" ).length > 0 ) {

                        if ( data[t.format( "HH:mm" )] && data[t.format( "HH:mm" )][$( item ).attr( "data-dayweek" )] ) {
                            data[t.format( "HH:mm" )][$( item ).attr( "data-dayweek" )]["componentId"] = $( item ).find( ".sel" ).attr( 'data-component' );
                            data[t.format( "HH:mm" )][$( item ).attr( "data-dayweek" )]["curriculumId"] = $( item ).find( ".sel" ).attr( 'data-curriculum' );
                            data[t.format( "HH:mm" )][$( item ).attr( "data-dayweek" )]["componentAbbreviation"] = $( item ).find( ".sel" ).attr( 'data-abbreviation' );
                            data[t.format( "HH:mm" )][$( item ).attr( "data-dayweek" )]["structureId"] = $( item ).find( ".sel" ).attr( 'data-structure' );
                            data[t.format( "HH:mm" )][$( item ).attr( "data-dayweek" )]["teacherId"] = $( item ).find( ".sel" ).attr( 'data-teacher' );
                        }

                    }

                } );

                if ( $( this ).hasClass( "interval" ) ) {
                    tt = parseInt( $( this ).attr( "data-duration" ) ) || 15;
                    t.add( tt, "minutes" );
                } else {
                    t.add( time, "minutes" );
                }

            } );

            me.pars.properties.timesheet.properties.data = data;

            $.each( arr, function ( k, v ) {
                $( ".connectedSortable" ).find( "li" ).eq( k + 1 ).attr( "data-timer", v.h ).find( "span:first" ).html( v.h );
            } );

        };

        /**
         * @description Função Padrão do template usada para carregar o módulo num determinado estado.
         * Ex. View / Update / New / etc...
         * @param String action Método Pertencente a esta controller
         * @param Array attr  Parâmetros do Action
         * @returns void
         */
        me.setState = function ( action, attr ) {
            var x;
            if ( attr ) {
                me.pars.properties.action = action;
                me.pars.properties.classId = attr;
                me.setElement( me, "[data-mod=class]" ).setFake().init( function () {
                    me.get( attr );
                } );
            } else {
                x = $factory.createInstance( "class", "class", { }, "Base" );
                x.setElement( x, "[data-mod=class]" ).init( function () {
                    x.update( x ).showPage( x );
                } );
            }
        };

        /**
         * @description Responsável por adicionar ou remover a classe .invalid
         * e retorna os valores que devem ser persistidos no banco
         *
         */
        me.getValues = function ( from, to ) {
            var values = { }, formatedDate = null;
            $( from ).find( "[data-bind]" ).each( function () {
                values[$( this ).data( "bind" )] = $( this ).val();
                $( this ).removeClass( "invalid" );
                if ( $factory.validation( $( this ).val(), $( this ).data( "type" ), $( this ).attr( "required" ) ) ) {
                    $( this ).addClass( "invalid" );
                }
            } );

            values.classId = me.pars.properties.classId;

            _.each( to, function ( target ) {
                $.extend( true, target, values );
            } );

            return me;
        };

        me.persistClass = function () {
            $model.class.post( me.pars.properties.postData, function ( id ) {
                $routes.changeRoute( [
                    "module", "class", "update", id
                ] );
                $.msg( "Turma alterada com sucesso!", "success" );
            } );
        };

        me.mountVerticalScale = function ( startTime, endTime, educationTime, call ) {
            var sm = moment().utcOffset( 0 ),
                        em = moment().utcOffset( 0 ),
                        arr,
                        end,
                        ref;

            arr = startTime.split( ":" );
            ref = sm.set( { hour: arr[0], minute: arr[1], second: arr[2], millisecond: 0 } );

            arr = endTime.split( ":" );
            end = em.set( { hour: arr[0], minute: arr[1], second: arr[2], millisecond: 0 } );
            me.pars.properties.timesheet.properties.data = { };

            while ( ref < end ) {
                me.pars.properties.timesheet.properties.data[ref.format( "HH:mm" )] = { };
                /* Para resolver ponteiro vou trabalhar com string */
                var obj = { };

                obj[ref.format( "HH:mm" )] = { };
                _.each( me.pars.properties.dayWeek, function ( v ) {
                    var aux = { };
                    aux[v.abbreviation] = { dayWeekId: v.id };
                    aux['start'] = ref;
                    aux['type'] = 'educationTime';
                    aux['duration'] = me.pars.properties.classEducationTime;
                    $.extend( true, obj[ref.format( "HH:mm" )], aux );
                    $.extend( true, me.pars.properties.timesheet.properties.data, obj );
                } );

                me.pars.properties.timesheet.properties.data[ref.format( "HH:mm" )]["start"] = ref;
                me.pars.properties.timesheet.properties.data[ref.format( "HH:mm" )]["type"] = "educationTime";

                ref.add( educationTime, "minute" );
            }

            if ( call ) {
                call();
            }

        };

        me.get = function ( id ) {
            me.pars.properties.disabledTab.timesheet = false;
            me.pars.properties.disabledTab.student = false;
            $model.class.get( { id: id }, function ( ret ) {

                //extend da 1ª aba
                me.pars.properties.classId = ret.class.classId;
                me.pars.properties.className = ret.class.className;
                me.pars.properties.classInep = ret.class.classInep;
                me.pars.properties.baseId = ret.class.baseId;
                me.pars.properties.structureId = ret.class.structureId;
                me.pars.properties.schoolYearId = ret.class.schoolYearId;
                me.loadSteps( ret.class.baseId, function () {
                    me.pars.properties.curricularId = ret.class.curricularId;
                    me.pars.properties.classNumberVacancies = ret.class.classNumberVacancies;

                    //construtor da 2ª aba
                    me.pars.properties.classMaxDuration = ret.class.classMaxDuration;
                    me.pars.properties.classStartTime = ret.class.classStartTime;
                    me.pars.properties.classEndTime = ret.class.classEndTime;
                    me.pars.properties.classEducationTime = ret.class.classEducationTime;
                    me.pars.properties.timesheet.conf.starTime = ret.class.classStartTime;
                    me.pars.properties.timesheet.conf.endTime = ret.class.classEndTime;
                    me.pars.properties.timesheet.conf.firstDay = ret.class.classFirstDay;
                    me.pars.properties.timesheet.conf.lastDay = ret.class.classLastDay;
                    me.pars.properties.timesheet.conf.educationTime = ret.class.classEducationTime;
                    me.pars.properties.timesheet.conf.components = ret.components;

                    if ( ret.timesheet.timesheet['07:00'] ) {
                        _.each( ret.timesheet.timesheet, function ( v, k ) {
                            v.start = moment( v.start );
                        } );
                        me.pars.properties.timesheet.properties.data = ret.timesheet.timesheet;
                        me.pars.teacherList = ret.timesheet.teachersList;

                    } else {

                        me.mountVerticalScale( ret.class.classStartTime, ret.class.classEndTime, ret.class.classEducationTime );

                    }

                    me.update( me ).showPage( me );

                    me.createNodeInstanceAllTeachers();

                } );


            } );

            return me;
        };

        me.createNodeInstanceAllTeachers = function () {

            var array = [
            ];

            _.each( me.pars.teacherList, function ( val ) {
                array.push( val.teacherId );
            } );

            socket.emit( "execute", {
                action: "getUnavailabilityInAttributes",
                data: JSON.stringify( array )
            } );

        };

        me.applyClassCssAllTimesheetComponents = function () {

            var dayweek, dayweekId, timer, li, teacher;

            $( ".connectedSortable" ).find( "li" ).not( ".header" ).each( function ( k, v ) {

                li = $( this );

                _.each( li.find( "span" ), function ( item, x ) {

                    if ( $( item ).find( ".sel" ).length > 0 ) {

                        //$( item ).find( ".sel" ).attr( 'data-component' );
                        //debugger;
                        dayweek = $( item ).attr( 'data-dayweek' );
                        dayweekId = $( item ).attr( 'data-dayweekId' );
                        teacher = $( item ).find( ".sel" ).attr( 'data-teacher' );
                        timer = li.attr( 'data-timer' );

                        console.log('parametros:::::',teacher, timer, dayweek, dayweekId);
                        me.setClass( teacher, timer, dayweek, dayweekId, $( item ).find( ".sel" ) );

                    }

                } );

            } );


        };

        me.getAllStudentsByClassId = function () {
            var properties = me.pars.properties
                        , data = {
                            id: properties.classId
                        };

            $model.class.getAllStudentsByClassId( data, function ( ret ) {
                if ( ret.length !== 0 ) {
                    properties.activeTab = 3;

                    _.each( ret, function ( student ) {
                        properties.studentList.push( student );
                    } );

                    me.update( me );
                }
            } );

            return me;
        };

        me.addStudentToClass = function ( pars ) {
            var studentName = pars.searchPeople.val()
                        , studentId = $( "#studentId" ).val()
                        , dic = me.pars.dic.classes.students;

            if ( $.trim( studentName ) != '' && $.trim( studentId ) != '' ) {
                $model.student.get( studentId, function ( ret ) {
                    var studentList = me.pars.properties.studentList
                                , numberVacancies = me.pars.properties.classNumberVacancies;

                    if ( studentList.length === numberVacancies ) {
                        $.msg( dic.alerts.max, 'error' );
                        me.update( me );
                        return;
                    }

                    if ( studentList.length == 0 ) {
                        studentList.push( ret.student );
                    }
                    else {
                        var added = false;
                        _.each( studentList, function ( student ) {
                            if ( student.studentId === ret.student.studentId ) {
                                added = true;
                            }
                        } );

                        if ( !added ) {
                            studentList.push( ret.student );
                        }
                        else {
                            $.msg( dic.alerts.add, 'error' );
                        }
                    }

                    me.pars.properties.activeTab = 3;
                    me.update( me );
                } );
            }

            return me;
        };

        me.handleStudentsToClass = function ( e ) {
            var properties = me.pars.properties
                        , dic = me.pars.dic.classes.students
                        , data;

            data = {
                classId: properties.classId,
                studentList: properties.studentList
            }

            $model.class.handleStudentsToClass( data, function ( ret ) {
                $.msg( dic.alerts.success, 'success' );
            } );

            return me;
        };

        me.removeStudent = function ( e ) {
            var properties = me.pars.properties
                        , index = $( this ).data( 'index' )
                        , studentId = $( this ).data( 'id' )
                        ;

            var data = {
                id: studentId,
                classId: properties.classId
            }

            if ( properties.studentList[index].studentEnrollmentId ) {
                $model.class.removeStudentOfClass( data, function ( ret ) {
                } );
            }

            properties.studentList.splice( index, 1 );
            $.msg( 'Aluno removido com sucesso', 'success' );

            me.update( me );

            return me;
        }

        return me;
    };