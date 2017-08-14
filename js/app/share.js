require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
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

require(['vue', 'zepto', 'route', 'comm'], function(vue, $, route, comm) {

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
        getInvitation: function() {
            route({
                url: '/api/course/invitation?courseId=' + this._courseid,
                type: 'POST',
                // params: {courseId: this._courseid}
            }, function(response) {
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

                var SHARE_TITLE = '课程邀请卡';

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
                    desc: '非常棒的课程，邀请你也来试试吧！',
                    link: window.location.href,
                    // imgUrl: IMG_TT,
                    success: function() {
                        
                    }
                });
            });
        },
        init: function() {
            this.getInvitation();
            this.initSDK();

            delete this.init;
        }
    };

    app.init();

});