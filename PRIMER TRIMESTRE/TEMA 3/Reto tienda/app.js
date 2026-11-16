// =====================================================================
// EJERCICIOS · Tienda DAW con carrito
// Lo que ya funciona: el catálogo. Lo que tienes que programar: el carrito.
// Busca los comentarios TODO (ejercicios 1 a 4).
// =====================================================================

// ---------------------------------------------------------------------
// DADO: la clase Producto y el catálogo (igual que en el ejemplo de clase)
// ---------------------------------------------------------------------
class Producto {
  constructor(id, nombre, precio, stock, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;      // precio SIN IVA
    this.stock = stock;        // unidades disponibles en la tienda
    this.icono = icono;
  }
  conIVA() {
    return this.precio * 1.21;
  }
  html() {
    return "<div class='producto'>" +
      "<span class='icono'>" + this.icono + "</span>" +
      "<h3>" + this.nombre + "</h3>" +
      "<span class='precio'>" + this.conIVA().toFixed(2) + " €</span>" +
      "<span class='stock'>Quedan " + this.stock + " unidades</span>" +
      "<button onclick='comprar(" + this.id + ")'>Añadir al carrito</button>" +
      "</div>";
  }
}

const productos = [
  new Producto(1, "Ratón inalámbrico", 19.90, 5, "🖱️"),
  new Producto(2, "Teclado mecánico", 49.90, 3, "⌨️"),
  new Producto(3, "Auriculares", 29.90, 4, "🎧"),
  new Producto(4, "Memoria USB 64 GB", 9.90, 10, "💾"),
  new Producto(5, "Webcam HD", 34.90, 2, "📷"),
  new Producto(6, "Alfombrilla XL", 12.50, 6, "🟩")
];

function pintarCatalogo() {
  let html = "";
  for (let i = 0; i < productos.length; i++) {
    html += productos[i].html();
  }
  document.getElementById("catalogo").innerHTML = html;
}

function buscarProducto(id) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }
  return null;
}

// Muestra un aviso que se borra solo a los 3 segundos
function aviso(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 3000);
}

// ---------------------------------------------------------------------
// TODO EJERCICIO 1 · La clase LineaCarrito
// Una línea del carrito guarda UN producto y CUÁNTAS unidades se compran.
//  - constructor(producto, cantidad): la cantidad vale 1 si no se indica
//  - subtotal(): precio con IVA del producto × cantidad
//  - html(): devuelve el HTML de la línea (mira la estructura en la diapositiva
//    y las clases .linea, .icono, .nombre, .cantidad y .subtotal en estilos.css).
//    El botón ✕ debe llamar a quitar(id del producto).
// ---------------------------------------------------------------------
// >>> INICIO EJERCICIO 1
// EXPLICACIÓN: Esta clase sirve para agrupar un producto con la cantidad que llevas
// (por ejemplo: 2 ratones) y así no repetir filas iguales en el carrito.
class LineaCarrito {
  constructor(producto, cantidad) {
    // Guardamos el objeto producto dentro de la línea
    this.producto = producto;
    // Si no nos pasan ninguna cantidad al crearla, ponemos 1 por defecto
    if (cantidad === undefined) {
      this.cantidad = 1;
    } else {
      this.cantidad = cantidad;
    }
  }
  subtotal() {
    // Calcula cuánto cuesta esta fila: precio del producto con IVA multiplicado por las unidades
    return this.producto.conIVA() * this.cantidad;
  }
  html() {
    // Crea el trozo de código HTML que se va a ver en pantalla para esta fila del carrito
    // .toFixed(2) sirve para que el precio salga siempre con 2 decimales (ej: 48.16)
    // En el botón pasamos el id del producto a quitar() para saber cuál borrar al hacer clic
    return "<div class='linea'>" +
      "<span class='icono'>" + this.producto.icono + "</span>" +
      "<span class='nombre'>" + this.producto.nombre + "</span>" +
      "<span class='cantidad'>x" + this.cantidad + "</span>" +
      "<span class='subtotal'>" + this.subtotal().toFixed(2) + " €</span>" +
      "<button onclick='quitar(" + this.producto.id + ")'>✕</button>" +
      "</div>";
  }
}
// <<< FIN EJERCICIO 1

