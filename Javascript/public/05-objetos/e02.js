function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
function crearUsuario(name, id) {
  return {
    name,
    id: getRandom(1, 10),
  };
}
let user1 = crearUsuario("chanchito");
let user2 = crearUsuario("chanchito feliz");
console.log(user1, user2);
