
//Pulls product name by looking up against productID
var productNameObj = {
	'product01': "Performance T-shirt: Cool Blue",
		'product02': "Performance T-shirt: White/Red",
		'product03': "Performance T-shirt: Black/Charcoal",
		'product04': "Sports Tanktop: Untamed Black",
		'product05': "Sports Tanktop: Red/Black",
		'product06': "Sports Tanktop: Black/Red"
};

	// Upon loading page from CART page - Display cart in the ORDER SUMMARY COLUMN.
displayCart();

function displayCart() {
	var cartItem = JSON.parse(sessionStorage.getItem("cartSS"));
	console.log(cartItem);
	var cart = cartItem;
	
	var productLine = document.getElementById('order-container');
	var taxes=0, subTotal = 0, orderTotal = 0;
	
	for (var j in cart) {
			var productName = productNameObj[cart[j].productID];
			var lineTotal = parseInt(cart[j].quantity) * (cart[j].price);

			productLine.insertAdjacentHTML('afterend', `<div class="product-line"><img id = "cart-img" src="img/${cart[j].productID}.jpg" alt="cart"><div id = "cart-product"><p id = "product-name">${productName}</p><p id = "product-size">Size: ${cart[j].size}</p></div><p id = "product-price">(${cart[j].quantity}) x $${cart[j].price} = $${lineTotal.toFixed(2)}</p></div></div>`);
		}
	
	subTotal = calcSubTotal();
	displayPrices(subTotal);
}

function calcSubTotal(){
	var cartItem = JSON.parse(sessionStorage.getItem("cartSS"));
	var cart = cartItem;
	var subTotal = 0;
	for (var j in cart) {
			var lineTotal = parseInt(cart[j].quantity) * (cart[j].price);
			subTotal+= lineTotal;
		}
	return subTotal;
}

function displayPrices(subTotal, shipPrice) {
	var orderTotal = 0;
	var taxes = subTotal * .07;
	
	if (shipPrice === undefined) {
		console.log("no shipping has been selected");
		orderTotal = subTotal + taxes;	
	} else {
		orderTotal = subTotal + shipPrice + taxes;
	}
	//Display subtotal, taxes, and Order Total in DOM
	document.getElementById('subtotal').textContent = "Subtotal: $" + subTotal.toFixed(2);
	document.getElementById('taxes').textContent = "Taxes: $" + taxes.toFixed(2);
	document.getElementById('orderTotal').textContent = "Order Total: $" + orderTotal.toFixed(2);
}

//ONCLICK FUNCTION: collects shipping information
document.querySelector('#shipMethod').addEventListener('click', function(){
	
	//COLLECT DATA FROM INPUT FIELDS
		//Your Information Section
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
		//Shipping Address Section
	var shipAdd1 = document.getElementById("Address1").value;
	var shipAdd2 = document.getElementById("Address2").value;
	var shipCity = document.getElementById("city").value;
	var shipState = document.getElementById("state").value;
	var shipZip = document.getElementById("zip").value;
	var shipCountry = document.getElementById("country").value;
	

	//If all input requirements are met, change display to show input data and unlock the next section. 
	
	if ((requiredField(firstName, lastName, email, shipAdd1, shipCity, shipState, shipZip, shipCountry) == true) &&(letterCheck(firstName, lastName, shipCity, shipState) == true) && (emailCheck(email) == true)) {
		
		unlockSection();
		
		var shipInfoComplete = document.getElementById('shipping-info-complete');
		
		//Check to see if ID shipEdit exists before adding to DOM
		if (document.getElementById('shipEdit') == null) {
			
			shipInfoComplete.insertAdjacentHTML('afterend', `<div id ="shipEdit"><button id ="editShipInfo">Edit</button> <h5>${firstName} ${lastName}</h5><h5>${email}</h5><h5>${shipAdd1}</h5><h5>${shipAdd2}</h5><h5>${shipCity}, ${shipState} ${shipZip}</h5><h5>${shipCountry}</h5></div>`);
		}

		var shipHide = document.getElementById('shipping-info');
		var personalInfo = document.getElementById('personal-info');
		shipInfoComplete.style.display = "block";
		shipHide.style.display = "none";
		personalInfo.style.display = "none";
		
		//ONCLICK FUNCTION to edit shipping info input
		document.querySelector('#editShipInfo').addEventListener('click', function(){
			shipInfoComplete.style.display = "none";
			document.getElementById('shipOption').style.display = "none";
			document.getElementById('shipEdit').remove();
			shipHide.style.display = "block";
			personalInfo.style.display = "block";
			
		});
		
	} else {
		console.log("Something is not working at the SHIPPING INFO SECTION.");
	}
	
});

