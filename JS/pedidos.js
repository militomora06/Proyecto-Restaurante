document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaPedido = document.getElementById("listaPedido");
    const totalPedido = document.getElementById("totalPedido");
    const totalConEnvio = document.getElementById("totalConEnvio");
    const envio = 5.00;

    function actualizarPedido() {
        listaPedido.innerHTML = "";
        let total = 0;

        carrito.forEach(producto => {
            let li = document.createElement("li");
            li.textContent = `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}`;
            listaPedido.appendChild(li);
            total += producto.precio * producto.cantidad;
        });

        totalPedido.textContent = total.toFixed(2);
        totalConEnvio.textContent = (total + envio).toFixed(2);
    }

    actualizarPedido();

    document.getElementById("formPedido").addEventListener("submit", async (e) => {
        e.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let telefono = document.getElementById("telefono").value;
        let direccion = document.getElementById("direccion").value;

        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de hacer el pedido.");
            return;
        }

        let pedido = {
            nombre,
            telefono,
            direccion,
            productos: carrito.map(prod => ({
                id: prod.id || "sin-id",
                nombre: prod.nombre,
                cantidad: prod.cantidad,
                precio: prod.precio
            })),
            total: (parseFloat(totalPedido.textContent) + envio).toFixed(2)
        };

        try {
            let respuesta = await fetch("https://script.google.com/macros/s/AKfycbyPOOnPfOflIV7WYqm-N9OkLjsx6QwY-FrtX8vm1dFvPPkRZKbfKtYuvSHdFKL8CpjUfw/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });

            let data = await respuesta.json();
            console.log("Respuesta de la API:", data);

            alert("Pedido realizado con éxito! 🎉");
            localStorage.removeItem("carrito"); // Vaciar el carrito tras la compra
            window.location.href = "index.html"; // Redirigir a la página principal
        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            alert("Hubo un problema al enviar tu pedido. Intenta de nuevo.");
        }
    });
});