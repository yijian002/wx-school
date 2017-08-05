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

                // var sound;
                // for (var i = response.length - 1; i >= 0; i--) {
                //     sound = new Audio(response[i].audioUrl);
                //     _showDuration(sound.duration);
                // }

                // function _showDuration(duration) {
                //     setTimeout(function() {
                //         console.log(duration);
                //     }, 1000);
                // }

                vm.free_class = response;
            });
        },
        getBestClass: function() {
            route({url: '/api/parentsHall/courses'}, function(response) {
                if(! response) {
                    return;
                }

                for (var i = response.length - 1; i >= 0; i--) {
                    response[i].durationTotal = response[i].durationTotal.toFixed(0);
                }

                vm.best_class = response;
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
            $(window).off('scroll').on('scroll', function() {
                clearTimeout(timer_search);

                timer_search = setTimeout(function() {
                    vm.is_search = _canLoad() ? true : false;

                    _this.blurSearch();
                }, 100);
            });

            function _canLoad() {
                return (document.documentElement.scrollHeight) <= (document.documentElement.scrollTop | document.body.scrollTop) + document.documentElement.clientHeight + 50;
            }
        },
        blurSearch: function() {
            timer_search = setTimeout(function() { // 3秒自动隐藏
                vm.is_search = false;
            }, 2000);
        },
        init: function() {
            this.initFirst();
            this.initSearch();

            this.getBanners();
            this.getFreeClass();
            this.getBestClass();
            delete this.init;
        }
    };

    app.init();

});