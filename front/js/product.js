let url = new URL(window.location.href);
let idProduct = url.searchParams.get("id");
const UrlProduct = `http://localhost:3000/api/products/${idProduct}`;

const colors = document.getElementById("colors");
const itemQty = document.getElementById("quantity");

// appel de l'api
//affiche des produits dans la page produit
fetch(UrlProduct)
  .then((response) => response.json())
  .then((data) => {
    dataProduct = data;

    //appel des éléments depuis l'API
    const image = document.querySelector(".item__img");
    const titre = document.querySelector("#title");
    const prix = document.querySelector("#price");
    const description = document.querySelector("#description");

    //relié API et HTML
    image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageUrl = data.imageUrl;
    imageAlt = data.altTxt;
    titre.innerHTML = `${data.name}`;
    prix.innerHTML = `${data.price}`;
    description.innerHTML = `${data.description}`;
    const colors = data.colors;
    optionColors(colors);

    // choix de couleurs
    function optionColors(colors) {
      const select = document.querySelector("#colors");
      colors.forEach((couleur) => {
        const option = document.createElement("option");
        option.textContent = couleur;
        select.appendChild(option);
      });
    }
  })
  .catch(function (err) {
    console.log("Fetch Erreur");
    alert(
      "Veuillez nous excusez les produits ne sont pas disponible pour le moment."
    );
  });

const buttonPanier = document.querySelector("#addToCart");
buttonPanier.addEventListener("click", (event) => {
  // création tableau vide
  let arrayItem = [];

  // affecter produit de l'api
  let colorProduct = document.querySelector("#colors").value;
  let quantityProduct = document.querySelector("#quantity").value;

  //dataProduct = data
  const productId = dataProduct._id;
  const nameProduct = dataProduct.name;
  const imageUrlProduct = dataProduct.imageUrl;
  const imageAltTxtProduct = dataProduct.altTxt;

  //créer un objet pour mettre dans le local storage
  let produitPanier = {
    id: productId,
    name: nameProduct,
    color: colorProduct,
    quantity: parseInt(quantityProduct, 10), //rajoute une qantité décimale
    img: imageUrlProduct,
    alt: imageAltTxtProduct,
  };
  console.log(produitPanier);

  //rajoute le produit dans le local storage s'il y a déjà un produit dans le panier
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

        if (arrayItem[i].quantity > 100) {
          arrayItem[i].quantity = 100;
          alert("Le nombre d'articles selectionnés est trop important !");
        }

        if (arrayItem[i].quantity <= 0) {
          // ajouter option -1 ne doit pas se calculer
          arrayItem[i].quantity <= 0;
          alert("NON !");
        }
        localStorage.setItem("panier", JSON.stringify(arrayItem));
        return;
      }
    }
    arrayItem.push(produitPanier);
    localStorage.setItem("panier", JSON.stringify(arrayItem));
  } // si le panier est vide, ajoute le product directement
  else {
    arrayItem.push(produitPanier);
    localStorage.setItem("panier", JSON.stringify(arrayItem));
  }
});
