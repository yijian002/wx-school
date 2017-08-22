require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        wx: 'http://res.wx.qq.com/open/js/jweixin-1.2.0',
        mediaelement: 'lib/mediaelement/mediaelement-and-player.min',
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

require(['vue', 'zepto', 'route', 'util', 'comm', 'wx', 'swiper', 'mediaelement'], 
    function(vue, $, route, util, comm, wx) {

    var o_swiper = null;

    vue.directive('focus', {
        inserted: function(el) {
            setTimeout(function() {
                window.scrollTo(0,document.body.scrollHeight);
                el.focus();
            }, 150);
        }
    });

    var vm = new vue({
        el: '#course-detail-main',
        data: {
            show: false,
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
            join: function() {
                if(this.detail.isGroup) { // 入群克
                    window.location.href = 'user-join.html';
                    return;
                }

                window.location.href='user-camp.html?id=' + app._id;
            },
            buy: function() {
                route({
                    url: '/api/pay/payInfo/buyCourse',
                    type: 'POST',
                    params: {courseId: app._id}
                }, function(response) {
                    if (!response) {
                        return;
                    }

                    util.wxPay({
                        wx: wx,
                        success: function() {
                            window.location.reload(true);
                        }}, response);
                });
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
                    params: JSON.stringify({courseId: app._id, comment: _this.add_comments}),
                    isJson: true
                }, function(response) {
                    if (!response) {
                        return;
                    }

                    setTimeout(function() {
                        app.reloadComments();
                    }, 500);
                });
            },
            invitationCard: function() { // 邀请卡
                window.location.href = 'share.html?courseid=' + app._id;
            }
        },
        // watch: {},
        updated: function() {
            var $audio_box = $('.audio-js-box');

            if(o_swiper) {
                o_swiper.destroy();
            }

            $.each($audio_box, function(idx) {
                new MediaElementPlayer($(this).find('audio')[0], {
                    stretching: 'auto',
                    success: function (media) {
                    }
                });

                if(idx > 0) {
                    $(this).hide();
                }
            });

            o_swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: false,
                spaceBetween: 30,
                loop: false,
                nextButton: '.ico-next',
                prevButton: '.ico-prev',
                onSlideChangeEnd: function(swiper) {
                    $.each($audio_box.find('.mejs__pause'), function(idx) {
                        $(this).click();
                    });

                    $audio_box.hide().eq(swiper.activeIndex).show().find('.mejs__play').click();
                }
            });
        }
    });

    var app = {
        _id: comm.getUrlParam('id'),
        _comment_page: 1,
        getInfo: function(callback) {
            route({ url: '/api/course/info', params: { id: this._id } }, function(response) {
                if (!response) {
                    return;
                }

                // response.lessons = [{
                //     audioUrl: 'http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3'
                // }]
                var len = response.lessons.length - response.banners.length;
                if(len > 0) { // lessons 和 banners的长度保持一致
                    for (var i = 0; i < len; i++) {
                        response.banners.push(response.banners[0]);
                    }
                }
                vm.detail = response;

                if(callback) {
                    callback();
                }
            });
        },
        reloadComments: function() {
            vm.comments = [];

            this._comment_page = 1;
            this.getComments();
        },
        getComments: function() {
            var _this = this;
            if(this._comment_page < 1) {
                this._comment_page = -1;
                return;
            }

            route({ url: '/api/course/comments', params: { 
                courseId: this._id,
                pageNum: this._comment_page,
                pageSize: 10
            }}, function(response) {
                if (!response) {
                    return;
                }

                if(!response.result.length) {
                    _this._comment_page = -1;
                    return;
                }

                vm.comments = vm.comments.concat(response.result);
            });
        },
        getUserInfo: function(callback) {
            route({ url: '/api/me/userInfo' }, function(response) {

                vm.is_vip = response.clubTag || false;

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
                    //debug: true,
                    appId: response.appId,
                    timestamp: response.timestamp,
                    nonceStr: response.nonceStr,
                    signature: response.signature,
                    jsApiList: ['chooseWXPay']
                });
            });

            wx.ready(function(){
            });
        },
        bind: function() {
            var _this = this;

            util.loadMore({
                loading: function() {
                    _this._comment_page++;
                    _this.getComments();
                }
            });
        },
        loaded: function() {
            util.loading('hide');
            vm.show = true;
        },
        init: function() {
            var _this = this;
            
// _this.getInfo(_this.loaded);
// _this.getComments();
            this.getUserInfo(function() {
                _this.getInfo(_this.loaded);
                _this.getComments();
            });

            this.initSDK();
            this.bind();

            delete this.init;
        }
    };

    app.init();

});
