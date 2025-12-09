// ==UserScript==
// @name         Generador de Plantillas con Panel de Botones 3.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Panel flotante con botones para abrir/cerrar generador de plantillas y copiar resultados automáticamente.
// @match        https://amx-peru.fs.ocs.oraclecloud.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🔍 Detección DOM directa
    const detectarVistaActividad = () => {
        const contieneDetallesDOM = !!document.querySelector('.page-header-title[title="Detalles de actividad"]');
        const contieneDatosDOM = !!document.querySelector('.section-dots[title="Datos de la actividad"]');
        return contieneDetallesDOM || contieneDatosDOM;
    };

    // 📋 Extrae campos clave del texto
    const extraerCampos = (texto) => {
        const buscar = (regex) => {
            const match = texto.match(regex);
            return match ? match[1].trim() : "Ingresar";
        };
        return {
            sot: buscar(/SOT\s*[:]\s*(\d+)/i),
            cliente: buscar(/Cliente[:]\s*([A-ZÁÉÍÓÚÑ\s]+)/i),
            telefono: buscar(/Tel[eé]fono\s*[:]\s*(\d+)/i),
            tecnico: buscar(/Detalles de actividad\s*\.\s*([A-ZÁÉÍÓÚÑ\s]+),/i),
            estado: buscar(/Estado\s*[:]\s*([A-ZÁÉÍÓÚÑ]+)/i),
            direccion: buscar(/Dirección\s*[:]\s*(.+)/i)
        };
    };

    // 📦 Crear panel flotante de botones
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.zIndex = '9999';
    panel.style.background = '#222';
    panel.style.border = '1px solid #555';
    panel.style.borderRadius = '8px';
    panel.style.padding = '10px';
    panel.style.fontFamily = 'sans-serif';
    panel.style.color = '#fff';

    // Estado del panel de plantillas
    let panelPlantillasVisible = false;
    let camposExtraidos = {};

    // 📝 Botón abrir/cerrar generador
    const togglePlantillasBtn = document.createElement('button');
    togglePlantillasBtn.textContent = '📝 Abrir Plantillas';
    togglePlantillasBtn.style.marginRight = '5px';
    togglePlantillasBtn.onclick = () => {
        panelPlantillasVisible = !panelPlantillasVisible;
        if (panelPlantillasVisible) {
            const textoExtraido = document.body.innerText;
            camposExtraidos = extraerCampos(textoExtraido);
            crearPanelPlantillas(camposExtraidos);
            togglePlantillasBtn.textContent = '❌ Cerrar Plantillas';
        } else {
            const p = document.getElementById("panelPlantillas");
            if (p) p.remove();
            togglePlantillasBtn.textContent = '📝 Abrir Plantillas';
        }
    };

    // 📋 Botón copiar plantilla
    const copiarBtn = document.createElement('button');
    copiarBtn.textContent = '📋 Copiar Plantilla';
    copiarBtn.style.marginRight = '5px';
    copiarBtn.onclick = () => {
        const contenido = document.getElementById("resultado")?.innerText || "";
        if (contenido) {
            navigator.clipboard.writeText(contenido).then(() => {
                alert("Plantilla copiada al portapapeles ✅");
            });
        } else {
            alert("No hay plantilla generada todavía ⚠️");
        }
    };

    // 🔄 Botón regenerar
    const regenerarBtn = document.createElement('button');
    regenerarBtn.textContent = '🔄 Regenerar';
    regenerarBtn.onclick = () => {
        const textoExtraido = document.body.innerText;
        camposExtraidos = extraerCampos(textoExtraido);
        crearPanelPlantillas(camposExtraidos);
    };

    panel.appendChild(togglePlantillasBtn);
    panel.appendChild(copiarBtn);
    panel.appendChild(regenerarBtn);
    document.body.appendChild(panel);

    // 📦 Panel de plantillas
    const crearPanelPlantillas = (campos) => {
        if (document.getElementById("panelPlantillas")) {
            document.getElementById("panelPlantillas").remove();
        }

        const panel = document.createElement("div");
        panel.id = "panelPlantillas";
        panel.style.position = "fixed";
        panel.style.top = "80px";
        panel.style.right = "20px";
        panel.style.width = "350px";
        panel.style.background = "#fff";
        panel.style.border = "2px solid #333";
        panel.style.padding = "10px";
        panel.style.zIndex = "9999";
        panel.style.fontSize = "12px";
        panel.style.maxHeight = "80vh";
        panel.style.overflowY = "auto";

        panel.innerHTML = `
          <h3 style="margin-top:0;">Generador de Plantillas</h3>
          <label>Categoría:</label>
          <select id="categoria">
            <option value="">Seleccione...</option>
            <option value="seguimiento">Seguimiento</option>
            <option value="rechazo">Rechazo</option>
          </select>
          <div id="submenu"></div>
          <button id="btnGenerar">Generar Plantilla</button>
          <pre id="resultado" style="white-space:pre-wrap;background:#f4f4f4;padding:5px;"></pre>
        `;

        document.body.appendChild(panel);

        document.getElementById("categoria").addEventListener("change", (e) => {
            generarSubmenu(e.target.value);
        });

        document.getElementById("btnGenerar").addEventListener("click", () => {
            generarPlantilla(campos);
        });
    };

    // 🔽 Submenús dinámicos
    const generarSubmenu = (categoria) => {
        const submenu = document.getElementById("submenu");
        submenu.innerHTML = "";

        if (categoria === "seguimiento") {
            submenu.innerHTML = `
              <label>Tipo Seguimiento:</label>
              <select id="tipoSeguimiento">
                <option value="confirma">Confirma visita</option>
                <option value="adelanto">Adelanto visita</option>
              </select>
            `;
        }

        if (categoria === "rechazo") {
            submenu.innerHTML = `
              <label>Tipo Rechazo:</label>
              <select id="tipoRechazo">
                <option value="cliente">Cliente no desea servicio</option>
                <option value="duplicidad">Duplicidad</option>
              </select>
            `;
        }
    };

    // 🧾 Plantilla generada
    const generarPlantilla = (campos) => {
        const categoria = document.getElementById("categoria").value;
        const tipoSeguimiento = document.getElementById("tipoSeguimiento")?.value || "";
        const tipoRechazo = document.getElementById("tipoRechazo")?.value || "";

        let plantilla = "";

        if (categoria === "seguimiento" && tipoSeguimiento === "confirma") {
            plantilla = `MESA MULTISKILL HITSS - CONFIRMA VISITA
SOT: ${campos.sot}
DÍA Y FRANJA: Ingresar
CLIENTE: ${campos.cliente}
NUMERO: ${campos.telefono}
CONTRATA: Ingresar
ID DE LLAMADA: Ingresar
REALIZADO POR: Jose Tirado`;
        }

        if (categoria === "rechazo" && tipoRechazo === "cliente") {
            plantilla = `MESA MULTISKILL HITSS - RECHAZO EN MESA/CAMPO
SOT: ${campos.sot}
CLIENTE: ${campos.cliente}
NUMERO: ${campos.telefono}
MOTIVO: CLIENTE NO DESEA SERVICIO
SUBMOTIVO: Ingresar
ID DE LLAMADA: Ingresar
REALIZADO POR: Jose Tirado`;
        }

        document.getElementById("resultado").innerText = plantilla || "⚠️ Complete los campos faltantes.";
    };

    // 🚀 Activación
    window.addEventListener('load', () => {
        if (detectarVistaActividad()) {
            console.log("✅ Vista de actividad detectada.");
        }
    });
})();
