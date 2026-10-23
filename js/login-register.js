function showForm(vista) {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const welcomeText = document.getElementById('welcome-text');

    if (vista === 'register') {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
        if (welcomeText) welcomeText.innerHTML = '¡Únete a <br>BinaryShop!';
    } else {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
        if (welcomeText) welcomeText.innerHTML = '¡Hola!, ¡qué bueno volver a <br>verte!';
    }
}

class User {
    constructor(username, password, rol){
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
}

class Admin extends User{
    constructor(username, password){
        super(username, password, 'Administrator');
    }

    deleteUser(User){}

    deleteProduct(Producto){}
}

class Buyer extends User{
    constructor(username, password, direccionEnvio){
        super(username, password, 'Buyer');
        this.direccionEnvio = direccionEnvio;
        this.cart = [];
    }
    addToCart(Producto){
        this.cart.push(Producto);
    }
}

class Seller extends User{
    constructor(username, password, direccionVenta){
        super(username, password, 'Seller');
        this.direccionVenta = direccionVenta;
        this.SellList = [];
    }

    Sell(Producto){
        
    }
    
    deleteProduct(Producto){

    }
}

const userDB = [
    new Admin('Admin', 'admin'),
    new Buyer('Buyer', '12345', ''),
    new Seller('Seller', '12345', '')
];

var input_user = document.getElementById('input-user');
var input_password = document.getElementById('input-password');
var input_role = document.getElementById('input-role');

function Login(){
    const user = input_user.value;
    const pass = input_password.value;
    const role = input_role.value; 

    
    const userFound = userDB.find(
        u => u.username === user && u.password === pass && u.rol === role
    );

    if(userFound){
        console.log(userFound.username, "ha ingresado como", userFound.rol);
        localStorage.setItem("userLogged", userFound.username);
        localStorage.setItem("userRol", userFound.rol);
        window.location.href = "dashboard.html";   
    } else {
        alert("Credenciales o rol inválidos");
    }
}




