document.addEventListener("DOMContentLoaded", () => {
    fetchMenu();
});

async function fetchMenu() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbw5IwS3LEh01R1Okqy_R2NDgFGVQlMlIMi1Tc9XzyVDS3y6GcfCsqz3lwTeuxpLTGDn/exec");
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("📦 Respuesta completa:", data);

        // Este es el arreglo correcto que devuelve el menú
        renderMenu(data.menu);

    } catch (error) {
        console.error("❌ Error al obtener el menú:", error);
    }
}

function renderMenu(items) {
    console.log("🧾 Datos recibidos:", items);

    items.forEach(item => {
        const categoria = item.Categoria?.toLowerCase().trim();
        const nombre = item.Nombre?.trim();
        const precio = parseFloat(item.Precio);
        const descripcion = item.Descripcion?.trim();
        const imagen = item.Imagen || "placeholder.jpg";

        let categoriaId = "";
        if (categoria.includes("entrada")) categoriaId = "entrada";
        else if (categoria.includes("plato")) categoriaId = "plato-fuerte";
        else if (categoria.includes("postre")) categoriaId = "postre";
        else if (categoria.includes("bebida")) categoriaId = "bebida";
        else return;

        const container = document.querySelector(`.menu-items[data-category="${categoriaId}"]`);
        if (!container) return;

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