
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
      localStorage.setItem("num", JSON.stringify(Object.keys(value).length))
    })
/*
    .then(function(value) {
      document
          .getElementById("items")
//          .innerText = JSON.stringify(value);
          .innerText = Object.keys(value).length;
    })
*/
    .catch(function(err) {
      // Une erreur est survenue
    });
  }

  let myVar = parseInt(localStorage.getItem("num"), 10);
  //myVar = parseInt(myVar, 10);
  alert(typeof myVar);




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