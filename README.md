# simple-object-attribute-resolver
Simple Object Attribute Resolver - Resolves and returns the value from a Javascript object with simple path expression.

Frequently we need to traverse deep attribute path to extract some value from some object.  This might require some defensive undefined object reference checking.  JSON path might be too burdensome to use for simple use cases.  This package aims to proivde simple yet reasonible exporession to access attribute values of an object.

## Quick Examples
```javascript
const soar = require('simple-object-attribute-resolver');

const data = {
  attr1: {
    attr11: {
      attr111: "Hello"
    }, attr1list1: [
      "value1"
      ,"value2"
      ,"value3"
    ]
  }, attr2: {

  }, list1: [
    [[1, 2, 3], [4, 5]]
  ], list2: [
    {
      hello: "World"
    }
  ]
};

soar.resolve(data, 'attr1.attr11.attr111'); // Hello
soar.resolve(data, 'attr1.attr1list1[1]'); // value2

const soarr1 = soar.resolver('attr1.attr11.attr111');
soarr1(data); // Hello
```
* See [test](test) directory for more examples

## Install
Install from npm:
```
$ npm install simple-object-attribute-resolver
```

## Methods
### soar.resolve(data, path)
Returns the value or reference to the element in the data object given by path.
* params:
  * data - the object to resolve the value from
  * path - simple dot path expression
* return:
  * the value of the element or the reference to the element in the data object.

### soar.resolver(path)
Returns the resolver function for the given path.  It is useful to resolve the same attribute across different data object.
* params:
  * path - simple dot path expression
* return:
  * a resolver function for the given path which could resolve the attribute by passing data object.

* Note: As the return value could be the reference to the elements in the data object, modifying the attribute of the reference could affect the source data (shallow copy).

## License
[MIT](LICENSE)