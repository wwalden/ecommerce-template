let currentPage = window.location.href;
let pageUrl = new URL(currentPage); 
let orderNum = pageUrl.searchParams.get("order");
console.log(orderNum);
document
  .getElementById("orderId")
  .innerHTML = orderNum;
  