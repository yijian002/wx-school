require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        swiper: 'lib/swiper.min',
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

require(['vue', 'zepto', 'route', 'util', 'comm', 'swiper'], function(vue, $, route, util, comm) {

    var timer_search = null;

    var vm = new vue({
        el: '#index-main',
        data: {
            // loaded: true,
            is_search: false,
            slider: [],
            free_class: [],
            best_class: []
        },
        methods: {
            showPoster: function(type, url) {
                if(type === 'poster') {
                    util.dialog('.dialog-posters').find('.contents').css({backgroundImage: 'url('+ url +')'});
                }
            },
            playSound: function(url, id) {
                $('.sound.playing').removeClass('playing');
                $('#free_class_'+ id).find('.sound').toggleClass('playing');

                util.sound({url: url, ended: function() {
                    $('#free_class_'+ id).find('.sound').removeClass('playing');
                }});
            },
            inputSearch: function() {
                clearTimeout(timer_search);
                $(window).off('scroll');

                this.is_search = true;
            },
            blurSearch: function() {
                app.blurSearch();
                app.initSearch();
            }
        },
        watch: {
        },
        updated: function() {
            new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: false,
                spaceBetween: 30,
                loop: true
            });
        }
    });

    var app = {
        _page: 1,
        getBanners: function() {
            route({url: '/api/parentsHall/banners'}, function(response) {
                if(! response) {
                    return;
                }

                vm.slider = response;
            });
        },
        getFreeClass: function() {
            route({url: '/api/parentsHall/freeCourses'}, function(response) {
                if(! response) {
                    return;
                }

                vm.free_class = response;
            });
        },
        getBestClass: function() {
            var _this = this,
                page = this._page;
            if(page < 1) {
                this._page = -1;
                return;
            }

            route({url: '/api/parentsHall/courses', params: {
                pageNum: page,
                pageSize: 10,
            }}, function(response) {
                if(! response || !response.length) {
                    _this.page = -1;
                    return;
                }

                for (var i = response.length - 1; i >= 0; i--) {
                    response[i].durationTotal = response[i].durationTotal.toFixed(0);
                }

                vm.best_class = vm.best_class.concat(response);
            });
        },
        initFirst: function() {
            var _this = this;
            var cache_name = 'welcome_first';
            if(comm.getCache(cache_name)) {
                return;
            }

            comm.setCache(cache_name, 1);

            route({url: '/api/parentsHall/welcome'}, function(response) {
                if(! response) {
                    return;
                }

                var $dialog = util.dialog('.dialog-first', {close: function() {
                    util.sound('pause');
                }});

                $dialog.find('.pic').html('<img src="'+ response.teacherHeadimgUrl +'" />');
                $dialog.find('.sound').off().on('click', function() {
                    $(this).toggleClass('playing');

                    util.sound({url: response.teacherAudioUrl, ended: function() {
                        $dialog.find('.sound').removeClass('playing');
                    }});
                });
            });
        },
        initSearch: function() {
            var _this = this;
            $(window).on('scroll.search', function() {
                clearTimeout(timer_search);

                timer_search = setTimeout(function() {
                    vm.is_search = _canLoad() ? true : false;

                    _this.blurSearch();
                }, 0);
            });

            function _canLoad() {
                return (document.documentElement.scrollTop || document.body.scrollTop) > 300;
                // return (document.documentElement.scrollHeight) <= (document.documentElement.scrollTop | document.body.scrollTop) + document.documentElement.clientHeight + 50;
            }
        },
        blurSearch: function() {
            timer_search = setTimeout(function() { // 3秒自动隐藏
                vm.is_search = false;
            }, 2000);
        },
        bind: function() {
            var _this = this;

            util.loadMore({
                loading: function() {
                    _this.page++;
                    _this.getBestClass();
                }
            });
        },
        init: function() {
            this.initFirst();
            this.initSearch();

            this.getBanners();
            this.getFreeClass();
            this.getBestClass();

            this.bind();
            delete this.init;
        }
    };

    app.init();

});