define('route', ['zepto', 'comm'], function($, comm) {

	if(comm.getUrlParam('openid')) {
		comm.setCache('openid', comm.getUrlParam('openid'));
	}

	if(comm.getUrlParam('userId')) {
		comm.setCache('userId', comm.getUrlParam('userId'));
	}

	var opt_key = {
			openid: comm.getCache('openid') || '',
			userId: comm.getCache('userId') || ''
		};

	function route(opts, callback) {
		if(! opts) {
			callback(false);
			return;
		}

		$.ajax({
			// url: 'http://112.74.102.63' + opts.url,
			url: 'http://39.108.129.226:30000' + opts.url,
			data: $.extend(opt_key, opts.params || {}),
			type: opts.type || 'GET',
			cache: false,
			beforeSend: opts.beforeSend || function(){},
			success: function(response) {
				if(response.code !== 200) {
                    alert(response.message || '接口返回错误['+ response.code +']');
                    return;
                }

				callback(response.data);
			},
			error: function(xhr, type) {
			}
		});
	}

	return route;

});