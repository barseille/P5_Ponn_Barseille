let arrayItem = JSON.parse(localStorage.getItem("panier"));
console.table(arrayItem);

const cartContainer = document.querySelector("#cart__items");

//  récupération des canapés depuis l'API
const recuperationCanapesAPI = async function () {
  const canapesLocalStorage = JSON.parse(localStorage.getItem("panier"));

  let informationsCanapesUtilisateur = [];

  return fetch("http://localhost:3000/api/products/")
    .then((response) => response.json())
    .then((response) => {
      canapesLocalStorage.forEach((canape, index) => {
        // On créé une variable => infoFromLocalStorage (canapeDansAPI)
        // cette variable nous permet de récupérer les informations d'un canapé dans l'API
        // dont l'id correspond à l'id d'un canapé présent dans le localStorage
        const infoFromLocalStorage = {};
        infoFromLocalStorage.color = canape.color;
        infoFromLocalStorage.quantity = canape.quantity;

        informationsCanapesUtilisateur[index] = Object.assign(
          // cloner objet
          infoFromLocalStorage,
          response.find((el) => el._id === canape.id)
        );
      });

      // Une fois que la boucle est terminée on renvoie le tableau "informationsCanapesUtilisateur"
      // et cela afin de pouvoir faire s'en servir pour faire des traitements dessus dans le reste de notre script
      return informationsCanapesUtilisateur;
      // return à l'intérieur d'un "then" = promesse résolue
    })
    .catch(function () {
      cartContainer.innerHTML = `<p>Une erreur est survenue. Merci de contacter le support client.</p>`;
    });
};
// affichages des canapés
const affichageDesCanapes = async function () {
  const canapesUtilisateur = await recuperationCanapesAPI();

  let affichage = "";

  canapesUtilisateur.forEach((canape) => {
    affichage += `
      <article class="cart__item" data-id="${canape._id}" data-color="${canape.color}">
        <div class="cart__item__img">
          <img src="${canape.imageUrl}" alt="${canape.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${canape.name}</h2>
            <p>${canape.color}</p>
            <p>${canape.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${canape.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>
    `;
  });

  cartContainer.innerHTML = affichage;

  // On fait appel aux autres fonctions
  // canapesUtilisateur sert de paramètre pour faire l'addition et l'affectation
  miseAJourPrix(canapesUtilisateur);
  miseAJourQuantite(canapesUtilisateur);
  suppressionCanape();
};

const miseAJourPrix = function (canapesUtilisateur) {
  let sommeDesQuantites = 0;
  let sommeDesPrix = 0;

  canapesUtilisateur.forEach((canape) => {
    sommeDesQuantites += canape.quantity;
    sommeDesPrix += canape.quantity * canape.price;
  });

  let totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.innerHTML = sommeDesQuantites;

  let priceDisplay = document.querySelector("#totalPrice");
  priceDisplay.innerHTML = Math.round(sommeDesPrix);
};

const miseAJourQuantite = function (canapesUtilisateur) {
  const inputQuantite = document.querySelectorAll(".itemQuantity");
  inputQuantite.forEach((input) => {
    input.addEventListener("change", (event) => {
      event.preventDefault();

      const canapesLocalStorage = JSON.parse(localStorage.getItem("panier"));

      // quand on modifira les quantités, on fera tjs apel au "parent"
      const parent = input.closest("article"); // recherche son parent qui est lui même
      const canapeId = parent.getAttribute("data-id");
      const canapeColor = parent.getAttribute("data-color");
      const quantite = input.valueAsNumber;

      // On va mettre à jour la quantité dans le tableau du localStorage
      // id et color du data = élément de l'article
      const indexTableauLS = canapesLocalStorage.findIndex(
        (el) => el.id === canapeId && el.color === canapeColor
      );
      // quantité du panier = nombre d'article dans panier
      canapesLocalStorage[indexTableauLS].quantity = quantite;
      localStorage.setItem("panier", JSON.stringify(canapesLocalStorage));

      // On va mettre à jour la quantité dans page panier (l'objet canapesUtilisateur)
      const indexTableauCanapes = canapesUtilisateur.findIndex(
        (el) => el._id === canapeId && el.color === canapeColor
      );
      canapesUtilisateur[indexTableauCanapes].quantity = quantite;

      miseAJourPrix(canapesUtilisateur);
    });
  });
};

const suppressionCanape = function () {
  const boutonsDeSuppression = document.querySelectorAll(".deleteItem");
  boutonsDeSuppression.forEach((bouton) => {
    bouton.addEventListener("click", (event) => {
      event.preventDefault();

      const parent = bouton.closest("article");
      const canapeId = parent.getAttribute("data-id");
      const canapeCouleur = parent.getAttribute("data-color");

      const nouvelleValeurLocalStorage = arrayItem.filter(
        (el) => el.id !== canapeId || el.color !== canapeCouleur
      );

      localStorage.setItem(
        "panier",
        JSON.stringify(nouvelleValeurLocalStorage)
      );
      alert("L'article a bien été supprimé");

      location.reload(); // recharge la page actuelle
    });
  });
};

if (arrayItem === null || arrayItem.length === 0) {
  const empty = `<p>Votre panier est vide</p>`;
  cartContainer.innerHTML = empty;
} else {
  affichageDesCanapes();
}
