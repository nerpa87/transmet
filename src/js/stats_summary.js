goog.require('stats');

function setupClearStats() {
   document.getElementById('clearStats').addEventListener('click', function() {
        stats.clear(function() {
			window.location.reload();
		});
    });
}

function setupWindowClose() {
   document.getElementById('close').addEventListener('click', window.close.bind(window));
}

function fillList(listId, functionName, n, opts) {
	opts = opts || {};
	if (typeof opts.renderWord != 'function') {
		opts.renderWord = function(el) {return el.k}
	}
	var node = document.querySelector('#' + listId + ' .trans-entry')
        ,p = node.parentNode;
    p.removeChild(node);
    stats[functionName](n, function(arr) {
        arr.forEach(function(el) {
           var n = node.cloneNode(true);
           n.querySelector('.word').innerText =  opts.renderWord(el);
           n.querySelector('.translation').innerText = el.tr;
           p.appendChild(n);
       });
       node = null;
    });
}

document.addEventListener('DOMContentLoaded', function() {
	//html content filling
	stats.getCountSince(0, function(c) {
		document.querySelector('#list_summary .total').innerText = c;
	});
	var lastDay = new Date().getTime() - 86400000; 
	stats.getCountSince(lastDay, function(c) {
		document.querySelector('#list_summary .day').innerText = c;	
	});	
	var lastWeek = new Date().getTime() - 7*86400000; 
	stats.getCountSince(lastWeek, function(c) {
		document.querySelector('#list_summary .week').innerText = c;	
	});	

	fillList('list_recent', 'getNLatest', 10);
	fillList('list_popular', 'getNPopular', 10, {
		renderWord: function(el) {
			return el.k + ' (' + el.cnt + ')'			
		}
	});
	
	setupClearStats();
	setupWindowClose();
});
