// Validar inicio de sesión
const userLogged = localStorage.getItem("userLogged");
const userRol = localStorage.getItem("userRol");

if (!userLogged) {
    window.location.href = "index.html";
}

//-------------- CLASE PRODUCTO --------------//
class Product {
    constructor(id, name, price, img, stock, owner = "Admin") {
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.stock = stock;
        this.owner = owner;
    }

    getFormattedPrice() {
        return `$${this.price.toFixed(2)}`;
    }
}

// Catálogo base
const initialCatalog = [
    new Product(1, "Teclado Mecánico RGB", 45.00, "../assets/products/teclado.jpg", 10, "Seller"),
    new Product(2, "Mouse Gamer 16000 DPI", 25.50, "../assets/products/mouse.jpg", 15, "Seller"),
    new Product(3, "Audífonos Inalámbricos", 60.00, "../assets/products/audifonos.jpg", 8, "Seller"),
    new Product(4, "Monitor 144Hz IPS", 180.00, "../assets/products/monitor.jpg", 5, "Seller"),
    new Product(5, "Notebook Gaming", 800.00, "../assets/products/notebook.webp", 3, "Seller"),
    new Product(6, "Silla Gamer Ergonómica", 150.00, "../assets/products/silla.jpg", 7, "Seller"),
    new Product(7, "Tarjeta Gráfica RTX 5090", 700.00, "../assets/products/rtx-5090.webp", 2, "Seller"),
    new Product(8, "Procesador Intel i9", 500.00, "../assets/products/procesador.webp", 4, "Seller"),
    new Product(9, "Placa Base ATX", 120.00, "../assets/products/placa.jpg", 6, "Seller"),
    new Product(10, "Fuente de Poder 750W", 90.00, "../assets/products/fuente.webp", 5, "Seller"),
    new Product(11, "Disco Duro SSD 1TB", 110.00, "../assets/products/ssd.webp", 12, "Admin"),
    new Product(12, "Memoria RAM 16GB", 80.00, "../assets/products/ram.jpg", 20, "Paola")
];

let catalogIdCounter = 100;

let catalog = loadCatalog();

function loadCatalog() {
    const savedCatalog = localStorage.getItem("catalogDB");
    if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog);
        parsed.forEach(p => { if (typeof p.id === "number") catalogIdCounter = Math.max(catalogIdCounter, p.id + 1); });
        return parsed.map(p => new Product(p.id, p.name, p.price, p.img, p.stock, p.owner));
    } else {
        localStorage.setItem("catalogDB", JSON.stringify(initialCatalog));
        return [...initialCatalog];
    }
}

function saveCatalog() {
    localStorage.setItem("catalogDB", JSON.stringify(catalog));
}

function publishArticle() {
    const name = document.getElementById("pub-name").value.trim();
    const price = parseFloat(document.getElementById("pub-price").value);
    const stock = parseInt(document.getElementById("pub-stock").value, 10);
    const img = document.getElementById("pub-img").value.trim();

    if (!name || isNaN(price) || isNaN(stock)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const newProduct = new Product(catalogIdCounter++, name, price, img || "../assets/products/teclado.jpg", stock, userLogged);
    catalog.push(newProduct);
    saveCatalog();
    renderProducts();
    document.getElementById("publish-form").reset();
    alert("Artículo publicado y guardado.");
    showSection('home');
}

// Estado global del carrito del comprador
let cart = [];

//-------------- EVENTO DOM CONTENT LOADED --------------//
document.addEventListener("DOMContentLoaded", () => {
    const usernameElement = document.getElementById("username-display");
    if (usernameElement) {
        usernameElement.textContent = userLogged;
    }

    renderProducts();
    updateCartBadge();
});

//-------------- LOGICA DEL DASHBOARD Y PRODUCTOS --------------//
function renderProducts() {
    const productsGrid = document.querySelector(".products-grid");
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    catalog.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const canDelete = (userRol === "Administrator") || (userRol === "Seller" && product.owner === userLogged);

        let actionButtonsHTML = '';

        if (userRol === "Buyer") {
            actionButtonsHTML = `
                <button class="add-btn" onclick="addToCart(${product.id}, this)">Agregar al carrito</button>
            `;
        } else {
            actionButtonsHTML = `
                ${canDelete ? `<button class="add-btn delete-btn" style="background-color: #ff5252; color: white;" onclick="deleteProduct(${product.id})">Eliminar artículo</button>` : ''}
            `;
        }

        card.innerHTML = `
            <div class="product-image" style="${product.img ? `background-image: url('${product.img}'); background-size: cover;` : ''}"></div>
            <h3>${product.name}</h3>
            <p class="price">${product.getFormattedPrice()}</p>
            <small style="color: #d1d1d1; display: block; margin-bottom: 8px;">Vendedor: ${product.owner}</small>
            ${actionButtonsHTML}
        `;

        productsGrid.appendChild(card);
    });
}

