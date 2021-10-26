"use strict";

/**************************************/
// BLOC 1: Afficher dynamiquement les éléments du panier sur la page panier, produit par produit

/**************************************/
// Compter et récupérer les ID présents dans le panier
var myData = localStorage.getItem("carty");
var myJson = JSON.parse(myData);
Object.keys(myJson).forEach(function (myId) {
  // Pour chaque ID du panier, requêter l'API et s'assurer du retour des données
  fetch("http://localhost:3000/api/products/" + myId).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }).then(function (value) {
    // Appel de la fonction qui affiche les éléments
    return displayItems(value);
  }).then(function () {
    // Appel de la fonction updateTotal, définie plus tard, pour mettre à jour les totaux du panier
    return updateTotal();
  });
}); // Fonction qui permet d'afficher toutes les informations de chaque élément du panier

function displayItems(value) {
  // Déterminer le nombre de couleurs disponibles pour l'ID, identifier chaque couleur [j]
  // Vérifier à chaque fois si elle est présente dans le panier
  var Arr = value.colors;
  Arr.forEach(function (newColor) {
    // Si la couleur est dans le panier (quantité > 0), création de la structure HTML 
    // En insérant les informations du produit / du panier
    if (myJson[value._id][newColor] > 0) {
      var newArtBox = document.createElement("article");
      document.getElementById("cart__items").appendChild(newArtBox);
      newArtBox.setAttribute("class", "cart__item"); // Si la couleur contient un "/", le supprimer

      var colorUpdate = newColor.replace('/', '');
      newArtBox.setAttribute("id", "".concat(colorUpdate).concat(value._id));
      newArtBox.innerHTML = "\n        <div class=\"cart__item__img\">\n            <img src=\"".concat(value.imageUrl, "\" alt=\"").concat(value.altTxt, "\">\n        </div>\n        <div class=\"cart__item__content\">\n            <div class=\"cart__item__content__titlePrice\">\n                <h2>").concat(value.name, "</h2>\n                <p>couleur: ").concat(newColor, "</p>\n                <p class=\"price\">").concat(value.price, "\u20AC</p>\n                \n            </div>\n            <div class=\"cart__item__content__settings\">\n                <div class=\"cart__item__content__settings__quantity\">\n                    <p>Qt\xE9 :</p>\n                    <input type=\"number\" onchange=\"changeFunc('").concat(value._id, "', '").concat(newColor, "')\" class=\"itemQuantity\" name=\"itemQuantity\" min=\"1\" max=\"100\" value=").concat(myJson[value._id][newColor], ">\n                </div>\n                <div class=\"cart__item__content__settings__delete\">\n                    <p onclick=\"deleteFunc('").concat(value._id, "', '").concat(newColor, "')\" class=\"deleteItem\">Supprimer</p>\n                </div>\n            </div>\n        </div>");
    }
  });
}
/**************************************/
//END BLOC 1

/**************************************/

/**************************************/
// BLOC 2: Fonctions pour gérer les quantités du panier (Modifier, Supprimer...)

/**************************************/
// Vider le panier. La fonction se lance au clic sur le bouton "vider le panier"


var emptyCartEl = document.getElementById('emptyCart');
emptyCartEl.addEventListener('click', function () {
  var answer = window.confirm("Confirmez-vous la suppression du panier?");

  if (answer) {
    localStorage.removeItem("carty");
    alert("votre panier est vide!");
    location.reload();
  }
}); // Supprimer un article. L'élément concerné se supprime du panier et du localstorage au clic
// La fonction se lance au clic (clic du code HTML défini par la fonction d'affichage ci-dessus)