// ---------------------------------------------------------------------
// El objeto carrito
// ---------------------------------------------------------------------
const carrito = {
  lineas: [],
  descuento: 0,      // 0.10 significará un 10 % (ejercicio 4)

  // TODO EJERCICIO 2 · buscarLinea(id): la línea de ese producto, o null
  // >>> INICIO EJERCICIO 2 (buscarLinea)
  // EXPLICACIÓN: Mira si ya tenemos ese producto metido en el carrito.
  buscarLinea(id) {
    // Recorremos todas las líneas que hay ahora mismo en el carrito una por una
    for (let i = 0; i < this.lineas.length; i++) {
      // Si el id del producto de esa línea coincide con el que buscamos, devolvemos la línea entera
      if (this.lineas[i].producto.id === id) {
        return this.lineas[i];
      }
    }
    // Si termina el bucle y no lo encuentra, devuelve null (nada)
    return null;
  },
  // <<< FIN EJERCICIO 2 (buscarLinea)

  // TODO EJERCICIO 2 · agregar(producto)
  // Ahora mismo crea una línea nueva cada vez (como en el ejemplo).
  // Cámbialo: si el producto ya está en el carrito, suma 1 a su cantidad.
  // No se puede pasar del stock del producto: en ese caso devuelve false.
  // Si se ha podido añadir, devuelve true.
  // >>> INICIO EJERCICIO 2 (agregar)
  // EXPLICACIÓN: Añade 1 unidad al carrito comprobando antes si ya estaba y si queda stock.
  agregar(producto) {
    // Primero buscamos si ese producto ya tiene una línea en el carrito
    let linea = this.buscarLinea(producto.id);

    if (linea !== null) {
      // CASO A: El producto YA estaba en el carrito
      // Si ya tenemos tantas unidades como stock hay en la tienda, no dejamos añadir más
      if (linea.cantidad >= producto.stock) {
        return false;
      }
      // Si todavía queda stock, simplemente sumamos 1 a la cantidad de esa línea
      linea.cantidad = linea.cantidad + 1;
      return true;
    } else {
      // CASO B: El producto NO estaba en el carrito todavía
      // Comprobamos por si acaso que haya al menos 1 unidad en stock
      if (producto.stock <= 0) {
        return false;
      }
      // Creamos una línea nueva con cantidad 1 y la metemos al array del carrito
      let nuevaLinea = new LineaCarrito(producto, 1);
      this.lineas.push(nuevaLinea);
      return true;
    }
  },
  // <<< FIN EJERCICIO 2 (agregar)

  // TODO EJERCICIO 3 · quitar(id): quita del array la línea de ese producto
  // >>> INICIO EJERCICIO 3 (quitar)
  // EXPLICACIÓN: Elimina del carrito la fila entera cuando pulsas el botón rojo ✕.
  quitar(id) {
    // Recorremos las líneas hasta encontrar la que tiene el id del producto que queremos borrar
    for (let i = 0; i < this.lineas.length; i++) {
      if (this.lineas[i].producto.id === id) {
        // splice(i, 1) borra 1 elemento justo en la posición 'i' del array
        this.lineas.splice(i, 1);
        // Salimos del bucle con break porque ya lo hemos borrado
        break;
      }
    }
  },
  // <<< FIN EJERCICIO 3 (quitar)

  // TODO EJERCICIO 3 · vaciar(): deja el carrito sin líneas y sin descuento
  // >>> INICIO EJERCICIO 3 (vaciar)
  // EXPLICACIÓN: Reinicia el carrito dejándolo totalmente limpio al pulsar "Vaciar carrito".
  vaciar() {
    this.lineas = [];    // Vaciamos la lista de productos
    this.descuento = 0;  // Quitamos cualquier descuento aplicado
  },
  // <<< FIN EJERCICIO 3 (vaciar)

  // TODO EJERCICIO 3 · unidades(): suma de las cantidades de todas las líneas
  // >>> INICIO EJERCICIO 3 (unidades)
  // EXPLICACIÓN: Cuenta cuántos artículos llevas en total sumando las cantidades de cada fila.
  unidades() {
    let suma = 0;
    for (let i = 0; i < this.lineas.length; i++) {
      // Vamos sumando la cantidad de cada línea al contador
      suma = suma + this.lineas[i].cantidad;
    }
    return suma;
  },
  // <<< FIN EJERCICIO 3 (unidades)

  // TODO EJERCICIO 3 · total(): suma de los subtotales de todas las líneas
  // >>> INICIO EJERCICIO 3 (total)
  // EXPLICACIÓN: Calcula el precio total de toda la compra antes de aplicar descuentos.
  total() {
    let suma = 0;
    for (let i = 0; i < this.lineas.length; i++) {
      // Vamos sumando el subtotal (precio con IVA × cantidad) de cada fila
      suma = suma + this.lineas[i].subtotal();
    }
    return suma;
  },
  // <<< FIN EJERCICIO 3 (total)

  // TODO EJERCICIO 4 · aplicarCodigo(codigo): si el código es "DAW10"
  // (da igual mayúsculas o espacios), pon descuento a 0.10 y devuelve true.
  // Si no, devuelve false.
  // >>> INICIO EJERCICIO 4a (aplicarCodigo)
  // EXPLICACIÓN: Comprueba si el cupón escrito es válido y activa el 10 % de rebaja.
  aplicarCodigo(codigo) {
    // .trim() quita espacios por delante y por detrás; .toUpperCase() lo pasa todo a mayúsculas
    let codigoLimpio = codigo.trim().toUpperCase();
    if (codigoLimpio === "DAW10") {
      this.descuento = 0.10; // Guardamos un 10 % (0.10)
      return true;           // Avisamos de que el código es válido
    } else {
      return false;          // Avisamos de que el código está mal
    }
  },
  // <<< FIN EJERCICIO 4a (aplicarCodigo)

  // DADO: rebaja y total final, redondeados a céntimos para que las cuentas cuadren
  rebaja() {
    return Number((Number(this.total().toFixed(2)) * this.descuento).toFixed(2));
  },
  totalFinal() {
    return Number(this.total().toFixed(2)) - this.rebaja();
  }
};

