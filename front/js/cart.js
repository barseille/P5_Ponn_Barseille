// on ramène le panier avec getItem et on le transforme le JSON en javascript avec parse
let arrayItem = JSON.parse(localStorage.getItem("panier"));
console.log("les canapés", arrayItem);
const cartContainer = document.getElementById("cart__items");

// si le panier est vide :
if (arrayItem === null || arrayItem == 0) {
  const empty = `<p>Votre panier est vide</p>`;
  cartContainer.innerHTML = empty;
}

// si pas vide
else {
  let affichage = "";

  fetch("http://localhost:3000/api/products/")
    .then((response) => response.json())
    .then((response) => {
      // boucle forEach pour attribuer les différente values
      arrayItem.forEach((product) => {
        const { id, color, alt, name, quantity, img } = product;
        const data = response;

        // trouver si element id de data est égal id de arrayitem
        const search = data.find((el) => el._id === id);
        const price = search.price;

        //relie et affiche pour chaque produit séléctionné dans le dom
        affichage += `
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

        // fonction pour afficher les prix dans le dom || servira pour raffraichir les prix ensuite
        function miseAJourPrix() {
          // je récupère les quantités
          let quantiteDArticle =
            document.getElementsByClassName("itemQuantity");
          let produitTotal = quantiteDArticle.length;

          // j'initialise ma variable pour le total des quantités
          let totalQtt = 0;

          // je boucle pour savoir le total
          for (let q = 0; q < produitTotal; q++) {
            totalQtt += quantiteDArticle[q].valueAsNumber; // valueAsNumber : changer type string en number
          }

          // je transmet le résultat sur le dom
          let afficherQuantite = document.getElementById("totalQuantity");
          afficherQuantite.innerHTML = totalQtt;
          console.log(totalQtt);

          // j'initialise le compteur de ma variable à zéro pour le total des prix
          // je boucle pour avoir le prix des articles en fonction des quantités
          // boucle pour avoir le total des prix
          let totalPrice = 0;
          for (let q = 0; q < produitTotal; q++) {
            totalPrice += quantiteDArticle[q].valueAsNumber * price;
          }

          // je transmet le résultat à mon html
          let priceDisplay = document.getElementById("totalPrice");
          let fix = Math.round(totalPrice); // arrondi à l'entier le plus proche.
          priceDisplay.innerHTML = fix; // pour finir jenvoie mon panier vers le localStorage

          localStorage.setItem("panier", JSON.stringify(arrayItem));
        }
        miseAJourPrix();

        // fonction pour supprimer un produit choisi
        function deleteProduct() {
          let deleteItem = document.querySelectorAll(".deleteItem");

          for (let s = 0; s < deleteItem.length; s++) {
            deleteItem[s].addEventListener("click", (event) => {
              event.preventDefault(); // ne va pas à la page suivante si tu ne remplis pas ces conditions

              let idDelete = arrayItem[s].id;
              let colorDelete = arrayItem[s].color;

              // méthode filter pour trouver le bon élément de la boucle
              arrayItem = arrayItem.filter(
                (el) => el.id !== idDelete || el.color !== colorDelete
              ); //
              arrayItem.splice(s, 0); //modifie dans le tableau
              localStorage.setItem("panier", JSON.stringify(arrayItem));
              location.reload(); // mise à jour des prix et quantités de façon dynamique

              miseAJourPrix();
            });
          }
        }
        deleteProduct();

        // fonction pour que l'utilisateur puisse changer la quantité d'un canapé
        function qttChange() {
          let quantiteDArticle = document.querySelectorAll(".itemQuantity");

          // je boucle la longueur pour chaque quantité
          for (let k = 0; k < quantiteDArticle.length; k++) {
            quantiteDArticle[k].addEventListener("change", (e) => {
              e.preventDefault();

              //je sélectionner l'élément à modifier
              const qttSelect = arrayItem[k].quantity;
              const qttValue = quantiteDArticle[k].valueAsNumber;

              // je cherche l'élement que je veux avec la méthode find
              const qttSearch = arrayItem.find(
                (el) => el.qttValue !== qttSelect
              );

              qttSearch.quantity = qttValue;
              arrayItem[k].quantity = qttSearch.quantity;

              // je remplace le panier avec les bonnes valeurs
              miseAJourPrix();
            });
          }
        }
        qttChange();
      }); // fin du fetch
    }); // fin du for each
} // fin de else

// partie formulaire

let form = document.querySelector(".cart__order__form");

// Ajout des Regex
let emailCheck = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9._]+[.]{1}[a-z]{2,10}$"
);
let nameCheck = new RegExp("^[a-zA-Z ,.'-àâäéèêëïîôöùûüç]+$");
let cityCheck = new RegExp("^[a-zA-Z]+(?:[s-][a-zA-Z]+)*$");
let addressCheck = new RegExp(
  "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
);

// Ecoute de la modification du nom
form.firstName.addEventListener("change", function () {
  prenomValide(this);
});

// Ecoute de la modification du prénom
form.lastName.addEventListener("change", function () {
  validLastName(this);
});

// Ecoute de la modification de l'adresse
form.address.addEventListener("change", function () {
  validAddress(this);
});

// Ecoute de la modification de la ville
form.city.addEventListener("change", function () {
  validCity(this);
});

// Ecoute de la modification du mail
form.email.addEventListener("change", function () {
  validEmail(this);
});

//validation du prénom
const prenomValide = function (saisirPrenom) {
  let prenomErreurMsg = saisirPrenom.nextElementSibling; //donne la balise suivante

  if (nameCheck.test(saisirPrenom.value)) {
    prenomErreurMsg.innerHTML = "";
    return true;
  } else {
    prenomErreurMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation du nom
const validLastName = function (saisirNom) {
  let nomErreurMsg = saisirNom.nextElementSibling;

  if (nameCheck.test(saisirNom.value)) {
    nomErreurMsg.innerHTML = "";
    return true;
  } else {
    nomErreurMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation de l'adresse
const validAddress = function (saisirAdresse) {
  let adresseErreurMsg = saisirAdresse.nextElementSibling;

  if (addressCheck.test(saisirAdresse.value)) {
    adresseErreurMsg.innerHTML = "";
    return true;
  } else {
    adresseErreurMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation de la ville
const validCity = function (saisirVille) {
  let villeErreurMsg = saisirVille.nextElementSibling;

  if (cityCheck.test(saisirVille.value)) {
    villeErreurMsg.innerHTML = "";
    return true;
  } else {
    villeErreurMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

//validation de l'email
const validEmail = function (saisirEmail) {
  let emailErreurMsg = saisirEmail.nextElementSibling;

  if (emailCheck.test(saisirEmail.value)) {
    emailErreurMsg.innerHTML = "";
    return true;
  } else {
    emailErreurMsg.innerHTML = "Le champ n'est pas valide !";
    return false;
  }
};

// bouton commander
function checkFinal() {
  const btn_commander = document.getElementById("order");

  btn_commander.addEventListener("click", (e) => {
    e.preventDefault();

    const saisirPrenom = document.getElementById("firstName");
    const saisirNom = document.getElementById("lastName");
    const saisirAdresse = document.getElementById("address");
    const saisirVille = document.getElementById("city");
    const saisirEmail = document.getElementById("email");

    if (
      validLastName(saisirNom) &&
      prenomValide(saisirPrenom) &&
      validAddress(saisirAdresse) &&
      validCity(saisirVille) &&
      validEmail(saisirEmail)
    ) {
      // le tableau pour les id
      let itemId = [];
      for (let z = 0; z < arrayItem.length; z++) {
        itemId.push(arrayItem[z].id);
      }
      console.log(itemId);

      const order = {
        contact: {
          firstName: saisirPrenom.value,
          lastName: saisirNom.value,
          address: saisirAdresse.value,
          city: saisirVille.value,
          email: saisirEmail.value,
        },
        products: itemId,
      };

      //méthode post = envoi au serveur
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
          console.log(data);
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);

          document.location.href = `confirmation.html?orderId=${data.orderId}`;
        });
    } // fin du if
  }); // fin du addEvent orderBtn
}
checkFinal();