function deleteFunc(delId, delCol) {
  // Aller dans le localStorage, récupérer le JSON pour mettre la quantité à 0
  var myData = localStorage.getItem("carty");
  var myJson = JSON.parse(myData); // S'il y a plusieurs couleurs pour la même référence, on ne supprime que la couleur concernée

  if (Object.keys(myJson[delId]).length == 1) {
    delete myJson[delId];
  } else if (Object.keys(myJson[delId]).length > 1) {
    delete myJson[delId][delCol];
  } // Stocker à nouveau le JSON modifié


  var myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData); // Envoyer un message de confirmation et reloader la page

  alert("Élément supprimé!");
  location.reload();
} // Modifier la quantité pour un article. L'élément concerné est mis à jour dans le panier + le localstorage
// La fonction se lance au clic (clic du code HTML défini par la fonction d'affichage ci-dessus)


function changeFunc(modifId, modifCol) {
  // Récupérer l'ID et la couleur de l'élément concerné
  // Si la couleur contient un "/", le supprimer
  var modifColUpdate = modifCol.replace('/', '');
  var getQty = document.querySelector("#".concat(modifColUpdate).concat(modifId, " input"));
  var modifQty = parseInt(getQty.value); //let modifQty = parseInt(document.getElementById(`${modifId}|${modifCol}`).value )
  // Aller dans le localStorage, récupérer le JSON pour mettre à jour la quantité

  var myData = localStorage.getItem("carty");
  var myJson = JSON.parse(myData);
  myJson[modifId][modifCol] = modifQty; // Stocker à nouveau le JSON modifié

  var myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData); // Appel de la fonction updateTotal, définie plus tard, pour mettre à jour les totaux du panier

  updateTotal();
} // Mettre à jour le total des prix et quantités du panier 


function updateTotal() {
  // Aller dans le localStorage, récupérer le JSON 
  var myData = localStorage.getItem("carty");
  var myJson = JSON.parse(myData);
  var myTotQty = 0;
  var myTotPce = 0;
  Object.keys(myJson).forEach(function (theId) {
    // Récupérer les quantités pour chaque référence
    var countByRef = Object.values(myJson[theId]).reduce(function (a, b) {
      return a + b;
    }, 0); // Récupérer la première couleur demandée dans la référence (sert à récupérer ensuite le prix)

    var colorRaw = Object.keys(myJson[theId])[0]; // Si la couleur contient un "/", le supprimer

    var myIddCol = colorRaw.replace('/', '');
    var idForPrice = document.querySelector("#".concat(myIddCol).concat(theId, " p.price"));
    var pcebyRef = parseInt(idForPrice.textContent.slice(0, -1));
    myTotQty += countByRef;
    myTotPce += pcebyRef * countByRef;
  }); // Implémenter les résultats dans le corps HTML

  var totalQtyEl = document.getElementById("totalQuantity");
  totalQtyEl.innerHTML = myTotQty;
  var totalPceEl = document.getElementById("totalPrice");
  totalPceEl.innerHTML = myTotPce;
}
/**************************************/
//END BLOC 2

/**************************************/

/**************************************/
// BLOC 3: Valider les différents champs du formulaire avec des RegEx (en 2 parties)

/**************************************/
// Définir la fonction de validation Regex
// rId: ID de l'élément à tester, rIdError: ID de l'élément qui affiche le message d'erreur, rRegex: règle à appliquer
// La fonction sera appelée pour chacun des 5 champs du formulaire


function regexFunc(rId, rIdError, rRegex) {
  document.getElementById(rId).addEventListener("input", function (e) {
    // Définir les caractères autorisés
    if (rRegex.test(e.target.value)) {
      var el = document.getElementById(rIdError);
      el.innerText = "";
    } else {
      // Définir un message si le champ est laissé vide
      if (/^$/.test(e.target.value)) {
        var _el = document.getElementById(rIdError);

        _el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        var _el2 = document.getElementById(rIdError);

        _el2.innerText = "Format non valide";
      }
    }
  });
} // Définir les différentes règles Regex


var regex1 = /^[A-zÀ-ÿ-_ ]+$/;
var regex2 = /^[A-zÀ-ÿ0-9-/_,. ]+$/;
var regex3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Stocker les différentes variables (5 champs de formulaire) pour la fonction. (dans des Arrays)

