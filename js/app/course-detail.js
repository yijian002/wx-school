require.config({
    baseUrl: './',
    paths: {
        vue: 'lib/vue.min',
        zepto: 'lib/zepto.min',
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

require(['zepto', 'route', 'util', 'comm'], function($, route, util, comm) {

    var app = {
        initPlayer: function() {
            var player = videojs('my-video');
            player.on('timeupdate', function() {
                if (player.duration() != 0 && player.currentTime() === player.duration()) { // 播放结束
                    util.dialog('.dialog-playend');
                }
            });
        },
        init: function() {
            this.initPlayer()

            delete this.init;
        }
    };

    app.init();

});