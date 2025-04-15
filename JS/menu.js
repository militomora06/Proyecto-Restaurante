document.addEventListener("DOMContentLoaded", () => {
    fetchMenu();
});

async function fetchMenu() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzvdPKqT3kHS9fWWB7eHV5KZinaLbWpyeyHNWcsqQDflpCFf_ij1vgi67G18fcom6BPMw/exec");

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        console.log("📦 Respuesta completa:", data);
        console.log("📄 Datos:", data.data);

        renderMenu(data.data); // Ajustar esto si necesitas cambiar el nombre del campo
    } catch (error) {
        console.error("❌ Error al obtener el menú:", error);
    }
}


function renderMenu(items) {
    console.log("Datos recibidos:", items);

    items.forEach(item => {
        const categoria = item.Categoria?.toLowerCase().trim(); // ejemplo: "Entrada"
        const nombre = item.Nombre?.trim();
        const precio = parseFloat(item.Precio);
        const descripcion = item.Descripcion?.trim();
        const imagen = item.Imagen || "placeholder.jpg";

        // Mapea la categoría al data-category del HTML
        let categoriaId = "";
        if (categoria.includes("entrada")) categoriaId = "entrada";
        else if (categoria.includes("plato")) categoriaId = "plato-fuerte";
        else if (categoria.includes("postre")) categoriaId = "postre";
        else if (categoria.includes("bebida")) categoriaId = "bebida";
        else return; // Si no se reconoce, no lo muestra

        const container = document.querySelector(`.menu-items[data-category="${categoriaId}"]`);
        if (!container) return;

        // Crear la tarjeta del producto
        const card = document.createElement("div");
        card.classList.add("menu-item");

        card.innerHTML = `
            <img src="${imagen}" alt="${nombre}" class="menu-image">
            <h4 class="menu-name">${nombre}</h4>
            <p class="menu-description">${descripcion}</p>
            <p class="menu-price">$${precio.toFixed(2)}</p>
            <button onclick="addToCart('${nombre}', ${precio})">Agregar al Carrito</button>
        `;

        container.appendChild(card);
    });
}

