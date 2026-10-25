const clave = "chiikawa_coleccion";
const ejemplos = [
  { id: "1", nombre: "Chiikawa", rol: "Tierno", origen: "Mundo Chiikawa", imagen: "./imagenes/chiikawa.png", descripcion: "Es tímido, amable y siempre intenta ser valiente." },
  { id: "2", nombre: "Hachiware", rol: "Optimista", origen: "Mundo Chiikawa", imagen: "./imagenes/hachiware.png", descripcion: "Un amigo alegre que siempre ayuda a los demás." },
  { id: "3", nombre: "Usagi", rol: "Aventurero", origen: "Mundo Chiikawa", imagen: "./imagenes/usagi.png", descripcion: "Le encanta divertirse y gritar ¡Yaha!" },
  { id: "4", nombre: "Momonga", rol: "Travieso", origen: "Mundo Chiikawa", imagen: "./imagenes/momonga.png", descripcion: "Le gusta llamar la atención y parecer adorable." },
  { id: "5", nombre: "Kurimanju", rol: "Tranquilo", origen: "Mundo Chiikawa", imagen: "./imagenes/kurimanju.png", descripcion: "Disfruta la comida, las bebidas y los momentos relajados." },
  { id: "6", nombre: "Rakko", rol: "Valiente", origen: "Mundo Chiikawa", imagen: "./imagenes/rakko.png", descripcion: "Es un cazador habilidoso que cuida de sus amigos." }
];
ejemplos.forEach(p => { p.fechaCreacion = "2026-10-01T12:00:00Z"; p.favorito = false; });

const $ = id => document.getElementById(id);
let personajes = cargarPersonajes();
let seleccionado = "";
let soloFavoritos = false;

function cargarPersonajes() {
  try {
    const datos = localStorage.getItem(clave);
    if (datos === null) {
      try { localStorage.setItem(clave, JSON.stringify(ejemplos)); } catch (e) { /* almacenamiento no disponible */ }
      return ejemplos;
    }
    const lista = JSON.parse(datos);
    return Array.isArray(lista) ? lista.filter(p => p && typeof p.id === "string" && typeof p.nombre === "string" && p.nombre.trim() && typeof p.rol === "string" && p.rol.trim()) : [];
  } catch (e) { return []; }
}

function guardarPersonajes(lista, mensaje) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
    personajes = lista;
    $("aviso").textContent = mensaje;
    $("aviso").classList.remove("is-hidden");
    renderizarGrid();
    return true;
  } catch (e) {
    alert("No se pudo guardar. Revisa el espacio disponible en el navegador.");
    return false;
  }
}

function normalizar(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapar(texto) {
  return String(texto || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function filtrarPersonajes(texto) {
  const coincide = p => normalizar(p.nombre + " " + p.rol).includes(texto);
  const resultados = [];
  let i = 0;
  while (i < personajes.length && resultados.length === 0) {
    if (coincide(personajes[i])) resultados.push(personajes[i]);
    i++;
  }
  while (i < personajes.length) {
    if (coincide(personajes[i])) resultados.push(personajes[i]);
    i++;
  }
  return resultados;
}

function fotoHTML(p) {
  return `<div class="foto"><span class="inicial">${escapar(p.nombre.charAt(0))}</span>${p.imagen ? `<img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}">` : ""}</div>`;
}

function comprobarImagen(contenedor) {
  const img = contenedor.querySelector("img");
  if (img) img.addEventListener("error", () => img.remove());
}

function renderizarGrid() {
  const termino = normalizar($("busqueda").value.trim());
  const resultados = filtrarPersonajes(termino).filter(p => !soloFavoritos || p.favorito);
  const totalFavoritos = personajes.filter(p => p.favorito).length;
  $("cantidadFavoritos").textContent = totalFavoritos;
  $("grid").innerHTML = "";
  $("contador").textContent = `${resultados.length} personaje(s) encontrado(s)`;

  resultados.forEach(p => {
    const columna = document.createElement("div");
    columna.className = "column is-one-third-desktop is-half-tablet";
    columna.innerHTML = `<div class="card tarjeta">${fotoHTML(p)}
      <button class="button corazon ${p.favorito ? "marcado" : ""}" type="button"
        aria-label="${p.favorito ? "Quitar de" : "Agregar a"} favoritos" aria-pressed="${!!p.favorito}">
        ${p.favorito ? "♥" : "♡"}</button>
      <div class="card-content"><h3 class="title is-4">${escapar(p.nombre)}</h3>
      <span class="tag mb-4">${escapar(p.rol)}</span><br>
      <button class="button boton-azul ver-detalle" type="button">Ver detalles ♡</button></div></div>`;
    columna.querySelector(".ver-detalle").addEventListener("click", () => abrirDetalle(p.id));
    columna.querySelector(".corazon").addEventListener("click", () => cambiarFavorito(p.id));
    comprobarImagen(columna);
    $("grid").appendChild(columna);
  });

  $("vacio").classList.toggle("is-hidden", resultados.length > 0);
  $("limpiar").classList.toggle("is-hidden", !termino);
  $("mensajeVacio").textContent = personajes.length === 0
    ? "Tu colección está vacía. ¡Agrega a tu primer amigo!"
    : soloFavoritos && totalFavoritos === 0 && !termino
      ? "Aún no tienes favoritos. Presiona ♡ en la tarjeta de un amigo."
      : "No encontramos personajes. Prueba otra búsqueda ♡";
}

function cambiarVista(favoritos) {
  soloFavoritos = favoritos;
  $("verTodos").classList.toggle("activo", !favoritos);
  $("verFavoritos").classList.toggle("activo", favoritos);
  $("verTodos").setAttribute("aria-pressed", String(!favoritos));
  $("verFavoritos").setAttribute("aria-pressed", String(favoritos));
  $("tituloColeccion").textContent = favoritos ? "Mis favoritos ♡" : "Mi colección";
  $("descripcionColeccion").textContent = favoritos
    ? "Aquí están los amiguitos que marcaste con un corazón."
    : "Un lugar para guardar a todos los amigos de Chiikawa.";
  renderizarGrid();
}

function cambiarFavorito(id) {
  const lista = personajes.map(p => p.id === id ? { ...p, favorito: !p.favorito } : p);
  if (guardarPersonajes(lista, "¡Favoritos actualizados! ♡") && $("modalDetalle").classList.contains("is-active")) {
    abrirDetalle(id);
  }
}

function cerrarModales() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("is-active"));
}

