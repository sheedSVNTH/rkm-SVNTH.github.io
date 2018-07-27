//Pulls product name by looking up against productID

var productNameObj = {
	'product01': "Performance T-shirt: Cool Blue",
		'product02': "Performance T-shirt: White/Red",
		'product03': "Performance T-shirt: Black/Charcoal",
		'product04': "Sports Tanktop: Untamed Black",
		'product05': "Sports Tanktop: Red/Black",
		'product06': "Sports Tanktop: Black/Red"
};

displayCart();

function displayCart() {
	var cartItem = JSON.parse(sessionStorage.getItem("cartSS"));
	console.log(cartItem);
	var cartEmpty = 0;
	
	if (cartItem == null) {
		var cart = [];
		cartEmpty == true;
	} else {
		var cart = cartItem;
		cartEmpty = false;
	}
		if (cart.length == 0) {
			var emptyCartMessage = document.getElementById('product-container');
			emptyCartMessage.insertAdjacentHTML('afterend', '<div id ="emptyCart">Your Cart is Empty</div>');
			document.getElementById('subtotal').style.display = "none";
		} else {
			var productLine = document.getElementById('product-container');
			var subTotal = 0;
			for (var j in cart) {
				var productName = productNameObj[cart[j].productID];
				var lineTotal = parseInt(cart[j].quantity) * (cart[j].price);

				subTotal+= lineTotal;

				productLine.insertAdjacentHTML('afterend', `<div class="product-line"><img id = "cart-img" src="img/${cart[j].productID}.jpg" alt="cart"><div id = "cart-product"><h3 id = "product-name">${productName}</h3><p id = "product-size">Size: ${cart[j].size}</p></div><div id = "cart-price"><h3 id = "heading-price">Item Price</h3><p id = "product-price">(${cart[j].quantity}) x $${cart[j].price} = $${lineTotal.toFixed(2)}</p></div><div class = "remove-btn" value = "${j}"><button onclick="removeItem(this.parentElement)">Remove Item</button></div></div>`);
			}
			
			document.getElementById('subtotal').textContent = "Subtotal: $" + subTotal.toFixed(2);
			//Onclick function that allows Checkout page to be visible if items are in cart. 
			document.querySelector('#btn-checkout').addEventListener('click', function(){
				if (cartEmpty == false) {
					window.location = "checkout.html";
				}
			});
			
		}
}

function removeItem (removeBtn){
	var cart = JSON.parse(sessionStorage.getItem("cartSS"));
	var btnIndex = removeBtn.getAttribute('value');
	//console.log("btn indext: " + btnIndex);
	cart.splice(btnIndex, 1);
	//console.log(cart);
	sessionStorage.clear();
	sessionStorage.setItem("cartSS", JSON.stringify(cart));
	location.reload();
}


