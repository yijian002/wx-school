;(function (factory, window) {
    if (typeof define === "function" && define.amd) {
        define('localstorage', factory);
    }
    else {
        window.G = window.G || {};
        window.G.userParams = factory()();
    }
}
(function() {

	function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[2]); 
        }
        return null;
    }

    function getParams() {
        return {
            // uuid: getUrlParam('uuid') || '', 
            openid: getUrlParam('openid') || ''
        };
    }

    function init() {
        var LS_KEY = 'WX_SCHOOL_';
    	var params = getParams(),
            user_params = {};

    	for(var key in params) {
    		if (params.hasOwnProperty(key)) {
                if(params[key] !== '') {
                    window.localStorage.setItem(LS_KEY + key, params[key]);
                }

                user_params[key] = window.localStorage.getItem(LS_KEY + key) || '';
    		}
    	}

        return user_params;
    }
    
    return init;

}, window));