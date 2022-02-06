// sélectionne #items dans HTML
const container = document.querySelector("#items");

// connexion à l'API
fetch("http://localhost:3000/api/products")
  .then((reponse) => {
    return reponse.json();
  })

  .then((data) => {
    const allKanap = data;
    console.log(allKanap);
    allKanap.forEach((element) => {
      container.innerHTML += `<a href="./product.html?id=${element._id}">
    <article>
      <img src = "${element.imageUrl} "alt = "${element.altTxt}" >
      <h3 class = "productName" > ${element.name} </h3>
      <p class = "productDescription"> ${element.description} </p>
    </article>
  </a>`;
    });
  })
  .catch(function (erreur) {
    console.log("Fetch Erreur");
    alert(
      "veuillez nous excusez les produits ne sont pas disponible pour le moment."
    );
  });
