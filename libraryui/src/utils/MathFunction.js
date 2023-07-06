export const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

export const SortByDate = (data, key, order = "desc") => {
  let d = [...data].sort(function (a, b) {
    var keyA = new Date(a.stock[key]),
      keyB = new Date(b.stock[key]);
    // Compare the 2 dates
    if (order === "desc") {
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
    } else {
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
    }
    return 0;
  });

  return d;
};
