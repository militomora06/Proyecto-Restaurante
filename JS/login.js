loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const contraseña = document.getElementById('loginPassword').value;

  const res = await fetch('http://localhost:8000/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: email,  // ⚠️ JWT usa "username" por defecto (aunque sea el email)
      password: contraseña
    })
  });

  const data = await res.json();

  if (res.ok) {
    // Guardamos los tokens en el almacenamiento local
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    mensajeDiv.innerText = 'Login exitoso';

    // Opcional: redirigir al menú
    // window.location.href = "menu.html";
  } else {
    mensajeDiv.innerText = data.detail || 'Error al iniciar sesión';
  }
});


const token = localStorage.getItem('access');

const res = await fetch('http://localhost:8000/api/pedidos/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
