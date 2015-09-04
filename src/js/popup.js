goog.require('stats');

function onOnOffBtnClick(evt) {
	var btn = evt.target
		,attr = btn.getAttribute('data-enabled')
		,enabled = attr == 'enabled';
	setOnOffBtnState(enabled);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"command": "setPluginState", "data": enabled}); 
	});
}

function setOnOffBtnState(enabled) {
	console.log('updateBtnState enabled:', enabled);
	var	btn = getOnOffBtn();
	var text = (enabled) ? 'off' : 'on'
		,attr = (enabled) ? 'disabled' : 'enabled'
		,cls = (enabled) ? 'btn-disable' : 'btn-enable';
	btn.innerHTML = text;
	btn.setAttribute('data-enabled',attr);
	btn.setAttribute('class', cls);
}

function getOnOffBtn() {
	return document.getElementById('switchPluginState');
}

function showStats() {
	var url = 'chrome-extension://' + chrome.runtime.id + '/stats.html';
	var newWin = window.open(url, "stats",  "width=420,height=500,top=" + Math.max(0,window.screenY - 100) + ",left=" + Math.max(0, window.screenX - 300) + ",resizable=yes,scrollbars=yes,status=yes");
}

function setupShowStats() {
	document.getElementById('showStats').addEventListener('click', showStats);
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log("activetab detected", tabs[0]);
		chrome.tabs.sendMessage(tabs[0].id, {"command": "getPluginState"}, function(response) {
			if (!response) {
				console.warn("No response received, lastError", chrome.runtime.lastError);
				chrome.storage.local.get({'enabled': config.DEFAULT_ENABLED}, function(items) {
				setOnOffBtnState(items.enabled);		
				});
			} else {
				setOnOffBtnState(response.data);
			}
			var btn = getOnOffBtn();
			btn.addEventListener('click', onOnOffBtnClick);
		});
	});
	
	setupShowStats();
});