//COMPLETE
//ONCLICK FUNCTION: collects shipping method selection
document.querySelector('#payment-btn').addEventListener('click', shipSelection);

function shipSelection() {
	var shipSelection = document.getElementById("shipMethodSelect").value;
	
	var shippingData = {
		'0' : [0, "N/A"],
		'1' : [4, "First Class (2-3 Day Shipping)"],
		'2' : [10, "Over-night (1 Day Shipping)"]
	};

	if (shipSelection == 0) {
		alert("Please select a shipping method to continue.");
		
	} else { 
		var shippingPrice = shippingData[shipSelection][0];
		
		//UNLOCK PAYMENT SECTION
		unlockSection();
		//After shipping method selection is made
		//Update Ordertotal & display in DOM
			subTotal = calcSubTotal();
		console.log("shipMethFCN" + subTotal);
		displayPrices(subTotal, shippingPrice);
		document.getElementById('shippingCost').textContent = "Shipping: $" + shippingPrice.toFixed(2);

		var shipMethodComplete = document.getElementById('shipMethodComplete');
		var shipOptionHide = document.getElementById('shipOption');
		
		shipMethodComplete.style.display = "block";
		
		//Check to see if ID shipSelect exists before adding to DOM
		if (document.getElementById('shipSelection') == null) {
			shipMethodComplete.insertAdjacentHTML('beforeend', `<h5 id = "shipSelection">${shippingData[shipSelection][1]}</h5>`);
			shipOptionHide.style.display = "none";
			}
		document.querySelector('#changeShipMethod').addEventListener('click', function(){
			
			document.getElementById('shipSelection').remove();
			shipMethodComplete.style.display = "none";
			shipOptionHide.style.display = "block";
		});
		
	}
	return shippingPrice;
}

//ONCLICK FUNCTION: collects CC information, parses data and stores
document.querySelector('#validateCC').addEventListener('click', function(){
	//Get card information onclick of VALIDATE btn
	var cardType = document.getElementById("cardType").value;
	var cardNum = document.getElementById("cardNum").value;
	var cardEXP = document.getElementById("cardEXP").value;
	var cardCVV = document.getElementById("cardCVV").value;

	//Check #1 - See if all information is completed
	//Check #2 - Parse EXP Date (Not expired, correct format)
	//Check #3 - Parse CC Number by Type
	//Check #4 - Parse CVV (Correct format)
	
	requiredField(cardNum, cardEXP, cardCVV);
	//When all conditions are met, reveal the Billing Address Section
	
	if ((checkEXPDate(cardEXP) == true) && (cardNumberCheck(cardNum, cardType) == true) &&(parseCVV(cardCVV) == true)) {
		
		console.log("ALL CREDIT CARD INFO IS GOOD.") 

		var cardRx = {
		'1': "AMERICAN EXPRESS",
		'2': "DISCOVER", 
		'3': "MASTERCARD",
		'4': "VISA"};
		
		//Send input CC info to DOM display
		var cardInfoComplete = document.getElementById('card-info-complete');
		var cardHide = document.getElementById('card-info');
		
		cardInfoComplete.style.display = "block";
		cardInfoComplete.insertAdjacentHTML('afterend', `<div id ="editCard"><button id ="editCardInfo">Edit</button><h5>${cardRx[cardType]} ending in ${cardNum.slice(-4)}.</h5><h5>Exp. ${cardEXP.slice(0,2)}/${cardEXP.slice(-2)}</h5></div>`);
		cardHide.style.display = "none";
		
		//ONCLICK FUNCTION CALL to edit card info
		document.querySelector('#editCardInfo').addEventListener('click', function(){
						cardInfoComplete.style.display = "none";
						document.getElementById('editCard').remove();
						cardHide.style.display = "block";
			
		});
		
		//Expand billing addressinput section
		var billSection = document.getElementById('billAddWrap');
		billSection.style.display = "block";
	}

});


