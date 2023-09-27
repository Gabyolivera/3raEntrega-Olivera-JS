const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

class Producto {
    constructor(id, nombre, precio, img) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = 1;
        this.img = img;
    }

    descripcionProducto() {
        return `
        <div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="card text-center mx-auto">
                <h4 class="card-title text-center">${this.nombre}</h4>
                <img src="${this.img}" class="card-img-top img-fluid" alt="${this.nombre}">
                <div class="card-body">
                    <p class="card-text fs-4">$${this.precio}</p>
                    <button class="btn btn-dark" onclick="agregarProducto(${this.id}, '${this.nombre}', ${this.precio})">AÑADIR AL CARRITO</button>
                </div>
                </div>  
        </div>`;
    }

    descripcionCarrito() {
        return `
            <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${this.img}" class="img-fluid rounded-start" alt="${this.nombre}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${this.nombre}</h5>
                            <p class="card-text">Cantidad: ${this.cantidad}</p>
                            <p class="card-text">Precio: $${this.precio}</p>
                            <button class="btn btn-danger" onclick="eliminarProducto(${this.id})">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    
}

class ProductoController {
    constructor() {
        this.listaProductos = [];
    }

    agregar(producto) {
        if (producto instanceof Producto) {
            this.listaProductos.push(producto);
        }
    }
 
}

const productoController = new ProductoController();


function actualizarTotal() {
    let totalCarrito = 0;
    carrito.forEach(producto => {
        totalCarrito += producto.precio * producto.cantidad;
    });
    document.getElementById('totalCarrito').textContent = totalCarrito;
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarProducto(id, nombre, precio, img) {
    const index = carrito.findIndex(producto => producto.id === id);

    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        const producto = new Producto(id, nombre, precio, img); // Pasa la ruta de la imagen aquí
        carrito.push(producto);
    }

    const productoAgregado = carrito.find(producto => producto.id === id);
    if (productoAgregado) {
        Toastify({
            text: `Se agregó ${productoAgregado.nombre} al carrito!🛒`,
            duration: 3000,
            gravity: 'bottom',
            backgroundColor: 'green',
            close: true,
            icon: "🛒"
        }).showToast();
    }

    actualizarTotal();
    actualizarCarritoDOM();
    actualizarNumeroProductosEnCarrito();
    guardarCarritoEnLocalStorage();
}


function actualizarNumeroProductosEnCarrito() {
    const numProductosCarrito = document.getElementById('numProductosCarrito');
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    numProductosCarrito.textContent = totalProductos;
}




function eliminarProducto(id) {
    const index = carrito.findIndex(producto => producto.id === id);

    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }

        actualizarTotal();
        actualizarCarritoDOM();
        actualizarNumeroProductosEnCarrito();
        guardarCarritoEnLocalStorage();
    }
}

function vaciarTodo() {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará todos los productos del carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar todo",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
           carrito.length = 0;
            actualizarCarritoDOM();
            actualizarTotal();
            guardarCarritoEnLocalStorage();
             Swal.fire(
                "Eliminado!",
                "El carrito se ha vaciado correctamente.",
                "success"
            );
        }
        actualizarNumeroProductosEnCarrito();
    });
   
}

function finalizarCompra() {
  Swal.fire({
        title: "¿Deseas finalizar la compra?",
        text: "Al finalizar, se procesará la compra de los productos en tu carrito.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, finalizar compra",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            
            Swal.fire(
                "¡Compra exitosa!",
                "La compra se ha procesado correctamente.",
                "success"
            );

          
            carrito.length = 0;
            actualizarCarritoDOM();
            actualizarTotal();
            guardarCarritoEnLocalStorage();
            actualizarNumeroProductosEnCarrito()
        }
    });
}


function actualizarCarritoDOM() {
    const tablaCarrito = document.getElementById('listaCarrito');
    tablaCarrito.innerHTML = '';

    carrito.forEach((producto, index) => {
        const filaCarrito = document.createElement('tr');
        filaCarrito.innerHTML = `
            <td>${producto.nombre}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="restarUno(${producto.id})">-</button>
                <span>${producto.cantidad}</span>
                <button class="btn btn-secondary btn-sm" onclick="sumarUno(${producto.id})">+</button>
            </td>
            <td>$${producto.precio * producto.cantidad}</td>
            <td>
                <button class="btn btn-warning btn-sm eliminar-producto" data-id="${producto.id}">Eliminar</button>
            </td>
        `;
        tablaCarrito.appendChild(filaCarrito);

        const botonEliminar = filaCarrito.querySelector('.eliminar-producto');
        botonEliminar.addEventListener('click', () => {
            eliminarProducto(producto.id);
            Toastify({
                text: `Se eliminó ${producto.nombre} del carrito`,
                duration: 1000,
                gravity: 'top',
                backgroundColor: 'red',
            }).showToast();
        });
    });
}

function sumarUno(id) {
    const producto = carrito.find(producto => producto.id === id);
    if (producto) {
        producto.cantidad++;
        actualizarTotal();
        actualizarCarritoDOM();
        guardarCarritoEnLocalStorage();
    }
}

function restarUno(id) {
    const producto = carrito.find(producto => producto.id === id);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        actualizarTotal();
        actualizarCarritoDOM();
        guardarCarritoEnLocalStorage();
    }
}






window.onload = function () {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito.length = 0;
        const productosGuardados = JSON.parse(carritoGuardado);

        productosGuardados.forEach(productoGuardado => {
            const productoExistente = carrito.find(producto => producto.id === productoGuardado.id);

            if (productoExistente) {
                productoExistente.cantidad += productoGuardado.cantidad;
            } else {
                const nuevoProducto = new Producto(
                    productoGuardado.id,
                    productoGuardado.nombre,
                    productoGuardado.precio,
                    productoGuardado.img
                );
                nuevoProducto.cantidad = productoGuardado.cantidad;
                carrito.push(nuevoProducto);
            }
        });

        actualizarCarritoDOM();
        actualizarTotal();
        actualizarNumeroProductosEnCarrito(); 
    }

    obtenerProductos(); 
};

const obtenerProductos = async () => {
    
        const response = await fetch("js/productos.json"); 
        const productos = await response.json();
       
        productos.forEach(producto => {
            productoController.agregar(new Producto(producto.id, producto.nombre, producto.precio, producto.img));
        });

        const catalogo = document.getElementById('catalogoProductos');
        productoController.listaProductos.forEach(producto => {
            const productoHTML = producto.descripcionProducto();
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = productoHTML;
            catalogo.appendChild(col);
        });
    
};









  