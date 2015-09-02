var _txt, _node, _asterisk, _pluginEnabled;

goog.require('config');
goog.require('util');

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
	_asterisk = util.createNode("i", "_t", "transmet-asterisk");
	return _asterisk;
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
	util.addCls(a,'transmet-translated');
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

function onStorageChange(changes, area) {
	console.log('onStorageChange changes', changes);
	if (changes.enabled) {
		_pluginEnabled = changes.enabled.newValue;
		if (!_pluginEnabled) {
			removeOldAsterisk();	
		}
	}
}


console.log("Plugin init");
chrome.storage.local.get(function(items) {
	_pluginEnabled = items.enabled || typeof items.enabled == 'undefined';
});

chrome.storage.onChanged.addListener(onStorageChange);

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
		//console.log('sel.focusNode', sel.focusNode, "a", a, "a.text==sel.f", a.childNodes[0] == sel.focusNode);
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