// Agregar producto al carrito
function addToCart(productId, buttonElement) {
    const productFound = catalog.find((p) => p.id === productId);

    if (productFound) {
        cart.push(productFound);
        updateCartBadge();

        buttonElement.textContent = "¡Agregado!";
        buttonElement.style.backgroundColor = "#4EFEAA";
        buttonElement.style.color = "#1C1326";

        setTimeout(() => {
            buttonElement.textContent = "Agregar al carrito";
            buttonElement.style.backgroundColor = "#F291A3";
            buttonElement.style.color = "#1C1326";
        }, 1000);
    }
}

function deleteProduct(productId) {
    const product = catalog.find((item) => item.id === productId);
    if (!product) {
        alert("El artículo ya no está disponible.");
        return;
    }

    const canDelete = userRol === "Administrator"
        || (userRol === "Seller" && product.owner === userLogged);
    if (!canDelete) {
        alert("No tienes permiso para eliminar este artículo.");
        return;
    }

    if (!confirm(`¿Seguro que deseas eliminar "${product.name}"?`)) return;

    catalog = catalog.filter((item) => item.id !== productId);
    saveCatalog();
    renderProducts();
}

// Actualizar contador del carrito
function updateCartBadge() {
    const menuCartCount = document.getElementById("menu-cart-count");
    if (menuCartCount) {
        menuCartCount.textContent = cart.length;
    }

    const dashboardCartCount = document.getElementById("dashboard-cart-count");
    if (dashboardCartCount) {
        dashboardCartCount.textContent = cart.length;
    }

    const floatCartCount = document.getElementById("float-cart-count");
    if (floatCartCount) {
        floatCartCount.textContent = cart.length;
    }
}

//-------------- LÓGICA Y MODAL DEL CARRITO --------------//
function toggleCartModal() {
    const modal = document.getElementById("cart-modal");
    if (!modal) return;

    if (modal.style.display === "none" || modal.style.display === "") {
        renderCartModal();
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.style.display = 'none');

    // Desmarcar todos los enlaces del menú
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // mostrar la seccion seleccionada y activar su boton
    const targetSection = document.getElementById(`section-${sectionName}`);
    const targetNav = document.getElementById(`nav-${sectionName}`);

    if (targetSection) {
        targetSection.style.display = 'block';
    }
    if (targetNav) {
        targetNav.classList.add('active');
    }

    // Si entra a la seccion del carrito actualiza la vista
    if (sectionName === 'cart') {
        toggleCartModal();
    }
}

function renderCartPage() {
    renderCartItems("cart-page-container", "cart-total-price");
}

function renderCartModal() {
    renderCartItems("cart-items-container", "modal-cart-total-price");
}

function renderCartItems(containerId, totalPriceId) {
    const container = document.getElementById(containerId);
    const totalPriceElement = document.getElementById(totalPriceId);
    if (!container || !totalPriceElement) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #d1d1d1; padding: 20px;">Tu carrito está vacío.</p>`;
        totalPriceElement.textContent = "$0.00";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const cartItemHTML = document.createElement("div");
        cartItemHTML.classList.add("cart-item");

        cartItemHTML.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.getFormattedPrice()}</p>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${index})">Quitar</button>
        `;

        container.appendChild(cartItemHTML);
    });

    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    renderCartPage();
    renderCartModal();
}

function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert(`¡Gracias por tu compra, ${userLogged}! Procesando pedido...`);
    cart = [];
    updateCartBadge();
    renderCartModal();

    const modal = document.getElementById("cart-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

//-------------- CERRAR SESIÓN --------------//
function logOut() {
    localStorage.removeItem("catalogDB");
    localStorage.removeItem("userLogged");
    localStorage.removeItem("userRol");
    window.location.href = "index.html";
}