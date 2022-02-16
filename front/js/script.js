//sélectionne #items dans html
const container = document.querySelector("#items");

//connexion à l'API
fetch("http://localhost:3000/api/products")
  //promise pour récupérer tous les canapés de façon asynchrone
  .then((reponse) => {
    return reponse.json();
  })

  .then((dataKanap) => {
    const allKanap = dataKanap;
    // console.log(allKanap);
    allKanap.forEach((element) => {
      container.innerHTML += `<a href="./product.html?id=${element._id}">
            <article>
                <img src=${element.imageUrl} alt=${element.altTxt}>
                    <h3 class="productName">${element.name}</h3>
                    <p class="productDescription">${element.description}</p>
                </article>
            </a>`;
    });
  })
  .catch(function (err) {
    console.log("Fetch Erreur");
    alert(
      "Veuillez nous excusez les produits ne sont pas disponible pour le moment."
    );
  });
