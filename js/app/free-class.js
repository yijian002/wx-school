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
        el: '#free-class-main',
        data: {
            show: false,
            free_class: []
        },
        methods: {
            playSound: function(url, id) {
                if(!url) {
                    alert('没有发现音频文件');
                    return;
                }

                $('.sound.playing').removeClass('playing');
                $('#free_class_'+ id).find('.sound').toggleClass('playing');

                util.sound({url: url, ended: function() {
                    $('#free_class_'+ id).find('.sound').removeClass('playing');
                }});
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

            route({url: '/api/parentsHall/freeCourses', params: {
                pageNum: this._page,
                pageSize: 20
            }}, function(response) {
                if(! response) {
                    return;
                }

                if (response.result.length === 0) {
                    _this._page = -1;
                } else {
                    for (var i = 0; i < response.result.length; i++) {
                        if(response.result[i].duration) {
                            response.result[i].longtime = parseInt(response.result[i].duration/60) + "'";
                            if(response.result[i].duration%60 > 0) {
                                var s = (response.result[i].duration%60).toFixed(0);
                                if(s < 10) {
                                    s = '0' + s;
                                }
                                response.result[i].longtime += s + '"';
                            }
                        }
                        else {
                            response.result[i].longtime = '0"';
                        }
                    }
                
                    vm.free_class = vm.free_class.concat(response.result);
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