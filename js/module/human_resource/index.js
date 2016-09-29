
$.human_resource = function (me) {

    me.pars = $.extend(true, {
        model: $model.humanResource,
        properties: {
        },
        element: null
    }, me.pars);

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

    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function (action, attr) {
        
        switch (action) {
            case 'store':
            case 'edit':
            case 'update':
                me.updateEmployedForm(attr);
                break;
            case 'availability':
                me.updateAvailability(attr);
                break;
            case 'search':
                me.updateEmployeesList(attr);
                break;
        }

    };

    me.updateEmployedForm = function (attr) {
        
        var instance = $factory.execute('employees_form'), newInstance;
        
        if (!instance) {
            instance = $factory.createInstance("employees_form", "employees_form", {}, me);
        }
        
        if (!attr) {
            
            newInstance = $factory.resetInstance(instance,{});
            newInstance.init().setElement(newInstance, "#human_resource").showPage(newInstance).update(newInstance);
            newInstance.updatePersonData();   
            
        } else {
            
            instance.init().setElement(instance, "#human_resource").get(attr).showPage(instance).update(instance);
            instance.updatePersonData();
        
        }
        return me;
        
    };

    me.updateAvailability = function(attr) {
        var instance = $factory.execute('teacher_availability'), newInstance;
        
        if (!instance) {
            instance = $factory.createInstance("teacher_availability", "teacher_availability", {}, me);
        }
        
        if (!attr) {
            
            newInstance = $factory.resetInstance(instance,{});
            newInstance.init().setElement(newInstance, "#human_resource").showPage(newInstance).update(newInstance);
            
        } else {
            
            instance.setElement(instance, "#human_resource").get(attr);//.showPage(instance);//.update(instance);
        
        }
        return me;        
    };
    
    me.updateEmployeesList = function(attr) {
        var instance = $factory.execute('employees_list'), newInstance;
        
        if (!instance) {
            instance = $factory.createInstance("employees_list", "employees_list", {}, me);
        }
        
        if (!attr) {
            
            newInstance = $factory.resetInstance(instance,{});
            newInstance.init().setElement(newInstance, "#human_resource").showPage(newInstance).update(newInstance);
            
        } else {
            console.log('com attr!!');
            instance.setElement(newInstance, "#human_resource").get(attr).showPage(instance).update(instance);
        
        }
        return me;        
    };
    
    me.next = function(param) {
        $routes.changeRoute(["module", "human_resource", "update", param.employeesId]);
    };

    return me;

};



