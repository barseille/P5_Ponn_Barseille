//lien d'un produit de la page d'accueil à la page produit, récupération de l'ID
let idProduct = new URL(window.location.href).searchParams.get("id");

fetch("http://localhost:3000/api/products/" + idProduct)
  .then((response) => response.json())

  .then((product) => {
    // ADD the image
    let imgItemElement = document.getElementsByClassName("item__img");
    let img = document.createElement("img");
    img.src = product.imageUrl;
    imgItemElement[0].appendChild(img); // ADD the name

    let titleElement = document.getElementById("title");
    let h3 = document.createElement("h3");
    h3.textContent = product.name;
    titleElement.appendChild(h3); // ADD the price

    let priceSpanElement = document.getElementById("price");
    let price = document.createTextNode(product.price);
    priceSpanElement.appendChild(price); // ADD the description

    let descriptionElement = document.getElementById("description");
    let descri = document.createTextNode(product.description);
    descriptionElement.appendChild(descri); //ADD the colors options

    let selectElement = document.getElementById("colors");
    let colors = product.colors;
    for (let c of colors) {
      let newOption = document.createElement("option");
      newOption.value = c;
      let colorText = document.createTextNode(c);
      newOption.appendChild(colorText);
      selectElement.appendChild(newOption);
    }
  });

//ajoute un produit au panier
const button = document.querySelector("#addToCart");

button.addEventListener("click", (event) => {
  let colors = document.querySelector("#colors").value;
  let quantity = document.querySelector("#quantity").value;

  let optionProduct = {
    _id: idProduct,
    colors: colors,
    qty: quantity,
  };
  if (colors == null || quantity == null || quantity == "0") {
    alert("Veuillez mettre la couleur et la quantité");
    event.preventDefault();
  }
 

  localStorage.setItem("id", JSON.stringify(optionProduct));
  window.location.href = "cart.html";
});
