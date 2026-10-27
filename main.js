const clave = "chiikawa_coleccion";
const ejemplos = [
  { 
    id: "1", 
    nombre: "Chiikawa", 
    rol: "Tierno", 
    origen: "Mundo Chiikawa", 
    imagen: "./imagenes/chiikawa.png", 
    descripcion: "Es tímido, amable y siempre intenta ser valiente." 
  },
  { 
    id: "2", 
    nombre: "Hachiware", 
    rol: "Optimista", 
    origen: "Mundo Chiikawa", 
    imagen: "./imagenes/hachiware.png", 
    descripcion: "Un amigo alegre que siempre ayuda a los demás." 
  },
  { 
    id: "3", 
    nombre: "Usagi", 
    rol: "Aventurero", 
    origen: "Mundo Chiikawa", 
    imagen: "./imagenes/usagi.png", 
    descripcion: "Le encanta divertirse y gritar ¡Yaha!" 
  },
  { 
    id: "4", 
    nombre: "Momonga", 
    rol: "Travieso", 
    origen: "Mundo Chiikawa", 
    imagen: "./imagenes/momonga.png", 
    descripcion: "Le gusta llamar la atención y parecer adorable." 
  },
  { 
    id: "5", 
    nombre: "Kurimanju", 
    rol: "Tranquilo", 
    origen: "Mundo Chiikawa", 
    imagen: "./imagenes/kurimanju.png", 
    descripcion: "Disfruta la comida, las bebidas y los momentos relajados." 
  },
  { 
    id: "6", 
    nombre: "Rakko", 
    rol: "Valiente", 
    origen: "Mundo Chiikawa", 
    imagen: "./imagenes/rakko.png", 
    descripcion: "Es un cazador habilidoso que cuida de sus amigos."
  }
];

ejemplos.forEach(p => { 
  p.fechaCreacion = "2026-10-01T12:00:00Z"; 
  p.favorito = false; 
});

const $ = id => document.getElementById(id);
let personajes = cargarPersonajes();
let seleccionado = "";
let soloFavoritos = false;

function cargarPersonajes() {
  try {
    //getItem devuelve el valor de la clave especificada en el almacenamiento local del navegador. Si la clave no existe, devuelve null.
    const datos = localStorage.getItem(clave); //Busca una colección guardada en el almacenamiento local del navegador

    if (datos === null) {
      try { 
        //setItem guarda un valor en el almacenamiento local del navegador. En este caso, guarda la colección de personajes de ejemplo en formato JSON.
        localStorage.setItem(clave, JSON.stringify(ejemplos)); 
      } catch (e) 
      {
      }

      return ejemplos;
    }

    //JSON.parse convierte una cadena JSON en un objeto JavaScript. En este caso, convierte la cadena guardada en el almacenamiento local en un array de personajes.
    const lista = JSON.parse(datos);
  
    //Array.isArray verifica si el valor proporcionado es un array. En este caso, verifica si la lista cargada desde el almacenamiento local es un array.
    return Array.isArray(lista) 
    //lista.filter crea un nuevo array con todos los elementos que cumplan la condición especificada. En este caso, filtra los personajes que tengan un id y nombre válidos, y que el rol sea una cadena no vacía.
    ? lista.filter(p => 
      p && typeof p.id === "string" && 
      typeof p.nombre === "string" && 
      p.nombre.trim() && 
      typeof p.rol === "string" && 
      p.rol.trim()) : [];
      //typeof verifica el tipo de una variable. En este caso, se utiliza para asegurarse de que los campos id, nombre y rol sean cadenas de texto.
      //trim() elimina los espacios en blanco al inicio y al final de una cadena. En este caso, se utiliza para asegurarse de que los campos nombre y rol no estén vacíos.
  } catch (e) 
  { return []; 

  }
}

