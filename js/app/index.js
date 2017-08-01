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
            playSound: function(url) {

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

                vm.free_class = response;
            });
        },
        getBestClass: function() {
            route({url: '/api/parentsHall/courses'}, function(response) {
                if(! response) {
                    return;
                }

                vm.best_class = response;
            });
        },
        initFirst: function() {
            var cache_name = 'welcome_first';
            if(comm.getCache(cache_name)) {
                return;
            }

            comm.setCache(cache_name, 1);
            util.dialog('.dialog-first');
        },
        initSearch: function() {
            var timer = null;

            $(window).off('scroll').on('scroll', function() {
                clearTimeout(timer);

                timer = setTimeout(function() {
                    vm.is_search = _canLoad() ? true : false;
                }, 100);
            });

            function _canLoad() {
                return (document.documentElement.scrollHeight) <= (document.documentElement.scrollTop | document.body.scrollTop) + document.documentElement.clientHeight + 150;
            }
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