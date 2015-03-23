/*
Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var confParser = require(__dirname + '/../index.js');

module.exports = {
  'basic-test': function (test) {
    var data = 'foo=bar';
    var parsed = confParser.parse(data);
    test.equal(parsed.getKeys().length, 1, 'has the proper number of keys');
    test.ok(parsed.hasKey('foo'), 'has the proper key');
    test.equal(parsed.get('foo'), 'bar', 'has the proper value');
    test.done();
  },
  'test-with-comments': function (test) {
    var data = '; This is a comment\n' +
      'foo=bar ; This is a different comment';
    var parsed = confParser.parse(data);
    test.equal(parsed.getKeys().length, 1, 'has the proper number of keys');
    test.ok(parsed.hasKey('foo'), 'has the proper key');
    test.equal(parsed.get('foo'), 'bar', 'has the proper value');
    test.done();
  },
  'serialize-with-comments': function (test) {
    var data = '; This is a comment\n' +
      'foo=bar ; This is a different comment';
    var parsed = confParser.parse(data);
    parsed.set('foo', 'baz');
    parsed.set('foo2', 'stuff');
    test.equal(parsed.serialize(), '; This is a comment\n' +
      'foo=baz ; This is a different comment\n' +
      'foo2=stuff'
    );
    test.done();
  }
};