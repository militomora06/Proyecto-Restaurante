const registroForm = document.getElementById('registroForm');
const loginForm = document.getElementById('loginForm');
const mensajeDiv = document.getElementById('mensaje');

registroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('registroEmail').value;
  const contraseña = document.getElementById('registroPassword').value;

  const res = await fetch('http://localhost:8000/api/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, contraseña })
  });

  const data = await res.json();
  mensajeDiv.innerText = data.mensaje;
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const contraseña = document.getElementById('loginPassword').value;

  const res = await fetch('http://localhost:8000/api/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, contraseña })
  });

  const data = await res.json();

  if (res.ok) {
    mensajeDiv.innerText = `Bienvenido/a, ${data.usuario.nombre}`;
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    // Redirigir al menú si deseas:
    // window.location.href = "menu.html";
  } else {
    mensajeDiv.innerText = data.mensaje;
  }
});