function guardarPersonajes(lista, mensaje) {
  try {
    //JSON.stringify convierte un objeto JavaScript en una cadena JSON. En este caso, convierte la lista de personajes en una cadena para guardarla en el almacenamiento local.
    localStorage.setItem(clave, JSON.stringify(lista));
    personajes = lista;
    //textContent establece el contenido de texto de un elemento HTML. En este caso, se utiliza para mostrar un mensaje de aviso al usuario.
    $("aviso").textContent = mensaje;
    $("aviso").classList.remove("is-hidden");
    //renderizarGrid actualiza la visualización de la cuadrícula de personajes en la página web, mostrando los cambios realizados en la lista de personajes.
    renderizarGrid();
    return true;
  } catch (e) {
    alert("No se pudo guardar. Revisa el espacio disponible en el navegador.");
    return false;
  }
}

function normalizar(texto) {
  //normalize("NFD") descompone los caracteres acentuados en sus componentes básicos, lo que permite eliminar los acentos y otros diacríticos.
  //replace(/[\u0300-\u036f]/g, "") elimina los caracteres diacríticos (acentos, tildes, etc.) de la cadena.
  return String(texto || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();
}

function escapar(texto) {
  return String(texto || "")
  //replace sustituye los caracteres especiales en la cadena por sus entidades HTML correspondientes, evitando problemas de seguridad y visualización en el navegador.
  .replace(
    /[&<>"']/g, 
    c => ({ 
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" 
    })[c]
  );
}

function filtrarPersonajes(texto) {
  //normalizar convierte el texto de búsqueda a minúsculas y elimina acentos para facilitar la comparación con los nombres y roles de los personajes.
  const coincide = p => 
    normalizar(p.nombre + " " + p.rol).includes(texto);

  //resultados es un array que almacenará los personajes que coincidan con el texto de búsqueda.
  const resultados = [];
  let i = 0;

  //El primer bucle while recorre la lista de personajes hasta encontrar el primer personaje que coincida con el texto de búsqueda. Una vez encontrado, se agrega a la lista de resultados y se continúa buscando en el segundo bucle while.
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
  //escapar convierte el primer carácter del nombre del personaje en una cadena segura para HTML, evitando problemas de seguridad y visualización en el navegador.
  return `<div class="foto">
  <span class="inicial">
  ${escapar(p.nombre.charAt(0))} 
  </span>
  ${p.imagen 
    ? `<img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}">` 
    : ""}</div>`;
    //escapar(p.imagen) convierte la URL de la imagen en una cadena segura para HTML, evitando problemas de seguridad y visualización en el navegador.
}

function comprobarImagen(contenedor) {
  //querySelector busca el primer elemento <img> dentro del contenedor proporcionado. Si se encuentra una imagen, se agrega un evento "error" que eliminará la imagen si no se puede cargar correctamente.
  const img = contenedor.querySelector("img");
  if (img) img.addEventListener("error", () => img.remove());
}

function renderizarGrid() {
  const termino = normalizar($("busqueda").value.trim());
  //filtrarPersonajes devuelve un array de personajes que coinciden con el término de búsqueda. Luego, se filtra ese array para incluir solo los personajes favoritos si la variable soloFavoritos es verdadera.
  const resultados = filtrarPersonajes(termino).filter(p => !soloFavoritos || p.favorito);
  //filter crea un nuevo array con todos los elementos que cumplan la condición especificada. En este caso, filtra los personajes que sean favoritos si soloFavoritos es verdadero.
  const totalFavoritos = personajes.filter(p => p.favorito).length;
  //length devuelve el número de elementos en un array. En este caso, se utiliza para contar cuántos personajes son favoritos.
  $("cantidadFavoritos").textContent = totalFavoritos;
  //grid es el contenedor donde se mostrarán las tarjetas de los personajes. Se vacía antes de agregar las nuevas tarjetas.
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
      //querySelector busca el primer elemento con la clase "ver-detalle" dentro de la columna creada. Se agrega un evento "click" que abrirá el detalle del personaje correspondiente al hacer clic en el botón.
    columna.querySelector(".ver-detalle").addEventListener("click", () => abrirDetalle(p.id));
    //querySelector busca el primer elemento con la clase "corazon" dentro de la columna creada. Se agrega un evento "click" que cambiará el estado de favorito del personaje correspondiente al hacer clic en el botón.
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
