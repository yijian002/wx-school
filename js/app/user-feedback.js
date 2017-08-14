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

require(['vue', 'zepto', 'route'], function(vue, $, route) {

    var vm = new vue({
        el: '#user-feedback-main',
        data: {
            content: ''
        },
        methods: {
            save: function() {
                if (this.content === '') {
                    alert('请写下您的反馈意见，谢谢！');
                    return;
                }

                route({
                    url: '/api/me/feedback',
                    type: 'POST',
                    params: JSON.stringify({content: this.content}),
                    isJson: true
                }, function(response) {
                    if (!response) {
                        return;
                    }

                    alert('感谢您的反馈');
                    window.location.href = 'user.html';
                });
            }
        }
    });

    var app = {
        init: function() {

            delete this.init;
        }
    };

    app.init();

});