function abrirDetalle(id) {
  const p = personajes.find(personaje => personaje.id === id);
  if (!p) return;
  seleccionado = id;
  $("detalle").innerHTML = `${fotoHTML(p)}<div class="has-text-centered">
    <h2 class="title is-3">${escapar(p.nombre)}</h2>
    <p class="dato-personaje"><strong>Rol:</strong> ${escapar(p.rol)}</p>
    <p class="dato-personaje"><strong>Origen:</strong> ${escapar(p.origen || "Desconocido")}</p>
    <p class="mt-3">${escapar(p.descripcion || "Un amigo muy especial.")}</p>
    <button class="button boton-rosa favorito-detalle" type="button">${p.favorito ? "♥ Quitar de favoritos" : "♡ Añadir a favoritos"}</button></div>`;
  $("detalle").querySelector(".favorito-detalle").addEventListener("click", () => cambiarFavorito(id));
  comprobarImagen($("detalle"));
  cerrarModales();
  $("modalDetalle").classList.add("is-active");
}

function abrirFormulario(id = "") {
  $("formPersonaje").reset();
  ["nombre", "rol", "imagen"].forEach(campo => $(campo).setCustomValidity(""));
  $("idPersonaje").value = id;
  const p = personajes.find(personaje => personaje.id === id);
  $("tituloFormulario").textContent = p ? "Editar amigo ♡" : "Agregar amigo ♡";
  if (p) ["nombre", "rol", "origen", "imagen", "descripcion"].forEach(campo => $(campo).value = p[campo] || "");
  cerrarModales();
  $("modalFormulario").classList.add("is-active");
}

$("formPersonaje").addEventListener("submit", evento => {
  evento.preventDefault();
  const id = $("idPersonaje").value;
  const nombre = $("nombre").value.trim();
  const rol = $("rol").value.trim();
  const imagen = $("imagen").value.trim();

  if (!nombre || !rol) {
    const campo = !nombre ? $("nombre") : $("rol");
    campo.setCustomValidity("Este campo es obligatorio.");
    campo.reportValidity();
    return;
  }
  if (personajes.some(p => normalizar(p.nombre) === normalizar(nombre) && p.id !== id)) {
    $("nombre").setCustomValidity("Ya existe un personaje con ese nombre.");
    $("nombre").reportValidity();
    return;
  }
  if (imagen && !/\.(png|jpe?g)(\?.*)?$/i.test(imagen)) {
    $("imagen").setCustomValidity("Utiliza una imagen PNG o JPG.");
    $("imagen").reportValidity();
    return;
  }

  const anterior = personajes.find(p => p.id === id);
  const personaje = {
    id: id || Date.now().toString() + Math.random().toString(36).slice(2, 6),
    nombre, rol,
    origen: $("origen").value.trim(), imagen,
    descripcion: $("descripcion").value.trim(),
    favorito: anterior ? !!anterior.favorito : false,
    fechaCreacion: anterior ? anterior.fechaCreacion : new Date().toISOString()
  };
  const lista = id ? personajes.map(p => p.id === id ? personaje : p) : [...personajes, personaje];
  if (guardarPersonajes(lista, id ? "¡Personaje actualizado! ♡" : "¡Nuevo amigo agregado! ♡")) {
    cerrarModales();
    if (id) abrirDetalle(id);
  }
});

["nombre", "rol", "imagen"].forEach(id => $(id).addEventListener("input", () => $(id).setCustomValidity("")));
$("busqueda").addEventListener("input", renderizarGrid);
$("limpiar").addEventListener("click", () => { $("busqueda").value = ""; renderizarGrid(); });
$("nuevo").addEventListener("click", () => abrirFormulario());
$("verTodos").addEventListener("click", () => cambiarVista(false));
$("verFavoritos").addEventListener("click", () => cambiarVista(true));
$("editar").addEventListener("click", () => abrirFormulario(seleccionado));
$("eliminar").addEventListener("click", () => {
  const p = personajes.find(personaje => personaje.id === seleccionado);
  if (p && confirm(`¿Quieres eliminar a ${p.nombre} de tu colección?`)) {
    if (guardarPersonajes(personajes.filter(personaje => personaje.id !== seleccionado), "Personaje eliminado.")) cerrarModales();
  }
});
document.querySelectorAll(".cerrar-modal").forEach(b => b.addEventListener("click", cerrarModales));

document.addEventListener("click", e => {
  const texto = e.target.closest("h1, h2, h3, p, span, label");
  if (texto) texto.classList.add("camaron_saltando");
});
document.addEventListener("animationend", e => e.target.classList.remove("camaron_saltando"));

renderizarGrid();