var rId = ["firstName", "lastName", "address", "city", "email"];
var rIdError = Array.from(rId, function (x) {
  return x + "ErrorMsg";
});
var rRegex = [regex1, regex1, regex2, regex1, regex3]; // Boucle "for" sur la fonction, afin de l'appliquer à chacun des champs de formulaire

for (i = 0; i < rId.length; i++) {
  regexFunc(rId[i], rIdError[i], rRegex[i]);
}
/**************************************/
//END BLOC 3

/**************************************/

/**************************************/
// BLOC 4: Entrer les informations client dans le local storage

/**************************************/

/*
// Fonction appelée au clic de commande
// Le but est de désactiver le bouton si tous les champs ne sont pas correctement renseignés
function storeCust() {
  // Définir les variables de champs qui seront testés
  const rIdT = ["firstName", "lastName", "address", "city", "email"];
  const rIdErrorT = Array.from(rIdT, x => x + "ErrorMsg");
  // Boucle qui renvoie un entier supérieur à zéro si l'un des champs est vide (== bloquant)
  let sumTest = 0
  for (let testOne of rIdT) {
    let elemTest1 = document.getElementById(testOne);
    if (elemTest1.value.length == 0) {
      sumTest += 1;
    }
  }
  // Boucle qui renvoie un entier supérieur à zéro si l'un des champs ne respecte pas les règles Regex (== bloquant)
  for (let testTwo of rIdErrorT) {
    let elemTest2 = document.getElementById(testTwo);
    if (elemTest2.textContent.length > 0) {
      sumTest += 1;
    }
  }
  // Si les conditions requises ne sont pas remplies, le bouton est désactivé et un message d'erreur s'affiche
  if (sumTest > 0) {
      document
        .getElementById("order")
        .setAttribute("disabled", true);
      alert("veuillez corriger le formulaire")
  } else {
    // Sinon, le formulaire peut être envoyé
    document
      .getElementById("order")
      .removeAttribute("disabled");
    sendData;
  }
}
*/


function sendData(event) {
  event.preventDefault();
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var email = document.getElementById("email").value;
  var custData = {
    "firstName": firstName,
    "lastName": lastName,
    "address": address,
    "city": city,
    "email": email
  };
  var productData = [];
  Object.keys(myJson).forEach(function (theId) {
    productData.push(theId);
  });
  var dataAll = {
    "contact": custData,
    "products": productData
  };
  var dataAllString = JSON.stringify(dataAll);
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: dataAllString
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }).then(function (value) {
    window.open("./confirmation.html?order=".concat(value.orderId), "_self");
  });
}

document.getElementById("order").addEventListener("click", sendData);
/**************************************/
//END BLOC 4

/**************************************/
//***********************************************************************//
// DATA USE KIT //
//***********************************************************************//

/*
// JSON
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);
let count = Object.keys(myJson).length;
let myId = Object.keys(myJson)[2];
alert (myId);
*/

/*
// LOCAL STORAGE
localStorage.clear();
alert(localStorage.length);
let myData = localStorage.getItem("carty");
alert(myData);
*/

/*
// TO GET A SPECIFIC KEY
// FORMAT : {"107fb5b75607497b96722bda5b504926":{"Blue":1,"White":2}}
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);
let count = Object.keys(myJson).length; // DONNE LE NOMBRE D'ID DANS LE JSON
let myId = Object.keys(myJson);  // DONNE L'ID SEULEMENT S'IL N'Y EN A QU'UNE
let myId = Object.keys(myJson)[0]; // DONNE LA PREMIERE ID STOCKÉE
let myQtyByColor = myJson[myId]["Red"];  // DONNE LA QUANTITÉ DE RED

Object.keys(Object.values(myJson)[0])[0]; // POUR ALLER PLUS LOIN DANS LE JSON
*/
//***********************************************************************//