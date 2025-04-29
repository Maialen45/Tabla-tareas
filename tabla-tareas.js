let tareas = [];
class Tarea {
    constructor(fecha, texto, importancia) {
        console.log(fecha.valueOf());
        if (!fecha.valueOf()) {
            fecha = new Date();
        }
        this.fecha = fecha;
        this.texto = texto;
        this.importancia = importancia;
    }

    creaFila(indice) {
        let filaTarea = document.createElement("tr");

        filaTarea.innerHTML = `
            <td scope="row" class="tabla-fecha">${this.fecha.toLocaleString()}</td>
            <td class="tabla-tarea">${this.texto}</td>
            <td class="celdaBotonBorrar" id='botonBorrar'></td>
            <td class="celdaBotonCheck" id='botonCheck'></td>
            <td class="botones-accion-mobile" style="display: none;">
                <i id= 'borrar' class="fas fa-trash-alt icono-borrar" title="Borrar"></i>
                <i id= 'hecho' class="fas fa-check icono-hecho" title="Hecho"></i>
            </td>
        `;

        // Etiquetas para móvil (sin "Borrar" y "Hecho")
        const celdas = filaTarea.querySelectorAll(
            "td:not(.botones-accion-mobile)"
        );
        const encabezados = ["Fecha", "Tarea", "", ""]; // Vacías para las celdas de botones
        celdas.forEach((celda, indice) => {
            if (indice < 2) {
                // Solo añadir data-label a Fecha y Tarea
                celda.setAttribute("data-label", encabezados[indice]);
            }
        });

        // Botones para desktop (como antes)
        let itemBoton = document.createElement("i");
        let checkBoton = document.createElement("i");
        itemBoton.title = "Borrar";
        itemBoton.className = "fas fa-trash-alt icono-borrar";
        checkBoton.title = "Hecho";
        checkBoton.className = "fas fa-check icono-hecho";

        itemBoton.addEventListener("click", () => borrarItem(indice));
        checkBoton.addEventListener("click", () =>
            hechoItem(indice, filaTarea)
        );

        let casillaBoton = filaTarea.querySelector(".celdaBotonBorrar");
        casillaBoton.appendChild(itemBoton);

        let casillaCheck = filaTarea.querySelector(".celdaBotonCheck");
        casillaCheck.appendChild(checkBoton);

        // Botones para móvil
        let mobileBtns = filaTarea.querySelector(".botones-accion-mobile");
        let trashMobile = mobileBtns.querySelector(".icono-borrar");
        let checkMobile = mobileBtns.querySelector(".icono-hecho");

        trashMobile.addEventListener("click", () => borrarItem(indice));
        checkMobile.addEventListener("click", () =>
            hechoItem(indice, filaTarea)
        );

        filaTarea.setAttribute("importancia", this.importancia);
        return filaTarea;
    }
}

function hechoItem(indice, fila) {
    const mensaje = `¿Quieres marcar como realizada la tarea ${
        tareas[indice].texto
    } de la fecha ${tareas[indice].fecha.toLocaleString()}?`;
    mensajeConfirmación(mensaje).then((respuesta) => {
        if (respuesta) {
            fila.setAttribute("hecho", "hecho");
            // renderizarListado(); Si renderizo la tabla no se ven los cambios porque vuelve a poner la tabla original
            toast("Has completado la tarea", "tostadaHecho");
        }
    });
}

const borrarItem = function (indice) {
    console.log("borro" + indice);
    const mensaje = `¿Quieres eliminar la tarea ${
        tareas[indice].texto
    } de la fecha ${tareas[indice].fecha.toLocaleString()}?`;
    mensajeConfirmación(mensaje).then((respuesta) => {
        if (respuesta) {
            tareas.splice(indice, 1);
            renderizarListado();
            toast("Has eliminado la tarea", "tostadaBorrar");
        }
    });
};

