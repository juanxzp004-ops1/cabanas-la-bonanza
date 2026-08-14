// ===== GALERÍA DE FOTOS =====

document.addEventListener("DOMContentLoaded", function () {

    const imagenesGaleria = document.querySelectorAll(".galeria img");

    imagenesGaleria.forEach(function (imagen) {

        imagen.addEventListener("click", function () {

            // Crear visor
            const visor = document.createElement("div");
            visor.className = "visor";

            // Contenido del visor
            visor.innerHTML = `
                <button class="cerrar">✕</button>
                <img src="${imagen.src}" alt="${imagen.alt}">
            `;

            // Mostrar visor
            document.body.appendChild(visor);

            // Cerrar al hacer clic en X
            const botonCerrar = visor.querySelector(".cerrar");

            botonCerrar.addEventListener("click", function () {
                visor.remove();
            });

            // Cerrar al hacer clic fuera de la imagen
            visor.addEventListener("click", function (evento) {
                if (evento.target === visor) {
                    visor.remove();
                }
            });

            // Cerrar con la tecla ESC
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
/* ===== VISOR DE GALERÍA (injected CSS) ===== */
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
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();
// ===== FORMULARIO DE RESERVAS =====

const formulario = document.querySelector("#reservas form");

if (formulario) {

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.querySelector("#nombre").value;
        const telefono = document.querySelector("#telefono").value;
        const correo = document.querySelector("#correo").value;
        const llegada = document.querySelector("#fecha").value;
        const salida = document.querySelector("#salida").value;
        const personas = document.querySelector("#personas").value;
        const mensaje = document.querySelector("#mensaje").value;

        const texto = `Hola, quiero realizar una reserva en Cabañas La Bonanza.

Nombre: ${nombre}
Teléfono: ${telefono}
Correo: ${correo}
Fecha de llegada: ${llegada}
Fecha de salida: ${salida}
Número de personas: ${personas}
Mensaje: ${mensaje}`;

        const whatsapp = "https://wa.me/573233925309?text=" + encodeURIComponent(texto);

        window.open(whatsapp, "_blank");

        formulario.reset();
    });
}