// ---------------------------------------------------------------------
// TODO EJERCICIO 3 · pintarCarrito()
//  - En #carrito-lineas: el html() de cada línea, o «Tu carrito está vacío»
//  - En #carrito-resumen: las unidades y el total (mira la diapositiva)
//  - Ejercicio 4: si hay descuento, muestra también el subtotal y la rebaja
// ---------------------------------------------------------------------
// >>> INICIO EJERCICIO 3 (pintarCarrito) y EJERCICIO 4a (descuento)
// EXPLICACIÓN: Dibuja en el HTML de la página todo lo que hay ahora mismo en el carrito.
function pintarCarrito() {
  // Cogemos los dos contenedores del HTML donde vamos a meter el código
  let cajaLineas = document.getElementById("carrito-lineas");
  let cajaResumen = document.getElementById("carrito-resumen");

  if (carrito.lineas.length === 0) {
    // Si no hay ningún producto, ponemos el mensaje de vacío y borramos el resumen
    cajaLineas.innerHTML = "<p class='vacio'>Tu carrito está vacío</p>";
    cajaResumen.innerHTML = "";
  } else {
    // Si hay productos, juntamos el HTML de todas las líneas en una variable y lo pintamos
    let htmlLineas = "";
    for (let i = 0; i < carrito.lineas.length; i++) {
      htmlLineas = htmlLineas + carrito.lineas[i].html();
    }
    cajaLineas.innerHTML = htmlLineas;

    // Preparamos el resumen de abajo empezando por las unidades totales
    let htmlResumen = "<p><span>Unidades</span><span>" + carrito.unidades() + "</span></p>";

    // Parte del ejercicio 4a: si hay descuento activo (> 0), añadimos también el subtotal y lo que se resta
    if (carrito.descuento > 0) {
      htmlResumen = htmlResumen +
        "<p><span>Subtotal</span><span>" + carrito.total().toFixed(2) + " €</span></p>" +
        "<p class='descuento'><span>Descuento DAW10</span><span>-" + carrito.rebaja().toFixed(2) + " €</span></p>";
    }

    // Por último, añadimos la línea con el precio final a pagar
    htmlResumen = htmlResumen +
      "<p class='total'><span>Total</span><span>" + carrito.totalFinal().toFixed(2) + " €</span></p>";

    // Metemos todo el resumen en su caja del HTML
    cajaResumen.innerHTML = htmlResumen;
  }

  // Cada vez que cambia el carrito y lo pintamos, lo guardamos en memoria del navegador
  guardar();
}
// <<< FIN EJERCICIO 3 y EJERCICIO 4a