document.querySelector('#billing-check').addEventListener('click', function(){
	
	var checkStatus = document.getElementById('billing-check').checked;
	var billSection = document.getElementById('billingSection');
	var content = billSection.firstElementChild;
	var billInfoComplete = document.getElementById('billing-info-complete');
	
	if (checkStatus == true) {
		var hideReview = document.getElementById('review-end').nextElementSibling.style.display = "none";
		content.style.display = "none";

		var firstName = document.getElementById("firstName").value;
		var lastName = document.getElementById("lastName").value;
		var email = document.getElementById("email").value;
		//Shipping Address Section
		var shipAdd1 = document.getElementById("Address1").value;
		var shipAdd2 = document.getElementById("Address2").value;
		var shipCity = document.getElementById("city").value;
		var shipState = document.getElementById("state").value;
		var shipZip = document.getElementById("zip").value;
		var shipCountry = document.getElementById("country").value;
		
		billInfoComplete.style.display = "block";
		if (document.getElementById('billEdit') == null) {
			billInfoComplete.insertAdjacentHTML('afterend', `<div id ="billEdit"><button id ="editBillInfo">Edit</button> <h5>${firstName} ${lastName}</h5><h5>${email}</h5><h5>${shipAdd1}</h5><h5>${shipAdd2}</h5><h5>${shipCity}, ${shipState} ${shipZip}</h5><h5>${shipCountry}</h5></div>`);
		}
		
		//Set billing address info equal to shipping info
	} else {
		content.style.display = "block";
		document.getElementById('billEdit').remove();
		billInfoComplete.style.display = "none";
		
		var hideReview = document.getElementById('review-end').nextElementSibling.style.display = "none";
	}
});


document.querySelector('#review-end').addEventListener('click', function(){
		
	var checkStatus = document.getElementById('billing-check').checked;
	var billSection = document.getElementById('billingSection');
	var content = billSection.firstElementChild;
	var billInfoComplete = document.getElementById('billing-info-complete');
	
	if (checkStatus == true) {
		//Show SUBMIT ORDER BUTTON
		console.log("CHECKED OPTION 1 order comlete");
		unlockSection();
		
	} else {
			//Billing Address Collection
		billInfoComplete.style.display = "none";
		var firstName = document.getElementById("firstName").value;
		var lastName = document.getElementById("lastName").value;
		var email = document.getElementById("email").value;
		var billAdd1 = document.getElementById("billAddress1").value;
		var billAdd2 = document.getElementById("billAddress2").value;
		var billCity = document.getElementById("billCity").value;
		var billState = document.getElementById("billState").value;
		var billZip = document.getElementById("billZip").value;
		var billCountry = document.getElementById("billCountry").value;
	
			//CHECK - Confirm Required Fields are Complete and Confirm all letters
		if (requiredField(billAdd1, billCity, billState, billZip, billCountry) == true && (letterCheckBilling(billCity, billState) == true)) {
			
			content.style.display = "none";
			billInfoComplete.style.display = "block";
			
			//Check to see if ID billEdit exists before adding to DOM
		if (document.getElementById('billEdit') == null) {
			
			billInfoComplete.insertAdjacentHTML('afterend', `<div id ="billEdit"><button id ="editBillInfo">Edit</button> <h5>${firstName} ${lastName}</h5><h5>${email}</h5><h5>${billAdd1}</h5><h5>${billAdd2}</h5><h5>${billCity}, ${billState} ${billZip}</h5><h5>${billCountry}</h5></div>`);
		}
			//Show SUBMIT ORDER BUTTON
			unlockSection();
		}
	}
	document.querySelector('#editBillInfo').addEventListener('click', function(){
		//Hides the Review Order Section if Edit BTN is clicked
		var hideReview = document.getElementById('review-end').nextElementSibling.style.display = "none";
		
		var checkStatus = document.getElementById('billing-check').checked;
		var billInfoComplete = document.getElementById('billing-info-complete');
		var billSection = document.getElementById('billingSection');
		var content = billSection.firstElementChild;
		
		//Removes added innerAdjacentHTML so it is not duplicated
		document.getElementById('billEdit').remove();
		
		if(checkStatus == true) {
			billInfoComplete.style.display = "none";
		} else {
			billInfoComplete.style.display = "none";
			content.style.display = "block";
		}
	});
});

