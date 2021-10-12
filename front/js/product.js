
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
    .catch(function(err) {
      alert("error")
    });
  }, false);