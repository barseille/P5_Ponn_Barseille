// utilisation de searchparams pour récupérer l'id du bon produit pour chaque objet
let params = new URL(document.location).searchParams;
let id = params.get("id");
const newUrl = "http://localhost:3000/api/products/" + id;

const color = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const imageURL = "";

// appel de l'api
fetch(newUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    resultApi = data; // const pour afficher les produits de l'Api

    const image = document.querySelector(".item__img");
    const titre = document.querySelector("#title");
    const prix = document.querySelector("#price");
    const description = document.querySelector("#description");
    const colors = document.querySelector("#colors");
    let imageURL = "";
    let imageAlt = ""; // mise en page de l'api avec le DOM

    image.innerHTML = `<img src="${resultApi.imageUrl}" alt="${resultApi.altTxt}">`;
    imageURL = resultApi.imageUrl;
    imageAlt = resultApi.altTxt;
    titre.innerHTML = `${resultApi.name}`;
    prix.innerText = `${resultApi.price}`;
    description.innerText = `${resultApi.description}`; // boucle pour mettre en place les options de couleurs

    for (let i in resultApi.colors) {
      colors.innerHTML += `<option value="${resultApi.colors[i]}">${resultApi.colors[i]}</option>`;
    } // création du formulaire d'envoi du bouton

    const button = document.querySelector("#addToCart");
    button.addEventListener("click", handleClick); //fonction pour bloquer quand le panier est vide

    function handleClick() {
      const color = document.getElementById("colors").value;
      const quantity = document.getElementById("quantity").value;

      if (isOrderIsValid(color, quantity)) return;
      saveOrder(color, quantity);
      redirectToCart();
    } //fonction pour envoyer au panier
    function redirectToCart() {
      window.location.href = "cart.html";
    } //fonction des paramètres couleurs et quantités

    function isOrderIsValid(color, quantity) {
      if (color == null || color === "" || quantity == null || quantity == 0) {
        alert("Veuillez sélectionner une couleur ou une quantité");
        return true;
      }
    } // création du tableau d'informations que je vais retourner au localStorage

    function saveOrder(color, quantity) {
      const arrayItem = {
        id: id,
        alt: imageAlt,
        image: imageURL,
        name: titre.innerHTML,
        price: prix.innerHTML,
        color: color,
        quantity: quantity,
      }; //ajoute dans le localstorage

      localStorage.setItem(id, JSON.stringify(arrayItem));
    }
  });
