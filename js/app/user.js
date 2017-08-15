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

require(['vue', 'zepto', 'route', 'config', 'comm', 'util'], function(vue, $, route, _c, comm, util) {

    var vm = new vue({
        el: '#user-main',
        data: {
            show: false,
            user: {

            }
        },
        methods: {

        }
    });

    var app = {
        get: function(callback) {
            route({url: '/api/me/userInfo'}, function(response) {
                response.levelPoints = 500;
                response.leveling = (response.pointsTotal / response.levelPoints * 100) + '%';

                vm.user = response;
                comm.setCache(_c.CACHE_USER_INFO, response);

                if(callback) {
                    callback();
                }
            });
        },
        loaded: function() {
            util.loading('hide');
            vm.show = true;
        },
        init: function() {
            this.get(this.loaded);
            delete this.init;
        }
    };

    app.init();

});