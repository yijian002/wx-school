define('route', ['zepto', 'comm'], function($, comm) {

	// if(comm.getUrlParam('openid')) {
	// 	comm.setCache('openid', comm.getUrlParam('openid'));
	// }

	// if(comm.getUrlParam('userId')) {
	// 	comm.setCache('userId', comm.getUrlParam('userId'));
	// }
	var opt_key = {};
	// var opt_key = {
	// 		openid: comm.getCache('openid') || '',
	// 		userId: comm.getCache('userId') || ''
	// 	};

	function route(opts, callback) {
		if(! opts) {
			callback(false);
			return;
		}

		var data = opts.noParams ? (opts.params || {}) : $.extend(opts.params || {}, opt_key);

		$.ajax({
			// url: 'http://112.74.102.63' + opts.url,
			url: 'http://wxmptest.vrtyg.net' + opts.url,
			data: data,
			type: opts.type || 'GET',
			cache: opts.noParams ? true : false,
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