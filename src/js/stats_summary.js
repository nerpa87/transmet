goog.require('stats');

function setupClearStats() {
   document.getElementById('clearStats').addEventListener('click', function() {
        stats.clear(function() {
			window.location.reload();
		});
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

	var node = document.querySelector('#list_recent .trans-entry')
		,p = node.parentNode;
    p.removeChild(node);	
	stats.getNLatest(10, function(arr) {
		arr.forEach(function(el) {
			var n = node.cloneNode(true);
			n.querySelector('.word').innerText = el.k;
			n.querySelector('.translation').innerText = el.tr;
			p.appendChild(n);
		});
		node = null;
	});
	//clear handler
	setupClearStats();
});
