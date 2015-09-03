var appSettings = {};

goog.require('stats');

function onBtnClick(evt) {
	var btn = evt.target;
	appSettings.enabled = !appSettings.enabled;
	chrome.storage.local.set(appSettings);
}

function updateBtnState() {
	console.log('updateBtnState appSettings:', appSettings);
	var	btn = getOnOffBtn();
	var text = (appSettings.enabled) ? 'OFF' : 'ON';
	btn.innerHTML = text;
}

function onStorageChange(changes, area) {
	console.log('onStorageChange changes', changes);
	for (var i in changes) {
		appSettings[i] = changes[i].newValue;
	}
	console.log('new appSettings', appSettings);
	if (changes.enabled) {
		updateBtnState();
	}
}

function getOnOffBtn() {
	return document.getElementById('switchPluginState');
}

function setupOnOffBtn() {
	chrome.storage.local.get('enabled',function(settings) {
		if (typeof settings.enabled == 'undefined') {
			settings.enabled = true;
			chrome.storage.local.set(settings);
		}
		appSettings = settings;

		var btn = getOnOffBtn();
		updateBtnState();
		btn.addEventListener('click', onBtnClick);
	});
}

function showStats() {
	var url = 'chrome-extension://' + chrome.runtime.id + '/stats.html';
	var newWin = window.open(url, "stats",  "width=420,height=500,top=" + Math.max(0,window.screenY - 100) + ",left=" + Math.max(0, window.screenX - 300) + ",resizable=yes,scrollbars=yes,status=yes");
}

function setupShowStats() {
	document.getElementById('showStats').addEventListener('click', showStats);
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.onChanged.addListener(onStorageChange);
	setupOnOffBtn();
	setupShowStats();
});

