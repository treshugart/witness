export default function (items, cb) {
  if (!items) {
    return;
  }

  if (items.hasOwnProperty) {
    for (let a in items) {
      if (items.hasOwnProperty(a)) {
        if (cb(items[a], a) === false) {
          return;
        }
      }
    }
  } else if (items.length) {
    for (let a = 0; a < items.length; a++) {
      if (cb(items[a], a) === false) {
        return;
      }
    }
  }
}
