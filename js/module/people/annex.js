/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.annex = function(me) {

    me.pars = $.extend(true,{
        properties:{
            postData:{},
            studentId:null,
            peopleId:null,
            screenMode:1,
            annexId:null,
            annexName:"",
            annexObs:"",
            items:null,
            annexesList:[]
        },
        element:null
    },me.pars);

    me.construct = function (obj) {
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr,obj.attrs[i].val);
            }
        }
    };

    me.init = function (call) {
        call();
    };

    /**loadData
     * @description Método Padrão que adiciona os listener de eventos no html
     * @param data-bind pars
     *
     */
    me.context = function (pars) {
        var itemAnnex;
        if (pars.cadAnnex) {
            pars.cadAnnex.evt("click",function(){
                me.getValues();

                me.pars.properties.screenMode = 2;
                me.pars.properties.postData.annexId = me.pars.properties.annexId = null;

                me.pars.properties.postData.annexName = me.pars.properties.annexName = me.pars.dic.annex.add.title;
                me.pars.properties.postData.annexObs  = me.pars.properties.annexObs  = me.pars.dic.annex.add.obs;
                console.log(me.pars.properties.annexId);
                me.persistAnnex(me, function(annex) {
                    me.alterAnnex(annex.annexId, true);
                });

            });
        }

        if (pars.cancelAnnex) {
            pars.cancelAnnex.evt("click",function(){
                me.pars.properties.annexId = null;
                me.pars.properties.annexName = null;
                me.pars.properties.annexObs = null;
                me.pars.properties.screenMode = 1;
                me.update(me);
            });
        }

        if (pars.submitAnnex) {
            pars.submitAnnex.evt("click",function(){
                me.pars.properties.screenMode = 1;
                me.getValues().persistAnnex(me);
            });
        }

        if (pars.alterAnnex) {
            pars.alterAnnex.find(".annex").evt("click", function() {
                var $this = $(this).find(".cell.name")
                    id = parseInt($this.data('id'))
                    ;
                me.alterAnnex(id)
            });

            pars.alterAnnex.find(".cell.remove").evt("click",me.rmAnnex);
        }

        if (pars.addAnnex) {
            itemAnnex = pars.addAnnex.find('a');
            itemAnnex.getFile(function(base64){
                me.getValues();
                me.persistAnnexItem(me,base64,$(".input-group").has(itemAnnex).find("input"), function(annexesList) {
                    var item = annexesList.filter(function(f) {
                        return f.annexId === me.pars.properties.annexId;
                    });

                    item = item[0];

                    me.pars.properties.screenMode = 2;
                    me.pars.properties.items      = item.items;
                    me.pars.properties.annexId    = item.annexId;

                    me.updateInPopup(me,me.annexUpdate);

                });
            });
        }

        if (pars.annexItemList) {
            pars.annexItemList.find('.delete').evt("click", function(e) {
                e.stopPropagation();

                var $this = $(this)
                    , id = parseInt($this.data('id'))
                    , docs = me.pars.docs
                    ;

                var data = {
                    annexItemId: id
                    , annexId: me.pars.properties.annexId
                    , peopleId: me.pars.properties.peopleId
                };

                me.deleteAnnexItem(me, data, function(_me) {
                    me.updateInPopup(_me, me.annexUpdate);

                });
            })
        }
    };

    me.rmAnnex = function(e) {
        e.stopPropagation();

        var id = parseInt($(this).attr('data-id'));

        var data = {
            annexId: id
            , peopleId: me.pars.properties.peopleId
        }

        me.deleteAnnexes(me, data);

    };

    me.annexUpdate =  function(inner, parent){

        parent.addClass("max");

        inner.find("[data-evt=cancelAnnex]").click(function(){
            parent.remove();
        });

        inner.find("[data-evt=submitAnnex]").click(function(){
            parent.remove();
        });
    };


    me.alterAnnex = function(id, focusInput) {
        var item = me.pars.properties.annexesList.filter(function(f) {
            return f.annexId === id;
        });

        item = item[0];

        me.pars.properties.screenMode = 2;

        me.pars.properties.items      = item.items;
        me.pars.properties.annexName  = item.annexName;
        me.pars.properties.annexObs   = item.annexObs;

        me.pars.properties.postData.annexId = me.pars.properties.annexId    = item.annexId;


        me.updateInPopup(me, me.annexUpdate);

        // console.log(me.pars.properties);
        if(typeof focusInput === 'boolean' && focusInput === true) {
            console.log("ENTROU");
            $("[data-bind=annexName]").focus(function() { $(this).select(); } ).trigger("focus");
        }

    };

    /**
     * @description Altera em tempo de execução qualquer propriedade do módulo
     * @param String elem Nome do atributo
     * @param Any val Valor para o atributo
     *
     */
    me.setProperty = function (elem,val) {
        me.pars.properties[elem] = val;
    };

    /**
     * @description Responsável por adicionar ou remover a classe .invalid
     * e retorna os valores que devem ser persistidos no banco
     *
     */
    me.getValues = function () {
        var values = {}, formatedDate = null;
        $(".popup").find("[data-bind]").each(function () {
            values[$(this).data("bind")] = $(this).val();
            $(this).removeClass("invalid");
            if ($factory.validation($(this).val(), $(this).data("type"), $(this).attr("required"))) {
                $(this).addClass("invalid");
            }
        });

        values.peopleId = me.pars.properties.peopleId;

        $.extend(true, me.pars.properties, values);
        $.extend(true, me.pars.properties.postData, values);

        return me;
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
        me.pars.properties.screenMode  = 1;
        me.pars.properties.annexesList = obj;
        return me;
    };

    me.submit = function () {
        var values = me.getValues(), sel = $(me.pars.element).find(".invalid");
        if (sel.length) {
            sel.removeClass("blink").addClass("blink").focus(function () {
                $(this).removeClass("blink");
            });
        } else {
            me.call(values);
        }
    };

    return me;

};
