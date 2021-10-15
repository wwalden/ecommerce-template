// !!!!! Utilisation d'une boucle For... in ?

// Afficher dynamiquement les éléments du panier sur la page panier, produit par produit

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
                    let newArtBox = document.createElement("article");
                    newArtBox.setAttribute("class", "cart__item");
                    document.getElementById("cart__items").appendChild(newArtBox);
                    newArtBox.innerHTML = `
                            <div class="cart__item__img">
                                <img src="${value[i].imageUrl}" alt="${value[i].altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__titlePrice">
                                    <h2>${value[i].name}</h2>
                                    <p>couleur: ${NewColor}</p>
                                    <p>${value[i].price}€</p>
                                    
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté :</p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${myJson[myId][NewColor]}>
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
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







//***********************************************************************//
                    // DATA MANIPULATION KIT //
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
*/

//***********************************************************************//