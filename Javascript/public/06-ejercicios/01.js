function paraAbsoluto(arr) {
  return arr.map((n) => Math.abs(n));
}

const ns = [-2, 3, 5, -15];

const absolutos = paraAbsoluto(ns);

console.log(absolutos);
