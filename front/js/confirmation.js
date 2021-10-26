// Récupérer le numéreo de commande dans l'URL de la page
let currentPage = window.location.href;
let pageUrl = new URL(currentPage); 
let orderNum = pageUrl.searchParams.get("order");
// Afficher le numéro de commande sur la page, et vider le panier
document
  .getElementById("orderId")
  .innerHTML = orderNum;
localStorage.removeItem("carty");

