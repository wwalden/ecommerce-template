/*
Voir pour faire fonctionner le cart_test ? (avec requête de l'API par product_ID only)
Aller chercher avec juste un ID par produit pour les modifs etc.... (<article id="[id][col]") + possibilité de récup ces variables direct
vérifier si le plug du HTML est bien autorisé?
puis méthode POST...
/*


/**************************************/
// BLOC 1: Afficher dynamiquement les éléments du panier sur la page panier, produit par produit
/**************************************/


// Requêter l'API et s'assurer du retour des données
fetch("http://localhost:3000/api/products")
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(value) {

  // Compter le nombre d'ID présents dans le panier
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  let count = Object.keys(myJson).length;
  var basketAmount = 0;

  // Boucle qui sera effectuée pour chacun des ID du panier
  for (k=0; k<=count-1; k++) {
    let myId = Object.keys(myJson)[k];

    // Boucle 'for' permettant de parcourir l'API à la recherche de l'ID n°[k] du panier: (ID[k] = APIelement[i])
    for (i=0; i<value.length;i++) {
      let docID = value[i]._id;

      // Boucle 'if' pour indiquer quoi faire lorsque l'on a trouvé notre ID via l'API
      if (docID == myId){

        // Déterminer le nombre de couleurs disponibles pour l'ID, identifier chaque couleur [j]
        // Vérifier à chaque fois si elle est présente dans le panier 
        for (j=0; j<=value[i].colors.length;j++) {
          let NewColor = value[i].colors[j];

          // Si la couleur est dans le panier (quantité > 1), création de la structure HTML 
          // En insérant les informations du produit / du panier
          if (myJson[myId][NewColor] > 0) {
              
            // BEG ---- Pour afficher le prix total
            let bktQty = parseInt(myJson[myId][NewColor]);
            if (bktQty>0) {
            basketAmount = basketAmount + bktQty * value[i].price;
            }
            let el = document.getElementById("totalPrice");
            el.innerHTML = `${basketAmount}`;
            // END ---- Pour afficher le prix total

            let newArtBox = document.createElement("article");
            newArtBox.setAttribute("class", "cart__item");
            //newArtBox.setAttribute("id", value[i]._id + NewColor);
            document.getElementById("cart__items").appendChild(newArtBox);
            newArtBox.innerHTML = `
              <div class="cart__item__img">
                  <img src="${value[i].imageUrl}" alt="${value[i].altTxt}">
              </div>
              <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                      <h2>${value[i].name}</h2>
                      <p>couleur: ${NewColor}</p>
                      <p id="${NewColor}${value[i]._id}${NewColor}">${value[i].price}€</p>
                      
                  </div>
                  <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                          <p>Qté :</p>
                          <input type="number" onchange="changeFunc(this)" id="${NewColor}${value[i]._id}" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${myJson[myId][NewColor]}>
                      </div>
                      <div class="cart__item__content__settings__delete">
                          <p onclick="deleteFunc(this)" class="deleteItem" id="${value[i]._id}${NewColor}">Supprimer</p>
                      </div>
                  </div>
              </div>`
          }         
        }
        // La clé 'break' permet de sortir de la boucle lorsque l'on a trouvé l'ID du panier dans le JSON via l'API
        break
      }
    }
  }
updateTotal();
})



/**************************************/
//END BLOC 1
/**************************************/





/**************************************/
// BLOC 2: Gérer les quantités du panier (Modifier, Supprimer...)
/**************************************/

// Vider le panier. La fonction se lance au clic sur le bouton "vider le panier"
function emptyFunc() {
  let answer = window.confirm("Confirmez-vous la suppression du panier?");
    if (answer) {
      localStorage.removeItem("carty");
      alert("votre panier est vide!");
      location.reload();
      return false;
    }
    else {
    }
}


// Supprimer un article. L'élément concerné se supprime du panier et du localstorage au clic
// La fonction se lance au clic (clic du code HTML défini par la fonction d'affichage ci-dessus)
function deleteFunc(btn) {
  // Récupérer l'ID et la couleur de l'élément concerné
  let modifCol = btn.id.slice(32);
  let modifId = btn.id.slice(0,32);
  // Aller dans le localStorage, récupérer le JSON pour mettre la quantité à 0
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  myJson[modifId][modifCol] = 0;
  // Stocker à nouveau le JSON modifié
  let myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData);
  // Envoyer un message de confirmation et reloader la page
  alert("Élément supprimé!");
  location.reload();
  return false;
}


