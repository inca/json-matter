'use strict';

var path = require('path')
  , fs = require('fs')
  , fm = require('../src/index')
  , assert = require('assert');

describe('json-matter', function () {

  it('should parse front matter from strings', function () {
    var input = fs.readFileSync(path.join(__dirname, 'simple.txt'), 'utf-8');
    var obj = fm.parse(input);
    assert.equal(obj.meta, 'data');
    assert.ok(obj.arbitrary.complex);
    assert.ok(obj.__content__);
    assert.equal(obj.__content__.indexOf('  '), 0);
  });

  it('should serialize front matter in a similar way', function () {
    var input = fs.readFileSync(path.join(__dirname, 'simple.txt'), 'utf-8');
    var obj = fm.parse(input);
    var serialized = fm.serialize(obj);
    assert.ok(input, serialized);
  });

  it('should support alias redefinition', function () {
    var input = fs.readFileSync(path.join(__dirname, 'simple.txt'), 'utf-8');
    var obj = fm.parse(input, {
      alias: 'text'
    });
    assert.equal(obj.text.indexOf('  The rest content begins'), 0);
  });

  it('should support custom parsing regex', function () {
    var input = fs.readFileSync(path.join(__dirname, 'custom.txt'), 'utf-8');
    var obj = fm.parse(input, {
      regex: /^\{\{([\S\s]+)\}\}\n+-{3,}\n+/
    });
    assert.equal(obj.__content__.indexOf('This one shows custom delimiters'), 0);
  });

});
