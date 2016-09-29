/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.curricularBases = function (me) {

    me.pars = $.extend(true, {
        properties: {
            dirState: "onecol",
            bases: [],
            basesItemSelected: false,
            stepsList: {},
            steps: {},
            stepsItemSelected: false,
            componentsList: {},
            components: {},
            inputBase: null,
            comboStep: null,
            comboComponent: null,
            postData: {},
            componentPostData:{}
        },
        element: ""
    }, me.pars);

    me.construct = function (obj) {
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

    me.init = function (call) {

        $model.conf.curriculum.getBasesComponentsBySchool({id: 1}, function (ret) {
            me.pars.properties.bases = ret.bases;
            me.pars.properties.components_ = ret.components;
            call(me);
        });
        
        return me;


    };

    /**
     * @description Responsável por adicionar ou remover a classe .invalid 
     * e retorna os valores que devem ser persistidos no banco
     * 
     */
    me.getValues = function (from,to) {
        var values = {}, formatedDate = null;
        $(from).find("[data-bind]").each(function () {
            values[$(this).data("bind")] = $(this).val();
            $(this).removeClass("invalid");
            if ($factory.validation($(this).val(), $(this).data("type"), $(this).attr("required"))) {
                $(this).addClass("invalid");
            }
        });

        _.each(to,function(val){
            $.extend(true, val, values);
        });

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

    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function (action, attr) {

        if (attr) {
            me.pars.properties.action = action;
            me.pars.properties.studentId = attr;
            me.setElement(me,"[data-mod=curricularBases]").init(me.update).get(attr).showPage(me);
        } else {
//            debugger;
            me.setElement(me,"[data-mod=curricularBases]").init(me.update).showPage(me);

        }

    };

    me.context = function (pars) {
        
        pars.listBasesItems.find('li').not('.selected').evt("click", function () {
            me.getValues('#curricular-bases',[me.pars.properties,me.pars.properties.postData]).selectBase($(this).data("id"),me.update);
        });

        pars.curricularStepsItems.find('li').not('.selected').evt("click", function () {
            me.getValues('#curricular-bases',[me.pars.properties,me.pars.properties.postData]).selectStep($(this).data("id"),me.update);
        });

        pars.listBasesItems.find('li').find(".edit").evt("click", function () {
            
            var context, attrs, value = $('li').has($(this)).find(".cell").html();
            
            attrs = me.pars.properties.bases.filter(function(f){
                return f.baseName == value;
            })[0];
            
            $.curtain(function (content, self) {
                $factory.getTemplate("template/config/curricularBases/base-props.html", function (foo) {
                    context = foo(attrs);
                    content = $factory.renderModule(content,context);
                    $.getContext(content, me.addListener);
                });
            });
        });

        pars.listComponentsItems.find('li').find(".edit").evt("click", function () {
            
            var context, item = me.pars.properties.components[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected][$(this).data('idx')];
            $.extend(true,me.pars.properties.componentPostData,item);
            
            $.curtain(function (content, self) {
                $factory.getTemplate("template/config/curricularBases/components-props.html", function (foo) {
                    item.dic = me.pars.dic;
                    context = foo(item);
                    content = $factory.renderModule(content,context);
                    $.getContext(content, me.addComponentsListener);
                });
            });
        });

        if (pars.cadBase) {
            pars.cadBase.evt("click", function () {
                if ($(this).parent().find("input").val() === "")
                    return;
                me.getValues('#curricular-bases',[me.pars.properties,me.pars.properties.postData]).cadBase();
            });
        }

        if (pars.cadStep) {
            pars.cadStep.evt("click", function () {
                me.getValues('#curricular-bases',[me.pars.properties,me.pars.properties.postData]).cadStep();
            });
        }

        if (pars.cadComponent) {
            pars.cadComponent.evt("click", function () {
                me.getValues('#curricular-bases',[me.pars.properties,me.pars.properties.postData]).cadComponent();
            });
        }
        
    };

    me.addComponentsListener = function (pars) {
        if (pars.cancel) {
            pars.cancel.evt("click",function(){
                $(".popup").has($(this)).remove();
            });
        }

        if (pars.submit) {
            pars.submit.evt("click",function(e){
                me.getValues('#componentsProps',[me.pars.properties.componentPostData]);
                
                $model.conf.curriculum.post(me.pars.properties.componentPostData,function(ret){
                    me.pars.properties.components[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected] = ret;
                    setTimeout(function(){
                        $(".popup").remove();
                    },700);                        
                });
            });
        }
    };


    me.selectBase = function (id,call) {
        var arr = $factory.lookup.steps.slice(0);
        $model.conf.curricularSteps.getStepsToBase({id:id},function(ret){
            
            me.pars.properties.steps[id] = ret;
            me.pars.properties.dirState = "twocol";
            me.pars.properties.stepsItemSelected = false;
            me.pars.properties.basesItemSelected = id;
            
            //cada vez que eu seleciono uma base, preciso remover da lista de etapas os elementos já vinculados
            me.pars.properties.stepsList[id] = arr.filter(function (f) {
                return _.indexOf(_.pluck(me.pars.properties.steps[id], "id") || [], f.id) == -1;
            }); 
            
            call(me);
            
        });
        

        //return me;
    };

    me.selectStep = function (id,call) {
        var arr = me.pars.properties.components_.slice(0), 
            list = me.pars.properties.components[me.pars.properties.basesItemSelected] || {};
        
        $model.conf.curriculum.getComponentsFromBaseSteps({id:id},function(ret){
            me.pars.properties.components[me.pars.properties.basesItemSelected] = {};
            me.pars.properties.components[me.pars.properties.basesItemSelected][id] = ret;
            me.pars.properties.dirState = "";
            me.pars.properties.stepsItemSelected = id;
            me.pars.properties.componentsList[me.pars.properties.basesItemSelected] = {};
            me.pars.properties.componentsList[me.pars.properties.basesItemSelected][id] = arr.filter(function (f) {
                return _.indexOf(_.pluck(list[id], "id") || [], f.id) == -1;
            });
            
            call(me);
            
        });
    };

    me.cadBase = function () {
        $model.conf.curricularBases.post({baseSchoolId:1, baseName:me.pars.properties.inputBase}, function (ret) {
            me.pars.properties.bases.push(ret);
            me.pars.properties.basesItemSelected = ret.id;
            me.pars.properties.inputBase = null;
            me.selectBase(ret.baseId,me.update);
        });
    };

    me.cadStep = function () {
        if (me.pars.properties.comboStep == 0)
            return;
        
        var data, 
            arr = $factory.lookup.steps.slice(0),
            item = arr.filter(function (f) {
                return f.id == me.pars.properties.comboStep;
            })[0];
            
        data = {stepId: item.id, baseId: me.pars.properties.basesItemSelected};
        
        $model.conf.curricularSteps.post(data,function(id){
            
            if (!me.pars.properties.steps[me.pars.properties.basesItemSelected]) {
                me.pars.properties.steps[me.pars.properties.basesItemSelected] = [];
            }
            item.curricularId = id;
            item.stepName = item.name;
            me.pars.properties.steps[me.pars.properties.basesItemSelected].push(item);
            me.pars.properties.stepsList[me.pars.properties.basesItemSelected].splice(_.indexOf(me.pars.properties.stepsList[me.pars.properties.basesItemSelected], item), 1);
            me.pars.properties.stepsItemSelected = item.id;
            me.selectStep(id,me.update);            
            
        });

    };

    me.cadComponent = function () {
        if (me.pars.properties.comboComponent == 0)
            return me;
        var arr = me.pars.properties.components_.slice(0),
                item = arr.filter(function (f) {
                    return f.id == me.pars.properties.comboComponent;
                })[0];

        if (!me.pars.properties.components[me.pars.properties.basesItemSelected]) {
            me.pars.properties.components[me.pars.properties.basesItemSelected] = {};
        }

        if (!me.pars.properties.components[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected]) {
            me.pars.properties.components[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected] = [];
        }
        
        item.curricularId = me.pars.properties.stepsItemSelected;
        item.componentId = item.id;
        
        $model.conf.curriculum.post(item,function(ret){
            
//            me.pars.properties.components[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected].push(item);
            me.pars.properties.components[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected] = ret;
            me.pars.properties.componentsList[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected].splice(_.indexOf(me.pars.properties.componentsList[me.pars.properties.basesItemSelected][me.pars.properties.stepsItemSelected], item), 1);
            me.update(me);            
            
        });
    };

    return me;
};
