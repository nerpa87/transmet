## Minimalistic Chrome browser extension for inline translation

Currently only en-ru translations supported

## Requirements
You have to have node.js and npm installed to build the extension.
Outut directory name is 'plugin', it contains all the files of extension.

### Building
	1. In the porject directory, create file named api_key.txt and put there your Yandex Translate API key.
	2. Run ./makeInstall.sh from the project directory
	3. If everuthing is OK, you will have unpacked chrome extension in the 'plugin' directory

### Add unpacked extension to Chrome 
	1. Go to chrome://extensions/ url
	2. Mark "developer mode" checkbox
	3. Press "Launch unpacked extension" button, and choose 'plugin' directory


