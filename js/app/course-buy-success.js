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
    var courseId = comm.getUrlParam('courseId');
    var vm = new vue({
        el: '#user-join',
        data: {
            randomCode: null,
            imageUrl: null
        },
        created: function () {
            var _this = this;
            route({url: '/api/qrcode/courseTeacher?courseId='+courseId}, function(data){
                _this.randomCode = data.randomCode;
                _this.imageUrl = data.imageUrl;
            });
        }
    });

});