//Onclick function to prompt personalized alert message of Order Complete
document.querySelector('#submitOrder').addEventListener('click', orderConfirmation);

//Onclick funciton to exit the order confirmation alert and redirect to home page
document.querySelector('#okClick').addEventListener('click', exitBtn);

function orderConfirmation() {
		var winW = window.innerWidth;
		var winH = window.innerHeight
		var dialogOverlay = document.getElementById('dialogOverlay');
		var dialogBox = document.getElementById('dialogBox');
		var firstName = document.getElementById("firstName").value;
		var nameParent = document.getElementById('underline');
	
		nameParent.insertAdjacentHTML('afterend', `<p>${firstName}, thank-you for your order!</p><br>`);
		dialogOverlay.style.display = "flex";
		dialogOverlay.style.height = winH + "px";
		dialogBox.style.left = (winW/2) - (550 * .5) + "px";
		dialogBox.style.top = "200px";
		dialogBox.style.display = "block";
}

function exitBtn() {
		dialogOverlay.style.display = "none";
		dialogBox.style.display = "none";
	//Clear the session Storate aka Clear the cart
	sessionStorage.clear();
	window.location = "index.html";
	
}

	//Function definition to check if REQUIRED FIELDS have been completed. 
function requiredField(firstName, lastName, email, address1, city, state, zip, country) {
	var falseCount = 0;
	var requiredFieldStatus = false;
	for (var i=0; i < arguments.length; i++) {
		if(arguments[i].length == 0) {
			falseCount++;
      	}
	}
	if (falseCount == 0) {
		requiredFieldStatus = true; 
	} else {
		alert("One or more required input fields is missing.  Please complete all required fields denoted by *.");
	}
	return requiredFieldStatus;
}

	//Function definition to check if First, Last Name, City, and State input is a string with all letters
function letterCheck(firstName, lastName, city, state) {
	var letters = /^[A-Za-z]+$/;
	var letterStatus = false;
	
	if ((firstName.match(letters)) && (lastName.match(letters)) && (city.match(letters)) && (state.match(letters))){
		console.log("we are good for next step");
		letterStatus = true; 
		
	} else if (firstName.match(letters) == null){
		alert("Please re-enter First Name. Be sure there are no numbers or special characters.");
		
	} else if (lastName.match(letters) == null){
		alert("Please re-enter Last Name. Be sure there are no numbers or special characters.");
		
	} else if (city.match(letters) == null){
		alert("City entry not valid. Be sure there are no numbers or special characters.");
	}else {
		alert("State entry not valid. Be sure there are no numbers or special characters.");
	}
	return letterStatus; 
}

	//Function definition to check if First, Last Name, City, and State input is a string with all letters
