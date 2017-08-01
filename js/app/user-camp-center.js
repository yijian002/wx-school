require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        dateTimePicker: 'lib/date-time-picker.min',
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

require(['vue', 'zepto', 'route', 'config', 'comm', 'dateTimePicker'], function(vue, $, route, _c, comm, dateTimePicker) {

    var vm = new vue({
        el: '#user-infomation',
        data: {
            user: {}
        },
        methods: {
            change: function(e) {
                app.save();
            },
            selectTime: function(key) {
                var _this = this,
                    timePicker = new dateTimePicker.Time({
                        lang: 'zh-CN',
                        format: 'HH:mm'
                    });

                timePicker.on('selected', function (formatTime, now) {
                    _this.user[key] = formatTime;
                });
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
            user = user ? JSON.parse(user) : {};
            user.homeTime = '12:20';
            user.homeWork = '11:10';
            user.interestTime = '13:20';

            vm.user = user;

            delete this.init;
        }
    };

    app.init();

});