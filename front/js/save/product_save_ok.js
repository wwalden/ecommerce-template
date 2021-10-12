window.addEventListener("load", function prodPage() {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
        let currentPage = window.location.href;
        let pageUrl = new URL(currentPage);
        let prodId = pageUrl.searchParams.get("id");
        let prodRef = parseInt(prodId/6)-1;

        let prodName = JSON.stringify(value[prodRef].name);
        let prodNameOk = prodName.replace(/['"]+/g, '');
        let prodPrice = JSON.stringify(value[prodRef].price);
        let prodDesc = JSON.stringify(value[prodRef].description).replace(/['"]+/g, '');
        let prodImg = JSON.stringify(value[prodRef].imageUrl).replace(/['"]+/g, '');
        let prodAlt = JSON.stringify(value[prodRef].altTxt);
        let prodColors = JSON.stringify(value[prodRef].colors);
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





  //let source = JSON.stringify(value[prodRef].imageUrl)
  //let alt = JSON.stringify(value[prodRef].altTxt)
  /*
  let currentPage = window.location.href;
  let pageUrl = new URL(currentPage);
  let prodId = pageUrl.searchParams.get("id");
  let prodRef = parseInt(prodId/6)-1;
  let prodRef = parseInt(prodRef);
  alert(prodRef);

  
  document
    .getElementsByClassName(item__img)
    .innerHTML = "<img src=" + source + " alt=" + alt + ">";
*/
