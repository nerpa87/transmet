var _txt, _node, _asterisk, _pluginEnabled, _copyAwared;

goog.require('config');
goog.require('util');
goog.require('stats');

function getAsterisk(opts) {
	opts = opts || {}
	if (_asterisk) {
		if (opts.clear) {
			Array.prototype.forEach.call(_asterisk.children, function(child) {
				_asterisk.removeChild(child);
			});
			util.removeCls(_asterisk,'transmet-translated');
		}
		return _asterisk;	
	}
	_asterisk = util.createNode("div", "_t", "transmet-asterisk");
	return _asterisk;
}

function addCopyright(targetNode) {
	var copyWrap = util.addCopyright(targetNode);
	copyWrap.addEventListener('click', function(evt) {
		evt.stopPropagation();
		if (evt.target == copyWrap) {
			copyWrap.parentNode.removeChild(copyWrap);
			chrome.storage.local.set({'copy_awared': true});
		}
	});
}

function showTranslation(sresp) {
	console.log('showTranslation sresp:"' + sresp + '"');
	var resp = JSON.parse(sresp);
	var trans = '?', transClass = 'transmet-status-done';
	if (resp.code != 200) {
		console.warn("Wrong resp code, resp", typeof resp);
		transClass = 'transmet-status-error';
	} else {
		trans = resp.text[0];
	}
	var a = getAsterisk(),
	transNode = util.createNode("span", trans, transClass);
	a.appendChild(transNode);
	if (!_copyAwared) {
		addCopyright(a);
	}
	util.addCls(a,'transmet-translated');
	if (resp.code == 200) {
		stats.addEntry(_txt, trans);
	}
}

function performTranslation() {
	console.log("will translate _txt", _txt);
	var conf = {
		API_KEY: config.API_KEY,
		FROM_LANG: util.getFromLang(),
		TO_LANG: util.getToLang(),
		TEXT: _txt
	}
	var url = config.RPC_URL.replace(/\{.*?\}/g, function(subst) {
		subst = subst.replace(/\{(.*)\}/, '$1');
		return conf[subst];
	});
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4) {
				       showTranslation(xhr.responseText);
			}
	}
	xhr.send();
}

function removeOldAsterisk() {
	if (_node) {
		var el = _node.getElementsByClassName("transmet-asterisk")[0];
		if (el) {
			el.parentNode.removeChild(el);
		}
		_node = null;
	}
}

console.log("Plugin init");
chrome.storage.local.get({'enabled': config.DEFAULT_ENABLED, 'copy_awared': false}, function(items) {
	_pluginEnabled = items.enabled;
	_copyAwared = items.copy_awared;
});
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
	console.log("Message received:", message, "; _pluginEnabled:", _pluginEnabled);
	if (message.command == "getPluginState") {
		callback({"data": _pluginEnabled});
	} else if (message.command == "setPluginState") {
		_pluginEnabled = message.data;
		if (!_pluginEnabled) {
	        removeOldAsterisk();
        }
	}
});
chrome.storage.onChanged.addListener(function(changes) {
	if (changes['copy_awared']) {
		_copyAwared = changes['copy_awared'];
	}
});

document.addEventListener('click', function(e) {
	if (!_pluginEnabled)
		return;
	if (e.target.getAttribute('class') == 'transmet-asterisk') {
		e.preventDefault();
		performTranslation();
		return;
	}
	var sel = window.getSelection(),
	    rng = (sel && sel.rangeCount) ? sel.getRangeAt(0) : null,
	    txt = rng ? rng.toString() : '';
	var a = getAsterisk({clear: true});
	if (txt && !/^[\r\n\s\t]+$/.test(txt)) {
	    if (a.childNodes[0] == sel.focusNode) {
			return; //_t is in range
		}
		_txt = txt;
	    console.log('_txt set to: "' + _txt + '"');
	    _node = sel.focusNode.parentNode;
		var rng2 = rng.cloneRange();
		rng2.collapse(false);
		rng2.insertNode(a);
	} else {
		removeOldAsterisk();
	}
});
