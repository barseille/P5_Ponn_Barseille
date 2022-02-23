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
