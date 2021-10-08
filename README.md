# Kanap #

This is the front end and back end server for Project 5 of the Web Developer path.

### Back end Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Back end Installation ###

Clone this repo. From the "back" folder of the project, run `npm install`. You 
can then run the server with `node server`. 
The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.



acceuil
> GET /api tous les produits (fetch(http://....api/))
> fetch est asynchrone! utiliser des callbacks
(Une fonction qui n'est appele que quand le data est pret, dans le deuxieme then( (data) => mafonction(data) ) )
> for (chaque canap)
> afficher vignette (nom, prix, photo)
> hyperliens ( produit.html?id=3 ) <- parametre URL
> ressembler au P2 (automatique)

cliquer sur un canape, produit.html?id=3
> Retrieve ID from URL (window. )
> GET /api/3 seulement le canape clic
> afficher details, encore plus (nom, prix, desc, photo, customize), populer automatiquement avec l'API
> bouton ajouter au panier onClick function
> ecrire dans le localStorage
/!\ Stock que des datatype primaire (int, string, float,  bool)
Pour stocker un json, utiliser stringify
Pour le recuperer, JSON.parse

page panier
> retrieve localStorage
> parse, afficher dynamiquement (for js)
> js faire le total
> Champs pour le compte client (nom, adresse, tel,...)
> bouton passer la commande
> Recuperer les champs ( ById.value )
> POST /api envoyer aussi le json/ce qui a ete commande + client

page confirmation
> POST renvoie une valeur, un order id
> tu l'affiches