function letterCheckBilling(city, state) {
	var letters = /^[A-Za-z]+$/;
	var letterStatus = false;
	
	if ((city.match(letters)) && (state.match(letters))){
		console.log("we are good for next step");
		letterStatus = true; 
		
	} else if (city.match(letters) == null){
		alert("City entry not valid. Be sure there are no numbers or special characters.");
	}else {
		alert("State entry not valid. Be sure there are no numbers or special characters.");
	}
	return letterStatus; 
}

	//Function to review and validate email entry
function emailCheck(email){
	var emailCheckStatus = false;
	var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(email.match(emailFormat)) {
		emailCheckStatus = true;
	} else {
		alert("You have entered an invalid email address!");
	}
	return emailCheckStatus;
}

	//Used for SHIPPING, BILLING, and PAYMENT sections
function requiredField() {
	var falseCount = 0;
	var requiredFieldStatus = false;
	for (var i=0; i < arguments.length; i++) {
		if(arguments[i].length == 0) {
			falseCount++;
      	}
	}
	if (falseCount == 0) {
		requiredFieldStatus = true; 
	} else {
		alert("One or more required input fields is missing.  Please complete all required fields denoted by *.");
	}
	return requiredFieldStatus;
}

	//Used for PAYMENT SECTION
	//Checks to confirm entry is all digits
function digitCheck(input) {
	var digits = /^[0-9]+$/;
	var digitStatus = false;
	
	if (input.match(digits)){
		digitStatus = true; 
	}
	return digitStatus; 
}

function parseCVV(cardCVV) {
	var status = false;
	if ((digitCheck(cardCVV)) == true && (cardCVV.length == "3" || cardCVV.length == "4")) {
		status = true; 
	} else {
		alert("CVV Code entry not valid. Confirm format contains (3 or 4) digits as shown by your credit card.");
		status = false; 
	}
	return status;
}

	//Used for PAYMENT section
	//Check to see if credit card is valid number
function cardNumberCheck(cardNumber, cardType) {
	var cardNumStatus = false;
	var cardRx = {
		'1': ["AMERICAN EXPRESS", /^(?:3[47][0-9]{13})$/],
		'2': ["DISCOVER", /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/], 
		'3': ["MASTERCARD", /^(?:5[1-5][0-9]{14})$/],
		'4': ["VISA", /^(?:4[0-9]{12}(?:[0-9]{3})?)$/]
		};
	
	if (cardType == 0) {
		alert("Please select card type to continue.");
	} else {
		if (cardNumber.match(cardRx[cardType][1])) {
			console.log("Ccard checks out. good to go");
			cardNumStatus = true; 
		} else {
			alert("Not a valid " + cardRx[cardType][0] + " credit card number. Please review and re-enter.");
		}
	}
	return cardNumStatus;
}
	//Used for PAYMENT section
	//Check if card expiration date to confirm valid card
function checkEXPDate (cardEXP) {
	
	var cardEXPDate = false;
	var cardMonth = cardEXP.slice(0,2);
	var cardYear = 20 + cardEXP.slice(2,);
	var dt = new Date();
	var curMonth = dt.getMonth() + 1 ;
	var curYear = dt.getFullYear();
	
	if ((digitCheck(cardEXP)) == false || (cardEXP.length != "4")) {
		alert("EXP. date entry not valid. Confirm format contains (4) digits.");
	} else {
		console.log("CCEXP format is correct");
		if ((cardYear < curYear) || ((cardYear == curYear) &&(cardMonth <= curMonth))) {
			alert("Card is expired. Please enter another payment method.")
		} else {
		cardEXPDate = true;
		}
	}
	return cardEXPDate;
}

	//Function Definition to unlock collapsible section after previous section is validated

function unlockSection () {
	var coll = document.getElementsByClassName("collapsible");
	var i;
	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			this.classList.toggle("active");
        	var content = this.nextElementSibling;
			if (content.style.display === "block") {
            	content.style.display = "none";
        	} else {
            	content.style.display = "block";
        	}
    	});
	}
}
