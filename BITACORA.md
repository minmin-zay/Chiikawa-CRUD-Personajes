# Bitácora de decisiones · Chiikawa & Friends

**Alumno:** Ana Maritza Arellano Ortiz

**1. ¿Por qué un ID único en vez del nombre?** Cada personaje necesita una identidad que no cambie cuando se edite su nombre. Si se usara el nombre y hubiera dos iguales, sería difícil decidir cuál editar o eliminar. El ID se asigna al crear el personaje; además, por claridad, el formulario no permite nombres duplicados.

**2. ¿Por qué guardar todo en una sola clave de localStorage?** Un arreglo guardado como JSON simplifica agregar, editar, eliminar y recuperar los personajes. Guardarlos en distintas claves podría permitir cambiar uno sin reescribir toda la colección, pero sería más difícil recorrerlos y mantenerlos organizados. Se usa `JSON.stringify` al guardar y `JSON.parse` al cargar.

**3. ¿Por qué buscar en cada tecla?** Da resultados inmediatamente, sin pedir otro clic. Con seis personajes funciona bien y es fácil de entender. Con miles convendría retrasar unos milisegundos la búsqueda para mejorar el rendimiento. Aquí se usa `while` de forma limitada: si no existe coincidencia se detiene cuando se agota el arreglo, evitando un ciclo infinito y permitiendo mostrar «Sin resultados».

**4. ¿Qué pasa si localStorage tiene JSON inválido?** `JSON.parse` puede producir un error. Por eso la carga está dentro de `try/catch`, y el programa muestra una colección vacía en lugar de bloquearse. Como alternativa se podrían recuperar los datos desde un respaldo, pero esta versión no tiene servidor ni copias externas.

**5. ¿Se permiten espacios en blanco o nombres duplicados?** No. `trim()` elimina espacios al principio y final, y se comprueba que el nombre tenga contenido. Los nombres se comparan sin distinguir mayúsculas ni acentos. La alternativa sería permitir nombres iguales, porque las identidades se basan en IDs, pero para esta colección pequeña resulta más claro evitar repeticiones.


**6. ¿Por qué añadir favoritos?** Es una mejora sencilla que permite separar los personajes preferidos de la colección general sin duplicarlos. Cada personaje tiene un campo booleano `favorito`, almacenado junto a los demás datos. Así se mantiene al editar y al recargar la página. Una alternativa sería guardar los IDs favoritos en otra clave, pero aumentaría la complejidad de sincronización al eliminar personajes.
