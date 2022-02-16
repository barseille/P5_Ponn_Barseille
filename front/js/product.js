const url = new URL(window.location.href);
const idProduct = url.searchParams.get("id");
const UrlProduct = `http://localhost:3000/api/products/${idProduct}`;

const colors = document.getElementById("colors");
const itemQty = document.getElementById("quantity");
let myProduct = {};

//appel des éléments depuis l'API
const image = document.querySelector(".item__img");
const titre = document.querySelector("#title");
const prix = document.querySelector("#price");
const description = document.querySelector("#description");

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
    //relié API et HTML
    image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    titre.innerHTML = `${data.name}`;
    prix.innerHTML = `${data.price}`;
    description.innerHTML = `${data.description}`;
    const colors = data.colors;
    optionColors(colors); // clé de l'objet myProduct

    myProduct.id = data._id;
    myProduct.name = data.name;
    myProduct.price = data.price;
    myProduct.imageUrl = data.imageUrl;
    myProduct.altTxt = data.altTxt;
  })
  .catch(function () {
    console.log("Fetch Erreur");
    alert(
      "Veuillez nous excuser les produits ne sont pas disponible pour le moment."
    );
  });

const buttonPanier = document.querySelector("#addToCart");
buttonPanier.addEventListener("click", () => {
  // création tableau vide
  let arrayItem = []; // affecter produit de l'api

  let colorProduct = document.querySelector("#colors").value;
  let quantityProduct = document.querySelector("#quantity").value; //créer un objet pour mettre dans le local storage

  function alertPanier() {
    alert("Votre article a été ajouté au panier");
  }

  let produitPanier = {
    id: myProduct.id,
    name: myProduct.name,
    price: myProduct.price,
    color: colorProduct,
    quantity: parseInt(quantityProduct, 10), //rajoute une quantité décimale
    img: myProduct.imageUrl,
    alt: myProduct.altTxt,
  };
  console.log(
    produitPanier
  ); /*if (produitPanier.quantity <= 0 || produitPanier.color === '') { //si rien est sélectionné
    alert('allo') //ok
    return
  }*/

  if (produitPanier.quantity <= 0 || produitPanier.quantity > 100) {
    alert("Veuillez indiquer un nombre d'article entre 1 et 100");
    return; //ok
  }
  if (produitPanier.color === "" || produitPanier.quantity <= 0) {
    alert("Veuillez saisir un article");
    return;
  }
  if (produitPanier.color == "") {
    //ok couleur
    alert("Veuillez saisir une couleur");
    return;
  } //rajoute le produit dans le local storage s'il y a déjà un produit dans le panier

  if (localStorage.getItem("panier")) {
    arrayItem = JSON.parse(localStorage.getItem("panier"));
   

    for (let i in arrayItem) {
      if (
        // va chercher dans l'objet ProduitPanier
        //si meme produit et meme couleur
        produitPanier.id == arrayItem[i].id &&
        produitPanier.color == arrayItem[i].color
      ) {
        //ajouter le produit dans le tableau remplit
        arrayItem[i].quantity = arrayItem[i].quantity + produitPanier.quantity;

        localStorage.setItem("panier", JSON.stringify(arrayItem));
        alertPanier();
        return;
      }
    }
  } // si le panier est vide, ajoute le product directement

  arrayItem.push(produitPanier);

  localStorage.setItem("panier", JSON.stringify(arrayItem));
  window.location.href = "cart.html";
  alertPanier();
});
