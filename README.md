# thorvarium-js-client

[![Build Status](https://travis-ci.org/ghophp/thorvarium-js-client.svg)](https://travis-ci.org/ghophp/thorvarium-js-client)

AngularJS based structure, and canvas game.. this is the js client for the thorvarium server.

### Building

Basic angular stack `grunt-cli` and `bower`

	npm install
	bower install
	grunt

### Running

I recommend you to use `mongoose` to run the files statically like:

	mongoose -document_root bin

###TODO
=======

* Server active the turn just when both clients sent the turn_start, this could hang in lag
* When the tab is inactive, the client simulate the game buggy
* Disable ready and clean movements at the running state at client
* Ignore inputs at the running stage
* Fix scroll at chat