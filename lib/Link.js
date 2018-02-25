const fs = require('fs'),
  path = requir('path');

const pino = require('./helper/pino');

const DEFAULT_PLATFORM = '_',
  LINKS_PATH = path.resolve(__dirname, '../', 'links.json'),
  POOL = 'abcdefghijklmnopqrstuvwxyz1234567890';

class Link {
  constructor() {
    /** @type {Object} */
    this.links = {};
    /** @type {Object} */
    this._urls = {};

    this._init();
  }

  /**
   * Retrieves the url for the given short key or false it the key is unknown.
   * 
   * @param {string} key - The short key that should be looked up
   * @param {string} [platform] - The character that identifies the platform the
   *   links has been clicked on.
   * @param {boolean} [isClick] - Determines whether the lookup was initially
   *   send from a client call or is just an internal check.
   * @returns {(string|boolean)}
   */
  lookup(key, platform = DEFAULT_PLATFORM, isClick = true) {
    if (this.links && this.links.hasOwnProperty(key)) {
      if (isClick) {
        this._addClick(key, platform);
      }

      return this.links[key].url;
    }

    return false;
  }

  /**
   * Generates a new short key with the characters of the pool and the given length.
   * 
   * @param {number} length - The number of characters the short key should
   *   consist of.
   * @returns {string}
   */
  generateKey(length = 4) {
    let key = '';

    for (let i = 0; length > i; i++) {
      key += POOL[Math.floor(Math.random() * POOL.length)];
    }

    pino.info({ key }, 'Generated new key');

    return key;
  }

  /**
   * Creates a new short key for the given url.
   * 
   * @param {string} url - The url that should be saved as a short key.
   * @returns {(string|boolean)}
   */
  store(url) {
    if (!this.links) {
      return false;
    }

    let key = this._findUrl(url);
    if (key) {
      return key;
    }

    key = this.generateKey();
    while (false !== this.lookup(key, null, false)) {
      key = this.generateKey();
    }

    this.links[key] = {
      url: url
    };
    this._urls[url] = key;

    pino.info({ key, url }, `Added key for url`);

    if (!this._save()) {
      return false;
    }

    return key;
  }

  /**
   * Tries to find an existing short key for the given url.
   * 
   * @param {string} url - The url that should be checked.
   * @returns {(string|boolean)}
   */
  _findUrl(url) {
    if (this._urls.hasOwnProperty(url)) {
      return this._urls[url];
    }

    return false;
  }

  /**
   * Increases the number of clicks of the given short key.
   * 
   * @param {string} key - The short key the client looked up.
   * @param {*} platform - The platform the call came from.
   */
  _addClick(key, platform) {
    let clicks = this.links[key].clicks;

    if ('object' !== typeof clicks) {
      clicks = {
        [DEFAULT_PLATFORM]: clicks || 0
      };
      this.links[key].clicks = clicks;
    }
    clicks[platform] = (clicks[platform] || 0)++;

    pino.info(`Clicked on key ${key} [${platform}].`)

    this._save();
  }

  /**
   * Saves the links file with the current links.
   * 
   * @returns {boolean}
   */
  _save() {
    if (!this.links) {
      return false;
    }

    fs.writeFile(LINKS_PATH, JSON.stringify(this.links), (err) => {
      if (err) {
        pino.error('Could not save links: ' + err.message);
      }
    });

    return true;
  }

  /**
   * Load the initial set of links that have been stored.
   */
  _init() {
    try {
      this.links = require(LINKS_PATH);

      for (const key in this.links) {
        if (this.links.hasOwnProperty(key)) {
          const url = this.links.url;

          if (!this._urls[url]) {
            this._urls[url] = key;
          }
        }
      }
    }
    catch (e) {
      pino.error('Could not load links: ' + e.message);
    }
  }
}

let singletonLink = null;
Link.getInstance = () => {
  if (!singletonLink) {
    singletonLink = new Link();
  }

  return singletonLink;
};

module.exports = Link;
