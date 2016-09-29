    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */
    
    
$.presence_modal = function(me) {
    
    me.pars = $.extend(true,{
        properties:{
            dateTimeRef:null,
            situations:[
                {id:1,name:"Presente"},
                {id:2,name:"Ausente"},
                {id:3,name:"Transferido de Outra Escola"},
                {id:4,name:"Transferido para Outra Escola"},
            ],
            attendance:[
                {studentId:1,studentName:'Julio Schimidt',situation:1 },
                {studentId:2,studentName:'Vitor Abreu',situation:1 },
                {studentId:3,studentName:'Raviel Chausse',situation:0 },
                {studentId:4,studentName:'Guilherme Silva',situation:1 },
                {studentId:5,studentName:'Gabriel Portugal',situation:1 }
            ]
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
    
    me.context = function(pars) {
        if (pars.setPresence) {
            pars.setPresence.find('.cell').evt('click',function(){
                var scroll= 0;
                me.pars.properties.attendance[$(this).data('idx')].attendanceSituation = !me.pars.properties.attendance[$(this).data('idx')].attendanceSituation;
                scroll = $(".popup .inner-popup").scrollTop();
                me.updateInPopup(me);
                $(".popup .inner-popup").scrollTop(scroll);
            });
        }
        
        if (pars.cancel) {
            pars.cancel.evt('click',function(){
                $(".popup").remove();
            });
        }
    };
    
    return me;
    
};;