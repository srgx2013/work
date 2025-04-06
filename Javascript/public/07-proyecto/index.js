class User {
  static #url = "https://jsonplaceholder.typicode.com/users";
  static #users = [];

  static async getAll() {
    try {
      const response = await fetch(this.#url);
      if (!response.ok) throw new response();
      this.#users = await response.json();
      return this.#users;
    } catch (e) {
      console.log("Error", e);
    }
  }
}
static reder() {
    this.#ul = document.createElement('ul');
}

async function main() {
  const users = await User.getAll();
  User.reder();
  console.log(users);
}

main();
