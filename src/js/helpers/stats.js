goog.provide('stats');

var stats = (function(){
	var store = chrome.storage.local;
	var MAX_KEY_LEN = 40;

	//todo handle no more space error 
	function addEntry(key, translation) {
		if (key.length > MAX_KEY_LEN)
			return;
		key = key.toLowerCase();
		store.get({'stats': []}, function(items) {
			//console.log("1. items", items);
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
			//console.log("2. items", items);
			store.set(items, function() {
				console.log("items set, runtime.lastError", chrome.runtime.lastError);
			});
		});
	}	

	function clear(clb) {
		store.set({'stats': []}, clb);
	}
	
	function getCountSince(ts, clb) {
		var count = 0;
		store.get({'stats': []}, function(items) {
			var data = items.stats;
			data.forEach(function(el) {
				if (el.ts > ts) count++;
			});
			clb(count);
		});
	}

	function getNLatest(n, clb) {
		var words = {}, count = 0, worstTs = 0;
		store.get({'stats': []}, function(items) {
		    var data = items.stats;
			data.forEach(function(el) {
				 var ts = el.ts;
				 if (count < n || worstTs < ts) {
				 	if (count >= n) {
						delete words[worstTs];
						worstTs = 0;
						count--;
					}
					words[ts] = el;
					count++;
					for (var _ts in words) {
						worstTs = (_ts < worstTs || !worstTs) ? _ts : worstTs;
					}
				 }
		    });
			var out = [];
			for (var _ts in words) {
				out.push(words[_ts]);
			}
			out.sort(function(a,b){return a.ts<b.ts ? 1 : -1});
			clb(out);
        });
	}

	function getNPopular(n, clb) {
		store.get({'stats': []}, function(items) {
		    var data = items.stats;
			var out = data.sort(function(a,b) {return a.cnt < b.cnt ? 1 : -1}).splice(0, n);
			clb(out);
		});	
	}

	return {
		addEntry: addEntry,
		getCountSince: getCountSince,
		getNLatest: getNLatest,
		getNPopular: getNPopular,
		clear: clear
	}
})();
