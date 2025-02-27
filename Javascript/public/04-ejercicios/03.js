// indice validar que no sea menor a cero y que el elemento exita
// en el array

function getbyIdx(arr, index) {
  if (index < 0 || index >= arr.length) {
    return null;
  }
  return arr[index];
}
let resultado = getbyIdx([1, 2], -1);
console.log(resultado); // Debería mostrar 2
