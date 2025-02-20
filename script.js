let cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartContainerButtons = document.querySelector(".cart-buttons");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartContainer = document.getElementById("cart");
const callTakeaway = document.getElementById("callTakeawayOrder");
const orderBtn = document.getElementById("order-btn");
const orderBtnDelivery = document.getElementById("order-btn-delivery");
const closeCartBtn = document.getElementById("close-cart");
const clearCartBtn = document.getElementById("clear-cart");
const takeawayalert = document.getElementById("Takeaway");
const closeTakeaway = document.querySelector(".closeTakeaway");


// Open cart
cartBtn.addEventListener("click", function () {
    cartContainer.classList.add("active");
    cartContainerButtons.classList.add("active");
    displayCartItems();
});

// Close cart
closeCartBtn.addEventListener("click", function () {
    cartContainer.classList.remove("active");
    cartContainerButtons.classList.remove("active");
});

// Handle adding items
document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", function (event) {
        const target = event.target;

        // Handle "Add to Order" button
        if (target.classList.contains("add-to-order")) {
            const name = item.getAttribute("data-name");
            const price = parseFloat(item.getAttribute("data-price"));

            // Show the quantity controls and hide the "Add to Order" button
            const quantityDiv = item.querySelector(".quantity");
            quantityDiv.classList.remove("hidden");
            target.classList.add("hidden");

            // Update the cart
            let cartItem = cart.find(cartItem => cartItem.name === name);
            if (!cartItem) {
                cart.push({ name, price, quantity: 1 });
            } else {
                cartItem.quantity++;
            }

            // Update the cart count and display items
            updateCartCount();
            displayCartItems();
        }

        // Handle "+" button
        if (target.classList.contains("plus")) {
            const name = item.getAttribute("data-name");
            let cartItem = cart.find(cartItem => cartItem.name === name);
            if (cartItem) {
                cartItem.quantity++;
                item.querySelector(".qty").textContent = cartItem.quantity;
            }
            updateCartCount();
            displayCartItems();
        }

        // Handle "-" button
        if (target.classList.contains("minus")) {
            const name = item.getAttribute("data-name");
            let cartItem = cart.find(cartItem => cartItem.name === name);
            if (cartItem) {
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                    item.querySelector(".qty").textContent = cartItem.quantity;
                } else {
                    cart = cart.filter(cartItem => cartItem.name !== name);
                    item.querySelector(".quantity").classList.add("hidden");
                    item.querySelector(".add-to-order").classList.remove("hidden");
                }
            }
            updateCartCount();
            displayCartItems();
        }
    });
});

// Handle + and - buttons
document.querySelectorAll(".plus").forEach(button => {
    button.addEventListener("click", function () {
        let item = this.parentElement.parentElement;
        let name = item.getAttribute("data-name");
        let cartItem = cart.find(cartItem => cartItem.name === name);

        if (cartItem) {
            cartItem.quantity++;
            item.querySelector(".qty").textContent = cartItem.quantity;
        }
        updateCartCount();
        displayCartItems();
    });
});

document.querySelectorAll(".minus").forEach(button => {
    button.addEventListener("click", function () {
        let item = this.parentElement.parentElement;
        let name = item.getAttribute("data-name");
        let cartItem = cart.find(cartItem => cartItem.name === name);
        if (cartItem) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                item.querySelector(".qty").textContent = cartItem.quantity;
            } else {
                cart = cart.filter(cartItem => cartItem.name !== name);
                item.querySelector(".quantity").classList.add("hidden");
                item.querySelector(".add-to-order").classList.remove("hidden");
            }
        }
        updateCartCount();
        displayCartItems();
    });
});

// Update cart count
function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    if(totalItems == 0){
        cartCount.style.fontWeight = "bold";
        cartCount.style.position = "absolute";
        cartCount.style.top = "10px";
        cartCount.style.right = "15px";
        cartCount.style.fontSize = "12px";
        cartCount.style.height = "20px";
        cartCount.style.width = "20px";
        cartCount.style.display = "flex";
        cartCount.style.justifyContent = "center";
        cartCount.style.alignItems = "center";
        cartCount.style.color = "white";
        cartCount.style.backgroundColor = "transparent";
    } else {
        cartCount.style.fontWeight = "bold";
        cartCount.style.position = "absolute";
        cartCount.style.top = "10px";
        cartCount.style.right = "15px";
        cartCount.style.fontSize = "12px";
        cartCount.style.backgroundColor = "red";
        cartCount.style.borderRadius = "50%";
        cartCount.style.height = "20px";
        cartCount.style.width = "20px";
        cartCount.style.display = "flex";
        cartCount.style.justifyContent = "center";
        cartCount.style.alignItems = "center";
        cartCount.style.color = "white";
    }
}


// Display cart items with total price
function displayCartItems() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    const totalElement = document.querySelector(".cart-buttons .total");
    if (cart.length > 0) {
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
    } else {
        totalElement.textContent = `Total: $0.00`;
    }
}

// Clear cart
clearCartBtn.addEventListener("click", function () {
    cart = [];
    updateCartCount();
    displayCartItems();
    document.querySelectorAll(".quantity").forEach(q => q.classList.add("hidden"));
    document.querySelectorAll(".add-to-order").forEach(btn => btn.classList.remove("hidden"));
});

// Generate a random order ID
function generateOrderID() {
    return Math.floor(Math.random() * 1000000);
}

// Send order to WhatsApp
callTakeaway.addEventListener("click", ()=> {
    takeawayalert.classList.add("active");
});

closeTakeaway.addEventListener("click", () =>{
    takeawayalert.classList.remove("active");
});

document.getElementById("order-btn").addEventListener("click", function () {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    const selectedBranch = document.getElementById("selectBranch").value;
    const phoneNumberInput = document.querySelector("#Takeaway input[type='number']");
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber || phoneNumber.length < 7) {
        alert("Please enter a valid phone number.");
        return;
    }
    let orderID = generateOrderID();
    let orderType = "Takeaway";

    let message = `*Hi Tony's Food*\n`;
    message += `New Food Order\n`;
    message += `Order ID: *#${orderID}*\n`;
    message += `Branch: *${selectedBranch}*\n\n`;
    message += `Order Details:\n`;
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
    });

    message += `\nTotal: *$${total.toFixed(2)}*\n`;
    message += `Phone: ${phoneNumber}\n`;
    message += `Order Type: *${orderType}*\n\n`;
    message += `Thank you Tony's!`;

    let whatsappURL = `https://wa.me/+96171096971?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
});

orderBtnDelivery.addEventListener( "click", ()=>{
    alert("Delivery service is not available yet.");
})
