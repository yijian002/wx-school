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
        el: '#user-bind-phone-main',
        data: {
            mobile: '',
            code: '',
            sec: 0
        },
        methods: {
            getCode: function() {
                if(this.sec > 0) {
                    return;
                }

                if(this.mobile === '' || !comm.isInt(this.mobile)) {
                    alert('请输入正确的手机号码');
                    return;
                }

                route({url: '/api/sms/send', type: 'POST', params: JSON.stringify( {type: 'changeMobile', mobile: this.mobile} )}, function(response) {
                    if (!response) {
                        return;
                    }

                    app.timeSec();
                });
            },
            save: function() {
                if(this.mobile === '' || !comm.isInt(this.mobile)) {
                    alert('请输入正确的手机号码');
                    return;
                }

                if(this.code === '') {
                    alert('请输入短信验证码');
                    return;
                }

                route({url: '/api/me/userInfo', type: 'POST', params: JSON.stringify( {code: this.code, mobile: this.mobile} )}, function(response) {
                    if (!response) {
                        return;
                    }

                    window.location.href = 'user-info.html';
                });
            }
        },
        watch: {}
    });

    var app = {
        timeSec: function() {
            vm.sec = 20;
            var timer = setInterval(function() {
                vm.sec--;

                if(vm.sec <= 0) {
                    clearInterval(timer);
                }
            }, 1000);
        },
        init: function() {

            delete this.init;
        }
    };

    app.init();

});