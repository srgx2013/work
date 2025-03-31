function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
function Usuario(name) {
  this.id = getRandom(1, 10);
  this.name = name;
}

let usuario = new Usuario("chanchito");
console.log(usuario);

console.log(getRandom(1, 10));
