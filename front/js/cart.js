/**************************************/
// BLOC 1: Afficher dynamiquement les éléments du panier sur la page panier, produit par produit
/**************************************/

// Compter et récupérer les ID présents dans le panier
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);

if (myJson !== null) {
  // Pour chaque ID du panier, requêter l'API et s'assurer du retour des données
  Object.keys(myJson).forEach( (myId) => {
    fetch("http://localhost:3000/api/products/" + myId)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      // Appeler la fonction qui affiche les éléments
      displayItems(value);
      // Appeler la fonction de mise à jour des totaux
      updateTotal();
    })
  })
}


// Fonction qui permet d'afficher toutes les informations de chaque élément du panier
function displayItems(value) {
  // Déterminer les couleurs dispo pour l'ID, les identifier [j], vérifier leur présence dans le panier
  let Arr = value.colors;
  Arr.forEach((newColor) => {
    // Si la couleur est dans le panier (quantité > 0), création de la structure HTML avec les infos produit
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


// Supprimer un article. L'élément concerné se supprime du panier et du localstorage
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
function changeFunc(modifId, modifCol) {
  // Récupérer l'ID et la couleur de l'élément concerné
  let modifColUpdate = modifCol.replace('/', '');
  let getQty = document.querySelector(`#${modifColUpdate}${modifId} input`);
  let modifQty = parseInt(getQty.value);
  // Aller dans le localStorage, récupérer le JSON pour mettre à jour la quantité
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  myJson[modifId][modifCol] = modifQty;
  // Stocker à nouveau le JSON modifié
  let myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData);
  // Appeler de la fonction updateTotal pour mettre à jour les totaux du panier
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
    // Récupérer la première couleur demandée dans la référence
    let colorRaw = Object.keys(myJson[theId])[0];
    // Si la couleur contient un "/", le supprimer
    let myIddCol = colorRaw.replace('/', '');
    // Récupérer les prix dans le code HTML grace à l'ID
    let idForPrice = document.querySelector(`#${myIddCol}${theId} p.price`);
    if (idForPrice !== null) {
      let pcebyRef = parseInt(idForPrice.textContent.slice(0,-1));
      // Mettre à jour les totaux
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
// BLOC 3: Valider lors de la saisie les différents champs du formulaire avec des RegEx 
/**************************************/

// Définir les différentes règles Regex //
// Lettres, accents et tirets autorisés
let regex1 = /^[A-zÀ-ÿ-_ ]+$/;
// Lettres, accents, tirets, points et virgules autorisés
let regex2 = /^[A-zÀ-ÿ0-9-/_,. ]+$/;
// Format adresse mail uniquement autorisé
let regex3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


// Stocker les différentes variables (5 champs de formulaire) pour la fonction. (dans des Arrays)
// Array avec les ID des champs de formulaires
const arrId = ["firstName", "lastName", "address", "city", "email"];
// Array avec les ID des espaces définis pour afficher les messages d'erreurs
const arrIdError = Array.from(arrId, x => x + "ErrorMsg");
// Array contenant les différentes Regex définies
const arrRegex = [regex1, regex1, regex2, regex1, regex3];

// Boucle "for" sur la fonction, afin de l'appliquer à chacun des champs de formulaire
for (i=0;i<arrId.length;i++) {
regexFunc(arrId[i], arrIdError[i], arrRegex[i]);
}


// Définir la fonction de validation Regex
// La fonction sera appelée pour chacun des 5 champs du formulaire
function regexFunc(arrId, arrIdError, arrRegex) {
  document
    .getElementById(arrId)
    .addEventListener("input", function(e) {
  document
    .getElementById("order")
    .removeAttribute("disabled");
  // Définir les caractères autorisés
    if (arrRegex.test(e.target.value)) {
      let el = document.getElementById(arrIdError)
      el.innerText = "";
    } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById(arrIdError)
        el.innerText = "Format non valide";
    }
  })
}

/**************************************/
//END BLOC 3
/**************************************/




/**************************************/
// BLOC 4: Entrer les informations client dans le local storage
/**************************************/

// Fonction appelée au clic du bouton de commande
// Permet de récupérer les données du formulaire et de créer l'objet qui sera envoyé via l'API
function getData(event) {
  event.preventDefault();
  // Nommer les variables pour chacun des champs de formulaire
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;
  // S'assurer que TOUS les champs respectent les Regex
  if (formCheck(firstName, lastName, address, city, email) == true) {
    // Créer un Object avec les informations du client
    let custData = {"firstName": firstName,"lastName": lastName,"address": address,"city": city,"email": email};
    // Créer un Array avec les ID des produits du panier
    let productData = [];
    Object.keys(myJson).forEach((cartId) => {
      productData.push(cartId)
    })
    // Concaténer le tout dans un object, le mettre au format JSON
    let dataAll = {"contact": custData, "products": productData};
    let dataAllString = JSON.stringify(dataAll)
    // Appeler la fonction d'envoi des données
    sendData(dataAllString)
  } else {
    alert("Veuillez vérifier le formulaire!")
  }
}


// Vérifier au moment de la soumission du formulaire que l'ensemble des input sont conformes aux attentes
function formCheck(firstName, lastName, address, city, email) {
  // S'assurer que TOUS les champs respectent les Regex
  let v1 = regex1.test(firstName);
  let v2 = regex1.test(lastName);
  let v3 = regex2.test(address);
  let v4 = regex1.test(city);
  let v5 = regex3.test(email);
  if(v1 && v2 && v3 && v4 && v5) {
    return true;
  } else {
    return false;
  }
}


// Envoyer les informations de la commande (requête POST sur l'API), récupérer le numéro de commande
function sendData(dataAllString) {
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


// Event Listener qui lance les fonctions 'getData' puis 'sendData'
document
  .getElementById("order__form")
  .addEventListener("submit", getData);

/**************************************/
//END BLOC 4
/**************************************/
