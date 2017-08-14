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

    var timer_search = null,
        timer_srcoll = null;

    var vm = new vue({
        el: '#index-main',
        data: {
            show: false,
            is_search: false,
            search_key: '',
            slider: [],
            free_class: [],
            best_class: [],
            search_class: []
        },
        methods: {
            showPoster: function(type, url) {
                if(type === 'poster') {
                    util.dialog('.dialog-posters').find('.contents').css({backgroundImage: 'url('+ url +')'});
                }
                else if(type === 'link') {
                    window.location.href = url;
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
                clearTimeout(timer_srcoll);
                $(window).off('scroll');

                this.is_search = true;
            },
            blurSearch: function() {
                app.blurSearch();
                app.initSearch();
            },
            search: function() {
                clearTimeout(timer_search);

                timer_search = setTimeout(function() {
                    app._spage = 1;
                    app.getSearchClass();
                }, 100);
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
        _spage: 1,
        getBanners: function() {
            route({url: '/api/parentsHall/banners'}, function(response) {
                if(! response) {
                    return;
                }

                vm.slider = response;
            });
        },
        getFreeClass: function(callback) {
            route({url: '/api/parentsHall/freeCourses', params: {
                pageNum: 1,
                pageSize: 2,
            }}, function(response) {
                if(callback) {
                    callback();
                }

                if(! response) {
                    return;
                }

                vm.free_class = response.result;
            });
        },
        getBestClass: function(callback) {
            var _this = this,
                page = this._page;
            if(page < 1) {
                this._page = -1;
                return;
            }

            route({url: '/api/parentsHall/courses', params: {
                pageNum: page,
                pageSize: 5,
            }}, function(response) {
                if(callback) {
                    callback();
                }

                response = response.result;
                if(! response || !response.length) {
                    _this._page = -1;
                    return;
                }

                for (var i = response.length - 1; i >= 0; i--) {
                    response[i].durationTotal = response[i].durationTotal.toFixed(0);
                }

                vm.best_class = vm.best_class.concat(response);
            });
        },
        getSearchClass: function() {
            if(vm.search_key === '') {
                // this.initSearch();
                // this.blurSearch();
                return;
            }

            var _this = this;

            if(this._spage < 1) {
                this._spage = -1;
                return;
            }

            route({url: '/api/parentsHall/courses', type: 'POST', params: JSON.stringify( {'pageNum':this._spage,'pageSize':10,'keywords':vm.search_key} ), isJson: true}, function(response) {

                if(_this._spage === 1) {
                    vm.search_class = [];
                }

                if(! response.result || !response.result.length) {
                    _this._spage = -1;
                    return;
                }

                vm.search_class = vm.search_class.concat(response.result);
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
            $(window).off('scroll.search').on('scroll.search', function() {
                clearTimeout(timer_srcoll);

                timer_srcoll = setTimeout(function() {
                    vm.is_search = _canLoad() || vm.search_key !== '' ? true : false;

                    _this.blurSearch();
                }, 0);
            });

            function _canLoad() {
                return (document.documentElement.scrollTop || document.body.scrollTop) > 260;
            }
        },
        blurSearch: function() {
            if(vm.search_key !== '') {
                // this._spage = 1;
                // this.getSearchClass();
                return;
            }

            timer_srcoll = setTimeout(function() { // 2秒自动隐藏
                vm.is_search = false;
            }, 2000);
        },
        bind: function() {
            var _this = this;

            util.loadMore({
                loading: function() {
                    if(vm.search_key !== '') {
                        _this._spage++;
                        _this.getSearchClass();
                    }
                    else {
                        _this._page++;
                        _this.getBestClass();
                    }
                }
            });
        },
        loaded: function() {
            util.loading('hide');
            vm.show = true;
        },
        init: function() {
            var _this = this;

            this.initFirst();
            this.initSearch();

            this.getBanners();
            this.getFreeClass(function() {
                _this.getBestClass(_this.loaded);
            });

            this.bind();
            delete this.init;
        }
    };

    app.init();

});