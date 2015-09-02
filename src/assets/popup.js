var appSettings = {};

function onBtnClick(evt) {
	var btn = evt.target;
	appSettings.enabled = !appSettings.enabled;
	chrome.storage.local.set(appSettings);
}

function updateBtnState() {
	console.log('updateBtnState appSettings:', appSettings);
	var	btn = getBtn();
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

function getBtn() {
	return document.getElementById('switchPluginState');
}

function setupOnOffBtn() {
	chrome.storage.local.get(function(settings) {
		if (typeof settings.enabled == 'undefined') {
			settings.enabled = true;
			chrome.storage.local.set(settings);
		}
		appSettings = settings;

		var btn = getBtn();
		updateBtnState();
		btn.addEventListener('click', onBtnClick);
	});
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.onChanged.addListener(onStorageChange);
	setupOnOffBtn();
});

