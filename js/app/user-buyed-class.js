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
        el: '#user-class',
        data: {
            list: []
        },
        methods: {}
    });

    var app = {
        getList: function() {
            route({url: '/api/me/courses'}, function(response) {
                if(! response) {
                    return;
                }

                if(!response.length) {
                    alert('暂无购买课程');
                    return;
                }

                vm.list = response;
            });
        },
        init: function() {
            this.getList()

            delete this.init;
        }
    };

    app.init();

});