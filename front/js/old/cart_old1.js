/*
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);
let count = Object.keys(objJson).length;


for (i=0;i<=count;i++) {
    alert(myData);
}
*/





//localStorage.clear();
//alert(localStorage.length);
//let myData = localStorage.getItem("carty");
//alert(myData);

/*

// LE FORMAT : {"77711f0e466b4ddf953f677d30b0efc9":{"Grey":2}}

// TO GET A SPECIFIC KEY 
    let myData = localStorage.getItem("carty");
    let myJson = JSON.parse(myData);
  //let myId = Object.keys(myJson);  // DONNE L'ID SEULEMENT S'IL N'Y EN A QU'UNE
    let myId = Object.keys(myJson)[1]; // DONNE LA PREMIERE ID STOCKÉE
    let myQtyByColor = myJson[myId]["Red"];  // OK DONNE LA QUANTITÉ DE RED, le sortir pour chaque couleur? si undefined ne rien faire
    let myColor = Object.keys(myJson)[1][0];
    
    alert(myData);
*/

// faire une loop pour parcourir le fichier et récup les données (photos, nom...) à partir de l'ID




fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    //let ApiData = JSON.stringify(value);
    //alert(myData);

    let myData = localStorage.getItem("carty");
    let myJson = JSON.parse(myData);
    let myId = Object.keys(myJson);

    //alert(myId);

    for (i=0; i<value.length;i++) {
        let docID = value[i]._id;
        if (docID == myId){
            for (j=0; j<=value[i].colors.length;j++) {
                let NewColor = value[i].colors[j];
                if (myJson[myId][NewColor] > 0) {
                let newArtBox = document.getElementById("cart__items");
                newArtBox.innerHTML = `
                    <article class="cart__item" data-id="${value[i]._id}">
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
                        </div>
                    </article>`
                }
                break
            }

        }


    }

})



