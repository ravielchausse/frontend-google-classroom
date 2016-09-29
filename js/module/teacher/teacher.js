$.teacher = function(me) {
  
    me.pars = $.extend(true,{
        model: $model.humanResource,
        person_data: null,
        properties:{
            activeTab: 1,
            disabledTab: {
                persondata: false,
                timesheet: true
            },
            postData:{}
        },
        element:null
        
    },me.pars);
    
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

        //Dados Básicos do Indivíduo: 1ª aba
        me.pars.person_data = null;
        me.pars.person_data = $factory.createInstance("employed_data", "person_data", {
            attrs: [
                //{attr: "element",val:"#persondata"}
            ]
        }, me);

        me.pars.person_data.setCallback(me.persistEmployed);

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
        
    };    
    
    me.updatePersonData = function () {
        var instance = me.pars.person_data;
        instance.setElement(instance, "#persondata").update(instance);
    };    
    
    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function (action, attr) {
        var newInstance;
        if (attr) {
            me.pars.properties.action = action;
            me.init().get(attr).showPage(me).update(me);
        } else {

            newInstance = $factory.resetInstance(me);
            newInstance.init().setElement(newInstance, "#human_resource").showPage(newInstance).update(newInstance);
            newInstance.updatePersonData();

        }
    };
    
    /**
     * @description Responsável por adicionar ou remover a classe .invalid 
     * e retorna os valores que devem ser persistidos no banco
     * 
     */
    me.getValues = function () {
        var values = {}, formatedDate = null;
        $(me.pars.element).find("[data-bind]").each(function () {
            values[$(this).data("bind")] = $(this).val();
            $(this).removeClass("invalid");
            if ($factory.validation($(this).val(), $(this).data("type"), $(this).attr("required"))) {
                $(this).addClass("invalid");
            }
        });

        $.extend(true, me.pars.properties.postData, values);
        $.extend(true, me.pars.properties, values);

        return me;
    };
    
    
    me.persistEmployed = function(data) {
        data.schoolId = 1;
        data.employeesTypeId = 3;
        me.pars.model.post(data,function(ret){
            console.log(ret);
        });
    };
    
    me.get = function(id) {
        
        me.pars.model.get({id:id},function(ret){
            
            me.pars.person_data
                .setElement(me.pars.person_data, "#persondata")
                .loadData(ret.employed)
                .update(me.pars.person_data);
            
            
        });
        return me;
    };
    
    return me;
    
};