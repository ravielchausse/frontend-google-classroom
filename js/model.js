/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$conn = {
    path: "http://192.168.1.211/TEdu/backend/public/",
    username: "",
    password: ""
};

$model = {
    teste: 0,
    submit: function ( method, route, data, call ) {
        $model.teste++;
        $( "#loading" ).addClass( "load" ).removeClass( "loaded" );
        $( "#loadingIcon" ).fadeIn( 500 );
        $.ajax( {
            method: method,
            url: route,
            data: JSON.stringify( data ),
            timeout: 5000,
            dataType: 'json',
            contentType: 'application/json',
            success: function ( ret ) {
                call( ret );
                $model.teste--;
                if ( $model.teste == 0 ) {
                    $( "#loading" ).addClass( "loaded" ).removeClass( "load" );
                    $( "#loadingIcon" ).fadeOut( 500 );
                }
            },
            error: function ( a, b, c ) {
                var error;
                if(b==="timeout") {
                   $.alert({
                        title: "Erro Fatal!",
                        msg:"Sem conexão com o servidor!",
                        option1:{
                            label: "Ok! Entendi",
                            call: function(){

                            }
                        }
                    });
                }else if(a.status === 0){
                    $.alert({
                        title: "Erro Fatal!",
                        msg:"Servidor não encontrado!",
                        option1:{
                            label: "Ok! Entendi",
                            call: function(){

                            }
                        }
                    });
                }else{
                    error = JSON.parse( a.responseText );
                    $.msg( "Erro Ex" + error.code, "error" );
                    $model.teste--;
                }

                if ( $model.teste == 0 ) {
                    $( "#loading" ).addClass( "loaded" ).removeClass( "load" );
                    $( "#loadingIcon" ).fadeOut( 500 );
                }
            }
        } );
    },
    getCities: function ( uf, call ) {
        $model.submit( 'POST', $conn.path + "lookup/getCountiesByIdState", { id: uf }, call );
    },
    people: {
        personData: {
            get: function () {

            },
            guardianshipFilter: function () {

            },
            post: function ( data, call ) {
                data['phone'] = data['phone'].replace( /\D/g, '' );
                data['cellPhone'] = data['cellPhone'].replace( /\D/g, '' );
                data['zipcode'] = data['zipcode'].replace( /\D/g, '' );
                $model.submit( 'POST', $conn.path + "individual", data, call );
            },
            search: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "individual/autocompletebyname", data, call );
            }
        },
        photo: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "individual/photo/handle", data, call );
            }
        },
        documents: {
            get: function () {

            },
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "documents/individual/handle", data, call );
            }
        },
        individual: {
            get: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "individual/getIndividualById", data, call );
            }
        },
        specialNeeds: {
            get: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "individual/special-necessity/getAll", data, call );
            },
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "individual/special-necessity/handle", data, call );
            },
            delete: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "individual/special-necessity/delete", data, call );
            }
        },
        annexDocuments: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "people/annexes/handleDocuments", data, call );
            }
        },
        annex: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "people/annexes/handle", data, call );
            },
            get: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "people/annexes/getAll", data, call );
            },
            remove: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "people/annexes/deleteAnnexes", data, call );
            },
            deleteAnnexItem: function(data, call) {
                $model.submit('POST', $conn.path + "people/annexes/deleteAnnexItem", data, call);
            }
        }
    },
    student: {
        get: function ( id, call ) {
            var data = { id: id };
            $model.submit( 'POST', $conn.path + "student/getStudentById", data, call );
        },
        getAll: function () {

        },
        personData: {
            post: function ( data, call ) {
                data['phone'] = data['phone'].replace( /\D/g, '' );
                data['cellPhone'] = data['cellPhone'].replace( /\D/g, '' );
                data['zipcode'] = data['zipcode'].replace( /\D/g, '' );
                $model.submit( 'POST', $conn.path + "student/handle", data, call );
            }
        },
        guardianship: {
            post: function ( data, call ) {
                data['phone'] = data['phone'].replace( /\D/g, '' );
                $model.submit( 'POST', $conn.path + "student/responsible/handle", data, call );
            },
            remove: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "student/responsible/delete", data, call );
            }
        },
        search: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "student/getStudentByAttributes", data, call );
        }
    },
    login: {
        post: function ( user, pass, call ) {
            var data = { "login": "admrg", "password": "abc123" };
            $model.submit( 'POST', $conn.path + "login/handle", data, call );
        }
    },
    start: {
        all: function ( search, call ) {
            var data = {
                "query": {
                    "match": {
                        "name": {
                            "query": search,
                            "fuzziness": 5
                        }
                    }
                }
            };
//                    $.post(
//                        "http://192.168.1.231:9200/tedu/students/_search",
//                        data,
//                        function(ret){
//                            call(ret);
//                        },
//                        'json'
//                    );
//                    $model.submit('POST', "http://192.168.1.231:9200/tedu/students/_search", data, call);
            $model.submit( 'POST', "http://localhost:9200/tedu/students/_search", data, call );
        },
        get: function ( search, call ) {
            var data = { "name": search };
            $model.submit( 'POST', $conn.path + "student/getAllStudentByName", data, call );
        }
    },
    class: {
        post: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "classes/handle", data, call );
        },
        get: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "classes/getClassById", data, call );
        },
        timesheet: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "classes/timesheet/handle", data, call );
        },
        handleStudentsToClass: function(data, call) {
          $model.submit('POST', $conn.path + "classes/handleStudentsToClass", data, call)
        },
        getAllStudentsByClassId: function(data, call) {
            $model.submit('POST', $conn.path + "classes/getAllStudentsByClassId", data, call);
        },
        removeStudentOfClass: function(data, call) {
            $model.submit('POST', $conn.path + "classes/removeStudentOfClass", data, call);
        },
        getAvailabilityTeacher: function(data,call) {
//            var ret = [
//                {
//                    teacherId:1,
//                    teacherName:'Vitor Abreu',
//                    enrollmentNumber:'20091234001',
//                    availabilities:[
//                        {abbreviation:'SEG',startTime:'07:00:00',endTime:'12:00:00'}
//                    ],
//                    occupied:[
//                        {abbreviation:'SEG',startTime:'07:00:00',duration:'45',school:'Escola Teste'}
//                    ]
//                },
//                {
//                    teacherId:2,
//                    teacherName:'Vitor Abreu',
//                    enrollmentNumber:'20101234001',
//                    availabilities:[
//                        {abbreviation:'SEG',startTime:'07:00:00',endTime:'09:30:00'}
//                    ],
//                    occupied:[
//                        {abbreviation:'SEG',startTime:'07:50:00',duration:'45',school:'Escola Teste'}
//                    ]
//                },
//                {
//                    teacherId:3,
//                    teacherName:'Guilherme Silva',
//                    enrollmentNumber:'20104567001',
//                    availabilities:[
//                        {abbreviation:'SEG',startTime:'07:00:00',endTime:'12:00:00'}
//                    ],
//                    occupied:[
//                        {abbreviation:'SEG',startTime:'07:00:00',duration:'45',school:'Escola Teste'}
//                    ]
//                }
//            ];
//            call(ret);
            $model.submit('POST', $conn.path + "humanResources/employees-enrollment/getTeachersByBaseIdAndComponentId", data, call);
        }
    },
    conf: {
        curricularBases: {
            getBasesByClass: function (data, call) {
                $model.submit('POST', $conn.path + "curriculum/bases/getBasesJoinComponentsByIdSchool", data, call);
            },
            getAllByIdSchool: function (data, call) {
                $model.submit('POST', $conn.path + "curriculum/bases/getAllByIdSchool", data, call);
            },
            get: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "curriculum/bases/getAll", data, call );
            },
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "curriculum/bases/handle", data, call );
            }
        },
        curricularSteps: {
            get: function ( data, call ) { //todas as etapas existentes
                $model.submit( 'POST', $conn.path + "curriculum/steps/getAll", data, call );
            },
            getByBase: function ( data, call ) { //todas as bases que possuem etapas e componentes
                $model.submit( 'POST', $conn.path + "curriculum/curriculum-components/getStepsWithComponentsByIdBase", data, call );
            },
            post: function ( data, call ) { //vincula etapas na base
                $model.submit( 'POST', $conn.path + "curriculum/bases-steps/handle", data, call );
            },
            getStepsToBase: function ( data, call ) { //todas as etapas vinculadas a uma base
                $model.submit( 'POST', $conn.path + "curriculum/bases-steps/getAll", data, call );
            }
        },
        curricularComponents: {
            get: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "curriculum/components/getAll", data, call );
            }
        },
        curriculum: {
            getComponentsFromBaseSteps: function ( data, call ) { //todas as bases que possuem etapas e componentes
                $model.submit( 'POST', $conn.path + "curriculum/curriculum-components/getComponentsByIdBaseSteps", data, call );
            },
            getBasesComponentsBySchool: function ( data, call ) { //todas as bases que possuem etapas e componentes
                $model.submit( 'POST', $conn.path + "curriculum/curriculum-components/getBasesComponentsByIdSchool", data, call );
            },
            post: function ( data, call ) { //todas as bases que possuem etapas e componentes
                $model.submit( 'POST', $conn.path + "curriculum/curriculum-components/handle", data, call );
            },
            getComponentsJoinBasesByIdBase:function(data,call) {
                $model.submit( 'POST', $conn.path + "curriculum/components/getComponentsJoinBasesByIdBase", data, call );
            }

        },
        system: {
            handleGoogleClassroomCredentials: function(data, call) {
                $model.submit('POST', $conn.path + "setting/handleGoogleClassroomCredentials", data, call);
            },
            getSystemConfigs: function(data, call) {
                $model.submit('POST', $conn.path + "setting/getSystemConfigs", data, call);
            },
            handleFtpSettings: function(data, call) {
                $model.submit('POST', $conn.path + "setting/handleFtpSettings", data, call);
            },
            resetGoogleClassroomCredentials: function(data, call) {
                $model.submit('POST', $conn.path + "setting/resetGoogleClassroomCredentials", data, call);
            }

        }
    },
    humanResource: {
        post: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "humanResources/handle", data, call );
        },
        get: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "humanResources/getEmployedById", data, call );
        },
        search:function(data,call) {
            $model.submit( 'POST', $conn.path + "humanResources/getEmployeesByAttributes", data, call );
        },
        enrollment: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "humanResources/employees-enrollment/handle", data, call );
            }
        },
        schoolEnrollment: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "humanResources/school-enrollment/handle", data, call );
            },
            getSchoolEnrollmentsByEmployeesEnrollmentId: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/school-enrollment/getSchoolEnrollmentsByEmployeesEnrollmentId", data, call);
            },
            deleteSchoolEnrollmentsById: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/school-enrollment/deleteSchoolEnrollmentsById", data, call);
            },
            setSchoolEnrollmentRegentByEnrollmentId: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/school-enrollment/setSchoolEnrollmentRegentByEnrollmentId", data, call);
            }
        },
        skillAbilities: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "humanResources/skill-abilities/handle", data, call );
            }
        },
        qualifications: {
            post: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "humanResources/qualifications/handle", data, call );
            }
        },
        availability:{
            post:function(data,call) {
                $model.submit( 'POST', $conn.path + "humanResources/item-scales/handle", data, call );
            },
            get:function(data,call) {
                $model.submit( 'POST', $conn.path + "humanResources/school-enrollment/getAvailabilityBySchoolEnrollmentId", data, call );
            },
            delete: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/item-scales/handleDelete", data, call);
            }
        },
        functionEnrollment: {
            get: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/function-enrollment/getBySchoolEnrollmentId", data, call);
            },
            post: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/function-enrollment/handle", data, call);
            },
            delete: function(data, call) {
                $model.submit('POST', $conn.path + "humanResources/function-enrollment/removeFunctionEnrollmentById", data, call);
            }
        }
    },
    legalEntity: {
        school: {
            getByName: function ( data, call ) {
                $model.submit( 'POST', $conn.path + "legal-entity/school/getByName", data, call );
            }
        }
    },
    structure: {
        post: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "structures/handle", data, call );
        },
        get: function(data, call) {
            $model.submit('POST', $conn.path + "structures/getStructureById", data, call);
        },
        search: function ( data, call ) {
            $model.submit( 'POST', $conn.path + "structures/getStructureByTypeName", data, call );
        },
        getAllByIdSchool:function(data,call) {
            $model.submit( 'POST', $conn.path + "structures/getAllByIdSchool", data, call );
        }
    },
    dailyTeacher:{
        getAllByIdSchool:function(data,call) {
            $model.submit( 'POST', $conn.path + "dailyTeacher/getAllByIdSchool", data, call );
        },
        getEventsClassByDailyIdAndDate:function(data,call) {
            $model.submit( 'POST', $conn.path + "dailyTeacher/getLecturedByDailyIdAndDate", data, call );
        }
    },
    lectured:{
        getLecturedById:function(data,call) {
            $model.submit( 'POST', $conn.path + "dailyTeacher/lectured/getLecturedById", data, call );
        },
        post:function(data,call) {
            $model.submit( 'POST', $conn.path + "dailyTeacher/lectured/handle", data, call );
        }
    }
};
