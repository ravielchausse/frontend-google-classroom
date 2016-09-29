    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */
    
    
$.daily = function(me) {
    
    me.pars = $.extend(true,{
        properties:{
            screenMode:1,
            dailyList:[],
            educationTimeList:[],
            attendance:[],
            numberPages:1,
            dateFilter:moment().format('YYYY-MM-DD'),
            dailyId:null,
            lecturedId:null,
            page:null
        },
        element:null
    },me.pars);
    
    me.construct = function ( obj ) {
        var i;
        if ( obj && obj.attrs ) {
            for ( i in obj.attrs ) {
                me.setProperty( obj.attrs[i].attr, obj.attrs[i].val );
            }
        }
    };
    
    me.setProperty = function ( elem, val ) {
        me.pars.properties[elem] = val;
    };    
    
    me.init = function(call) {
        me.all(function(){
            call();
        });
        return me;
    };
    
    me.context = function ( pars ) {
        
        if (pars.dailyitem) {
            pars.dailyitem.find('.item').evt("click",function(){
                var item = me.pars.properties.dailyList[$(this).data('idx')];
                $routes.changeRoute(["module", "dailyTeachers", "daily",item.dailyId,me.pars.properties.dateFilter]);
            });
        }
        
        if (pars.cancelDailyUpdate) {
            pars.cancelDailyUpdate.evt('click',function() {
                $routes.changeRoute(["module", "dailyTeachers", "search"]);
            });
        }
        
        if (pars.dateFilter) {
            pars.dateFilter.evt('click',function(){
                me.getValues('#daily-item',[me.pars.properties]);
                $routes.changeRoute(["module", "dailyTeachers", "daily",me.pars.properties.dailyId,me.pars.properties.dateFilter]);
            });
        }
        
        if (pars.educationTime) {
            pars.educationTime.find('.item').evt('click',function(){
                var obj = {
                    timeRef:$(this).data('timeref'),
                    lecturedId:$(this).data('lecturedid'),
                    dailyId:me.pars.properties.dailyId,
                    dateRef:me.pars.properties.dateFilter,
                    educationTime:$(this).data('educationtime')
                };
                
                if (obj.lecturedId) {
                    $routes.changeRoute(["module", "dailyTeachers", "lectured",obj.dailyId,obj.dateRef,obj.lecturedId]);
                } else {
                    me.persistLectured(obj);
                }
                
            });
        }
        
        if (pars.lecturedItem) {
            pars.lecturedItem.find('.item').evt('click',function(){
                var instance = $factory.createInstance('presence_modal','presence_modal',{
                    attrs:[
                        {attr:'dateTimeRef',val:me.pars.properties.dateFilter},
                        {attr:'attendance',val:me.pars.properties.attendance}
                    ]
                },me);
                me.updateInPopup(instance);
            });
        }
    };
    
    me.all = function(call) {
        $model.dailyTeacher.getAllByIdSchool({id:$factory._session.school.schoolId},function(ret){
            me.pars.properties.dailyList = ret;
            call();
        });
    };
    
    me.getEventsClassByDailyIdAndDate = function(id,call) {
        var data = {dateTimeRef:me.pars.properties.dateFilter,dailyId:id},item;
        $model.dailyTeacher.getEventsClassByDailyIdAndDate(data,function(ret){
            me.pars.properties.educationTimeList = ret;
            call();
        });
    };
    
    me.getLecturedById = function(id,call) {
        var data = {id:me.pars.properties.lecturedId};
        $model.lectured.getLecturedById(data,function(ret){
            me.pars.properties.attendance = ret.attendance;
            call();
        });
    };
    
    me.persistLectured = function(obj) {
        $model.lectured.post(obj,function(ret){
            $routes.changeRoute(["module", "dailyTeachers", "lectured",obj.dailyId,obj.dateRef,ret]);
        });
    };
    
    me.getAttendance = function() {
        
    };
    
    return me;
};