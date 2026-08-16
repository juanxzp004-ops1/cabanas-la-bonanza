// ===== GALERÍA DE FOTOS =====

document.addEventListener("DOMContentLoaded", function () {

    const imagenesGaleria = document.querySelectorAll(".galeria img");

    imagenesGaleria.forEach(function (imagen) {

        imagen.addEventListener("click", function () {

            const visor = document.createElement("div");
            visor.className = "visor";

            visor.innerHTML = `
                <button class="cerrar">✕</button>
                <img src="${imagen.src}" alt="${imagen.alt}">
            `;

            document.body.appendChild(visor);

            const botonCerrar = visor.querySelector(".cerrar");

            botonCerrar.addEventListener("click", function () {
                visor.remove();
            });

            visor.addEventListener("click", function (evento) {
                if (evento.target === visor) {
                    visor.remove();
                }
            });

            document.addEventListener("keydown", cerrarConEscape);

            function cerrarConEscape(evento) {
                if (evento.key === "Escape") {
                    visor.remove();
                    document.removeEventListener("keydown", cerrarConEscape);
                }
            }

        });

    });

});


// ===== ESTILOS DEL VISOR =====

(function injectVisorStyles() {

    const css = `
    .visor {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: pointer;
    }

    .visor img {
        max-width: 90%;
        max-height: 85%;
        object-fit: contain;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        cursor: default;
    }

    .visor .cerrar {
        position: absolute;
        top: 20px;
        right: 30px;
        background: white;
        color: #418538;
        border: none;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        font-size: 25px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10000;
    }

    .visor .cerrar:hover {
        background: #418538;
        color: white;
    }
    `;

    const style = document.createElement("style");

    style.type = "text/css";

    style.appendChild(document.createTextNode(css));

    document.head.appendChild(style);

})();


// ===== FORMULARIO DE RESERVAS =====

const formulario = document.querySelector("#reservas form");

const fechaLlegada = document.querySelector("#fecha");
const fechaSalida = document.querySelector("#salida");


// Evitar que la fecha de salida sea anterior a la llegada

if (fechaLlegada && fechaSalida) {

    fechaLlegada.addEventListener("change", function () {

        fechaSalida.min = fechaLlegada.value;

    });

}


// ===== CONFIGURACIÓN GOOGLE SHEETS =====

// IMPORTANTE:
// Aquí debes pegar la URL de tu aplicación web de Google Apps Script.

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmXA57CktXIwNNcm_YAIKUT-08dwY3WI-ySb3aGrU8XzNJLzPf3EvfauW_cZuyGGXO/exec";


// ===== ENVÍO DE RESERVA =====

if (formulario) {

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        // Obtener datos del formulario

        const nombre = document.querySelector("#nombre").value.trim();
        const telefono = document.querySelector("#telefono").value.trim();
        const correo = document.querySelector("#correo").value.trim();
        const llegada = document.querySelector("#fecha").value;
        const salida = document.querySelector("#salida").value;
        const personas = document.querySelector("#personas").value;
        const mensaje = document.querySelector("#mensaje").value.trim();


        // Comprobar datos obligatorios

        if (!nombre || !telefono || !correo || !llegada || !salida || !personas) {

            alert("Por favor completa todos los campos obligatorios.");

            return;

        }


        // Comprobar fechas

        if (salida <= llegada) {

            alert("La fecha de salida debe ser posterior a la fecha de llegada.");

            return;

        }


        // Desactivar botón mientras se envía

        const boton = formulario.querySelector("button[type='submit']");

        const textoOriginal = boton.textContent;

        boton.disabled = true;

        boton.textContent = "Enviando reserva...";


        // Datos que enviaremos a Google Sheets

        const datos = {

            nombre: nombre,

            telefono: telefono,

            correo: correo,

            llegada: llegada,

            salida: salida,

            personas: personas,

            mensaje: mensaje

        };


        try {

            // Enviar a Google Apps Script

            await fetch(GOOGLE_SCRIPT_URL, {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type": "text/plain;charset=utf-8"

                },

                body: JSON.stringify(datos)

            });


            // Crear mensaje para WhatsApp

            const texto = `Hola, quiero realizar una reserva en Cabañas La Bonanza.

Nombre: ${nombre}
Teléfono: ${telefono}
Correo: ${correo}
Fecha de llegada: ${llegada}
Fecha de salida: ${salida}
Número de personas: ${personas}
Mensaje: ${mensaje}`;


            const whatsapp = "https://wa.me/573233925309?text=" + encodeURIComponent(texto);


            // Mostrar confirmación

            alert("¡Solicitud de reserva enviada correctamente! Te redirigiremos a WhatsApp.");


            // Abrir WhatsApp

            window.location.href = whatsapp;


            // Limpiar formulario

            formulario.reset();

            if (fechaSalida) {

                fechaSalida.min = "";

            }


        } catch (error) {

            console.error("Error al enviar la reserva:", error);

            alert("No pudimos enviar la reserva. Por favor inténtalo nuevamente o escríbenos por WhatsApp.");

        }


        // Restaurar botón

        boton.disabled = false;

        boton.textContent = textoOriginal;

    });

}
