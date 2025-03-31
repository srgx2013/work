let array = [
  {
    id: 1,
    name: "nicolas",
  },
  {
    id: 2,
    name: "felipe",
  },
  {
    id: 3,
    name: "chanchito",
  },
];

function topairs(arr) {
  let pairs = [];
  for (idx in arr) {
    let elemento = arr[idx];
    pairs[idx] = [elemento.id, elemento];
  }
  return pairs;
}

let resultado = topairs(array);
console.log(resultado);
