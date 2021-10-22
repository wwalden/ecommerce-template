
window.addEventListener("load", function structure() {
  fetch("http://localhost:3000/api/products")

// Requesting API
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

// Knowing the number of items to display and creating the HTML structure
  .then(function(value) {
    localStorage.setItem("num", JSON.stringify(Object.keys(value).length))
  })
  .then(function() {
      let myVar = parseInt(localStorage.getItem("num"), 10);
      for (i=1;i<=myVar;i++) {
      let newbloc = document.createElement("a");
      let newArt = document.createElement("article");
      document.getElementById("items").appendChild(newbloc);
      newbloc.setAttribute("id","bloc" + i);
      newbloc.setAttribute("class","bloc");
      document.getElementById("bloc" + i).appendChild(newArt);
      }
  })
  .catch(function(err) {
      alert("error")
  });
}, false);


// Inserting NAME, DESCRIPTION, IMAGE (...) for each element
window.addEventListener("load", function displayProducts() {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    for (i=1;i<=8;i++) {
    let source = JSON.stringify(value[i-1].imageUrl)
    let alt = JSON.stringify(value[i-1].altTxt)
    document
        .querySelector("#bloc" + i +" article")
        .innerHTML = "<img src=" + source + " alt=" + alt + "><h3 class=\"productName\">" + value[(i-1)].name + "</h3><p class=\"productDescription\">" + value[(i-1)].description +"</p>"
    }
  })
  .catch(function(err) {
    alert("error")
  });
}, false);


let url= "./product.html"

document
  .getElementsByClassName("bloc")
  .addEventListener("click", function productPage(url) {
    window.open(url, '_blank').focus;

})