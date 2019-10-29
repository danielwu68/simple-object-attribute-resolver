const REGEX_ARRAY_REF = /(.*?)\[(.*?)\]/;

function resolveArrayValue(obj, path) {
  let regex = REGEX_ARRAY_REF.exec(path);
  while(regex && obj && path) {
    if(regex[0].startsWith('[')) {
      obj = obj[regex[2]];
    } else {
      obj = resolve(obj, regex[1]);
      if(obj) {
        obj = obj[regex[2]];
      }
    }
    path = path.substring(regex[0].length);
    regex = REGEX_ARRAY_REF.exec(path);
  } 
  return obj;
}

function dividePath(path) {
  if(!path) {
    return [ path, null ];
  }
  let pos = path.indexOf('.');
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

function resolve(obj, path) {
  if (!obj) {
    return null;
  }
  let pr;
  [ path, pr ] = dividePath(path);
  while ( obj && path ) {
    if(path.includes('[')) {
      obj = resolveArrayValue(obj, path);
    } else {
      obj = obj[path];
    }
    [ path, pr ] = dividePath(pr);
  }

  return obj;
}

exports.resolve = resolve;
exports.resolver = (path) => (obj) => resolve(obj, path);
