const has = (object, key) => {
  return object != null && key in object;
}
const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

const sum = (arr) => {
  return arr.reduce((a, b) => a + b, 0);
}

export {
  has, clone, sum
};
