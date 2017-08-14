require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
        wx: 'http://res.wx.qq.com/open/js/jweixin-1.2.0',
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

require(['vue', 'zepto', 'route', 'util', 'comm', 'wx'], 
    function(vue, $, route, util, comm, wx) {

    var vm = new vue({
        el: '#user-plan-main',
        data: {
            is_vip: false
        },
        methods: {
            join: function() {
                route({
                    url: '/api/pay/payInfo/joinClub',
                    type: 'POST',
                    params: {}
                }, function(response) {
                    if (!response) {
                        return;
                    }

                    util.wxPay({
                        wx: wx,
                        success: function() { // 支付成功
                        window.location.href = 'user-plan-detail.html';
                    }}, response);
                });
            }
        },
        watch: {},
        updated: function() {}
    });

    var app = {
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
        init: function() {
            var _this = this;

            this.getUserInfo(function() {
                
            });

            this.initSDK();

            delete this.init;
        }
    };

    app.init();

});
