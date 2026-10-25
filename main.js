const clave = "chiikawa_coleccion";
const ejemplos = [
  { "id": "1", 
    "nombre": "Chiikawa", 
    "rol": "Tierno", 
    "origen": "Mundo Chiikawa", 
    "imagen": "./imagenes/chiikawa.png", 
    "descripcion": "Es tímido, amable y siempre intenta ser valiente." 
  },
  { 
    "id": "2", 
    "nombre": "Hachiware", 
    "rol": "Optimista", "origen": 
    "Mundo Chiikawa", 
    "imagen": "./imagenes/hachiware.png", 
    "descripcion": "Un amigo alegre que siempre ayuda a los demás." },
  { 
    "id": "3", 
    "nombre": "Usagi", 
    "rol": "Aventurero", 
    "origen": "Mundo Chiikawa", 
    "imagen": "./imagenes/usagi.png", 
    "descripcion": "Le encanta divertirse y gritar ¡Yaha!" 
  },
  { 
    "id": "4", 
    "nombre": "Momonga", 
    "rol": "Travieso", 
    "origen": "Mundo Chiikawa", 
    "imagen": "./imagenes/momonga.png", 
    "descripcion": "Le gusta llamar la atención y parecer adorable." },
  { 
    "id": "5", 
    "nombre": "Kurimanju", "rol": 
    "Tranquilo", "origen": "Mundo Chiikawa", 
    "imagen": "./imagenes/kurimanju.png", 
    "descripcion": "Disfruta la comida, las bebidas y los momentos relajados." },
  { "id": "6", 
    "nombre": "Rakko", 
    "rol": "Valiente", 
    "origen": "Mundo Chiikawa", 
    "imagen": "./imagenes/rakko.png", 
    "descripcion": "Es un cazador habilidoso que cuida de sus amigos." }
];
const personajesGuardados = localStorage.getItem(clave);
let personajes = personajesGuardados ? JSON.parse(personajesGuardados) : ejemplos;
let seleccionado = "";
const $ = id => document.getElementById(id);
function normalizar(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function escapar(texto) {
  return String(texto || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function filtrar(texto) {
  const resultados = [];
  let i = 0;
  while (i < personajes.length && resultados.length === 0) {
    if (normalizar(personajes[i].nombre + " " + personajes[i].rol).includes(texto)) resultados.push(personajes[i]);
    i++;
  }
  while (i < personajes.length) {
    if (normalizar(personajes[i].nombre + " " + personajes[i].rol).includes(texto)) resultados.push(personajes[i]);
    i++;
  }
  return resultados;
}
function fotoHTML(p) {
  return `<div class="foto"><span class="inicial">${escapar(p.nombre.charAt(0))}</span>${p.imagen ? `<img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}">` : ""}</div>`;
}
function comprobarImagen(elemento) {
  const img = elemento.querySelector("img");
  if (img) img.addEventListener("error", () => img.remove());
}
function cerrarModales() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("is-active"));
}
function abrirDetalle(id) {
  const p = personajes.find(p => p.id === id);
  if (!p) return;
  seleccionado = id;
  $("detalle").innerHTML = `${fotoHTML(p)}<div class="has-text-centered">
    <h2 class="title is-3">${escapar(p.nombre)}</h2>
    <p class="dato-personaje"><strong>Rol:</strong> ${escapar(p.rol)}</p>
    <p class="dato-personaje"><strong>Origen:</strong> ${escapar(p.origen || "Desconocido")}</p>
    <p class="mt-3">${escapar(p.descripcion || "Un amigo especial.")}</p></div>`;
  comprobarImagen($("detalle"));
  cerrarModales();
  $("modalDetalle").classList.add("is-active");
}
function renderizarGrid() {
  const texto = normalizar($("busqueda").value.trim());
  const resultados = filtrar(texto);
  $("grid").innerHTML = "";
  $("contador").textContent = `${resultados.length} personaje(s) encontrado(s)`;
  resultados.forEach(p => {
    const columna = document.createElement("div");
    columna.className = "column is-one-third-desktop is-half-tablet";
    columna.innerHTML = `<div class="card tarjeta">${fotoHTML(p)}
      <div class="card-content"><h3 class="title is-4">${escapar(p.nombre)}</h3>
      <span class="tag mb-4">${escapar(p.rol)}</span><br>
      <button class="button boton-azul ver-detalle" type="button">Ver detalles ♡</button></div></div>`;
    columna.querySelector(".ver-detalle").addEventListener("click", () => abrirDetalle(p.id));
    comprobarImagen(columna);
    $("grid").appendChild(columna);
  });
  $("vacio").classList.toggle("is-hidden", resultados.length > 0);
  $("limpiar").classList.toggle("is-hidden", !texto);
  $("mensajeVacio").textContent = personajes.length === 0
    ? "Tu colección está vacía." : "Sin resultados. Prueba otra búsqueda ♡";
}

function guardarPersonajes(lista, mensaje) {
  localStorage.setItem(clave, JSON.stringify(lista));
  personajes = lista;
  $("aviso").textContent = mensaje;
  $("aviso").classList.remove("is-hidden");
  renderizarGrid();
}
function abrirFormulario(id = "") {
  $("formPersonaje").reset();
  $("idPersonaje").value = id;
  const p = personajes.find(p => p.id === id);
  $("tituloFormulario").textContent = p ? "Editar amigo ♡" : "Agregar amigo ♡";
  if (p) ["nombre", "rol", "origen", "imagen", "descripcion"].forEach(c => $(c).value = p[c] || "");
  cerrarModales();
  $("modalFormulario").classList.add("is-active");
}
$("formPersonaje").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("idPersonaje").value;
  const nombre = $("nombre").value.trim();
  const rol = $("rol").value.trim();
  if (!nombre || !rol) return alert("Escribe el nombre y el rol.");
  const anterior = personajes.find(p => p.id === id);
  const personaje = {
    id: id || Date.now().toString(), nombre, rol,
    origen: $("origen").value.trim(), imagen: $("imagen").value.trim(),
    descripcion: $("descripcion").value.trim(),
    fechaCreacion: anterior ? anterior.fechaCreacion : new Date().toISOString()
  };
  const lista = id ? personajes.map(p => p.id === id ? personaje : p) : [...personajes, personaje];
  guardarPersonajes(lista, id ? "Personaje modificado ♡" : "Personaje agregado ♡");
  cerrarModales();
  if (id) abrirDetalle(id);
});
$("editar").addEventListener("click", () => abrirFormulario(seleccionado));
$("eliminar").addEventListener("click", () => {
  const p = personajes.find(p => p.id === seleccionado);
  if (p && confirm(`¿Eliminar a ${p.nombre}?`)) {
    guardarPersonajes(personajes.filter(p => p.id !== seleccionado), "Personaje eliminado.");
    cerrarModales();
  }
});
$("nuevo").addEventListener("click", () => abrirFormulario());
$("busqueda").addEventListener("input", renderizarGrid);
$("limpiar").addEventListener("click", () => { $("busqueda").value = ""; renderizarGrid(); });
document.querySelectorAll(".cerrar-modal").forEach(b => b.addEventListener("click", cerrarModales));
renderizarGrid();
