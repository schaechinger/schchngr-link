const Link = require('../lib/Link');

describe('Link', () => {
  /** @type {Link} */
  let link = null;
  
  beforeEach(() => {
    link = new Link();
    link._save = sinon.stub().returns(true);
  });

  describe('lookup', () => {
    it('should detect unknown keys', () => {
      link.lookup('UNKNOWN').should.be.false();
    });
  });

  describe('generateKey', () => {
    it('should create keys with the given length', () => {
      [
        4, 5, , 7, 22
      ].forEach(length => {
        link.generateKey(length).should.be.a.String()
          .with.length(length);
      });
    });
  });

  describe('store', () => {
    it('should check the link list', () => {
      link.links = null;

      link.store('google.de').should.be.false();
    });

    it('should detect existing keys', () => {
      link._findUrl = sinon.stub().returns('MY_KEY');

      [
        'https://schaechinger.com',
        'https://google.de'
      ].forEach(url => {
        link.store(url).should.equal('MY_KEY');
        link._findUrl.args[link._findUrl.args.length - 1][0].should.equal(url);
      });
    });

    it('should generate a new (not existing) key', () => {
      link.generateKey = sinon.stub().onFirstCall().returns('KEY_1')
        .onSecondCall().returns('KEY_2');
      link.lookup = sinon.stub().onFirstCall().returns('KEY_1')
        .onSecondCall().returns(false);

      link.store('google.de').should.equal('KEY_2');
    });

    it('should only return key if it could be saved', () => {
      link._save.returns(false);

      link.store('google.de').should.be.false();
    });
  });

  describe('_findUrl', () => {
    it('should find existing urls', () => {
      link._urls = {
        'google.de': 'KEY_GOOGLE',
        'schaechinger.com': 'KEY_SCHAECHINGER',
        'code.visualstudio.com': 'KEY_VSC'
      };

      [
        { url: 'google.de', key: 'KEY_GOOGLE' },
        { url: 'schaechinger.com', key: 'KEY_SCHAECHINGER' }
      ].forEach(({ url, key }) => {
        link._findUrl(url).should.equal(key);
      });
    });

    it('should not find non-existing urls', () => {
      [
        'schaechinger.com',
        'google.de'
      ].forEach(url => {
        link._findUrl(url).should.be.false();
      });
    });
  });
});
