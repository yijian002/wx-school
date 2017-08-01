define('comm', function() {
	var comm = {
			isWX: function() {
				var ua = window.navigator.userAgent.toLowerCase();
			    return ua.match(/MicroMessenger/i) == 'micromessenger';
			},
			isIOS: function() {
				var ua = window.navigator.userAgent.toLowerCase();
			    return /(iphone|ipad|ipod|ios)/i.test(ua);
			},
			isAndroid: function() {
				var ua = window.navigator.userAgent.toLowerCase();
			    return ua.indexOf('android') > 0;
			},
			setCache: function(strName, strValue, intdays) {
				if(typeof strValue === 'object') {
					strValue = JSON.stringify(strValue);
				}

			    window.localStorage.setItem('WX_SCHOOL_' + strName, strValue);
			},
			getCache: function(name) {				
			    var val = window.localStorage.getItem('WX_SCHOOL_' + name);
			    return val;
			},
			getUrlParam: function (name) {
		        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		        var r = window.location.search.substr(1).match(reg);
		        if (r !== null) {
		            return unescape(r[2]); 
		        }
		        return null;
		    },
		    isInt: function(num) {
		    	var re = /^[1-9]+[0-9]*]*$/;
				return !re.test(num) ? false : true;
		    },
			formatTime: function(time_int) {
		        var s = Math.floor((time_int/1000)%60),
			        i = Math.floor((time_int/1000/60)%60),
			        h = Math.floor((time_int/1000/60/60)%24);

		        var _zero = function(v) {
		            return v < 10 ? ('0' + v) : v;
		        };

		        return {hour: _zero(h), mit: _zero(i), sec: _zero(s)};
		    },
			getDate: function(int_time) {
				int_time = String(int_time).substr(0, 13);
				int_time = new Date(Number(int_time));

				var year = int_time.getFullYear(),
					month = int_time.getMonth() + 1,
					day = int_time.getDate(),
					hour = int_time.getHours(),
					minute = int_time.getMinutes(),
					s = int_time.getSeconds();

				var _zero = function(v) {
		            return v < 10 ? ('0' + v) : v;
		        };

				int_time = year + '-' + _zero(month) + '-' + _zero(day) + ' ' + _zero(hour) + ':' + _zero(minute) + ':' + _zero(s);

				return int_time;
			}
		};
		
	return comm;
});