// on ramène le panier avec getItem et on transforme JSON en objet avec parse
let arrayItem = JSON.parse(localStorage.getItem("panier"));
console.log("les canapés", arrayItem);
const cartContainer = document.getElementById("cart__items");

// si le panier est vide :
if (arrayItem === null || arrayItem == 0) {
  const empty = "Votre panier est vide";
  cartContainer.innerHTML = empty;
}
// si pas vide
else {
  let affichage = "";

  fetch("http://localhost:3000/api/products/")
    .then((response) => response.json())
    .then((response) => {
      // boucle forEach pour attribuer les différente values
      arrayItem.forEach((productExtraction) => {
        const id = productExtraction.id;
        const color = productExtraction.color;
        const alt = productExtraction.alt;
        const name = productExtraction.name;
        const quantity = productExtraction.quantity;
        const img = productExtraction.img;
        const data = response;
        //  cherche l'Id de data qui est égal à l'Id du localStorage
        const search = data.find((e) => e._id === id);
        // chercher le prix dans localStorage
        const price = search.price;
        console.log(price);

        affichage = `
        <article class="cart__item" data-id="${id}" data-color="${color}">
        <div class="cart__item__img">
          <img src="${img}" alt="${alt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${name}</h2>
            <p>${color}</p>
            <p>${price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>
        `;

        document.getElementById("cart__items").innerHTML = affichage;

        console.table(arrayItem);
        // fonction pour afficher les prix dans le html et servira pour raffraichir les prix ensuite

        function miseAJourPrix() {
          // je récupère les quantités
          let quantiteArticle = document.getElementsByClassName("itemQuantity");
          let produitTotal = quantiteArticle.length; // j'initialise ma variable pour le total des quantités

          // je boucle pour savoir le total
          // valueAsNumber va changer la valeur de input de type chaîne en number
          let totalQtt = 0;
          for (let i = 0; i < produitTotal; i++) {
            totalQtt += quantiteArticle[i].valueAsNumber;
          }

          // je transmet le résultat à mon html
          let affichageQuantite = document.getElementById("totalQuantity");
          affichageQuantite.innerHTML = totalQtt;
          console.log(totalQtt); // j'initialise ma variable pour le total des prix

          // je boucle pour avoir le prix des articles en fonction des quantités
          let totalPrice = 0;
          for (let i = 0; i < produitTotal; i++) {
            totalPrice += quantiteArticle[i].valueAsNumber * price;
          }
          // je transmet le résultat à mon html
          let affichagePrix = document.getElementById("totalPrice");
          let arrondir = Math.round(totalPrice);
          affichagePrix.innerHTML = arrondir;

          // pour finir je set mon cart (sera surtout utile quand je delete un canapé)
          localStorage.setItem("panier", JSON.stringify(arrayItem));
        }
        miseAJourPrix(); // fonction pour supprimer un produit choisi

        function deleteProduct() {
          let deleteItem = document.querySelectorAll(".deleteItem");

          for (let i = 0; i < deleteItem.length; i++) {
            deleteItem[i].addEventListener("click", (event) => {
              event.preventDefault();

              let idDelete = arrayItem[i].id;
              let colorDelete = arrayItem[i].color; // méthode filter pour trouver le bonne élément de la boucle

              arrayItem = arrayItem.filter(
                (el) => el.id !== idDelete || el.color !== colorDelete
              ); // removeChild pour enlever dynamiquement le html de l'article

              let target = document.getElementById("cart__items");
              target.childNodes[i];
              target.removeChild(target.children[i]); // update des prix et quantités de façon dynamique

              miseAJourPrix();
            });
          }
        }
        deleteProduct(); // fonction pour que l'utilisateur puisse changer la quantité d'un canapé

        function quantityChange() {
          let quantiteArticle = document.querySelectorAll(".itemQuantity"); // je boucle la longueur pour chaque quantité

          for (let i = 0; i < quantiteArticle.length; i++) {
            quantiteArticle[i].addEventListener("change", (event) => {
              event.preventDefault(); //je sélectionner l'élément à modifier

              const qttSelect = arrayItem[i].quantity;
              const qttValue = quantiteArticle[i].valueAsNumber; // je cherche l'élement que je veux avec la méthode find

              const qttSearch = arrayItem.find(
                (element) => element.qttValue !== qttSelect
              );

              qttSearch.quantity = qttValue;
              arrayItem[i].quantity = qttSearch.quantity; // je remplace le panier avec les bonnes valeurs

              miseAJourPrix();
            });
          }
        }
        quantityChange();
      }); // fin du fetch
    }); // fin du for each
} // fin de else

