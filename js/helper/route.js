define('route', ['zepto', 'comm'], function($, comm) {

    var opt_key = {};

    function route(opts, callback) {
        if (!opts) {
            callback(false);
            return;
        }

        // var data = opts.noParams ? (opts.params || {}) : $.extend(opts.params || {}, opt_key);
        var data = opts.params || {};

        var setting = {
            url: 'http://wechat.qianbitour.com' + opts.url,
            // url: opts.url,
            data: data,
            type: opts.type || 'GET',
            cache: opts.noParams ? true : false,
            beforeSend: opts.beforeSend || function() {},
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                if (response.code !== 200) {
                    alert(response.message || '接口返回错误[' + response.code + ']');
                    return;
                }

                callback(response.data);
            },
            error: function(xhr, type) {}
        };

        if (opts.isJson) {
            setting.contentType = 'application/json';
        }

        $.ajax(setting);
    }

    return route;

});
