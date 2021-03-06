// Inserer NOM, DESCRIPTION, IMAGE (...) pour chaque élément

// Requêter l'API et s'assurer du retour des données
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
  // Déterminer le nombre de produits à afficher, et créer une boucle pour appliquer à chacun...
    for (i=0; i<value.length;i++) {
  
      // ...Créer la structure HTML
      // Déclarer les variables
      let newbloc = document.createElement("a");

      // Insérer les attributs des éléments créés
      newbloc.setAttribute("id",`bloc${i}`);
      newbloc.setAttribute("class","bloc");
      newbloc.setAttribute("href",`./product.html?id=${value[i]._id}`);
      document.getElementById("items").appendChild(newbloc);
      let newArt = document.createElement("article");
      document.getElementById(`bloc${i}`).appendChild(newArt);
      newArt.innerHTML =`<img src=${value[i].imageUrl} alt="${value[i].altTxt}"><h3 class="productName">${value[i].name}</h3>
      <p class="productDescription">${value[i].description}</p>`;
    }
  })

