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
            user: {
                birthday: '',
                mobile: ''
            }
        },
        methods: {
            change: function(e) {
                app.save();
            },
            bindPhone: function() {
                window.location.href = 'user-bind-phone.html';
            }
        },
        watch: {}
    });

    var app = {
        save: function() {
            var birthday = vm.user.birthday;

            if(birthday === '') {
                return;
            }

            route({url: '/api/me/userInfo', type: 'POST', params: {
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