# shortkey

[![Build Status][travis-svg]][travis-url]

Minimal short link system for https://schchn.gr

Simple url shortener on json base that matches short keys to urls and keeps
track of the number of clicks including a small social suffix feature to
differentiate the platform the link was clicked on.


## Link

Link is the main class of the project. You can lookup urls and create new keys:


### lookup

You can lookup a given key with optional source platform. If the key is unknown
the method returns `false`.

```javascript
const link = require('./lib/Link').getInstance();

const url = link.lookup('MY_KEY');
```


### store

If you want to add another url to the system you can do this with `store`, that
requires the url that should be shortened. The default length of generated keys
is currently `5` characters. You can change that with the second parameter
`keyLength`.

```javascript
const key = link.store('https://schaechinger.com');
```

If the given url exists in the system already, you will of course get the
current key for the url!

## Routes

At the moment there are a few routes that define the basic needs of the system.

* `lookup` is used to get the url for a given short key and redirects the client
  to the link destination.
* `add` can add a new short key with the information of the `url` that should
  be shortened and the `secret` token as defined in the config. The parameter
  have to be sent in the POST body of the request.
* `error400` and `error404` are default JSON responses that notify the user
  that the link could not be added or the key was not found.

## Database support

Currently the system comes without database support but can be added via an
adapter in future releases. The current version uses a simple `links.json` file
in the `./data` directory.



[travis-url]: https://travis-ci.org/schaechinger/shortkey
[travis-svg]: https://img.shields.io/travis/schaechinger/shortkey/master.svg

[coveralls-url]: https://coveralls.io/github/schaechinger/shortkey
[coveralls-svg]:  https://img.shields.io/coveralls/github/schaechinger/shortkey.svg
