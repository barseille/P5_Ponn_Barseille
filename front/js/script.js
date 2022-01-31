//connexion à l'API

fetch("http://localhost:3000/api/products") //requête fetch :récuperer des données dans le serveur de manière asynchrone
  .then((res) => res.json()) //promise : récupère les données en Json
  .then((data) => {
    let items = document.getElementById("items");
    let htmlItems = "";

    //instruction "for...in" itère tous les "_id" de data et implémente "items" via le string interpolation
    for (let i in data) {
      htmlItems += `<a href="./product.html?id=${data[i]._id}">
    <article>
      <img src = "${data[i].imageUrl} "alt = "${data[i].id}" >
      <h3 class = "productName" > ${data[i].name} </h3>
      <p class = "productDescription"> ${data[i].description} </p>
    </article>
  </a>`;
    }
    items.innerHTML = htmlItems;
  });
