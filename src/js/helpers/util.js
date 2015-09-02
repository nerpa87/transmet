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

	return {
		getFromLang: getFromLang,
		getToLang: getToLang,
		addCls: addCls,
		removeCls: removeCls,
		createNode: createNode
	}
})();
