
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


function cartFunc() {
  let cartQty = parseInt(document.getElementById("quantity").value);
  let cartCol = document.getElementById("colors").value;
  // alert(`alors ${prodId} et ${cartQty} et ${cartCol}`);
  // let myJson = {"id": prodId, "qty": cartQty, "col": cartCol}
  if (localStorage.getItem("carty") === null) {
    let myJson = {[prodId]: {[cartCol]: cartQty}};
    let myData = JSON.stringify(myJson);
    localStorage.setItem("carty", myData);
  } else {
    let myData = localStorage.getItem("carty");
    let myJson = JSON.parse(myData);
    if (prodId in myJson) {
      if (cartCol in myJson[prodId]) {
        myJson[prodId][cartCol] += cartQty;
      } else {
        myJson[prodId][cartCol] = cartQty;
      }
    } else { 
      myJson[prodId] = {[cartCol]: cartQty}
    }
    let myNewData = JSON.stringify(myJson);
    localStorage.setItem("carty", myNewData);
  }
}

//localStorage.clear();
//alert(localStorage.length);

let myData = localStorage.getItem("carty");
alert(myData);




//let cartQty = document.getElementById("quantity").value;
//let cartCol = document.getElementById("colors").value;

//let cartCol = "vert";


// TO KEEP, IT WORKS : let myJson = {"id": prodId, "qty": cartQty, "col": cartCol};
// TO GET DATA: myJson[prodId]["turquoise"]

//let myJson = {[prodId]: {[cartCol]: cartQty, "turquoise": 24}};
//alert(myJson[prodId]["orange"]);

/*
// SET THE STORAGE
let myJson = {[prodId]: {"rouge": 12, "turquoise": 24}};
let myData = JSON.stringify(myJson);
localStorage.setItem("carty", myData);
*/


// GET THE DATA
/*
let myData = localStorage.getItem("carty");
let myJson = JSON.parse(myData);
if (prodId in myJson) {
    if (cartCol in myJson[prodId]) {
      myJson[prodId][cartCol] += cartQty;
    }
    else {
      myJson[prodId][cartCol] = cartQty;
    }
} else { 
    myJson[prodId] = {[cartCol]: cartQty}
}
*/


/*
let newTest = "newTest";

let myData = localStorage.getItem("carty");
alert(myData);
let myJson = JSON.parse(myData);
if (newTest in myJson) {
    if ("etpaslà" in myJson["newTest"]) {
      myJson[newTest]["etlà"] = myJson["newTest"]["etlà"] + 3;
    }
    else {
      myJson[newTest]["etpaslà"] = 37;
    }
} else { 
    alert("still here");
    myJson["newTest"] = {"etlà": 2}
}

let myNewData = JSON.stringify(myJson);
localStorage.setItem("carty", myNewData);

alert(myNewData);
*/




//localStorage.setItem("cart", {"id": {"col":qt, "col":qt, "col":qt}});
//localStorage.setItem("members", [{"name": "Molecule Man","age": 29,"secretIdentity": "Dan Jukes","powers": ["Radiation resistance","Turning tiny","Radiation blast"]},{"name": "Madame Uppercut","age": 39,"secretIdentity": "Jane Wilson","powers": ["Million tonne punch","Damage resistance","Superhuman reflexes"]}]);
//localStorage.clear();
//let b = localStorage.key(0);
//let a = JSON.stringify(b);
//let c = localStorage.length;
//alert(localStorage.length);
//localStorage.setItem("bla","blou");
//alert(b); 
//alert(localStorage.bla);
//localStorage.clear();

/*
let objJson = 
{  "squadName": "Super hero squad",
  "homeTown": "Metro City",
  "formed": 2016,}

let objLinea = JSON.stringify(objJson);
localStorage.setItem("obj",objLinea);
*/

/*
let myData = localStorage.getItem("carty");
//alert(myData);
let myJson = JSON.parse(myData);
alert(myJson.id)
*/

// Ajouter les éléments au panier


/*
? format donnees

[  [id, qt, co], [id, qt, col] ]   for
{ id: [[qt, col], [qt, col]] }
{ id: {col:qt, col:qt, col:qt}}
dic

if dic[id] ?
    if dic[id][col] ?
        // facile
        dic[id][col] += qt 
    else
        dic[id][col] = qt
else
  dic[id] = {col: qt}

JSON.parse
JSON.stringify
*/

/*
// Getting values of the current page
let cartAdd = document.getElementById("addToCart");
cartAdd.addEventListener("click", function() { //onlcik (dans html)
  let currentPage = window.location.href;
  let pageUrl = new URL(currentPage);
  let prodId = pageUrl.searchParams.get("id");
  let cartId = prodId.replace(/['"]+/g, '');
  let cartQty = document.getElementById("quantity").value;
  let cartCol = document.getElementById("colors").value;

// Knowing if there is already something in cart. If not:
  if (localStorage.getItem("obj") === null) {
    localStorage.setItem("obj", "{\"id\": " + cartId + ",\"qty\":" + cartQty + ",\"color\": " + cartCol + ",}");
// If yes:
  } else {
    let objLinea = localStorage.getItem("obj");
    let objJson = JSON.parse(objLinea);
    let count = Object.keys(objJson).length;
//checking if there is already the same reference in cart, in this case we need to add Qty
    for (i=1;i<=count;i++) {
      let idTest = objJson[i-1].id; // scope du let? only dans le for?
      let colTest = objJson[i-1].color;
      if(cartId == idTest) {
        if(cartCol == colTest) {
          objJson[i-1].qty += 1;
          break;
        }
      }
      if (i==count) {
        objJson.push({"id": cartId,"qty": cartQty,"color": cartCol,});
      }
    }
  let objLinea = JSON.stringify(objJson);
  localStorage.setItem("obj",objLinea);  // assez pour remplacer? ou je dois clear puis set again?
  }
})

*/
