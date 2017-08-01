require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
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

require(['zepto', 'route', 'util', 'comm'], function($, route, util, comm) {

    var app = {
        bind: function() {
            $('.contents .item').on('click', '.ico', function() {
                $(this).parent().toggleClass('close');
            });
        },
        init: function() {
            this.bind()

            delete this.init;
        }
    };

    app.init();

});