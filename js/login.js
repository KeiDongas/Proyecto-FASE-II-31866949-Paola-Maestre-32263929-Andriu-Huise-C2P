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
        this.cart = []
    }
    addToCart(Producto){
        this.cart.push(Producto)
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

    new Admin('Admin', 'admin', 'Oficina'),
    new Buyer('Buyer', '12345', ''),
    new Seller('Seller', '12345', '')
]

var input_user = document.getElementById('input-user')
var input_password = document.getElementById('input-password')

function Login(){

    const user = input_user.value
    const pass = input_password.value

    const userFound = userDB.find(
        u => u.username === user && u.password === pass
    )

    if(userFound){

        console.log(userFound.username, "Ha ingresado")
        localStorage.setItem("userLogged", userFound.username);
        localStorage.setItem("userRol", userFound.rol);
        window.location.href = "dashboard.html";   
    } else{
        alert("Datos invalidos")
    }

}


//*  CODIGO VIEJO
/*const user_admin = 'Admin'
const pass_admin = 'admin'

const user_buyer

var input_user = document.getElementById('input-user')
var input_password = document.getElementById('input-password')

const lgn_button = document.getElementById('lgn_btn')

function Login(){ //EXPORT para hacer que una variable pueda leerse en otro archivo
  const user = input_user.value
  const pass = input_password.value

  if(user == user_admin && pass == pass_admin){ 
    console.log(user," Ha ingresado con exito!")
    localStorage.setItem("usuarioLogueado", user) //guarda el nombre
    window.location.href = "dashboard.html"
  } else { 
    alert("Datos invalidos") 
    }
}
*/
