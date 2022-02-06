// utilisation de searParams pour récupérer l'id du bon produit pour chaque objet
let params = new URL(document.location).searchParams;
let id = params.get("id");
const newURL = "http://localhost:3000/api/products/" + id;

//Affiche les produits de l'API
function Kanapdata(kanap) {
  const altTxt = kanap.altTxt;
  const colors = kanap.colors;
  const description = kanap.description;
  const imageUrl = kanap.imageUrl;
  const name = kanap.name;
  const price = kanap.price;

  itemPrice = price;
  imgUrl = imageUrl;
  altText = altTxt;
  articleName = name;
  creationImage(imageUrl, altTxt);
  creationTitle(name);
  creationPrice(price);
  creationDescription(description);
  creationColors(colors);
}
fetch(newURL)
  .then((response) => response.json())
  .then((res) => Kanapdata(res));

// on crée img car la balise img n'existe pas dans HTML
// if parent != null veut dire si parent est différent de null
function creationImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  if (parent != null) parent.appendChild(image);
}

function creationTitle(name) {
  const h1 = document.querySelector("#title");
  if (h1 != null) h1.textContent = name;
}
function creationPrice(price) {
  const span = document.querySelector("#price");
  if (span != null) span.textContent = price;
}
function creationDescription(description) {
  const p = document.querySelector("#description");
  if (p != null) p.textContent = description;
}

// select = menu déroulant
function creationColors(colors) {
  const select = document.querySelector("#colors");
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}
// Ecoute de l'évènement "add to cart"
const button = document.querySelector("#addToCart");
button.addEventListener("click", ajoutPanier);

function ajoutPanier() {
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  if (commandeNonValide(color, quantity)) return;
  commandeSauvegarder(color, quantity);
  redirectionPanier();
}
// création du tableau d'informations que je vais retourner au localStorage
function commandeSauvegarder(color, quantity) {
  const key = `${id}-${color}`;
  const data = {
    id: id,
    color: color,
    quantity: Number(quantity),
    price: itemPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
  };
  localStorage.setItem(key, JSON.stringify(data));
}
//Bloque les couleurs et quantités si 0 ou null
// color === "" string vide
function commandeNonValide(color, quantity) {
  if (color == null || color === "" || quantity == null || quantity == 0) {
    alert("Please select a color and quantity");
    return true;
  }
}

//Renvoi à la page cart
function redirectionPanier() {
  window.location.href = "cart.html";
}
