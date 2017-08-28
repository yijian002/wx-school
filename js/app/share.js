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
        _courseId: comm.getUrlParam('courseId'),
        _userId: comm.getUrlParam('userId'),
        _myposter: comm.getUrlParam('myposter'),
        _addPointsUrl: null,
        getInvitation: function(callback) {
            route({
                url: '/api/course/invitation?courseId=' + this._courseId + '&userId=' + this._userId,
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
                    // debug: true,
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

                var SHARE_TITLE = '铅笔头您身边的家庭教育顾问';
                var SHARE_DESC = '分享、传播、影响你、我、她！';
                var SHARE_LINK = window.location.href;
                var SHARE_IMG_URL = 'http://' + window.location.host + '/images/logo.jpg';

                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: SHARE_TITLE,
                    link: SHARE_LINK,
                    imgUrl: SHARE_IMG_URL,
                    success: function() {
                        alert('分享成功！');
                        route({url: _this._addPointsUrl, type: 'POST'}, function(){});
                    }
                });

                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: SHARE_TITLE,
                    desc: SHARE_DESC,
                    link: SHARE_LINK,
                    imgUrl: SHARE_IMG_URL,
                    success: function() {
                        alert('分享成功！');
                        var url = 
                        route({url: _this._addPointsUrl, type: 'POST'}, function(){});
                    }
                });
            });
        },
        init: function() {
            if(this._courseId) {
                this._addPointsUrl = '/api/points/shareCoursePoster';
                this.getInvitation();
            }
            else {
                this._addPointsUrl = '/api/points/shareMyPoster';
                this.getPoster();
            }
            
            this.initSDK();

            delete this.init;
        }
    };

    app.init();

});