// === Funciones globales ===
function addToCart(nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(item => item.nombre === nombre);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombre} agregado al carrito`);
}

function mostrarModal(titulo, mensaje) {
    const modal = document.getElementById("modal-mensaje");
    if (!modal) return;
    document.getElementById("modal-titulo").textContent = titulo;
    document.getElementById("modal-texto").textContent = mensaje;
    modal.style.display = "flex";
}

function cerrarModal() {
    const modal = document.getElementById("modal-mensaje");
    if (modal) modal.style.display = "none";
}

// === Página: Menu.html ===
if (window.location.pathname.includes("Menu.html")) {
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbzsC1dDe9nVP6_sHflJJNoDuAk7TfU-O4YWv4eZKD42Yx1_v8fWzbPRGYyiY8CF5BmU/exec");
            const data = await response.json();
            renderMenu(data.menu);
        } catch (e) {
            console.error("Error al cargar el menú:", e);
        }
    });

    function renderMenu(items) {
        items.forEach(item => {
            const categoria = item.Categoria?.toLowerCase();
            const container = document.querySelector(`.menu-items[data-category="${categoria}"]`);
            if (!container) return;

            const card = document.createElement("div");
            card.classList.add("menu-item");
            card.innerHTML = `
                <img src="${item.Imagen || 'placeholder.jpg'}" alt="${item.Nombre}">
                <h4>${item.Nombre}</h4>
                <p>${item.Descripcion}</p>
                <p>$${parseFloat(item.Precio).toFixed(2)}</p>
                <button onclick="addToCart('${item.Nombre}', ${parseFloat(item.Precio)})">Agregar al carrito</button>
            `;
            container.appendChild(card);
        });
    }
}

// === Página: carrito.html ===
if (window.location.pathname.includes("carrito.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        mostrarCarrito();
        document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
        document.getElementById("hacer-compra").addEventListener("click", () => {
            if ((JSON.parse(localStorage.getItem("carrito")) || []).length === 0) {
                mostrarModal("⚠️ Carrito vacío", "Agrega productos antes de continuar.");
                return;
            }
            window.location.href = "Pedidos.html";
        });
    });

    function mostrarCarrito() {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const tabla = document.getElementById("cart-items");
        let total = 0;
        tabla.innerHTML = "";

        carrito.forEach((item, i) => {
            const totalItem = item.precio * item.cantidad;
            total += totalItem;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td><input type="number" min="1" value="${item.cantidad}" data-index="${i}" class="cantidad-input"></td>
                <td>$${totalItem.toFixed(2)}</td>
                <td><button class="eliminar-btn" data-index="${i}">❌</button></td>
            `;
            tabla.appendChild(row);
        });

        document.getElementById("total-price").textContent = total.toFixed(2);

        document.querySelectorAll(".cantidad-input").forEach(input => {
            input.addEventListener("change", e => {
                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                const index = e.target.dataset.index;
                carrito[index].cantidad = Math.max(1, parseInt(e.target.value));
                localStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarrito();
            });
        });

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                carrito.splice(e.target.dataset.index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarrito();
            });
        });
    }

    function vaciarCarrito() {
        localStorage.removeItem("carrito");
        mostrarCarrito();
    }
}

// === Página: Pedidos.html ===
if (window.location.pathname.includes("Pedidos.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        mostrarResumenPedido();
        document.getElementById("formPedido").addEventListener("submit", enviarPedido);
    });

    function mostrarResumenPedido() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const tabla = document.getElementById("tablaPedido");
        const totalPedido = document.getElementById("totalPedido");
        const totalConEnvio = document.getElementById("totalConEnvio");
        let total = 0;
        tabla.innerHTML = "";

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>${item.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
            `;
            tabla.appendChild(row);
        });

        totalPedido.textContent = total.toFixed(2);
        totalConEnvio.textContent = (total + 5).toFixed(2);
    }

    async function enviarPedido(e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        if (!nombre || !telefono || !direccion || carrito.length === 0) {
            alert("Todos los campos son obligatorios y el carrito no puede estar vacío.");
            return;
        }

        const pedido = {
            nombre,
            telefono,
            direccion,
            items: carrito.map(p => `${p.nombre} x${p.cantidad}`).join(", "),
            total: (carrito.reduce((a, b) => a + b.precio * b.cantidad, 0) + 5).toFixed(2)
        };

        try {
            const res = await fetch("https://script.google.com/macros/s/AKfycbzsC1dDe9nVP6_sHflJJNoDuAk7TfU-O4YWv4eZKD42Yx1_v8fWzbPRGYyiY8CF5BmU/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });
            const respuesta = await res.json();
            if (respuesta.status === "success") {
                alert("✅ Pedido enviado con éxito");
                localStorage.removeItem("carrito");
                window.location.href = "index.html";
            } else {
                alert("❌ Error al enviar pedido. Intenta de nuevo.");
            }
        } catch (err) {
            console.error("❌ Error:", err);
            alert("Error de red. Intenta más tarde.");
        }
    }
}

fetch('http://localhost:8000/api/productos/')
  .then(res => res.json())
  .then(data => {
    console.log(data); // Renderiza productos
  });

