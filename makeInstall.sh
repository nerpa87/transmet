#!/bin/bash

#tools
npm install
if ! ls tools/compiler.jar 2>&1 1>/dev/null; then
	echo 'It seems there is no google closure compiler, installing'
	mkdir -p ./tools && cd ./tools
	wget http://dl.google.com/closure-compiler/compiler-latest.tar.gz && tar xzf compiler-latest.tar.gz && rm -f ./compiler-latest.tar.gz
	cd ../
fi

#api_key
if ! ls ./api_key.txt 2>&1 1>/dev/null; then
	echo "You have to create file api_key.txt and put there yandex translate API key"
	exit 1
fi
API_KEY=`cat ./api_key.txt`
cd ./src/js/helpers
sed "s/EXPORT_API_KEY/'${API_KEY}'/" ./config.js.sample > ./config.js
cd ../../../

#building
if ! echo $PATH | grep -q node-sass; then
	export PATH=$PATH:./node_modules/node-sass/bin	
fi
rm -r ./plugin; mkdir plugin
node-sass ./src/css/cs.scss ./plugin/cs.css
java -jar tools/compiler.jar --js src/js/cs.js --js src/js/helpers/*.js --js_output_file plugin/cs.js
java -jar tools/compiler.jar --js src/js/popup.js --js src/js/helpers/*.js --js_output_file plugin/popup.js
cp ./src/assets/* ./plugin
