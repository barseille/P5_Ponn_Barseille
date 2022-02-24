// je récupère le lien dans la barre d'adresse
const url = new URL(window.location.href);

//avec les paramètre je récupère l'order id dans l'url
const orderId = url.searchParams.get("orderId");
const confirmOrderId = document.querySelector("#orderId");

// j'intègre l'orderID dans l'HTML
confirmOrderId.innerHTML = orderId;

//vide le localstorage
localStorage.clear("orderId");
