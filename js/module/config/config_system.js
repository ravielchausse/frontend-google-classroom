$.configSystem = function(me) {

    me.pars = $.extend(true, {
        model: $model.conf.system,
        properties: {
            clientId: null,
            clientSecret: null,
            googleClassroomEnable: false,
            ftpHost: null,
            ftpUser: null,
            ftpPassword: null
        },
        element: null,

    }, me.pars);


    /**
     * @description Método construtor
     * @param  Object obj
     */
    me.construct = function (obj) {

        me.setElement(me, obj.element);
        var i;
        if (obj && obj.attrs) {
            for (i in obj.attrs) {
                me.setProperty(obj.attrs[i].attr, obj.attrs[i].val);
            }
        }
    };

    /**
     * @description Método para carga inicial do objeto
     * @return me
     */
    me.init = function () {
        me.loadSystemConfigs();
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
     * @description Método para vinculo dos events listener's
     * @param  pars
     */
    me.context = function (pars) {
        pars.saveGoogleClassroomCredentials.evt("click", function (e) {
            me.getValues().saveGoogleClassroomCredentials();
        });

        pars.handleFtpSettings.evt("click", function (e) {
            me.getValues().handleFtpSettings();
        });

        pars.toogleGoogleClassConfig.evt("click", function(e) {

            if (me.pars.properties.googleClassroomEnable) {
                me.resetGoogleClassroomCredentials();
            }

            $("#googleClassroomForm").slideToggle();
            me.pars.properties.googleClassroomEnable = !me.pars.properties.googleClassroomEnable;
        });
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

        $.extend(true, me.pars.properties, values);

        return me;
    };

    /**
     * @description Função Padrão do template usada para carregar o módulo num determinado estado.
     * Ex. View / Update / New / etc...
     * @param String action Método Pertencente a esta controller
     * @param Array attr  Parâmetros do Action
     * @returns void
     */
    me.setState = function (action, attr) {
        var instance = (attr) ? me : $factory.resetInstance(me);

        if (!attr) {
            instance.init().setElement(instance, "#config_system").showPage(instance).update(instance);
        }

    };

    me.saveGoogleClassroomCredentials = function() {
        var data = [
            {name: 'google_classroom_client_id', value: me.pars.properties.clientId},
            {name: 'google_classroom_client_secret', value: me.pars.properties.clientSecret}
        ];

        me.pars.model.handleGoogleClassroomCredentials(data, function(ret) {
            var urlAuth = '';
            for (var i = ret.length - 1; i >= 0; i--) {
                console.log(ret);
                switch(ret[i].name) {
                    case 'google_classroom_client_id':
                        me.pars.properties.clientId = ret[i].value;
                        break;

                    case 'google_classroom_client_secret':
                        me.pars.properties.clientSecret = ret[i].value;
                        break;
                }

                if (ret[i].urlAuth) {
                    urlAuth = ret[i].urlAuth;
                }
            }


            window.open (
                urlAuth,
                'page',
                "width=580, height=450, top=100, left=110, scrollbars=no "
            );

            $.msg("Credenciais salvas com sucesso!","success");
            me.update(me);
        });

        return me;
    };

    me.loadSystemConfigs = function () {
        me.pars.model.getSystemConfigs({}, function(ret)  {

            me.pars.properties.clientId              = ret.clientId;
            me.pars.properties.clientSecret          = ret.clientSecret;
            me.pars.properties.googleClassroomEnable = ret.googleClassroomEnable;

            me.pars.properties.ftpHost               = ret.ftpHost;
            me.pars.properties.ftpUser               = ret.ftpUser;
            me.pars.properties.ftpPassword           = ret.ftpPassword;

            me.update(me);

        });

        return me;
    };

    me.handleFtpSettings = function() {

        var data = [
            {name: 'ftp_servidor', value: me.pars.properties.ftpHost},
            {name: 'ftp_login', value: me.pars.properties.ftpUser},
            {name: 'ftp_password', value: me.pars.properties.ftpPassword}
        ];

        me.pars.model.handleFtpSettings(data, function(ret) {
            for (var i = ret.length - 1; i >= 0; i--) {
                switch(ret[i].name) {
                    case 'ftp_servidor':
                        me.pars.properties.ftpHost = ret[i].value;
                        break;

                    case 'ftp_login':
                        me.pars.properties.ftpUser = ret[i].value;
                        break;

                    case 'ftp_password':
                        me.pars.properties.ftpPassword = ret[i].value;
                        break;
                }

            }
            $.msg("FTP salvo com sucesso!","success");
            me.update(me);
        });
    };

    me.resetGoogleClassroomCredentials = function () {
        me.pars.model.resetGoogleClassroomCredentials({}, function(ret) {

            if (me.pars.properties.clientId != null && me.pars.properties.clientSecret != null) {
                $.msg('Credenciais apagadas com sucesso', 'success');
            }

            me.pars.properties.clientId              = null;
            me.pars.properties.clientSecret          = null;
            me.pars.properties.googleClassroomEnable = false;

            me.update(me);
        });
    }

    return me;

};