// partie formulaire

let form = document.querySelector(".cart__order__form");

// Ajout des Regex
let emailCheck = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9._]+[.]{1}[a-z]{2,10}$"
);
let nameCheck = new RegExp("^[a-zA-Zéè-]+$");
let cityCheck = new RegExp("^[a-zA-Z]+(?:[s-][a-zA-Z]+)*$");
let addressCheck = new RegExp(
  "^[0-9]{1,3}([,. ]{1,9}[-a-zA-Zàâäéèêëïîôöùûüç])"
);

// Ecoute de la modification du nom
form.firstName.addEventListener("change", function () {
  validFirstName(this);
});

// Ecoute de la modification du prénom
form.lastName.addEventListener("change", function () {
  validLastName(this);
});

// Ecoute de la modification du prénom
form.address.addEventListener("change", function () {
  validAddress(this);
});

// Ecoute de la modification du prénom
form.city.addEventListener("change", function () {
  validCity(this);
});

// Ecoute de la modification du prénom
form.email.addEventListener("change", function () {
  validEmail(this);
});

//validation du prénom
const validFirstName = function (saisirPrenom) {
  let firstNameErrorMsg = saisirPrenom.nextElementSibling;

  if (nameCheck.test(saisirPrenom.value)) {
    firstNameErrorMsg.innerHTML = "";
    return true;
  } else {
    firstNameErrorMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation du nom
const validLastName = function (inputLastName) {
  let lastNameErrorMsg = inputLastName.nextElementSibling;

  if (nameCheck.test(inputLastName.value)) {
    lastNameErrorMsg.innerHTML = "";
    return true;
  } else {
    lastNameErrorMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation de l'adresse
const validAddress = function (inputAddress) {
  let addressErrorMsg = inputAddress.nextElementSibling;

  if (addressCheck.test(inputAddress.value)) {
    addressErrorMsg.innerHTML = "";
    return true;
  } else {
    addressErrorMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation de la ville
const validCity = function (inputCity) {
  let cityErrorMsg = inputCity.nextElementSibling;

  if (cityCheck.test(inputCity.value)) {
    cityErrorMsg.innerHTML = "";
    return true;
  } else {
    cityErrorMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation de l'email
const validEmail = function (inputEmail) {
  let emailErrorMsg = inputEmail.nextElementSibling;

  if (emailCheck.test(inputEmail.value)) {
    emailErrorMsg.innerHTML = "";
    return true;
  } else {
    emailErrorMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

function checkFinal() {
  if (
    validLastName === true &&
    validFirstName === true &&
    validAddress === true &&
    validCity === true &&
    validEmail === true
  ) {
    const btn_commander = document.getElementById("order");

    btn_commander.addEventListener("click", (e) => {
      e.preventDefault(); // le tableau pour les id
      let itemId = [];
      for (let z = 0; z < cart.length; z++) {
        itemId.push(cart[z].id);
      }
      console.log(itemId);

      let inputName = document.getElementById("firstName");
      let inputLastName = document.getElementById("lastName");
      let inputAdress = document.getElementById("address");
      let inputCity = document.getElementById("city");
      let inputMail = document.getElementById("email");

      const order = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          address: inputAdress.value,
          city: inputCity.value,
          email: inputMail.value,
        },
        products: itemId,
      };

      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          /*console.log(data)
          localStorage.clear()
          localStorage.setItem('orderId', data.orderId)
*/
          let orderId = data.orderId;
          window.location.href = `./confirmation.html?id=${orderId}`;
          console.log(orderId);
        })
        .catch((error) => {
          console.log(error);
        }); /*document.location.href = 'confirmation.html?orderId'*/
    });
  } // fin du addEvent orderBtn
}

checkFinal();
