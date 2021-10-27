// AFFICHER LES INFORMATIONS LIÉES AU PRODUIT SÉLECTIONNÉ, PERMETTRE L'AJOUT AU PANIER

// Récupérer l'ID du produit sélectionné et requêter l'API uniquement pour ce dernier
let currentPage = window.location.href;
let pageUrl = new URL(currentPage);
let prodId = pageUrl.searchParams.get("id");
fetch("http://localhost:3000/api/products/" + prodId)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
})

// Récupérer les données du canapé choisi, les stocker dans des variables
  .then(function(value) {
    let prodName = value.name;
    let prodPrice = value.price;
    let prodDesc = value.description;
    let prodImg = value.imageUrl;
    let prodAlt = value.altTxt;
    let prodColors = value.colors;
    let ArrLength = prodColors.length;

// Insérer les données dans la structure HTML de la page
    document
      .getElementById("title")
      .innerHTML = prodName;
    document
      .getElementById("price")
      .innerHTML = prodPrice;
    document
      .getElementById("description")
      .innerText = prodDesc;
    document
      .getElementById("prod_image")
      .innerHTML = `<img src=${prodImg} alt="${prodAlt}">`;

// For loop pour déterminer la quantité d'options couleur, puis les afficher
    for (i=0;i<=ArrLength-1;i++) {
      let newOpt = document.createElement("option");
      document.getElementById("colors").appendChild(newOpt);
      newOpt.setAttribute("value",prodColors[i]);
      newOpt.innerHTML = prodColors[i];
    }
  })


// Ajouter la sélection au panier
// La fonction se déclenche via un 'onclick' situé directement dans le code HTML de la page produit
function cartFunc() {
// Récupérer les informations de couleur et de quantité
let cartQty = parseInt(document.getElementById("quantity").value);
let cartCol = document.getElementById("colors").value;

// Si le panier est vide, créer le panier avec les informations de ID / couleur / qté sélectionnées
// Sous la forme: {id: {couleur: quantité}}
// Stocker ces informations dans le localStorage sous forme de string, avec la clé "carty"
if (localStorage.getItem("carty") === null) {
  let myJson = {[prodId]: {[cartCol]: cartQty}};
  let myData = JSON.stringify(myJson);
  localStorage.setItem("carty", myData);
// Si un panier existe déjà, le récupérer
} else {
  let myData = localStorage.getItem("carty");
  let myJson = JSON.parse(myData);
  // Si notre produit est déjà dans le panier...
  if (prodId in myJson) {
    // ... avec la même couleur que celle choisie par l'utilisateur, on incrémente la quantité avec la nouvelle quantité
    if (cartCol in myJson[prodId]) {
      myJson[prodId][cartCol] += cartQty;
    // ... avec une autre couleur, on ajoute l'information sous forme d'une nouvelle paire {couleur: quantité} rattachée au produit
    } else {
      myJson[prodId][cartCol] = cartQty;
    }
  // Si le produit n'est pas dans le panier, on l'ajoute, sous la forme {id: {couleur: quantité}}
  } else { 
    myJson[prodId] = {[cartCol]: cartQty}
  }
  // Stocker notre nouveau panier dans le localStorage
  let myNewData = JSON.stringify(myJson);
  localStorage.setItem("carty", myNewData);
}
testCol = document.getElementById("quantity");
  if (testCol.value == 0) {
    alert("Veuillez renseigner une quantité")
  } else {alert("c'est ajouté au panier!")
  }
}



//localStorage.clear();
//alert(localStorage.length);
//let myData = localStorage.getItem("carty");
//alert(myData);