// ---------------------------------------------------------------------
// TODO EJERCICIO 4 · Guardar y recuperar el carrito en localStorage
// Pista: guarda solo el id y la cantidad de cada línea (y el descuento).
// Al cargar, busca cada producto por su id y vuelve a crear la LineaCarrito.
// ---------------------------------------------------------------------
// >>> INICIO EJERCICIO 4b (guardar y cargar)
// EXPLICACIÓN: Guarda el carrito en el navegador (localStorage) para que no se borre al recargar (F5).
function guardar() {
  // Creamos una lista sencilla solo con el id y la cantidad de cada producto
  // (porque localStorage solo guarda texto y al guardar objetos enteros se pierden sus funciones)
  let listaSimple = [];
  for (let i = 0; i < carrito.lineas.length; i++) {
    let objetoSimple = {
      id: carrito.lineas[i].producto.id,
      cantidad: carrito.lineas[i].cantidad
    };
    listaSimple.push(objetoSimple);
  }

  // Juntamos la lista sencilla y el descuento en un solo objeto
  let datosGuardar = {
    lineas: listaSimple,
    descuento: carrito.descuento
  };

  // JSON.stringify convierte el objeto a texto para poder guardarlo bajo el nombre "carrito"
  localStorage.setItem("carrito", JSON.stringify(datosGuardar));
}

// EXPLICACIÓN: Lee lo que había guardado en el navegador cuando abres o recargas la página.
function cargar() {
  // Pedimos al navegador el texto guardado con el nombre "carrito"
  let textoGuardado = localStorage.getItem("carrito");

  // Si había algo guardado (no es null), lo reconstruimos
  if (textoGuardado !== null) {
    // JSON.parse vuelve a convertir ese texto en un objeto de JavaScript
    let datos = JSON.parse(textoGuardado);
    carrito.descuento = datos.descuento;
    carrito.lineas = [];

    // Recorremos cada elemento guardado, buscamos su Producto real por su id
    // y volvemos a crear su LineaCarrito completa con todas sus funciones
    for (let i = 0; i < datos.lineas.length; i++) {
      let idProducto = datos.lineas[i].id;
      let cantidadProducto = datos.lineas[i].cantidad;
      let producto = buscarProducto(idProducto);

      if (producto !== null) {
        let linea = new LineaCarrito(producto, cantidadProducto);
        carrito.lineas.push(linea);
      }
    }
  }
}
// <<< FIN EJERCICIO 4b

// ---------------------------------------------------------------------
// DADO: los eventos (ya llaman a los métodos que vas a programar)
// ---------------------------------------------------------------------
function comprar(id) {
  const producto = buscarProducto(id);
  if (!carrito.agregar(producto)) {
    aviso("No quedan más unidades de " + producto.nombre);
  }
  pintarCarrito();
}

function quitar(id) {
  carrito.quitar(id);
  pintarCarrito();
}

document.getElementById("vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
});

document.getElementById("aplicar").addEventListener("click", () => {
  const campo = document.getElementById("codigo");
  if (carrito.descuento > 0) {
    aviso("Ya has aplicado un código de descuento");
  } else if (!carrito.aplicarCodigo(campo.value)) {
    aviso("Código no válido");
  } else {
    campo.value = "";
    pintarCarrito();
  }
});

// ---------------------------------------------------------------------
// AL ABRIR LA PÁGINA
// ---------------------------------------------------------------------
pintarCatalogo();
cargar();
pintarCarrito();