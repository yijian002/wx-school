require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        qrcode: 'lib/qrcode.min',
        route: 'js/helper/route',
        util: 'js/helper/util',
        comm: 'js/helper/comm'
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

require(['vue', 'zepto', 'route', 'qrcode'], function(vue, $, route) {

    var vm = new vue({
        el: '#user-my-teacher-main',
        data: {
            imageUrl: null,
            teacherName: '老师名字',
            teacherHead: ''
        },
        methods: {

        }
    });

    var app = {
        get: function() {
            route({url: '/api/me/teacher'}, function(response) {
                if (!response) {
                    return;
                }

                vm.imageUrl = response.imageUrl;
            });
        },
        // initQrcode: function(str) {
        //     var qrcode = document.getElementById('qrcode');

        //     new QRCode(qrcode, {
        //         text: 'http://www.baidu.com/',
        //         width: 110,
        //         height: 110,
        //         correctLevel : QRCode.CorrectLevel.L
        //     });
        // },
        init: function() {
            this.get();

            delete this.init;
        }
    };

    app.init();

});