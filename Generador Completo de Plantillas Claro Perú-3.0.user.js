// ==UserScript==
// @name         Generador Completo de Plantillas Claro Perú
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Generador automático de plantillas con extracción de datos y auto-relleno completo
// @match        https://amx-peru.fs.ocs.oraclecloud.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 📋 Extracción de campos desde el DOM
    const extraerCampos = () => {
        const texto = document.body.innerText;
        const buscar = (regex, def = "") => {
            const match = texto.match(regex);
            return match ? match[1].trim() : def;
        };

        return {
            sot: buscar(/SOT\s*[:]\s*(\d+)/i, ""),
            cliente: buscar(/Cliente[:]\s*([A-ZÁÉÍÓÚÑ\s]+?)(?:\n|Tipo)/i, ""),
            telefono: buscar(/Tel[eé]fono\s*[:]\s*(\d+)/i, ""),
            direccion: buscar(/Dirección\s*[:]\s*(.+?)(?:\n|$)/i, ""),
            distrito: buscar(/(?:Distrito|Ciudad)\s*[:]\s*([A-ZÁÉÍÓÚÑ\s]+)/i, ""),
            franja: buscar(/Intervalo de tiempo\s*[:]\s*(.+?)(?:\n|$)/i, ""),
            slaInicio: buscar(/SLA inicio\s*[:]\s*(\d{2}\/\d{2}\/\d{2,4}\s+\d{2}:\d{2})/i, ""),
            slaFin: buscar(/SLA fin\s*[:]\s*(\d{2}\/\d{2}\/\d{2,4}\s+\d{2}:\d{2})/i, ""),
            codCliente: buscar(/C[oó]digo de Cliente\s*[:]\s*(\d+)/i, ""),
            idAgenda: buscar(/ID Agenda\s*[:]\s*(\d+)/i, ""),
            habilidad: buscar(/Habilidad\s*[:]\s*(.+?)(?:\n|$)/i, ""),
            subTipo: buscar(/Sub Tipo de Orden\s*[:]\s*(.+?)(?:\n|$)/i, "")
        };
    };

    // 🎨 Crear panel flotante de botones
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '10000',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '2px solid #fff',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        fontFamily: 'Arial, sans-serif'
    });

    let panelPlantillasVisible = false;
    let camposExtraidos = {};

    // 📝 Botón toggle plantillas
    const toggleBtn = crearBoton('📋 Abrir Plantillas', '#4CAF50');
    toggleBtn.onclick = () => {
        panelPlantillasVisible = !panelPlantillasVisible;
        if (panelPlantillasVisible) {
            camposExtraidos = extraerCampos();
            crearPanelPlantillas();
            toggleBtn.textContent = '❌ Cerrar';
            toggleBtn.style.background = '#f44336';
        } else {
            document.getElementById("panelPlantillas")?.remove();
            toggleBtn.textContent = '📋 Abrir Plantillas';
            toggleBtn.style.background = '#4CAF50';
        }
    };

    // 📋 Botón copiar
    const copiarBtn = crearBoton('📄 Copiar', '#2196F3');
    copiarBtn.onclick = () => {
        const contenido = document.getElementById("resultado")?.innerText || "";
        if (contenido && contenido !== "⚠️ Seleccione una plantilla") {
            navigator.clipboard.writeText(contenido).then(() => {
                mostrarNotificacion("✅ Copiado al portapapeles");
            });
        } else {
            mostrarNotificacion("⚠️ Genere una plantilla primero");
        }
    };

    // 🔄 Botón regenerar
    const regenerarBtn = crearBoton('🔄 Actualizar', '#FF9800');
    regenerarBtn.onclick = () => {
        camposExtraidos = extraerCampos();
        crearPanelPlantillas();
        mostrarNotificacion("🔄 Datos actualizados");
    };

    panel.append(toggleBtn, copiarBtn, regenerarBtn);
    document.body.appendChild(panel);

    // 🛠️ Función auxiliar para crear botones
    function crearBoton(texto, color) {
        const btn = document.createElement('button');
        btn.textContent = texto;
        Object.assign(btn.style, {
            background: color,
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            margin: '2px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            transition: 'all 0.3s'
        });
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        return btn;
    }

    // 📦 Crear panel principal de plantillas
    function crearPanelPlantillas() {
        document.getElementById("panelPlantillas")?.remove();

        const panel = document.createElement("div");
        panel.id = "panelPlantillas";
        Object.assign(panel.style, {
            position: "fixed",
            top: "80px",
            right: "20px",
            width: "420px",
            maxHeight: "80vh",
            background: "#fff",
            border: "3px solid #667eea",
            borderRadius: "12px",
            padding: "15px",
            zIndex: "9999",
            fontSize: "13px",
            overflowY: "auto",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        });

        panel.innerHTML = `
            <h3 style="margin:0 0 15px 0;color:#667eea;font-size:18px;">🎯 Generador de Plantillas</h3>

            <label style="font-weight:bold;display:block;margin-bottom:5px;">Categoría:</label>
            <select id="categoria" style="width:100%;padding:8px;margin-bottom:10px;border:2px solid #ddd;border-radius:6px;">
                <option value="">-- Seleccione --</option>
                <option value="validacion">✅ Validación</option>
                <option value="seguimiento">📞 Seguimiento</option>
                <option value="rechazo">❌ Rechazo</option>
            </select>

            <div id="submenu"></div>
            <button id="btnGenerar" style="width:100%;padding:10px;background:#667eea;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer;margin-top:10px;">
                ✨ Generar Plantilla
            </button>

            <pre id="resultado" style="white-space:pre-wrap;background:#f8f9fa;padding:10px;margin-top:15px;border:2px solid #ddd;border-radius:6px;font-size:12px;max-height:400px;overflow-y:auto;">⚠️ Seleccione una plantilla</pre>
        `;

        document.body.appendChild(panel);

        document.getElementById("categoria").addEventListener("change", (e) => {
            generarSubmenu(e.target.value);
        });

        document.getElementById("btnGenerar").addEventListener("click", generarPlantilla);
    }

    // 🔽 Generar submenús dinámicos
    function generarSubmenu(categoria) {
        const submenu = document.getElementById("submenu");
        submenu.innerHTML = "";

        if (categoria === "validacion") {
            submenu.innerHTML = `
                <label style="font-weight:bold;display:block;margin-bottom:5px;">Tipo:</label>
                <select id="tipoValidacion" style="width:100%;padding:8px;margin-bottom:10px;border:2px solid #ddd;border-radius:6px;">
                    <option value="instalacion">Instalación</option>
                    <option value="postventa">Post-venta</option>
                    <option value="mantenimiento">Mantenimiento HFC/FTTH</option>
                </select>
            `;
        }

        if (categoria === "seguimiento") {
            submenu.innerHTML = `
                <label style="font-weight:bold;display:block;margin-bottom:5px;">Tipo:</label>
                <select id="tipoSeguimiento" style="width:100%;padding:8px;margin-bottom:10px;border:2px solid #ddd;border-radius:6px;">
                    <option value="confirma">Confirma visita</option>
                    <option value="adelanto">Adelanto visita</option>
                    <option value="mantiene">Mantiene fecha</option>
                    <option value="franja">Habilitación de franjas</option>
                    <option value="fuera">Fuera de TOA</option>
                    <option value="ciclo">Ciclo de llamadas</option>
                </select>
            `;
        }

        if (categoria === "rechazo") {
            submenu.innerHTML = `
                <label style="font-weight:bold;display:block;margin-bottom:5px;">Motivo:</label>
                <select id="tipoRechazo" style="width:100%;padding:8px;margin-bottom:10px;border:2px solid #ddd;border-radius:6px;">
                    <option value="cliente">Cliente no desea servicio</option>
                    <option value="duplicidad">Duplicidad</option>
                    <option value="facilidades">Facilidades técnicas</option>
                    <option value="contacto">Falta de contacto</option>
                    <option value="direccion">Mal ingreso dirección</option>
                    <option value="oferta">Mala oferta</option>
                    <option value="mudanza">Mudanza o viaje</option>
                    <option value="soterror">SOT con errores</option>
                    <option value="fraude">Posible fraude</option>
                </select>

                <label style="font-weight:bold;display:block;margin-bottom:5px;">Ubicación:</label>
                <select id="ubicacionRechazo" style="width:100%;padding:8px;margin-bottom:10px;border:2px solid #ddd;border-radius:6px;">
                    <option value="mesa">Mesa</option>
                    <option value="campo">Campo</option>
                </select>
            `;
        }
    }

    // 🧾 Generar plantilla según selección
    function generarPlantilla() {
        const c = camposExtraidos;
        const categoria = document.getElementById("categoria").value;
        let plantilla = "";

        // ============ VALIDACIONES ============
        if (categoria === "validacion") {
            const tipo = document.getElementById("tipoValidacion").value;

            if (tipo === "instalacion") {
                plantilla = `MESA MULTISKILL HITSS ID LLAMADA: ${c.idAgenda || "[INGRESAR]"} SOT: ${c.sot} VALIDADO POR: ${c.cliente || "[INGRESAR]"} NUMERO WSP: ${c.telefono || "[INGRESAR]"} ADP: Jose Tirado`;
            }
            else if (tipo === "postventa") {
                plantilla = `MESA MULTISKILL HITSS ID LLAMADA: ${c.idAgenda || "[INGRESAR]"} SOT: ${c.sot} VALIDADO POR: ${c.cliente || "[INGRESAR]"} NUMERO WSP: ${c.telefono || "[INGRESAR]"} ADP: Jose Tirado`;
            }
            else if (tipo === "mantenimiento") {
                plantilla = `MESA MULTISKILL HITSS ID LLAMADA: ${c.idAgenda || "[INGRESAR]"} SOT: ${c.sot} COD. SOLUCIÓN PRINCIPAL: [INGRESAR] VALIDADO POR: ${c.cliente || "[INGRESAR]"} NUMERO WSP: ${c.telefono || "[INGRESAR]"} ADP: Jose Tirado`;
            }
        }

        // ============ SEGUIMIENTOS ============
        if (categoria === "seguimiento") {
            const tipo = document.getElementById("tipoSeguimiento").value;

            if (tipo === "confirma") {
                plantilla = `MESA MULTISKILL HITSS - CONFIRMA VISITA
SOT: ${c.sot}
DÍA Y FRANJA: ${c.franja || "[INGRESAR]"}
CLIENTE: ${c.cliente}
NUMERO: ${c.telefono}
CONTRATA: [INGRESAR]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado`;
            }
            else if (tipo === "adelanto") {
                plantilla = `MESA MULTISKILL HITSS - ADELANTA VISITA
SOT: ${c.sot}
DÍA Y FRANJA: ${c.franja || "[INGRESAR]"}
CLIENTE: ${c.cliente}
NUMERO: ${c.telefono}
CONTRATA: [INGRESAR]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "mantiene") {
                plantilla = `MESA MULTISKILL HITSS - MANTIENE FECHA DE VISITA
SOT: ${c.sot}
DÍA Y FRANJA: ${c.franja || "[INGRESAR]"}
CLIENTE: ${c.cliente}
NUMERO: ${c.telefono}
CONTRATA: [INGRESAR]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado`;
            }
            else if (tipo === "franja") {
                plantilla = `MESA MULTISKILL HITSS - FORMATO PARA HABILITAR FRANJA 📥
SOT: ${c.sot}
🪚 PLANO: [INGRESAR]
📅 FECHA Y FRANJA: ${c.franja || "[INGRESAR]"}
📧 Motivo: SIN FRANJAS DISPONIBLES
🚨‍ Sup acargo: [INGRESAR]`;
            }
            else if (tipo === "fuera") {
                plantilla = `*FUERA DE TOA*
📥 SOT: ${c.sot}
⚙️ SUB TIPO: ${c.subTipo || "[INGRESAR]"}
🏡 DIRECCIÓN: ${c.direccion}
📍 DISTRITO: ${c.distrito || "[INGRESAR]"}
⚒️ SERVICIO: [INGRESAR]
🪚 PLANO: [INGRESAR]
👨‍💻 CLIENTE: ${c.cliente}
🔣 COD CLIENTE: ${c.codCliente || "[INGRESAR]"}
📱 CELULAR DEL CLIENTE: ${c.telefono}
📅 FECHA Y FRANJA: ${c.franja || "[INGRESAR]"}
✍️ REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "ciclo") {
                plantilla = `MESA MULTISKILL HITSS - CICLO DE LLAMADAS
CICLO DE LLAMADA NRO: 1
CANTIDAD DE LLAMADAS: 4
NUMERO: ${c.telefono}
MOTIVO: FALTA DE CONTACTO
SUB-MOTIVO: [Escoger: Buzón de voz / No contesta / Número no existe / Apagado / Corta llamada]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
        }

        // ============ RECHAZOS ============
        if (categoria === "rechazo") {
            const tipo = document.getElementById("tipoRechazo").value;
            const ubicacion = document.getElementById("ubicacionRechazo").value;
            const ubicTxt = ubicacion === "mesa" ? "MESA" : "CAMPO";

            if (tipo === "cliente") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZO EN ${ubicTxt}
PERSONA QUE CONTESTA: [INGRESAR]
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: CLIENTE NO DESEA EL SERVICIO${ubicacion === "mesa" ? " - MESA" : ""}
SUBMOTIVO DE RECHAZO: (Escoger 1 opción)
*Cliente ya tiene servicio de otro operador
*Titular no ha contratado ningun servicio a Claro
*Demora en la atención de la solicitud, ya no desea esperar.
*Cliente no desea servicio por Motivos personales.
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "duplicidad") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: RECHAZADO POR DUPLICIDAD
PERSONA QUE CONTESTA: [NO APLICA]
NUMERO DE CONTACTO: [NO APLICA]
SUBMOTIVO DE RECHAZO: se atendió con otra SOT
SE PROCEDE AL RECHAZO DE LA SOLICITUD POR DUPLICIDAD DE SOT, SE ATENDIÓ CON LA SOT: [VALIDAR CON DNI O EN HISTORIAL DEL CLIENTE]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "facilidades") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
PERSONA QUE CONTESTA: [INGRESAR]
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: FACILIDADES TÉCNICAS DEL CLIENTE
SUBMOTIVO DE RECHAZO: (Escoger 1 opción)
* Dueño de Casa y/o Edificio no autoriza la instalacion. Al momento de la instalación no hay acceso al techo
* Al momento de la instalación se valida ducterias obstruidas
* Cliente cuenta con sot de suspensión y/o baja
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "contacto") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZO EN ${ubicTxt}
PERSONA QUE CONTESTA: [INGRESAR]
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: FALTA DE CONTACTO
SUBMOTIVO DE RECHAZO: No hay contacto con el cliente (números errados)
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "direccion") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
PERSONA QUE CONTESTA: [NOMBRE]
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: MAL INGRESO DE DIRECCIÓN
DIRECCIÓN CORRECTA: [INGRESAR]
SUBMOTIVO DE RECHAZO:
*Dirección registrada en el sistema es errada. (numero, lt, mz, nombre calle, distrito)
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "oferta") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
PERSONA QUE CONTESTA: TITULAR/ FAMILIAR + NOMBRE
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: MALA OFERTA
SUBMOTIVO DE RECHAZO:
*Tecnología incorrecta FTTH/HFC/OVERLAP Instalación/ Post Venta]
*Velocidad de Internet no es acorde a lo solicitado por el cliente
*Cantidad o Modelo de Decos no es acorde a lo solicitado por el cliente
*Cliente solicito atención PostVenta (Decos adicionales, traslados, etc.)
*Cliente solicita adicionar la telefonía
*Decodificadores descontinuados (Básico HD, Básico, Standard, DVR)
PAQUETE INGRESADO: [XXXXX]
PAQUETE CORRECTO: [XXXXXXX]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "mudanza") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
PERSONA QUE CONTESTA: [INGRESAR]
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: MUDANZA O VIAJE
SUBMOTIVO DE RECHAZO: (escoger una opción)
*Cliente salió de viaje y en el domicilio no tienen conocimiento de la Instalación.
*Cliente no vive en esta dirección, se mudó.
*Cliente indica que pronto se mudará o viajará y rechaza instalación.
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "soterror") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
MOTIVO DEL RECHAZO: SOT CON ERRORES EN EL SISTEMA
SUBMOTIVO DE RECHAZO:
*Sin workflow, sin tareas generadas
*Campaña mal configurada, no figura etiquetas correctas
*Solicitud mal generada (no genera reservas, duplicidad de números, duplicidad de etiquetas, Sin Co_id, sin CustomerID, Sin plano, etc.)
**SE PROCEDE AL RECHAZO DE LA SOLICITUD POR TENER ERRORES DE SISTEMAS:
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
            else if (tipo === "fraude") {
                plantilla = `MESA MULTISKILL HITSS RECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicTxt}
PERSONA QUE CONTESTA: [INGRESAR]
NUMERO DE CONTACTO: ${c.telefono}
MOTIVO DEL RECHAZO: POSIBLE FRAUDE
SUBMOTIVO DE RECHAZO: Cliente ya tiene un servicio activo en la misma dirección
CUSTOMER ID: [Solicitar DNI]
AUTORIZADO POR: [INGRESAR]
ID DE LLAMADA: ${c.idAgenda || "[INGRESAR]"}
REALIZADO POR: Jose Tirado - ADP MULTISKILL HITSS`;
            }
        }

        document.getElementById("resultado").innerText = plantilla || "⚠️ Seleccione una categoría válida";
    }

    // 🔔 Notificación temporal
    function mostrarNotificacion(msg) {
        const notif = document.createElement('div');
        notif.textContent = msg;
        Object.assign(notif.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#323232',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: '10001',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease'
        });
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2500);
    }

    console.log("✅ Generador de Plantillas Claro Perú v3.0 cargado");
})();