// Modifier la quantité pour un article. L'élément concerné est mis à jour dans le panier et le localstorage au clic
// La fonction se lance au clic (clic du code HTML défini par la fonction d'affichage ci-dessus)
function changeFunc(inp) {
  // Récupérer l'ID et la couleur de l'élément concerné
  let modifCol = inp.id.slice(0,-32);
  let modifId = inp.id.slice(-32);
  let modifQty = parseInt(inp.value);
  // Aller dans le localStorage, récupérer le JSON pour mettre à jour la quantité
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  myJson[modifId][modifCol] = modifQty;
  // Stocker à nouveau le JSON modifié
  let myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData);

  updateTotal();
}


// Mettre à jour le total des prix et quantités du panier 
function updateTotal() {
  // Aller dans le localStorage, récupérer le JSON 
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  // Afficher EN TEMPS RÉEL les totaux quantités et prix du panier
  let count = Object.keys(myJson).length;
  var myTotQty = 0;
  var myTotPce = 0;
  // Boucle pour récupérer la quantité totale et le prix pour chacune des références
  for (i=0;i<=count-1;i++) {
    let reference = Object.values(Object.values(myJson)[i]);    // renvoie un Array avec la liste des quantités (une entrée par couleur) (pour Qty)
    let myIdd = Object.keys(myJson)[i];                         // trouve l'ID (pour prix)
    let myIddCol = Object.keys(Object.values(myJson)[i])[0];    // couleur pour l'ID (pour prix)
    let idToPick = myIddCol + myIdd + myIddCol;                 // permet de définir l'ID qui nous renverra le prix (pour prix)
    let idForPrice = document.getElementById(idToPick);         // récupère le prix (pour prix)
    let pcebyRef = parseInt(idForPrice.textContent.slice(0,-1));
    let countByRef = reference.reduce((a, b) => a + b, 0);      // fait la somme du Array (pour Qty)
    myTotQty += countByRef;                                     // Agrège les valeurs pour chaque ID du panier (pour Qty)
    myTotPce += pcebyRef * countByRef                           // donne le prix pour chaque ID du panier (pour Qty)       
  }
  let totalQtyEl = document.getElementById("totalQuantity");    // Afficher la quantité
  totalQtyEl.innerHTML = myTotQty;
  let totalPceEl = document.getElementById("totalPrice");       // Afficher le prix
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
  
// Définir les différentes règles Regex
let regex1 = /^[A-zÀ-ÿ-_ ]+$/;
let regex2 = /^[A-zÀ-ÿ0-9-/_,. ]+$/;
let regex3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Stocker les différentes variables (5 champs de formulaire) pour la fonction. (dans des Arrays)
const rId = ["firstName", "lastName", "address", "city", "email"];
const rIdError = Array.from(rId, x => x + "ErrorMsg");
const rRegex = [regex1, regex1, regex2, regex1, regex3];

// Boucle "for" sur la fonction, afin de l'appliquer à chacun des champs de formulaire
for (i=0;i<5;i++) {
regexFunc(rId[i], rIdError[i], rRegex[i]);
}
  
  
/**************************************/


// Fonction appelée au clic de commande
// Le but est de désactiver le bouton si tous les champs ne sont pas correctement renseignés
function storeCust() {

  // Définir les variables de champs qui seront testés
  const rIdT = ["firstName", "lastName", "address", "city", "email"];
  const rIdErrorT = Array.from(rId, x => x + "ErrorMsg");  

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
    alert("commande enregistrée!");
  }
}  

/**************************************/
//END BLOC 3
/**************************************/





/**************************************/
// BLOC 4: Entrer les informations client dans le local storage
/**************************************/
/*

function storeCust() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;

    let custData = [firstName, lastName, address, city, email];
    let custString = JSON.stringify(custData);
    localStorage.setItem("custData", custString);
}


let mybla = localStorage.getItem("custData");
let mybli = JSON.parse(mybla);
console.log(mybli);
*/

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