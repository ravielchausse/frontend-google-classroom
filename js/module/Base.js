/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.Base = function(me) {

    me.setElement = function(_me,sel) {
        _me.pars.element = sel;
        return _me;
    };


    /**
     * @description Método Padrão, responsável por transmitir ao html as variáveis de template
     *
     */
    me.update = function (_me) {
        var element, context;
        _me.pars.properties.dic = _me.pars.dic;
        _me.pars.properties.functions = {
            formatDate:$.formatDate
        };
        context = _me.template(_me.pars.properties);
        element = me.renderModule(_me.pars.element,context);
        $.getContext(element, _me.context);
        return _me;
    };

    me.updateInPopup = function( _me, call){
        var element, context;
        _me.pars.properties.dic = _me.pars.dic;
        _me.pars.properties.functions = {
            formatDate:$.formatDate
        };
        context = _me.template(_me.pars.properties);

        $.popup(function(inner, parent){
            element = me.renderModule(inner,context);
            $.getContext(element, _me.context);
            if(typeof call == "function"){
                call(inner, parent);
            }
        });



        //return _me;
    };

    me.renderModule = function (sel, ctx) {
        var elem = $(sel);
        elem.html(ctx);
        elem.find(".tabs-group").setTabs();
        elem.find("[data-mask]").each(function () {
            $(this).find("input").mask($(this).data("mask"));
        });
        elem.find(".disabled").each(function () {
            $(this).find("input, select").attr("disabled", "disabled");
        });
        elem.find(".input-group").has("[required]").find("label").append(" *");
        return elem;
    },

    me.showPage = function(_me){
        $("[data-mod]").hide();
        
        var breadcrumb = _me.pars.properties.breadcrumb
                , titlePage =$("#content").find("h1").find(".title") 
                , htmlArray = []
                , title
                ;
        
        
        _.each(breadcrumb, function(obj, index) {
                var link = $('<a/>').attr('href', obj.hash).text(obj.descr);
                htmlArray.push(link);
        });
        
        htmlArray.join("");
        
        if (breadcrumb && breadcrumb.length  > 0) {
            title = '';
        }
        else {
            title = $dictionary.pageTitle[_me.pars.instance.modName];
        }
        
        
        titlePage.html(title).append(htmlArray);

        $(_me.pars.element).show();
        return _me;
    },


    me.getAll = function() {

    };

    me.submit = function (from,call) {
        var sel = $(from).find(".invalid");
        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
            call();
        }
    }; 
    
    me.getValues = function ( from, to, _me ) {
        var values = { }, formatedDate = null;
        $( from ).find( "[data-bind]" ).each( function () {
            values[$( this ).data( "bind" )] = $( this ).val();
            $( this ).removeClass( "invalid" );
            if ( $factory.validation( $( this ).val(), $( this ).data( "type" ), $( this ).attr( "required" ) ) ) {
                $( this ).addClass( "invalid" );
            }
        } );

        _.each( to, function ( target ) {
            $.extend( true, target, values );
        } );

        return _me;
    };    
    
    return me;

};
