// Validar inicio de sesión
const userLogged = localStorage.getItem("userLogged");
const userRol = localStorage.getItem("userRol");

if (!userLogged) {
    window.location.href = "index.html"; // Redirección corregida con comillas
}

//-------------- CLASE PRODUCTO --------------//
class Product {
    constructor(id, name, price, img, stock, owner) {
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

// Catálogo de productos simulado
const catalog = [
    new Product(1, "Teclado Mecánico RGB", 67.00, "../assets/products/teclado.jpg", 10, 'Seller'),
    new Product(2, "Mouse Gamer 16000 DPI", 25.50, "../assets/products/mouse.jpg", 15 ,'Seller'),
    new Product(3, "Audífonos Inalámbricos", 60.00, "../assets/products/audifonos.jpg", 8, 'Seller'),
    new Product(4, "Monitor 144Hz IPS", 180.00, "../assets/products/monitor.jpg", 5),
    new Product(5, "Monitor 144Hz IPS", 180.00, "../assets/products/monitor.jpg", 5)
];

// Estado global del carrito (Arreglo de objetos Product)
const cart = [];

//-------------- EVENTO DOM CONTENT LOADED --------------//
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar nombre de usuario en el panel
    const usernameElement = document.getElementById("username-display");
    if (usernameElement) {
        usernameElement.textContent = userLogged;
    }

    // Renderizar catálogo de productos en la pantalla
    renderProducts();
});

//-------------- FUNCIONES DEL DASHBOARD --------------//
function renderProducts() {
    const productsGrid = document.querySelector(".products-grid");
    if (!productsGrid) return;

    productsGrid.innerHTML = ""; // Limpiar productos estáticos en HTML

    catalog.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const canDelete = (userRol === "Administrator") || (userRol === "Seller" && product.owner === userLogged);

        // Construir botones según el rol
        let actionButtonsHTML = '';

        if (userRol === "Buyer") {
            actionButtonsHTML = `
                <button class="add-btn" onclick="addToCart(${product.id}, this)">Agregar al carrito</button>
            `;
        } else {
            // Si es Admin o Seller, mostramos opciones de gestión
            actionButtonsHTML = `
                ${canDelete ? `<button class="add-btn delete-btn" style="background-color: #ff5252; color: white;" onclick="deleteProduct(${product.id})">Eliminar artículo</button>` : ''}
            `;
        }

        card.innerHTML = `
            <div class="product-image" style="${product.img ? `background-image: url('${product.img}'); background-size: cover;` : ''}"></div>
            <h3>${product.name}</h3>
            <p class="price">${product.getFormattedPrice()}</p>
            <small style="color: #a092b7; display: block; margin-bottom: 8px;">Vendedor: ${product.owner}</small>
            ${actionButtonsHTML}
        `;

        productsGrid.appendChild(card);
    });
}

function deleteProduct(productId) {
    const productIndex = catalog.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const productToDelete = catalog[productIndex];

        // Verificación de seguridad previa
        if (userRol === "Administrator" || (userRol === "Seller" && productToDelete.owner === userLogged)) {
            if (confirm(`¿Estás seguro de que deseas eliminar "${productToDelete.name}"?`)) {
                catalog.splice(productIndex, 1); // Elimina del arreglo catalog
                renderProducts(); // Vuelve a renderizar la vista actualizada
            }
        } else {
            alert("No tienes permiso para eliminar este artículo.");
        }
    }
}

function addToCart(productId, buttonElement) {
    // Buscar producto en el catálogo por su ID
    const productFound = catalog.find((p) => p.id === productId);

    if (productFound) {
        cart.push(productFound);

        // Actualizar el contador en la tarjeta de estadísticas (Stat Card #2)
        const cartCountElement = document.querySelectorAll(".stat-card .stat-number")[1];
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }

        // Feedback visual en el botón
        buttonElement.textContent = "¡Agregado!";
        buttonElement.style.backgroundColor = "#4EFEAA";
        buttonElement.style.color = "#1C1326";

        // Restaurar botón después de 1 segundo con la paleta rosa
        setTimeout(() => {
            buttonElement.textContent = "Agregar al carrito";
            buttonElement.style.backgroundColor = "#F291A3";
            buttonElement.style.color = "#1C1326";
        }, 1000);
    }
}

//-------------- CERRAR SESIÓN --------------//
function logOut() {
    localStorage.removeItem("userLogged");
    localStorage.removeItem("userRol");
    window.location.href = "index.html";
}