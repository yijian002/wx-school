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
        el: '#user-plan-feedback-main',
        data: {
            text: '',
            imgs: [
                {idx: 0, img_id: null},
                {idx: 1, img_id: null},
                {idx: 2, img_id: null},
                {idx: 3, img_id: null},
                {idx: 4, img_id: null},
                {idx: 5, img_id: null},
                {idx: 6, img_id: null},
                {idx: 7, img_id: null},
                {idx: 8, img_id: null}
            ],
            sound: ''
        },
        methods: {
            setSound: function() {
            },
            uploadImg: function(idx) {

            },
            save: function() {
                
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