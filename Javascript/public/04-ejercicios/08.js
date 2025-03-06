let array = [
  {
    id: 1,
    name: "Nicolas",
  },
  {
    id: 2,
    name: "Felipe",
  },
  {
    id: 3,
    name: "Chanchito",
  },
];

function toPairs(arr) {
  let pairs = [];
  for (idx in arr) {
    let elemento = arr[idx];
    pairs[idx] = [elemento.id, elemento];
  }
  return pairs;
}

let resultado = toPairs(array);
console.log(resultado);
