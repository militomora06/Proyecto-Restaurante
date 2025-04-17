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

        if (!Array.isArray(carrito) || carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de hacer tu pedido.");
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

        console.log("📦 Enviando datos:", datos);

        try {
            const respuesta = await fetch("https://script.google.com/macros/s/AKfycbw5IwS3LEh01R1Okqy_R2NDgFGVQlMlIMi1Tc9XzyVDS3y6GcfCsqz3lwTeuxpLTGDn/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        
            const texto = await respuesta.text();
            console.log("📥 Respuesta cruda:", texto);
        
            let resultado;
            try {
                resultado = JSON.parse(texto);
            } catch (err) {
                console.error("⚠️ Respuesta no es JSON válido:", texto);
                alert("❌ El servidor respondió con un formato inesperado.");
                return;
            }
        
            if (resultado.status === "success") {
                alert("✅ ¡Pedido realizado con éxito!");
                localStorage.removeItem("carrito");
                window.location.href = "index.html";
            } else {
                alert("❌ Error al enviar el pedido. Inténtalo nuevamente.");
            }
        
        } catch (error) {
            console.error("❌ Error en el fetch:", error);
            alert("❌ Error de red. Intenta de nuevo.");
        }        
    });
});
