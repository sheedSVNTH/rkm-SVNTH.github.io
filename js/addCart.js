
//MAIN JS FILE CONTAINING CODE BLOCKS FOR:
//SECTION 1 - ADD ITEM TO CART
//SECTION 2 - DISPLAY CART ON CART PAGE
//SECTION 3 - SORT THROUGH PRODUCT IMGS ON PRODUCT PAGE

//SECTION START- ADD ITEM TO CART 
//FUTURE GOAL:Try to optimize this code with the item-object input and Item function constructor. 

//When page loads, this block of code checks to see if there are items in the cart array. If not, it sets cartArr to 0.
if (sessionStorage.length == 0) {
	console.log("Cart and sessionStorage is empty");
	var cart = [];
} else {
	console.log("cart has items");
	var cartItem = loadCart();
	var cart = cartItem;
	console.log(cart);
}

//On click of "Add to Cart" btn, gets information for product selected and then saves cart
document.querySelector('#addCart').addEventListener('click', function(){

	var productID = document.getElementById("productId").value;
	var productPrice = document.getElementById("cartPrice").getAttribute("value");
	var productSize = document.getElementById("productSize").value;
	var e = document.getElementById("productQty");
	var productQty = e.options[e.selectedIndex].value;

	//Data taken in during click of "Add to Cart" Button
	
	var item = {
    'product_id': productID,
	'product_price': productPrice, 
	'product_size': productSize,
    'quantity': productQty
  	};
	
var Item = function(productID, size, quantity, price) {
	this.productID = productID
	this.size = size
	this.quantity = parseInt(quantity)
	this.price = price
};

	//Function checks for existing product-Size and adds to cart if new or updates qty if existing - both call saveCart fcnt
	function addItemToCart(productID, size, quantity, price) {
		for (var i in cart) {
			if (cart[i].size === size && cart[i].productID === productID) {
				cart[i].quantity += parseInt(quantity);
				saveCart();
				return;
			}
		}
		var item = new Item(productID, size, quantity, price);
		cart.push(item);
		saveCart();
	}	

addItemToCart(item.product_id, item.product_size, item.quantity, item.product_price);
	console.log(cart);
});

//On call, saves to session storage 
function saveCart() {
	sessionStorage.setItem("cartSS", JSON.stringify(cart));
}

//On call, loads from session storage 
function loadCart() {
	var newCart = JSON.parse(sessionStorage.getItem("cartSS"));
	return newCart;
}
//SECTION END - ADD ITEM TO CART 


//SECTION START- PRODUCT PAGE MINI-GALLERY 
function photoChange(photoID) {
	this.photoID = photoID
	console.log(photoID);
	document.querySelector('.img-main').innerHTML = `<img id = "img" src="img/${photoID}.jpg" alt="product">`;

}
//SECTION END - PRODUCT PAGE MINI-GALLERY 
