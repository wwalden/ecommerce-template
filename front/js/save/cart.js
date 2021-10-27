
/**************************************/
// BLOC 1: Afficher dynamiquement les éléments du panier sur la page panier, produit par produit
/**************************************/

// Compter et récupérer les ID présents dans le panier
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);

Object.keys(myJson).forEach( (myId) => {
  // Pour chaque ID du panier, requêter l'API et s'assurer du retour des données
  fetch("http://localhost:3000/api/products/" + myId)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    // Appel de la fonction qui affiche les éléments
    displayItems(value);
    updateTotal();
  })
})


// Fonction qui permet d'afficher toutes les informations de chaque élément du panier
function displayItems(value) {
  // Déterminer le nombre de couleurs disponibles pour l'ID, identifier chaque couleur [j]
  // Vérifier à chaque fois si elle est présente dans le panier
  let Arr = value.colors;
  Arr.forEach((newColor) => {
    // Si la couleur est dans le panier (quantité > 0), création de la structure HTML 
    // En insérant les informations du produit / du panier
    if (myJson[value._id][newColor] > 0) {
      let newArtBox = document.createElement("article");
      document.getElementById("cart__items").appendChild(newArtBox);
      newArtBox.setAttribute("class", "cart__item");
      // Si la couleur contient un "/", le supprimer
      let colorUpdate = newColor.replace('/', '');
      newArtBox.setAttribute("id", `${colorUpdate}${value._id}`);
      newArtBox.innerHTML = `
        <div class="cart__item__img">
            <img src="${value.imageUrl}" alt="${value.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${value.name}</h2>
                <p>couleur: ${newColor}</p>
                <p class="price">${value.price}€</p>
                
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté :</p>
                    <input type="number" onchange="changeFunc('${value._id}', '${newColor}')" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${myJson[value._id][newColor]}>
                </div>
                <div class="cart__item__content__settings__delete">
                    <p onclick="deleteFunc('${value._id}', '${newColor}')" class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>`
    }         
  }) 
}


/**************************************/
//END BLOC 1
/**************************************/




/**************************************/
// BLOC 2: Fonctions pour gérer les quantités du panier (Modifier, Supprimer...)
/**************************************/

// Vider le panier. La fonction se lance au clic sur le bouton "vider le panier"

const emptyCartEl = document.getElementById('emptyCart');
emptyCartEl.addEventListener('click', function() {       
  let answer = window.confirm("Confirmez-vous la suppression du panier?");
    if (answer) {
      localStorage.removeItem("carty");
      alert("votre panier est vide!");
      location.reload();
    }
});


// Supprimer un article. L'élément concerné se supprime du panier et du localstorage au clic
// La fonction se lance au clic (clic du code HTML défini par la fonction d'affichage ci-dessus)
function deleteFunc(delId, delCol) {
  // Aller dans le localStorage, récupérer le JSON pour mettre la quantité à 0
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  // S'il y a plusieurs couleurs pour la même référence, on ne supprime que la couleur concernée
  if (Object.keys(myJson[delId]).length == 1) {
    delete myJson[delId];
  } else if (Object.keys(myJson[delId]).length > 1) {
    delete myJson[delId][delCol];
  }
  // Stocker à nouveau le JSON modifié
  let myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData);
  // Envoyer un message de confirmation et reloader la page
  alert("Élément supprimé!");
  location.reload();
}


// Modifier la quantité pour un article. L'élément concerné est mis à jour dans le panier + le localstorage
// La fonction se lance au clic (clic du code HTML défini par la fonction d'affichage ci-dessus)
function changeFunc(modifId, modifCol) {
  // Récupérer l'ID et la couleur de l'élément concerné
  // Si la couleur contient un "/", le supprimer
  let modifColUpdate = modifCol.replace('/', '');
  let getQty = document.querySelector(`#${modifColUpdate}${modifId} input`);
  let modifQty = parseInt(getQty.value);
  //let modifQty = parseInt(document.getElementById(`${modifId}|${modifCol}`).value )
  // Aller dans le localStorage, récupérer le JSON pour mettre à jour la quantité
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  myJson[modifId][modifCol] = modifQty;
  // Stocker à nouveau le JSON modifié
  let myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData);
  // Appel de la fonction updateTotal, définie plus tard, pour mettre à jour les totaux du panier
  updateTotal();
}


