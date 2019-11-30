const REGEX_ARRAY_REF = /(.*?)\[(.*?)\]/;

/**
 * Returns the value indexed by the given path in the given obj.
 * @param {*} obj 
 * @param {string} path 
 */
function resolveArrayValue(obj, path) {
  let regex = REGEX_ARRAY_REF.exec(path);
  while(regex && obj != null && path) {
    if(regex[0].startsWith('[')) {
      obj = obj[regex[2]];
    } else {
      obj = resolve(obj, regex[1]);
      if(obj != null) {
        obj = obj[regex[2]];
      }
    }
    path = path.substring(regex[0].length);
    regex = REGEX_ARRAY_REF.exec(path);
  } 
  return obj;
}

/**
 * Breaks the path into 2 parts - the first segment and the rest of the path.
 * The first segment can be use to dereference the value from the object.
 * @param {string} path 
 * @returns {Array} first segment of the path as first and the rest as second.
 */
function dividePath(path) {
  if(!path) {
    return [ path, null ];
  }
  let pos = path.indexOf('.');
  // ignore the leading dots
  while(pos == 0 && path) {
    path = path.substring(1);
    pos = path.indexOf('.');
  };
  const bpos = path.indexOf('[');
  const bpos2 = path.indexOf(']', bpos);
  // if there is a square bracket before dot, terminate at that
  if(bpos == 0 && bpos2 > bpos && bpos < pos) {
    return [
      path.substring(bpos + 1, bpos2)
      , bpos2 < path.length - 1 ? path.substring(bpos2 + 1) : null
    ];
  } else if(bpos > 0 && bpos2 > bpos && bpos < pos) {
    return [
      path.substring(0, bpos)
      , path.substring(bpos)
    ];
  } else if(pos > -1) {
    return [
      path.substring(0, pos)
      , pos < path.length-1 ? path.substring(pos + 1) : null
    ];
  } else {
    return [path, null];
  }
}

/**
 * Returns the value referenced by the path in the given object.
 * @param {*} obj 
 * @param {string} path 
 */
function resolve(obj, path) {
  if (obj == null) {
    return obj;
  }
  let pr;
  [ path, pr ] = dividePath(path);
  while ( obj != null && path ) {
    if(path.includes('[')) {
      obj = resolveArrayValue(obj, path);
    } else {
      obj = obj[path];
    }
    [ path, pr ] = dividePath(pr);
  }

  return obj;
}

/**
 * Returns the value it the attribute referenced by path is already an array.
 * Otherwise, return an array with the value as the single element in the array.
 * If the value was null, return an empty array.
 * 
 * @param {*} obj 
 * @param {*} path 
 */
function resolveArray(obj, path) {
  let result = resolve(obj, path);
  return result == null ? [] 
    : Array.isArray(result) ? result : [ result ];
}

/**
 * Checks if the given obj is empty 
 */
exports.isEmpty = (obj) => {
  if (obj == null) {
    return true;
  } 
  
  if (obj === false || obj === 0) {
    return false;
  }

  for(let prop in obj) {
    if(obj.hasOwnProperty(prop))
        return false;
  }

  return true;
};

exports.resolve = resolve;
exports.resolveArray = resolveArray;

exports.resolver = (path) => (obj) => resolve(obj, path);
exports.arrayResolver = (path) => (obj) => resolveArray(obj, path);
