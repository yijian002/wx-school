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

require(['vue', 'zepto', 'route', 'util', 'comm'], function(vue, $, route, util, comm) {

    vue.directive('focus', {
      inserted: function (el) {
        el.focus();
      },
      updated: function (el) {
        el.focus();
      }
    });

    var vm = new vue({
        el: '#course-detail-main',
        data: {
            detail: {},
            comments: [],
            add_comments: '',
            is_comments: false
        },
        methods: {
            playSound: function(url, id) {
                util.sound({url: url, ended: function() {
                    $('#free_class_'+ id).find('.sound').removeClass('playing');
                }});
            },
            addComments: function(event) {
                this.is_comments = false;
                if(this.add_comments === '') {
                    return;
                }

                var _this = this;
                route({url: '/api/course/comment', type: 'POST', params: {
                    courseId: app._id,
                    comment: _this.add_comments
                }}, function(response) {
                    if(! response) {
                        return;
                    }

                    app.getComments();
                });
            }
        },
        watch: {
        },
        updated: function() {
        }
    });

    var app = {
        _id: comm.getUrlParam('id'),
        getInfo: function() {
            route({url: '/api/course/info', params: {id: this._id}}, function(response) {
                if(! response) {
                    return;
                }

                vm.detail = response;
            });
        },
        getComments: function() {
            route({url: '/api/course/comments', params: {courseId: this._id}}, function(response) {
                if(! response) {
                    return;
                }

                vm.comments = response;
            });
        },
        initPlayer: function() {
            var player = videojs('my-video');
            player.on('timeupdate', function() {
                if (player.duration() != 0 && player.currentTime() === player.duration()) { // 播放结束
                    this.exitFullscreen();
                    util.dialog('.dialog-playend');
                }
            });
        },
        init: function() {
            this.getInfo();
            this.getComments();

            delete this.init;
        }
    };

    app.init();

});