// Mettre à jour le total des prix et quantités du panier 
function updateTotal() {
  // Aller dans le localStorage, récupérer le JSON 
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  var myTotQty = 0;
  var myTotPce = 0;
  Object.keys(myJson).forEach((theId) => {
    // Récupérer les quantités pour chaque référence
    let countByRef = Object.values(myJson[theId]).reduce((a, b) => a + b, 0);
    // Récupérer la première couleur demandée dans la référence (sert à récupérer ensuite le prix)
    let colorRaw = Object.keys(myJson[theId])[0];
    // Si la couleur contient un "/", le supprimer
    let myIddCol = colorRaw.replace('/', '');
    let idForPrice = document.querySelector(`#${myIddCol}${theId} p.price`);
    if (idForPrice !== null) {
    let pcebyRef = parseInt(idForPrice.textContent.slice(0,-1));
    myTotQty += countByRef;                               
    myTotPce += pcebyRef * countByRef;
    }
  })
  // Implémenter les résultats dans le corps HTML
  let totalQtyEl = document.getElementById("totalQuantity");
  totalQtyEl.innerHTML = myTotQty;
  let totalPceEl = document.getElementById("totalPrice");  
  totalPceEl.innerHTML = myTotPce;
}


/**************************************/
//END BLOC 2
/**************************************/




/**************************************/
// BLOC 3: Valider les différents champs du formulaire avec des RegEx
/**************************************/

// Définir la fonction de validation Regex
// rId: ID de l'élément à tester, rIdError: ID de l'élément qui affiche le message d'erreur, rRegex: règle à appliquer
// La fonction sera appelée pour chacun des 5 champs du formulaire
function regexFunc(rId, rIdError, rRegex) {
  document
    .getElementById(rId)
    .addEventListener("input", function(e) {
  // Réactiver le bouton d'envoi de la commande (dans le cas où il aurait été désactivé par une tentative d'envoi non valide précédemment)
  document
    .getElementById("order")
    .removeAttribute("disabled");
  // Définir les caractères autorisés
  if (rRegex.test(e.target.value)) {
    let el = document.getElementById(rIdError)
    el.innerText = "";
  } else {
      // Définir un message si le champ est laissé vide
      if(/^$/.test(e.target.value)) {
        let el = document.getElementById(rIdError)
        el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById(rIdError)
        el.innerText = "Format non valide";
      }
  }
  })
}
  
// Définir les différentes règles Regex //
// Lettres, accents et tirets
let regex1 = /^[A-zÀ-ÿ-_ ]+$/;
// Lettres, accents, tirets, points et virgules
let regex2 = /^[A-zÀ-ÿ0-9-/_,. ]+$/;
// Format adresse mail uniquement
let regex3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Stocker les différentes variables (5 champs de formulaire) pour la fonction. (dans des Arrays)
const rId = ["firstName", "lastName", "address", "city", "email"];
const rIdError = Array.from(rId, x => x + "ErrorMsg");
const rRegex = [regex1, regex1, regex2, regex1, regex3];

// Boucle "for" sur la fonction, afin de l'appliquer à chacun des champs de formulaire
for (i=0;i<rId.length;i++) {
regexFunc(rId[i], rIdError[i], rRegex[i]);
}
  

/**************************************/
//END BLOC 3
/**************************************/




/**************************************/
// BLOC 4: Entrer les informations client dans le local storage
/**************************************/


// Fonction appelée au survol du bouton de commande
// Le but est de désactiver le bouton si tous les champs ne sont pas correctement renseignés
function formCheck() {
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
  } else {
    // Sinon, le formulaire peut être envoyé
    document
      .getElementById("order")
      .removeAttribute("disabled");
  }
}


// Fonction appelée au clic du bouton de commande
// Envoyer les informations de la commande (requête POST sur l'API), récupérer le numéro de commande
function sendData(event) {
  event.preventDefault();
  // Nommer les variables pour chacun des champs de formulaire
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;
  // Créer un Object avec les informations du client
  let custData = {"firstName": firstName,"lastName": lastName,"address": address,"city": city,"email": email};
  // Créer un Array avec les ID des produits du panier
  let productData = [];
  Object.keys(myJson).forEach((theId) => {
    productData.push(theId)
  })
  // Concaténer le tout dans un object, le mettre au format JSON
  let dataAll = {"contact": custData, "products": productData};
  let dataAllString = JSON.stringify(dataAll)
  // Requête POST sur l'API
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    body: dataAllString
  })
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  // Récupérer la réponse, ouvrir une page 'confirmation' et insérer le numéro de commande dans l'URL
  .then(function(value) {
    window.open(`./confirmation.html?order=${value.orderId}`,"_self")
  });
}


// Event Listener qui lance la fonction 'sendData'
document
  .getElementById("order")
  .addEventListener("click", sendData);

// Event Listener qui lance la fonction 'formCheck'
document
  .getElementById("order")
  .addEventListener("mouseover", formCheck, false);


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