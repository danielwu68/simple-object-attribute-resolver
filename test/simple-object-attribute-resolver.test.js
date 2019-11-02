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
    , aFalseValue: false
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
  it('return undefined if input obj was false with non-empty path', function() {
    const path = 'item2.aFalseValue.below.that';
    let actual;
    let x = false;
    
    actual = ap.resolve(x, path);
    assert(actual === undefined);

    actual = ap.resolve(sample1, path);
    assert(actual === undefined);
  });

  it('return false if input obj was false with empty or undefined path', function() {
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

  it('works with leading dots - e.g. "...item1"', function() {
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

  it('dots after square bracket are ignored', function() {
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

  it('attribute in the resolved path can be modified and alters the input data', function() {
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