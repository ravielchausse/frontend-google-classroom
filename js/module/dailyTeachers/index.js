    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */
    
    
$.dailyTeachers = function(me) {
    
    me.pars = $.extend(true,{
        properties:{
            breadcrumb:[
                {id:1,descr:'Diários',hash: "#module/dailyTeachers/search"}
            ],
            screenMode:1
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
    
    me.init = function() {
        return me;
    };
    
    me.context = function ( pars ) {
        
    };
    
    me.setState = function (action, attr,pars) {
        switch(action) {
            case 'store':
            case 'update':
                //to do
                break;
            case 'search':
                me.updateDailyList(attr);
                break;
            case 'daily':
                me.updateDaily(pars);
                break;
            case 'lectured':
                me.updateLectured(pars);
                break;
        }
    };
    
    me.updateDailyList = function (attr) {
        
        var instance = $factory.execute('daily'), newInstance;
        
        if (!instance) {
            
            instance = $factory.createInstance("daily", "daily", {}, me);
            //instance.pars.properties.breadcrumb = [{id:1,descr:"Diários"}];
            instance.init(function(){
                instance.setElement(instance, "#daily").showPage(instance).update(instance);
            });              
            
        } else {
            
            newInstance = $factory.resetInstance(instance,{});
            newInstance.init(function(){
                newInstance.setElement(newInstance, "#daily").showPage(newInstance).update(newInstance);
            });            
            
        }

        return me;
        
    };    
    
    me.updateDaily = function (pars) {
        var attr = pars[3], dayRef = pars[4], attributes = [
                        {attr:'screenMode',val:2},
                        {attr:'dailyId',val:attr}
                    ]; 
                    
        if (dayRef) {
            attributes.push({attr:'dateFilter',val:dayRef});
        } else {
            $routes.changeRoute(["module", "dailyTeachers", "search"]);
            return;
        }
        
        if (!attr) {
            
            $routes.changeRoute(["module", "dailyTeachers", "search"]);
            return;
            
        } else {
            
            var instance = $factory.execute('daily'), newInstance;
            
            if (!instance) {
                instance = $factory.createInstance("daily", "daily", {
                    attrs:attributes
                }, me);
            } else {
                instance.pars.properties.dailyId = attr;
                instance.pars.properties.screenMode = 2;
                if (dayRef)  instance.pars.properties.dateFilter = dayRef;
            }
            


            instance.setElement(instance, "#daily").all(function(){
                
                var item = instance.pars.properties.dailyList.filter(function(f){
                    return f.dailyId == attr;
                })[0];
                instance.pars.properties.breadcrumb = [{id:1,descr:'Diários',hash: "#module/dailyTeachers/search"},{id:2,descr:item.componentName + ' / ' + item.baseName + ' - ' + item.stepName}];                    
                
                instance.getEventsClassByDailyIdAndDate(attr,function(){
                    instance.showPage(instance).update(instance);
                });
            });
        
        }
        return me;
        
    };    
    
    me.updateLectured = function (pars) {
        var dailyId = pars[3], dayRef = pars[4], lecturedId = pars[5];
//        console.log(dailyId,dayRef,lecturedId);
//        return;
        
        if (!dailyId || !dayRef) {
            
            $routes.changeRoute(["module", "dailyTeachers", "search"]);
            return;
            
        } else {
            
            if (!lecturedId) {
                
                $routes.changeRoute(["module", "dailyTeachers", "daily",dailyId,dayRef]);
                return;
                
            } else {
            
                var instance = $factory.execute('daily'), newInstance;

                if (!instance) {
                    instance = $factory.createInstance("daily", "daily", {
                        attrs:[
                            {attr:'screenMode',val:3},
                            {attr:'dailyId',val:dailyId},
                            {attr:'dateFilter',val:dayRef},
                            {attr:'lecturedId',val:lecturedId}
                        ]
                    }, me);
                } else {
                    instance.pars.properties.screenMode = 3;
                    instance.pars.properties.dailyId = dailyId;
                    instance.pars.properties.dateFilter = dayRef;
                    instance.pars.properties.lecturedId = lecturedId;
                }            
                instance.pars.properties.breadcrumb = [{id:1,descr:'Diários',hash: "#module/dailyTeachers/search"}];
                instance.setElement(instance, "#daily").init(function(){
                    
                    instance.getEventsClassByDailyIdAndDate(dailyId,function(){
                        var item = instance.pars.properties.dailyList.filter(function(f){
                            return f.dailyId == dailyId;
                        })[0];
                        instance.pars.properties.breadcrumb.push({id:2,descr:item.componentName + ' / ' + item.baseName + ' - ' + item.stepName,hash: "#module/dailyTeachers/daily/" + dailyId + "/" + dayRef});    
                        instance.getLecturedById(lecturedId,function(){
                            var obj = instance.pars.properties.educationTimeList.filter(function(f){
                                return f.lecturedId == lecturedId;
                            })[0]; 
                            instance.pars.properties.breadcrumb.push({id:3,descr:obj.className + ' - ' + moment(obj.dateTimeRef).format('DD/MM/YY') + ' ' + obj.timeRef});
                            instance.showPage(instance).update(instance);
                        });

                    });                    

                });
            
            }
        
        }
        return me;
        
    };    
    
    return me;
};