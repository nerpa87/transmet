goog.provide('stats');

var stats = (function(){
	var store = chrome.storage.local;
	var MAX_KEY_LEN = 40;

	//todo handle no more space error 
	function addEntry(key, translation) {
		if (key.length > MAX_KEY_LEN)
			return;
		store.get({'stats': []}, function(items) {
			console.log("1. items", items);
			var data = items.stats
				,ts = new Date().getTime()
				,found = false;
			for (var i=0; i<data.length; i++) {
				if (data[i].k == key) {
					data[i].cnt++;
					data[i].ts = ts;
					data[i].tr = translation;
					found = true;
					break;
				}
			}
			if (!found) {
				data.push({
					k: key,
					cnt: 1,
					ts: ts,
					tr: translation
				})
			}
			console.log("2. items", items);
			store.set(items, function() {
				console.log("items set, runtime.lastError", chrome.runtime.lastError);
			});
		});
	}	

	function clear() {
		store.set({'stats': []});
	}
	
	return {
		addEntry: addEntry
		,clear: clear
	}
})();
