document.addEventListener("DOMContentLoaded", () => {
    const carritoTabla = document.getElementById("cart-items");
    const totalPrecio = document.getElementById("total-price");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonCompra = document.getElementById("hacer-compra");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function actualizarCarrito() {
        carritoTabla.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
                <td><button class="eliminar-item" data-index="${index}">❌</button></td>
            `;
            carritoTabla.appendChild(fila);
            total += producto.precio * producto.cantidad;
        });

        totalPrecio.textContent = total.toFixed(2);
    }

    carritoTabla.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-item")) {
            let index = e.target.getAttribute("data-index");
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
        }
    });

    botonVaciar.addEventListener("click", () => {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    });

    botonCompra.addEventListener("click", () => {
        if (carrito.length === 0) {
            mostrarModal("⚠️ Carrito Vacío", "No hay productos en el carrito.");
            return;
        }

        window.location.href = "Pedidos.html";
    });

    actualizarCarrito();
});
