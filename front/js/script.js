
//document.onload = 

//window.onload = function() {
//  alert("let's go!");
// }


//document
//.getElementsByTagName("body")
//.addEventListener("load", displayProducts);

// from 0 to 7

/*
LES 2 ONLOAD ne fonctionnent pas ensemble, mais indépendemment OK
--> checker la variable loopNum avec un alert(msg)
--> intégrer les 2 ONLOAD à une seule fonction??

window.onload = function displayProducts() {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    var loopNum  = Object.keys(value).length;
  })
  .catch(function(err) {
    // Une erreur est survenue
  });
}
*/


window.onload = function struct() {
  for (i=1;i<8;i++) {
    let newbloc = document.createElement("a");
    let newArt = document.createElement("article");
    let newH = document.createElement("h3");
    let newP = document.createElement("p");
    document.getElementById("items").appendChild(newbloc);
    //items.appendChild(newbloc);
    newbloc.setAttribute("id","bloc" + i);
    document.getElementById("bloc" + i).appendChild(newArt);
    //let art = document.getElementsByTagName('article');
    //let arti = art[i];
    newArt.appendChild(newH)
    newArt.appendChild(newP);
}}







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