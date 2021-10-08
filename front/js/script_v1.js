
//document.onload = 

//window.onload = function() {
//  alert("let's go!");
// }


//document
//.getElementsByTagName("body")
//.addEventListener("load", displayProducts);

// from 0 to 7

window.onload = function displayProducts() {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      document
          .getElementById("productName")
//          .innerText = JSON.stringify(value);
          .innerText = Object.keys(value).length;
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
  }




  // SCRIPT QUI FONCTIONNE //
  // avec un h3 id="productName" //

/*
  window.onload = function displayProducts() {
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      document
          .getElementById("productName")
//          .innerText = JSON.stringify(value);
          .innerText = value[6].name;
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
  }

*/