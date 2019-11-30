const assert = require('assert');
const { expect } = require('chai');

const ap = require('../.');

const sample1 = {
  item1: {
    item1level2: [
      {item1level31: 'Hello'}
      , {item1level32: 'World'}
    ], item1val2 : 'happy'
  },
  item2: {
    item2level2: [

    ]
    , aZero: 0
    , aFalseValue: false
    , aNullValue: null
    , anEmptyObject: {}
    , anEmptyArray: []
    , aNumber: 123
    , aString: 'Hello World'
    , anArrayOfNumbers: [123, 456, 789]
    , anArrayOfStrings: ['abc', 'def', 'ghi']
  },
  'test@test.com' : {
    'howto': 'escape'
    , 'more' : {
      'detail1': 'yes'
      , 'detail2' : 'no'
    }
  }
};

const sample2 = [[1,2,3], [4,5,6]];

const sample3 = { sample1, sample2 };

describe(`attr-path resolve`, function() {
  it('returns undefined if input obj was false with non-empty path', function() {
    const path = 'item2.aFalseValue.below.that';
    let actual;
    let x = false;
    
    actual = ap.resolve(x, path);
    assert(actual === undefined);

    actual = ap.resolve(sample1, path);
    assert(actual === undefined);
  });

  it('returns false if input obj was false with empty or undefined path', function() {
    let path;
    let actual;
    let x = false;
    
    actual = ap.resolve(x, path);
    assert(actual === false);

    path = '';
    actual = ap.resolve(x, path);
    assert(actual === false);
  });

  it('returns false if the path resolved is actually false', function() {
    const path = 'item2.aFalseValue';
    const actual = ap.resolve(sample1, path);
    assert(actual === false);
  });

  it('works with dot path', function() {
    const path = 'item1.item1val2';
    const actual = ap.resolve(sample1, path);
    expect(actual).equals('happy');
  });

  it('works with dot path and array', function() {
    const path = 'item1.item1level2[0][item1level31]'
    const actual = ap.resolve(sample1, path);
    expect(actual).equals('Hello');
  });

  it('ignores leading or repeating dots - e.g. "...item1"', function() {
    const path = '...item1'
    const actual = ap.resolve(sample1, path);
    expect(actual).is.an('object').that.has.property('item1val2');
  });

  it('should not break if any path component result in null', function() {
    const path = 'item1.non-exiting.item'
    const actual = ap.resolve(sample1, path);
    expect(actual).is.undefined;
  });

  it('allows dots to be escaped with square brackets', function() {
    const path = '[test@test.com]more.detail1';
    const actual = ap.resolve(sample1, path);
    expect(actual).equals('yes');
  });

  it('ignores dots after square bracket', function() {
    const path = '[test@test.com]...more.detail1';
    const actual = ap.resolve(sample1, path);
    expect(actual).equals('yes');
  });

  it('works with array', function() {
    const path = '[1][2]';
    const actual = ap.resolve(sample2, path);
    expect(actual).equals(6);    
  });

  it('works with array attribute', function() {
    const path = 'sample2[1][2]';
    const actual = ap.resolve(sample3, path);
    expect(actual).equals(6);    
  });

  it('could alter the attribute of input data with the resolved value', function() {
    const data = {
      l1: {
        l2: 'value1'
      }
    };

    const orig_value = data.l1.l2;
    const path = 'l1';
    const ref = ap.resolve(data, path);
    ref.l2 = 'value2';
    expect(ref.l2).equals(data.l1.l2);
    expect(ref.l2).not.equals(orig_value);
    expect(data.l1.l2).not.equals(orig_value);
  });

});

describe(`attr-path resolveArray`, function() {
  it('returns an empty array for null or empty object', function() {
    const path = 'item2.aFalseValue.below.that';
    let actual;

    actual = ap.resolveArray(null, path);
    expect(actual).to.be.an('array').eql([]);

    actual = ap.resolveArray([], path);
    expect(actual).to.be.an('array').eql([]);

    actual = ap.resolveArray({}, path);
    expect(actual).to.be.an('array').eql([]);
  });

  it('returns an empty array if input obj was false with non-empty path', function() {
    const path = 'item2.aFalseValue.below.that';
    let actual;
    let x = false;
    
    actual = ap.resolveArray(x, path);
    expect(actual).to.be.an('array').eql([]);
  });

  it('returns an empty array for empty array', function() {
    const path = 'item2.anEmptyArray';
    let actual;

    actual = ap.resolveArray(sample1, path);
    expect(actual).to.be.an('array').eql([]);
  });

  it('returns an array of empty object for empty object', function() {
    const path = 'item2.anEmptyObject';
    let actual;

    actual = ap.resolveArray(sample1, path);
    expect(actual).to.be.an('array').eql([{}]);
  });

  it('resolves single value as single element array', function() {
    let actual;

    actual = ap.resolveArray(sample1, 'item2.aZero');
    expect(actual).to.be.an('array').eql([0]);

    actual = ap.resolveArray(sample1, 'item2.aFalseValue');
    expect(actual).to.be.an('array').eql([false]);

    actual = ap.resolveArray(sample1, 'item2.aNullValue');
    expect(actual).to.be.an('array').eql([]);

    actual = ap.resolveArray(sample1, 'item2.aNumber');
    expect(actual).to.be.an('array').eql([123]);

    actual = ap.resolveArray(sample1, 'item2.aString');
    expect(actual).to.be.an('array').eql(['Hello World']);

  });

  it('resolves array properly', function() {
    let actual;

    actual = ap.resolveArray(sample1, 'item2.anArrayOfNumbers');
    expect(actual).to.be.an('array').eql([123, 456, 789]);

    actual = ap.resolveArray(sample1, 'item2.anArrayOfStrings');
    expect(actual).to.be.an('array').eql(['abc', 'def', 'ghi']);

  });

});

describe(`attr-path resolver`, function() {
  it('works with simple path', function() {
    const path = 'item1.item1val2'
    const apr = ap.resolver(path);
    const expected = ap.resolve(sample1, path);
    const actual = apr(sample1);
    expect(actual).equals('happy');
    expect(actual).equals(expected);
  });
});