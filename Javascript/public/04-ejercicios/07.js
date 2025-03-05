function precioCompleto(precio, impuesto) {
  let PrecioImp = precio * impuesto;
  let precioTotal = precio + PrecioImp;
  return precioTotal;
}

let resultado = precioCompleto(19.9, 0.15);
console.log(resultado);
