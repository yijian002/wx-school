require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        route: 'js/helper/route',
        util: 'js/helper/util',
        comm: 'js/helper/comm',
        config: 'js/helper/config'
    },
    shim: {
        zepto: {
            deps: ['vue'],
            exports: '$'
        },
        route: {
            deps: ['zepto', 'comm']
        }
    }
});

require(['vue', 'zepto', 'route', 'config', 'comm'], function(vue, $, route, _c, comm) {

    var vm = new vue({
        el: '#user-main',
        data: {
            user: {

            }
        },
        methods: {

        }
    });

    var app = {
        get: function() {
            route({url: '/api/me/userInfo'}, function(response) {
                response.levelPoints = 500;
                response.leveling = (response.pointsTotal / response.levelPoints * 100) + '%';

                vm.user = response;
                comm.setCache(_c.CACHE_USER_INFO, response);
            });
        },
        init: function() {
            this.get();
            delete this.init;
        }
    };

    app.init();

});