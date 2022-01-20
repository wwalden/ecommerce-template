
 //***********************************************************************//
                     // DATA MANIPULATION KIT //
 //***********************************************************************//

 /*
 // JSON
 let myData = localStorage.getItem("carty");
 let myJson = JSON.parse(myData);
 let count = Object.keys(myJson).length;
 let myId = Object.keys(myJson)[2];
 alert (myId);
 */

 /*
 // LOCAL STORAGE
 localStorage.clear();
 alert(localStorage.length);
 let myData = localStorage.getItem("carty");
 alert(myData);
 */

 /*
 // TO GET A SPECIFIC KEY
 // FORMAT : {"107fb5b75607497b96722bda5b504926":{"Blue":1,"White":2}}
 let myData = localStorage.getItem("carty");
 let myJson = JSON.parse(myData);
 let count = Object.keys(myJson).length; // DONNE LE NOMBRE D'ID DANS LE JSON
 let myId = Object.keys(myJson);  // DONNE L'ID SEULEMENT S'IL N'Y EN A QU'UNE
 let myId = Object.keys(myJson)[0]; // DONNE LA PREMIERE ID STOCKÉE
 let myQtyByColor = myJson[myId]["Red"];  // DONNE LA QUANTITÉ DE RED

  Object.keys(Object.values(myJson)[0])[0]; // POUR ALLER PLUS LOIN DANS LE JSON
 */

 //***********************************************************************// 
