
// Requesting API, accessing only the selected product data
window.addEventListener("load", function prodPage() {
  let currentPage = window.location.href;
  let pageUrl = new URL(currentPage);
  let prodId = pageUrl.searchParams.get("id");
  let prodIdOk = prodId.replace(/['"]+/g, '');
  fetch("http://localhost:3000/api/products/" + prodIdOk)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })

    
// Retrieving selected product data in variable, then inserting it in HTML structure
    .then(function(value) {
      let prodName = JSON.stringify(value.name); 
      let prodNameOk = prodName.replace(/['"]+/g, '');
      let prodPrice = JSON.stringify(value.price);
      let prodDesc = JSON.stringify(value.description).replace(/['"]+/g, '');
      let prodImg = JSON.stringify(value.imageUrl).replace(/['"]+/g, '');
      let prodAlt = JSON.stringify(value.altTxt);
      let prodColors = JSON.stringify(value.colors);
      let prodArr = JSON.parse(prodColors);
      let ArrLength = prodArr.length; 

      document
        .getElementById("title")
        .innerHTML = prodNameOk;

      document
        .getElementById("price")
        .innerHTML = prodPrice;

      document
        .getElementById("description")
        .innerText = prodDesc;

      document
        .getElementById("prod_image")
        .innerHTML = "<img src=" + prodImg + " alt=" + prodAlt + ">";


// For loop in order to have the correct amount of color options
      for (i=0;i<=ArrLength-1;i++) {
        let newOpt = document.createElement("option");
        document.getElementById("colors").appendChild(newOpt);
        newOpt.setAttribute("value",prodArr[i]);
        newOpt.innerHTML = prodArr[i];
      }
    })
    .catch(function() {
      alert("error")
    });
  }, false);



// ADDING ELEMENTS TO CART

// Getting values of the current page
let cartAdd = document.getElementById("addToCart");
cartAdd.addEventListener("click", function() {
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

