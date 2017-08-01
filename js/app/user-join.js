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
        el: '#user-join',
        data: {
            code: 6666
        },
        methods: {

        }
    });

    var app = {
        initQrcode: function() {
            var qrcode = document.getElementById('qrcode');

            new QRCode(qrcode, {
                text: 'http://www.baidu.com/',
                width: 110,
                height: 110,
                correctLevel : QRCode.CorrectLevel.L
            });
        },
        init: function() {
            this.initQrcode();
            delete this.init;
        }
    };

    app.init();

});