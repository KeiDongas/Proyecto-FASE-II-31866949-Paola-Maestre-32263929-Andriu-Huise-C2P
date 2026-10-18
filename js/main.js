const userLogged = localStorage.getItem("userLogged");
const userRol = localStorage.getItem("userRol");

if (!userLogged){
    window.location.href = index.html; //si no hay usuario logueado te manda para index (a casa)
}

document.addEventListener("DOMContentLoaded", () => {

    const usernameElement = document.getElementById("username-display");
    if(usernameElement){
        usernameElement.textContent = userLogged;
    }

})

//--------------DASHBOARD--------------/
// Seleccionamos la tarjeta donde se muestra el número del carrito
const cartCountElement = document.querySelectorAll('.stat-card .stat-number')[1]

// Seleccionamos todos los botones de "Agregar al carrito"
const addButtons = document.querySelectorAll('.add-btn')

// Variable para llevar el conteo local del carrito
let cartCount = 0

// Iteramos sobre cada botón para asignarle el evento de clic
addButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Incrementamos el contador
        cartCount++
        
        // Actualizamos el texto en el DOM
        cartCountElement.textContent = cartCount

        // Feedback visual rápido al hacer clic
        button.textContent = '¡Agregado!'
        button.style.backgroundColor = '#4caf50'

        // Restauramos el botón después de 1 segundo
        setTimeout(() => {
            button.textContent = 'Agregar al carrito'
            button.style.backgroundColor = '#e91e63'
        }, 1000)
    })
})

//----Cerrar sesion----/
function logOut(){
    localStorage.removeItem(userLogged);
    localStorage.removeItem(userRol);
    window.location.href = "index.html";
}