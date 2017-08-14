require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        wx: 'http://res.wx.qq.com/open/js/jweixin-1.2.0',
        zepto: 'lib/zepto.min',
        route: 'js/helper/route',
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

require(['vue', 'zepto', 'route', 'comm', 'wx'], function(vue, $, route, comm, wx) {

    var vm = new vue({
        el: '#share-main',
        data: {
            img: null
        },
        methods: {

        }
    });

    var app = {
        _courseid: comm.getUrlParam('courseid'),
        _myposter: comm.getUrlParam('myposter'),
        getInvitation: function(callback) {
            route({
                url: '/api/course/invitation?courseId=' + this._courseid,
                type: 'POST',
            }, function(response) {
                if(callback) {
                    callback();
                }
                
                if (!response) {
                    return;
                }

                vm.img = response.imageUrl;
            });
        },
        getPoster: function(callback) {
            route({url: '/api/me/poster'}, function(response) {
                if(callback) {
                    callback();
                }

                if (!response) {
                    return;
                }

                vm.img = response.imageUrl;
            });
        },
        initSDK: function() {
            var _this = this;

            route({ url: '/api/wx/config', params: { url: window.location.href.split('#')[0] }, noParams: true }, function(response) {
                if (!response) {
                    return;
                }

                wx.config({
                    debug: true,
                    appId: response.appId,
                    timestamp: response.timestamp,
                    nonceStr: response.nonceStr,
                    signature: response.signature,
                    jsApiList: ['hideMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage']
                });
            });

            wx.ready(function() {
                // 隐藏菜单
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq', 
                        'menuItem:share:weiboApp', 
                        'menuItem:favorite',
                        'menuItem:share:facebook', 
                        'menuItem:share:QZone',
                        'menuItem:editTag',
                        'menuItem:copyUrl',
                        'menuItem:readMode',
                        'menuItem:openWithQQBrowser',
                        'menuItem:openWithSafari',
                        'menuItem:share:email',
                        'menuItem:share:brand'
                    ]
                });

                var SHARE_TITLE = _this._courseid ? '课程邀请卡' : '我的海报';

                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: SHARE_TITLE,
                    link: window.location.href,
                    // imgUrl: IMG_TT,
                    success: function() {
                        
                    }
                });

                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: SHARE_TITLE,
                    desc: _this._courseid ? '非常棒的课程，邀请你也来试试吧！' : '快来看我的海报吧，棒棒哒~',
                    link: window.location.href,
                    // imgUrl: IMG_TT,
                    success: function() {
                        
                    }
                });
            });
        },
        init: function() {
            if(this._courseid) {
                this.getInvitation();    
            }
            else {
                this.getPoster();
            }
            
            this.initSDK();

            delete this.init;
        }
    };

    app.init();

});