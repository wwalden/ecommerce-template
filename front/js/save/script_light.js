
window.onload = function displayProducts() {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
      for (i=1;i<=Object.keys(value).length;i++) {
      let newbloc = document.createElement("a");
      let newArt = document.createElement("article");
      document.getElementById("items").appendChild(newbloc);
      newbloc.setAttribute("id","bloc" + i);
      document.getElementById("bloc" + i).appendChild(newArt);
      }
  })
  .then(function(value) {
    for (i=1;i<=8;i++) {
    let source = `<img src:http://localhost:3000/images/kanap0${i}.jpeg>`
    document
        .querySelector("#bloc" + i +" article")
        .innerHTML = source + "<h3>" + value[(i-1)].name + "</h3><p>" + value[(i-1)].description +"</p>"
    }
  })
  .catch(function(err) {
      alert("error")
  });
}
