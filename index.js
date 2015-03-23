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

module.exports.parse = function parse(rawData, options) {
  options = options || {};
  options.commentDelimiter = options.commentDelimiter || ';';
  var lines = rawData.split('\n');
  var props = {};
  var entryRegex = /([^=]*)=(.*)/;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var lineComment;
    var commentStart = line.indexOf(options.commentDelimiter);
    if (commentStart !== -1) {
      lineComment = line.substr(commentStart);
      line = line.substr(0, commentStart);
    }
    var match = entryRegex.exec(line);
    if (match) {
      props[match[1].trim()] = {
        value: match[2].trim(),
        line: i,
        comment: lineComment
      };
    }
  }
  return new ConfData(lines, props);
};

function ConfData(lines, props) {
  Object.defineProperties(this, {
    _props: {
      value: props
    },
    _lines: {
      value: lines
    },
    _currentLength: {
      value: lines.length,
      writable: true
    }
  });
}

ConfData.prototype.hasKey = function hasKey(key) {
  return this._props.hasOwnProperty(key);
};

ConfData.prototype.getKeys = function getKeys(key) {
  return Object.keys(this._props);
};

ConfData.prototype.get = function get(key) {
  return this._props[key].value;
};

ConfData.prototype.set = function set(key, value) {
  if (!this._props[key]) {
    this._props[key] = {
      line: this._currentLength++
    }
  }
  this._props[key].value = value;
};

ConfData.prototype.serialize = function() {
  var lines = this._lines;
  for(var prop in this._props) {
    var propValue = this._props[prop];
    this._lines[propValue.line] = prop + '=' + propValue.value;
    if (propValue.comment) {
      this._lines[propValue.line] += ' ' + propValue.comment;
    }
  }
  return lines.join('\n');
};
