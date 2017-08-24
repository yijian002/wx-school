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
            show: false,
            list: []
        },
        methods: {
            goCourseDetail: function(id) {
                location.href = 'course-detail.html?id=' + id;
            }
        }
    });

    var app = {
        _page: 1,
        getList: function(callback) {
            var _this = this;
            if(this._page < 1) {
                this._page = -1;
                return;
            }

            route({url: '/api/me/courses', params: {
                pageNum: this._page,
                pageSize: 10
            }}, function(response) {
                if(! response) {
                    return;
                }

                if (response.result.length === 0) {
                    _this._page = -1;
                } else {
                    vm.list = vm.list.concat(response.result);
                }

                if(callback) {
                    callback();
                }
            });
        },
        bind: function() {
            var _this = this;

            util.loadMore({
                loading: function() {
                    _this._page++;
                    _this.getList();
                }
            });
        },
        loaded: function() {
            util.loading('hide');
            vm.show = true;
        },
        init: function() {
            this.getList(this.loaded)
            this.bind();

            delete this.init;
        }
    };

    app.init();

});