
/**************************************/
// TO DO
/**************************************/

// !!!!! Utilisation d'une boucle For... in ?
// Element.closest et addEventListener de type change
var basketAmount = 0

/**************************************/



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
                                // FONCTIONNE MAIS REFRESH NECESSAIRE
                                // JUSTE FAIRE UN EVENT LISTENER POUR LA MODIF ALORS??
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
                                            <input type="number" onclick="changeFunc(this)" id="${NewColor}${value[i]._id}" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${myJson[myId][NewColor]}>
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
// La fonction se lance au clic (défini dans le code HTML défini par la fonction d'affichage ci-dessus)
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

// Modiifer la quantité pour un article. L'élément concerné se supprime du panier et du localstorage au clic
// La fonction se lance au clic (défini dans le code HTML défini par la fonction d'affichage ci-dessus)
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

// Afficher EN TEMPS RÉEL les quantités totales du panier
    let count = Object.keys(myJson).length;
    var myTotQty = 0;
    // Boucle pour récupérer la quantité totale pour chacune des références
    for (i=0;i<=count-1;i++) {
        let reference = Object.values(Object.values(myJson)[i]);    // renvoie un Array avec la liste des quantités (une entrée par couleur)
        let countByRef = reference.reduce((a, b) => a + b, 0);      // fait la somme du Array
        myTotQty += countByRef;                                     // Agrège les valeurs pour chaque ID du panier
    }
    let totalQtyEl = document.getElementById("totalQuantity");
    totalQtyEl.innerHTML = myTotQty;

    var myTotPrice = 0;
    for (j=0;j<=count-1;j++) {
        let refe = Object.values(Object.values(myJson)[i]);
        let myIdd = Object.keys(myJson)[0];
        let yoyo = Object.keys(Object.values(myJson)[0])[0];
        let price = document.getElementById(yoyo + myIdd + yoyo);
        let priceOK = price.textContent.slice(0,-1);  
        let countByRef = refe.reduce((a, b) => a + b, 0);      
        myTotPrice += countByRef * priceOK;                                     
    }
    let totalPriceEl = document.getElementById("totalPrice");
    totalPriceEl.innerHTML = myTotPrice;

    
}




// Afficher AU CHARGEMENT DE LA PAGE les quantités totales du panier
// Même bloc de code que juste au dessus celui qui se déclenche au clic avec la fonction "ChangeFunc"
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);
let count = Object.keys(myJson).length;
var myTotQty = 0;
for (i=0;i<=count-1;i++) {
    let reference = Object.values(Object.values(myJson)[i]);
    let countByRef = reference.reduce((a, b) => a + b, 0);
    myTotQty += countByRef;
}
let totalQtyEl = document.getElementById("totalQuantity");
totalQtyEl.innerHTML = myTotQty;


/**************************************/
//END BLOC 2
/**************************************/



/**************************************/
// BLOC 3: Valider les différents champs du formulaire avec des RegEx (5 blocs)
/**************************************/

// Récupérer l'ID du champ
document
  .getElementById("firstName")
  .addEventListener("input", function(e) {
// Définir les caractères autorisés
  if (/^[A-zÀ-ÿ-_ ]+$/.test(e.target.value)) {
    let el = document.getElementById("firstNameErrorMsg")
    el.innerText = "";
  } else {
      // Définir un message si le champ est laissé vide
      if(/^$/.test(e.target.value)) {
        let el = document.getElementById("firstNameErrorMsg")
        el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById("firstNameErrorMsg")
        el.innerText = "Format non valide";
      }
  }
})

// Récupérer l'ID du champ
document
  .getElementById("lastName")
  .addEventListener("input", function(e) {
// Définir les caractères autorisés
  if (/^[A-zÀ-ÿ-_ ]+$/.test(e.target.value)) {
    let el = document.getElementById("lastNameErrorMsg")
    el.innerText = "";
  } else {
    // Définir un message si le champ est laissé vide
    if(/^$/.test(e.target.value)) {
        let el = document.getElementById("lastNameErrorMsg")
        el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById("lastNameErrorMsg")
        el.innerText = "Format non valide";
      }
  }
})

// Récupérer l'ID du champ
document
  .getElementById("address")
  .addEventListener("input", function(e) {
// Définir les caractères autorisés
  if (/^[A-zÀ-ÿ0-9-_,. ]+$/.test(e.target.value)) {
    let el = document.getElementById("addressErrorMsg")
    el.innerText = "";
  } else {
    // Définir un message si le champ est laissé vide
    if(/^$/.test(e.target.value)) {
        let el = document.getElementById("addressErrorMsg")
        el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById("addressErrorMsg")
        el.innerText = "Format non valide";
    }
  }
})

// Récupérer l'ID du champ
document
  .getElementById("city")
  .addEventListener("input", function(e) {
// Définir les caractères autorisés
  if (/^[A-zÀ-ÿ-_ ]+$/.test(e.target.value)) {
    let el = document.getElementById("cityErrorMsg")
    el.innerText = "";
  } else {
    // Définir un message si le champ est laissé vide
    if(/^$/.test(e.target.value)) {
        let el = document.getElementById("cityErrorMsg")
        el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById("cityErrorMsg")
        el.innerText = "Format non valide";
      }
  }
})

// Récupérer l'ID du champ
document
  .getElementById("email")
  .addEventListener("input", function(e) {
// Définir les caractères autorisés
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
    let el = document.getElementById("emailErrorMsg")
    el.innerText = "";
  } else {
    // Définir un message si le champ est laissé vide
    if(/^$/.test(e.target.value)) {
        let el = document.getElementById("emailErrorMsg")
        el.innerText = "Doit être renseigné";
      } else {
        // Définir un message si le champ ne correspond pas au format demandé
        let el = document.getElementById("emailErrorMsg")
        el.innerText = "Veuillez entrer une adresse mail valide";
      }
  }
})

/**************************************/
//END BLOC 3
/**************************************/



/**************************************/
// BLOC 4: Entrer les informations client dans le local storage
/**************************************/



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


/*
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