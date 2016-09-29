/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.start = function(me) {
    
    me.pars = $.extend(true,{
        properties:{
            list: []
        },
        element:null
    },me.pars);
    
    me.construct = function (obj) {

        me.setElement(obj.element);
        if (obj.id) {
            me.getData(obj.id);
        }

    };

    /**
     * @description Grava a função que será executada no submit e chama o update de tela
     * @param json obj {call:call}
     * 
     */
    me.init = function (obj) {
        //me.call = obj.call;
        return me;
    };
    
    /**
     * @description Método Padrão, responsável por transmitir ao html as variáveis de template
     * 
     */
    me.update = function () {
        var context, element;
        me.pars.properties.dic = me.pars.dic;
        
        context = me.template(me.pars.properties);
        element = $factory.renderPage(me.pars.element, context);
        $.getContext(element, me.context); //realiza a carga do próprio módulo        
    };

    /**
     * @description Método Padrão que adiciona os listener de eventos no html
     * @param data-bind pars 
     * 
     */
    me.context = function (pars, context) {
        pars.searchButton.evt("click",me.search);
        $(".checkbox-group").checkbox();
    };

    /**
     * @description Altera em tempo de execução o local onde o módulo é carregado
     * @param String elem Id de onde será carregado o módulo
     * 
     */
    me.setElement = function (elem) {
        me.pars.element = elem;
    };

    /**
     * @description Responsável por adicionar ou remover a classe .invalid 
     * e retorna os valores que devem ser persistidos no banco
     * 
     */
    me.getValues = function () {
        
    };

    /**
     * @description Faz a chamada ajax e carrega os dados do Indivíduo para montar a tela quando no modo de alteração de registro
     * @param int id Identificador do Individuo
     * 
     */
    me.getData = function (id) {
        //faz requisição e envia os dados para serem plotados
        me.loadData(id);
    };

    /**
     * @description Recebe os dados para edição de um registro, sobrescreve me.pars.properties e monta o html preenchido
     * @param Json obj Equivalente ao properties
     * 
     */
    me.loadData = function (obj) {
        $.extend(true, me.pars.properties, obj);
    };

    me.search = function(){
        var search = $("#initSearch").val();
        $model.start.all(search, function(data){
            
            me.pars.properties.list = data.hits.hits;
            me.update();
        });
    };

    me.submit = function () {
        var values = me.getValues(), sel = $(me.pars.element).find(".invalid");
        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
            //me.call(values);
        }
    };
    
    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function(action,attr) {
        
        if (attr) {
            me.pars.properties.action = action;
            me.pars.properties.studentId =  attr;
            me.init().get(attr);
        } else {
            me.init().update();
        }
        
    };    
    
    return me;
    
};


