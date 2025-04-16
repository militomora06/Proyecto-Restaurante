document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const tablaPedido = document.getElementById("tablaPedido");
    const totalPedido = document.getElementById("totalPedido");
    const totalConEnvio = document.getElementById("totalConEnvio");
    const envio = 5.00;

    function mostrarProductosCarrito() {
        tablaPedido.innerHTML = "";
        let total = 0;

        carrito.forEach(producto => {
            const fila = document.createElement("tr");
            const totalProducto = producto.precio * producto.cantidad;
            total += totalProducto;

            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>$${totalProducto.toFixed(2)}</td>
            `;

            tablaPedido.appendChild(fila);
        });

        totalPedido.textContent = total.toFixed(2);
        totalConEnvio.textContent = (total + envio).toFixed(2);
    }

    mostrarProductosCarrito();

    document.getElementById("formPedido").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value.trim();

        if (!nombre || !telefono || !direccion) {
            alert("Por favor completa todos los campos.");
            return;
        }

        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const items = carrito.map(p => `${p.nombre} x${p.cantidad} ($${p.precio.toFixed(2)})`).join(", ");
        const total = (parseFloat(totalPedido.textContent) + envio).toFixed(2);

        const datos = {
            nombre,
            telefono,
            direccion,
            items,
            total
        };

        try {
            const respuesta = await fetch("https://script.google.com/macros/s/AKfycbxkdUK92F2NgziRZ9-lga-PQ0-mhloJs2KjUbyRk3nm4qcUhthfAng6RVfGbisdlaRB/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (resultado.status === "success") {
                alert("✅ ¡Pedido realizado con éxito!");
                localStorage.removeItem("carrito");
                window.location.href = "index.html";
            } else {
                alert("❌ Error al enviar el pedido. Inténtalo nuevamente.");
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            alert("❌ Error de red. Intenta de nuevo.");
        }
    });
});
