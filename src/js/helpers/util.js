goog.provide('util');

var util = (function() {
	function getFromLang() {
	    return 'en';
	}

	function getToLang() {
	    return 'ru';
	}

	function addCls(node, cls) {
	    var classes = node.getAttribute('class').split(/\s+/);
		classes.push(cls);
		node.setAttribute('class', classes.join(' '));
	}

	function removeCls(node, cls) {
	    var classes = node.getAttribute('class').split(/\s+/);
		for (var i=0; i<classes.length; i++) {
			if (classes[i] == cls) {
		    	classes.splice(i,1);
				break;
			}
		}
	    node.setAttribute('class', classes.join(' '));
	}

	function createNode(tagName, text, cls) {
	    var node = document.createElement(tagName);
		node.appendChild(document.createTextNode(text));
		node.setAttribute("class", cls);
		return node;
	}

	function addCopyright(targetNode, copyKey) {
		copyKey = copyKey || 'COPY_TEXT';
    	var copy_text = config[copyKey]
        	,copyLink, copy, arr;
    	if (arr = /<a(.*?)>(.*?)<\/a>/.exec(copy_text)) {
        	copyLink = util.createNode('a', arr[2], '');
        	var attrs = arr[1].split(/\s+/);
	        attrs.forEach(function(el) {
    	        if (el) {
        	        var pair = el.split('=');
            	    copyLink.setAttribute(pair[0], pair[1].replace(/[",']/g,''));
            	}
	        });
    	    var texts = copy_text.split(/<a.*>/);
        	copy = util.createNode("span", '', 'trans-copy');
	        copy.appendChild(document.createTextNode(texts[0]));
    	    copy.appendChild(copyLink);
        	copy.appendChild(document.createTextNode(texts[1]));
    	} else {
        	copy = util.createNode("span", config.COPY_TEXT, 'trans-copy');
    	}
    	var copyWrap = util.createNode("i", '', 'trans-copy-wrap');
    	copyWrap.appendChild(copy);
    	targetNode.appendChild(copyWrap);
		return copyWrap;
	}

	return {
		getFromLang: getFromLang,
		getToLang: getToLang,
		addCls: addCls,
		removeCls: removeCls,
		createNode: createNode,
		addCopyright: addCopyright
	}
})();