const toast = function (mensaje, nombreClase) {
    let tostada = document.createElement("div");
    tostada.className = nombreClase;
    tostada.textContent = mensaje;
    document.body.appendChild(tostada);

    void tostada.offsetWidth;
    tostada.classList.add("mostrar"); //Añade otro nombre a la clase a parte del que ya tiene

    setTimeout(() => {
        tostada.classList.remove("mostrar"); // Opcional: puede desvanecerse
        setTimeout(() => {
            document.body.removeChild(tostada); // Finalmente eliminamos el div
        }, 500); // Esperamos que termine la transición
    }, 3000);
};

const mensajeConfirmación = function (mensaje) {
    return new Promise((resolve) => {
        let confirmacion = document.createElement("div");
        confirmacion.className = "confirmacion";
        confirmacion.innerHTML = `<p>${mensaje}</p>
            <button id="botonSi">Aceptar</button><button id="botonNo">Rechazar</button>
        `;
        document.body.appendChild(confirmacion);

        const botonSi = document.getElementById("botonSi");
        //Si utilizo clases en lugar de ids, puedo escribir:
        //const botonSi = document.querySelector(".botonSi"). Esto selecciona el primer elemento con esa clase que encuentre
        //Lo que no puedo hacer es utilizar getElementbyClassName porque esto devuelve todas las clases con ese nombre, digamos que devuelve un conjunto.
        const botonNo = document.getElementById("botonNo");
        botonSi.onclick = function () {
            confirmacion.remove();
            resolve(true);
        };
        botonNo.onclick = function () {
            confirmacion.remove();
            resolve(false);
        };
    });
};

const renderizarListado = function () {
    let tablaTareas = document.getElementById("tabla_tareas");
    tablaTareas.innerHTML = "";
    tareas.forEach((tarea, indice) => {
        // Creación del botón
        let itemBoton = document.createElement("button");
        itemBoton.innerText = "Borrar";
        itemBoton.addEventListener("click", () => borrarItem(indice));

        let filaTarea = tarea.creaFila(indice);

        console.log(filaTarea);

        tablaTareas.appendChild(filaTarea);
    });
};

const aniadirTarea = function () {
    let input_tarea = document.getElementById("tarea_nueva");
    let input_momento = document.getElementById("momento");
    let input_importancia = document.getElementById("importancia");

    const tareaNueva = new Tarea(
        new Date(input_momento.value),
        input_tarea.value,
        input_importancia.value
    );

    console.log(tareaNueva);
    if (input_tarea.value === "") {
        mensajeAlerta("La tarea no puede estar vacía");
    } else {
        tareas.unshift(tareaNueva);
        console.log(tareas);
        renderizarListado();

        let claseToast = "tostadaNuevaTarea";
        if (input_importancia.value == "baja") {
            claseToast += "1";
        } else if (input_importancia.value == "media") {
            claseToast += "2";
        } else if (input_importancia.value == "alta") {
            claseToast += "3";
        }

        input_tarea.value = "";
        input_momento.value = "";
        input_importancia.value = "";

        toast("Has añadido una tarea nueva", claseToast);
    }
};

//Aquí no necesito la promesa porque no tiene que esperar una respuesta. La respuesta siempre va a ser aceptar
const mensajeAlerta = function (mensaje) {
    let alerta = document.createElement("div");
    alerta.className = "alerta";
    alerta.innerHTML = `<p>${mensaje}</p>
            <button id="botonAlertaSi">Aceptar</button>
        `;
    document.body.appendChild(alerta);

    const botonAlertaSi = document.getElementById("botonAlertaSi");

    botonAlertaSi.onclick = function () {
        alerta.remove();
    };
};

document
    .getElementById("aniadir_tarea")
    .addEventListener("click", aniadirTarea);

function actualizarVistaBotones() {
    const esMovil = window.innerWidth <= 480;
    document.querySelectorAll(".botones-accion-mobile").forEach((el) => {
        el.style.display = esMovil ? "flex" : "none";
    });
    document
        .querySelectorAll(".celdaBotonBorrar, .celdaBotonCheck")
        .forEach((el) => {
            el.style.display = esMovil ? "none" : "";
        });
}

// Ejecutar al cargar y al cambiar el tamaño de la ventana
// window.addEventListener("load", actualizarVistaBotones);
window.addEventListener("resize", actualizarVistaBotones);
