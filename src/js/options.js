function saveOptions() {
	var enabled = document.getElementById('enabled').checked;
	console.log('Enabled', enabled);
	chrome.storage.local.set({enabled: enabled});
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get({enabled: true}, function(data) {
		document.getElementById('enabled').checked = data.enabled;
	});
	document.getElementById('save').addEventListener('click',saveOptions);
});
