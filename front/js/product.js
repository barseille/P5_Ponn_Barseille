const url = new URL(window.location.href); // renvoie de l'Url de la page actuelle
const idProduct = url.searchParams.get("id");
const UrlProduct = `http://localhost:3000/api/products/${idProduct}`;

//appel des éléments depuis le DOM
const colors = document.querySelector("#colors");
const itemQty = document.querySelector("#quantity");
const image = document.querySelector(".item__img");
const titre = document.querySelector("#title");
const prix = document.querySelector("#price");
const description = document.querySelector("#description");

let myProduct = {};

// fonction pour afficher les couleurs
function optionColors(colors) {
  const select = document.querySelector("#colors");
  colors.forEach((couleur) => {
    const option = document.createElement("option");
    option.textContent = couleur;
    select.appendChild(option);
  });
}

// appel de l'api
//affiche des produits dans la page produit
fetch(UrlProduct)
  .then((response) => response.json())
  .then((data) => {
    //relié Dom à l'api pour l'affichage des produits
    image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    titre.innerHTML = `${data.name}`;
    prix.innerHTML = `${data.price}`;
    description.innerHTML = `${data.description}`;
    const colors = data.colors;
    optionColors(colors);

    // créer l'objet myProduct avec la clé API
    myProduct.id = data._id;
    myProduct.colors = data.colors;
    myProduct.quantity = data.quantity;
  })
  .catch(function () {
    console.log("Fetch Erreur");
    alert(
      "Veuillez nous excuser le produit n'est pas disponible pour le moment."
    );
  });

//bouton ajout au panier
const buttonPanier = document.querySelector("#addToCart");
buttonPanier.addEventListener("click", () => {
  // création tableau vide
  let arrayItem = [];

  let colorProduct = document.querySelector("#colors").value;
  let quantityProduct = document.querySelector("#quantity").value;

  function alertPanier() {
    alert("Votre article a été ajouté au panier");
  }

  // local storage
  let produitPanier = {
    id: myProduct.id,
    name: myProduct.name,
    price: myProduct.price,
    color: colorProduct,
    quantity: parseInt(quantityProduct, 10), //rajoute une quantité décimale
    img: myProduct.imageUrl,
    alt: myProduct.altTxt,
  };

  if (produitPanier.quantity <= 0 || produitPanier.quantity > 100) {
    alert("Indiquer un nombre d'article entre 1 et 100");
    return;
  }
  if (produitPanier.color == "") {
    alert("Sélectionnez une couleur");
    return;
  }

  //rajoute le produit dans le local storage s'il y a déjà un produit dans le panier

  if (localStorage.getItem("panier")) {
    //récupère les données dans le local storage

    arrayItem = JSON.parse(localStorage.getItem("panier")); // JSON en JS

    for (let i in arrayItem) {
      if (
        // va chercher dans l'objet ProduitPanier
        //si meme produit et meme couleur
        produitPanier.id == arrayItem[i].id &&
        produitPanier.color == arrayItem[i].color
      ) {
        //ajouter le produit dans le tableau rempli
        arrayItem[i].quantity = arrayItem[i].quantity + produitPanier.quantity;

        localStorage.setItem("panier", JSON.stringify(arrayItem));
        window.location.href = "cart.html";
        alertPanier();
        return;
      }
    }
  } // si le panier est vide, ajoute le produit directement

  arrayItem.push(produitPanier);

  localStorage.setItem("panier", JSON.stringify(arrayItem));
  window.location.href = "cart.html";
  alertPanier();
});
