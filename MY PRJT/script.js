
function filterProducts(category) {
    const products = document.querySelectorAll(".product");

    products.forEach(function(product) {
        if (
            category === "all" ||
            product.dataset.category === category
        ) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

function addToCart(name, price) {
    let cart = JSON.parse(
        localStorage.getItem("amosCart") || "[]"
    );

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("amosCart", JSON.stringify(cart));

    alert(name + " added to your cart!");
}

const DELIVERY_FEE = 200;

function formatPrice(amount) {
    return "KSh " + amount.toLocaleString("en-KE");
}

function displayCart() {
    const cartContainer = document.getElementById("cart-items");

    // Do nothing when we are not on cart.html
    if (!cartContainer) return;

    const cart = JSON.parse(
        localStorage.getItem("amosCart") || "[]"
    );

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty!</h2>
                <p>Add some products to get started.</p>
                <br>
                <a href="product.html">Shop Now</a>
            </div>
        `;

        document.getElementById("cart-subtotal").textContent =
            formatPrice(0);

        document.getElementById("delivery-cost").textContent =
            formatPrice(0);

        document.getElementById("cart-total").textContent =
            formatPrice(0);

        document.getElementById("checkout-button").disabled = true;
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);

        subtotal += price * quantity;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = item.name;

        const priceText = document.createElement("p");
        priceText.textContent = formatPrice(price) + " each";

        const quantityControl = document.createElement("div");
        quantityControl.className = "quantity-control";

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");
        decreaseButton.addEventListener("click", () => {
            changeQuantity(index, -1);
        });

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.setAttribute("aria-label", "Increase quantity");
        increaseButton.addEventListener("click", () => {
            changeQuantity(index, 1);
        });

        quantityControl.append(
            decreaseButton,
            quantityText,
            increaseButton
        );

        const lineTotal = document.createElement("p");
        lineTotal.textContent =
            "Item total: " + formatPrice(price * quantity);

        details.append(title, priceText, quantityControl, lineTotal);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-button";
        removeButton.addEventListener("click", () => {
            removeFromCart(index);
        });

        itemElement.append(details, removeButton);
        cartContainer.appendChild(itemElement);
    });

    const delivery = subtotal > 0 ? DELIVERY_FEE : 0;

    document.getElementById("cart-subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("delivery-cost").textContent =
        formatPrice(delivery);

    document.getElementById("cart-total").textContent =
        formatPrice(subtotal + delivery);

    document.getElementById("checkout-button").disabled = false;
}

function changeQuantity(index, change) {
    const cart = JSON.parse(
        localStorage.getItem("amosCart") || "[]"
    );

    if (!cart[index]) return;

    cart[index].quantity =
        (Number(cart[index].quantity) || 1) + change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("amosCart", JSON.stringify(cart));
    displayCart();
}

function removeFromCart(index) {
    const cart = JSON.parse(
        localStorage.getItem("amosCart") || "[]"
    );

    cart.splice(index, 1);

    localStorage.setItem("amosCart", JSON.stringify(cart));
    displayCart();
}

function checkout() {
    const cart = JSON.parse(
        localStorage.getItem("amosCart") || "[]"
    );

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "checkout.html";
}

function displayCheckout() {
    const itemContainer = document.getElementById("checkout-items");
    if (!itemContainer) return;

    const cart = JSON.parse(localStorage.getItem("amosCart") || "[]");
    const form = document.getElementById("checkout-form");
    const emptyMessage = document.getElementById("checkout-empty");
    const placeOrderButton = document.getElementById("place-order-button");

    itemContainer.innerHTML = "";

    if (cart.length === 0) {
        form.hidden = true;
        emptyMessage.hidden = false;
        placeOrderButton.disabled = true;
        document.getElementById("checkout-subtotal").textContent = formatPrice(0);
        document.getElementById("checkout-delivery").textContent = formatPrice(0);
        document.getElementById("checkout-total").textContent = formatPrice(0);
        return;
    }

    let subtotal = 0;
    cart.forEach(function(item) {
        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        subtotal += price * quantity;

        const row = document.createElement("p");
        row.textContent =
            item.name + " × " + quantity + " — " +
            formatPrice(price * quantity);
        itemContainer.appendChild(row);
    });

    document.getElementById("checkout-subtotal").textContent =
        formatPrice(subtotal);
    document.getElementById("checkout-delivery").textContent =
        formatPrice(DELIVERY_FEE);
    document.getElementById("checkout-total").textContent =
        formatPrice(subtotal + DELIVERY_FEE);
}

function placeDemoOrder(event) {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem("amosCart") || "[]");
    if (cart.length === 0) {
        displayCheckout();
        return;
    }

    document.getElementById("checkout-form").hidden = true;
    document.getElementById("checkout-success").hidden = false;
    localStorage.removeItem("amosCart");
}

// Initialize page-specific content when the page opens.
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
    displayCheckout();
});
