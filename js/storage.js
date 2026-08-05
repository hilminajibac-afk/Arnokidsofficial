function getCart(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(data){
    localStorage.setItem("cart", JSON.stringify(data));
}