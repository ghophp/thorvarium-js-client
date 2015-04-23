# thorvarium-js-client

[![Build Status](https://travis-ci.org/ghophp/thorvarium-js-client.svg)](https://travis-ci.org/ghophp/thorvarium-js-client)

AngularJS based structure, and canvas game.. this is the js client for the thorvarium server.

### Building

Basic angular stack `grunt-cli` and `bower`

	npm install
	bower install
	grunt

### Running

To run the project and simulate the real invironment, you must (after build) set the THORVARIUM_BUILD env variable. This will configure the server to provide the assets from this project. We need the server to provide the assets, because we need that everything run in the same domain, so we can make use of cookies and do a basic auth process with websockets.

Take a look at the server: [thorvarium](https://github.com/ghophp/thorvarium)

### Play Online

Here is the automatic deployed version at heroku: [play](https://thorvarium.herokuapp.com/game/index.html)