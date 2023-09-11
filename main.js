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
            <div class="card border-light" >
                <h4 class="card-title text-center fs-3">${this.nombre}</h5>
                <img src="${this.img}" class="card-img-top" alt="${this.nombre}">
                <div class="card-body">
                    <p class="card-text fs-4">$${this.precio}</p>
                    <button class="btn btn-dark" id="ap-${this.id}" onclick="agregarProducto(${this.id}, '${this.nombre}', ${this.precio})">AÑADIR AL CARRITO</button>
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
                            <button class="btn btn-danger" id="ep-${this.id}" onclick="eliminarProducto(${this.id})">
                            
                            </button>
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

    cargarProductos() {
        this.agregar(new Producto(1, "Hamaca de Pie", 80000, "imagenes/HamacaPieNegro.jpeg"));
        this.agregar(new Producto(2, "Hamaca Colgante", 65000, "imagenes/hamaca-colgante-1.jpg"));
        this.agregar(new Producto(3, "Sillón para Jardín", 90000, "imagenes/sillondeJardin.jpg"));
    }
}

const productoController = new ProductoController();
productoController.cargarProductos();

function actualizarTotal() {
    let totalCarrito = 0;
    carrito.forEach(producto => {
        totalCarrito += producto.precio;
    });
    document.getElementById('totalCarrito').textContent = totalCarrito;
}
function guardarCarritoEnLocalStorage() {
	localStorage.setItem("carrito", JSON.stringify(carrito));
}


function agregarProducto(id, nombre, precio) {
    const index = carrito.findIndex(producto => producto.id === id);

    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        const producto = new Producto(id, nombre, precio, "");
        carrito.push(producto);
    }

    actualizarTotal();
    actualizarCarritoDOM();
    guardarCarritoEnLocalStorage();
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
        guardarCarritoEnLocalStorage();
    }
}




function vaciarTodo() {
    carrito.length = 0; 
    actualizarCarritoDOM();
    actualizarTotal();
    guardarCarritoEnLocalStorage();
}


function actualizarTotal() {
    let totalCarrito = 0;
    carrito.forEach(producto => {
        totalCarrito += producto.precio * producto.cantidad;
    });
    document.getElementById('totalCarrito').textContent = totalCarrito;
}


function actualizarCarritoDOM() {
    const listaCarrito = document.querySelector('#listaCarrito');
    listaCarrito.innerHTML = '';

    carrito.forEach((producto, index) => {
        const itemCarrito = document.createElement('li');
        itemCarrito.innerHTML = `
            ${producto.nombre} - $${producto.precio} - Cantidad: ${producto.cantidad}
            <button class="btn btn-warning btn-sm eliminar-producto" data-id="${producto.id}"><img src="imagenes/basura-16.png" alt="eliminar"></button>
        `;
        listaCarrito.appendChild(itemCarrito);

       
        const botonEliminar = itemCarrito.querySelector('.eliminar-producto');
        botonEliminar.addEventListener('click', () => {
            eliminarProducto(producto.id);
        });
    });
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
    }

    const catalogo = document.getElementById('catalogoProductos');
    productoController.listaProductos.forEach(producto => {
        const productoHTML = producto.descripcionProducto();
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = productoHTML;
        catalogo.appendChild(col);
    });
};








  