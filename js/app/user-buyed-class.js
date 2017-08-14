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
        _page: 1,
        getList: function() {
            route({url: '/api/me/courses', params: {
                pageNum: this._page,
                pageSize: 10
            }}, function(response) {
                if(! response) {
                    return;
                }

                response.result = response.result || [];

                if(!response.result.length) {
                    alert('您还没购买过课程');
                    return;
                }

                vm.list = response.result;
            });
        },
        init: function() {
            this.getList()

            delete this.init;
        }
    };

    app.init();

});