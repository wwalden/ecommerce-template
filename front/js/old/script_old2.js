
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
  .then(function() {
      let myVar = parseInt(localStorage.getItem("num"), 10);
      for (i=1;i<=myVar;i++) {
      let newbloc = document.createElement("a");
      let newArt = document.createElement("article");
      document.getElementById("items").appendChild(newbloc);
      newbloc.setAttribute("id","bloc" + i);
      document.getElementById("bloc" + i).appendChild(newArt);
      }
  })
  .catch(function(err) {
      alert("error")
  });
}


function displayProducts() {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    for (i=1;i<=8;i++) {
    let source = `<img src:http://localhost:3000/images/kanap0${i}.jpeg>`
    //<img src:http:="" localhost:3000="" images="" kanap01.jpeg="">
    document
        .querySelector("#bloc" + i +" article")
//          .innerText = JSON.stringify(value);
        .innerHTML = source + "<h3>" + value[(i-1)].name + "</h3><p>" + value[(i-1)].description +"</p>"
       // .querySelector("#bloc1 article p")
       // .innerText = value[0].description
    }
  })
  .catch(function(err) {
    // Une erreur est survenue
  });
}


  
document
.getElementById("testpourAPI")
.addEventListener("click", displayProducts);