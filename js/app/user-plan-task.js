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

require(['vue', 'zepto', 'route', 'util', 'comm'], function(vue, $, route, util, comm) {

    var vm = new vue({
        el: '#user-plan-task-main',
        data: {
        },
        methods: {
            addFeedback: function() {
                window.location.href = 'user-plan-feedback.html';
            }
        },
        watch: {},
        updated: function() {
        }
    });

    var app = {
        bind: function() {
            
        },
        init: function() {
            this.bind()

            delete this.init;
        }
    };

    app.init();

});