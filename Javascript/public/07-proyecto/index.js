class User {
  static #url = "https://jsonplaceholder.typicode.com/users";
  static #users = [];
  static #ul = document.createElement("ul");

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
  static renderUser(u) {
    let li = document.createElement("li");
    li.innerText = u.name;
    return li;
  }
  static render() {
    let users = this.#users;
    users.forEach((u) => this.#ul.appendChild(this.renderUser(u)));

    return this.#ul;
  }
}

async function main() {
  const users = await User.getAll();
  const template = User.render();
  console.log(template);
  document.body.appendChild(template);
}

main();
