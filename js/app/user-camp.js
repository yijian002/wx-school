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
        el: '#user-camp-main',
        data: {
        },
        methods: {
            join: function() {
                route({
                    url: '/api/pay/payInfo/joinClub',
                    type: 'POST',
                    params: {clubId: 1}
                }, function(response) {
                    if (!response) {
                        return;
                    }

                    util.wxPay({
                        wx: wx,
                        success: function() {
                        window.location.href = 'user-join.html'; // 入群页面
                    }}, response);
                });
            }
        },
        watch: {},
        updated: function() {
        }
    });

    var app = {
        _id: comm.getUrlParam('id'),
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
            this.initSDK();

            delete this.init;
        }
    };

    app.init();

});
