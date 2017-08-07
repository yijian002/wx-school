require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        audiojs: 'lib/audiojs/audio.min',
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

require(['vue', 'zepto', 'route', 'util', 'comm', 'audiojs', 'swiper'], function(vue, $, route, util, comm) {

    vue.directive('focus', {
        inserted: function(el) {
            setTimeout(function() {
                el.focus();
            }, 100);
        },
        updated: function(el) {
            setTimeout(function() {
                el.focus();
            }, 100);
        }
    });

    var vm = new vue({
        el: '#course-detail-main',
        data: {
            detail: {},
            comments: [],
            add_comments: '',
            is_comments: false,
            is_vip: false
        },
        methods: {
            playSound: function(url, id) {
                util.sound({
                    url: url,
                    ended: function() {
                        $('#free_class_' + id).find('.sound').removeClass('playing');
                    }
                });
            },
            buy: function(price) {

            },
            addComments: function(event) {
                this.is_comments = false;
                if (this.add_comments === '') {
                    return;
                }

                var _this = this;
                route({
                    url: '/api/course/comment',
                    type: 'POST',
                    params: {
                        courseId: app._id,
                        comment: _this.add_comments
                    }
                }, function(response) {
                    if (!response) {
                        return;
                    }

                    app.getComments();
                });
            }
        },
        watch: {},
        updated: function() {
            new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: false,
                spaceBetween: 30,
                loop: false
            });

            audiojs.events.ready(function() {
                var audios = document.getElementsByTagName('audio');
                if (!audios || !audios[0]) {
                    return;
                }

                var a1 = audiojs.create(audios[0], {
                    css: false,
                    createPlayer: {
                        markup: false,
                        playPauseClass: 'play-pauseZ',
                        scrubberClass: 'scrubberZ',
                        progressClass: 'progressZ',
                        loaderClass: 'loadedZ',
                        timeClass: 'timeZ',
                        durationClass: 'durationZ',
                        playedClass: 'playedZ',
                        errorMessageClass: 'error-messageZ',
                        playingClass: 'playingZ',
                        loadingClass: 'loadingZ',
                        errorClass: 'errorZ'
                    }
                });
            });
        }
    });

    var app = {
        _id: comm.getUrlParam('id'),
        getInfo: function() {
            route({ url: '/api/course/info', params: { id: this._id } }, function(response) {
                if (!response) {
                    return;
                }

                vm.detail = response;
            });
        },
        getComments: function() {
            route({ url: '/api/course/comments', params: { courseId: this._id } }, function(response) {
                if (!response) {
                    return;
                }

                vm.comments = response;
            });
        },
        getUserInfo: function(callback) {
            route({ url: '/api/me/userInfo' }, function(response) {

                vm.is_vip = response.vipTag || false;

                if (callback) {
                    callback();
                }
            });
        },
        initSDK: function() {
            var _this = this;

            route({ url: '/api/wx/config', params: { url: window.location.href.split('#')[0] }, noParams: true }, function(response) {
                if (!response) {
                    return;
                }

                wx.config({
                    debug: false,
                    appId: response.appId,
                    timestamp: response.timestamp,
                    nonceStr: response.nonceStr,
                    signature: response.signature,
                    jsApiList: ['hideMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage']
                });
            });
        },
        // initPlayer: function() {
        //     var player = videojs('my-video');
        //     player.on('timeupdate', function() {
        //         if (player.duration() != 0 && player.currentTime() === player.duration()) { // 播放结束
        //             this.exitFullscreen();
        //             util.dialog('.dialog-playend');
        //         }
        //     });
        // },
        init: function() {
            var _this = this;

            this.getUserInfo(function() {
                _this.getInfo();
                _this.getComments();
            });

            this.initSDK();

            delete this.init;
        }
    };

    app.init();

});
