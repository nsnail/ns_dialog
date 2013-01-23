(function (w) {
	var ie_regex = /(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase());
	var ie = ie_regex && ie_regex[2];
	var find_childs = function (parent, tagname, classname) {
		var child_lst = parent.getElementsByTagName(tagname);
		var ret = [];
		for (var i = 0; i != child_lst.length; ++i) {
			var classes = child_lst[i].className.split(' ');
			for (var j in classes) {
				if (classes[j] == classname) {
					ret.push(child_lst[i]);
					break;
				}
			}
		}
		return ret;
	}
	var merge_opts = function (defs, users) {
		var ret = {};
		for (var o in defs) {
			ret[o] = users[o] === undefined ? defs[o] : users[o];
		}
		return ret;
	};
	var dialog_cnt = 0;
	w.ns_dialog = {
		open: function (opts) {
			var default_opts = {
				width: 400,
				height: 300,
				top: 100,
				boxshadow: 'none',
				shadow_opacity: .3,
				border_radius: '0',
				header: '<div class="ns-dialog-header"><a class="ns-dialog-close">&times;</a></div>',
				body: '<div class="ns-dialog-body"></div>',
				body_type: 'html',
				blank_off: false
			};
			opts = merge_opts(default_opts, opts || {});
			++dialog_cnt;
			var document_body = document.body || document.getElementsByTagName('body')[0];
			document_body.style.position = 'relative';
			var dialog = document.createElement('div');
			dialog.className = 'ns-dialog ns-dialogid:' + dialog_cnt;
			dialog.style.width = opts.width + 'px';
			dialog.style.height = opts.height + 'px';
			dialog.style.left = '50%';
			dialog.style.margin = '0 0 0 -' + opts.width / 2 + 'px';
			dialog.style.zIndex = 99999999;
			if (ie && ie < 7) {
				dialog.style.position = 'absolute';
				dialog.style.top = document.documentElement.scrollTop + opts.top;
			} else {
				dialog.style.position = 'fixed';
				dialog.style.top = opts.top + 'px';
			}
			dialog.style.boxShadow = opts.boxshadow;
			dialog.style.borderRadius = opts.border_radius;
			dialog.innerHTML += opts.header;
			if (opts.body_type == 'iframe') {
				dialog.innerHTML += '<iframe frameborder="0" marginheight="0" marginwidth="0" border="0" scrolling="no" src="' + opts.body + '" width="100%" height="100%"></iframe>';
			} else {
				dialog.innerHTML += opts.body;
			}


			var shadow = document.createElement('div');
			shadow.className = 'ns-dialog-shadow ns-dialog-shadowid:' + dialog_cnt;
			shadow.style.background = 'black';
			shadow.style.zIndex = 99999998;
			shadow.style.left = 0;
			if (ie && ie < 7) {
				shadow.style.position = 'absolute';
				shadow.style.height = document.documentElement.clientHeight + 'px';
				shadow.style.top = document.documentElement.scrollTop;
			}
			else {
				shadow.style.position = 'fixed';
				shadow.style.height = '100%';
				shadow.style.top = 0;
			}
			if (ie) {
				shadow.style.filter = 'alpha(opacity=' + opts.shadow_opacity * 100 + ')';
			} else {
				shadow.style.opacity = opts.shadow_opacity;
			}
			shadow.style.width = '100%';
			if (opts.blank_off) {
				shadow.onclick = function () {
					var dialogid = /ns-dialog-shadowid\:(\d+)/g.exec(this.className)[1];
					w.ns_dialog.close(dialogid);
				};
			}
			document_body.appendChild(dialog);
			document_body.appendChild(shadow);
			var closes = find_childs(dialog, 'a', 'ns-dialog-close');
			for (var i in closes) {
				closes[i].href = 'javascript:void(0);'
				closes[i].onclick = function () {
					var dialogid = /ns-dialogid\:(\d+)/g.exec(dialog.className)[1];
					w.ns_dialog.close(dialogid);
				};
			}
			if (ie && ie < 7) {
				w.attachEvent('onscroll', function () {
					dialog.style.top = document.documentElement.scrollTop + opts.top;
					shadow.style.top = document.documentElement.scrollTop;
				});
			}
		},
		close: function (i) {
			var document_body = document.body || document.getElementsByTagName('body')[0];
			var dialogs = find_childs(document_body, 'div', i ? 'ns-dialogid:' + i : 'ns-dialog');
			var shadows = find_childs(document_body, 'div', i ? 'ns-dialog-shadowid:' + i : 'ns-dialog-shadow');
			for (var i in dialogs) {
				document_body.removeChild(dialogs[i]);
			}
			for (var i in shadows) {
				document_body.removeChild(shadows[i]);
			}
		}
	}
})(window);