
window.addEventListener("load", function structure() {
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
}, false);


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
    document
        .querySelector("#bloc" + i +" article")
        .innerHTML = "<img src=" + source + "><h3>" + value[(i-1)].name + "</h3><p>" + value[(i-1)].description +"</p>"
    }
  })
  .catch(function(err) {
  });
}, false);
