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

function setupClearStats() {
	document.getElementById('clearStats').addEventListener('click', function() {
		stats.clear();
	});
}

function showStats() {
	var newWin = window.open("","stats",
	    "width=420,height=230,resizable=yes,scrollbars=yes,status=yes"
	);
	newWin.document.body.innerHTML = '';
	newWin.document.write('Stats here!');
}

function setupShowStats() {
	document.getElementById('showStats').addEventListener('click', showStats);
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.onChanged.addListener(onStorageChange);
	setupOnOffBtn();
	setupShowStats();
});

