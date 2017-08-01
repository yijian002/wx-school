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
        el: '#user-infomation',
        data: {
            user: {}
        },
        methods: {
            change: function(e) {
                app.save();
            }
        },
        watch: {}
    });

    var app = {
        save: function() {
            var mobile = vm.user.mobile,
                birthday = vm.user.birthday;

            if(String(mobile).length !== 11 || birthday === '') {
                return;
            }

            route({url: '/api/me/userInfo', type: 'POST', params: {
                mobile: mobile,
                birthday: birthday
            }}, function() {

            });
        },
        init: function() {
            var user = comm.getCache(_c.CACHE_USER_INFO);
            vm.user = user ? JSON.parse(user) : {};

            delete this.init;
        }
    };

    app.init();

});