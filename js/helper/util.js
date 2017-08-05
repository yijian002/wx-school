define('util', ['zepto', 'comm'], function($, comm) {

	var timer_tip_hide = null;

	var util = {
			oaudio: new Audio(),
			sound: function(opts) {
				var a = this.oaudio;
				a.preload = 'auto';

				if(opts === 'pause' || a.paused === false) {
					a.pause();
					return;
				}

				if(opts.url) {
					if(a.src !== opts.url) {
						a.src = opts.url;
					}
					a.play();
				}

				a.addEventListener('ended', function() {
					if(opts.ended) {
						opts.ended();
					}
				});
			},
			goTop: function(opts) {
				var options = {
						cont: $('#btn-back-top')
					};

				$.extend(options, opts || {});
				if(! options.cont.length) {
					return;
				}

				var $win = $(window),
		            win_h = $win.height(),
		            timer = null;

		        options.cont.on('click', function() {
		            $('html, body').animate({scrollTop: 0}, 0);
		        });

		        $win.on('scroll.top', function() {
		        	clearTimeout(timer);

		            timer = setTimeout(function() {
		            	_toggle();
		            }, 50);
		        });

		        function _toggle() {
		        	var fx_top = $(document).scrollTop();

		        	if(fx_top >= (win_h / 3)) {
		        		options.cont.show();
		        	}
		        	else {
		        		options.cont.hide();
		        	}
		        }
			},
			tip: function(msg, opts) {
				var BOX_ID = 'wxbox-tip';

				if(! msg) {
					return;
				}

				var options = {
						autoHide: false,
						hideTime: 3000
					};

				$.extend(options, opts || {});

				var $box = $('#' + BOX_ID);
				if(! $box.length) {
					$box = $('<div>').attr('id', BOX_ID).css({
						height: 'auto',
						minHeight: 20,
						lineHeight: '20px',
						padding: '8px 4px',
						width: '60%',
						textAlign: 'center',
						fontSize: 13,
						background: '#fff',
						border: '1px solid #ccc',
						boxShadow: '3px 3px 3px #ccc',
						display: 'none'
					});
					$box.appendTo('body');
				}

				if(msg === 'hide') {
					_hide();
					return;
				}

				switch (msg) {
					case 'reload':
						msg = '服务器繁忙，<a onclick="window.location.reload(true)">刷新</a>重试';
						break;
					case 'loading':
						msg = '<div class="tip-loading"></div>正在努力获取数据...';
						break;
				}

				function _hide() {
					setTimeout(function() {
						$box.hide();
					}, 150);
				}

				function _init() {
					util.dialog('open', {
						container: $box,
						modal: false,
						open: function() {
							$box.html(msg);
						}
					});

					if(options.autoHide) {
						clearTimeout(timer_tip_hide);
						timer_tip_hide = setTimeout(function() {
							_hide();
						}, options.hideTime);
					}
				}
				_init();
			},
			loadMore: function(opts) {
				var options = {loading: function(){}, offset: 30},
					timer = null;

				$.extend(options, opts || {});

				function _bind() {
					$(window).off('scroll.loadmore').on('scroll.loadmore', function() {
						clearTimeout(timer);

			            timer = setTimeout(function() {
			            	if(_canLoad()) {
			            		options.loading();
			            	}
			            }, 50);
			        });
				}

				function _canLoad() {
					return (document.documentElement.scrollHeight) <= (document.documentElement.scrollTop | document.body.scrollTop) + document.documentElement.clientHeight + options.offset;
				}

				function _init() {
					_bind();
				}
				_init();
			},
			dialog: function(container, opts) {
				opts = opts || {};
				if(typeof container === 'string') {
					container = $(container);
				}

				container
					.removeClass('hide')
					.find('.close').off().on('click', function() {
						container.addClass('hide');
						if(opts.close) {
							opts.close();
						}
					});

				return container;
			}
		};
		
	return util;
});