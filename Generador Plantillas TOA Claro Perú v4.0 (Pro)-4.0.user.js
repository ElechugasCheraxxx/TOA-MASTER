// ==UserScript==
// @name         Generador Plantillas TOA Claro Perú v4.0 (Pro)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Automatización completa para SOTs, Mantenimientos, Validaciones y Fuera de TOA en Oracle Field Service
// @match        https://amx-peru.fs.ocs.oraclecloud.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @author       Gemini AI
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. BASE DE DATOS (Constantes y Config)
    // ==========================================

    const CONFIG = {
        adpName: localStorage.getItem('adp_name') || "",
        lastCoords: ""
    };

    const CODIGOS_MANTENIMIENTO = [
        { cod: "AB01", desc: "MANIPULACIÓN CLIENTE - TV/Control desprogramado o sin pilas" },
        { cod: "AB02", desc: "MANIPULACIÓN CLIENTE - Cliente desconfiguró ONT/EMTA" },
        { cod: "AB03", desc: "MANIPULACIÓN CLIENTE - Cliente modificó red interna" },
        { cod: "AB04", desc: "MANIPULACIÓN CLIENTE - Comparte señal a otras personas / exceso de dispositivos" },
        { cod: "AB05", desc: "MANIPULACIÓN CLIENTE - Equipo telefónico desconfigurado o mal conectado" },
        { cod: "AB06", desc: "MANIPULACIÓN CLIENTE - Equipos desconectados o problemas con tomas de corriente" },
        { cod: "AB07", desc: "PROBLEMA CLIENTE - No cuenta con minutos para llamar" },
        { cod: "AB08", desc: "PROBLEMA CLIENTE - Problemas con equipos propiedad del cliente" },
        { cod: "AB09", desc: "PROBLEMA CLIENTE - Reinstalación por incendio, remodelación o construcción" },
        { cod: "AB10", desc: "MANIPULACIÓN CLIENTE - Equipo telefónico averiado por el cliente" },
        { cod: "AB11", desc: "PROBLEMA CLIENTE - Control remoto sin pilas" },
        { cod: "DE01", desc: "DERIVADO - Conmutación: llamadas no se concentran" },
        { cod: "DE02", desc: "DERIVADO - Operadora indica que número no existe (llamada entrante)" },
        { cod: "DE03", desc: "DERIVADO - Problemas SVA (central virtual, hunting, etc.)" },
        { cod: "DE04", desc: "DERIVADO PEXT - Degradación del servicio" },
        { cod: "DE05", desc: "DERIVADO PEXT - Sin servicio / avería masiva" },
        { cod: "DE06", desc: "DERIVADO PEXT - Niveles RF altos/bajos" },
        { cod: "DE07", desc: "DERIVADO PEXT - Intermitencia / pérdida de paquetes" },
        { cod: "DE08", desc: "DERIVADO PEXT - Mala señal" },
        { cod: "DE09", desc: "Derivado a segundo nivel" },
        { cod: "EQ01", desc: "CAMBIO EQUIPO - Control remoto no funciona" },
        { cod: "EQ02", desc: "CAMBIO EQUIPO - Extensor WiFi/MESH" },
        { cod: "EQ04", desc: "CAMBIO EQUIPO - EMTA por tecnología/fidelización" },
        { cod: "EQ05", desc: "CAMBIO EQUIPO - ONT/EMTA con problemas" },
        { cod: "EQ06", desc: "CAMBIO EQUIPO - ONT/EMTA + cambio de acometida" },
        { cod: "EQ07", desc: "CAMBIO EQUIPO - ONT/EMTA + cableado interno" },
        { cod: "EQ08", desc: "CAMBIO EQUIPO - STB + acometida" },
        { cod: "EQ09", desc: "CAMBIO EQUIPO - STB con problema" },
        { cod: "EQ10", desc: "CAMBIO EQUIPO - STB + cable interno" },
        { cod: "EQ11", desc: "CAMBIO EQUIPO - Teléfono con problema" },
        { cod: "EQ12", desc: "CAMBIO EQUIPO/IP FIJA - ONT/EMTA negocio" },
        { cod: "EQ13", desc: "CAMBIO EQUIPO/IP FIJA - EMTA negocio fidelización" },
        { cod: "EQ14", desc: "CAMBIO EQUIPO - Cambio EMTA/ONT/STB/MESH climatológico" },
        { cod: "EQ15", desc: "CAMBIO EQUIPO - ONT/EMTA por factores climatológicos" },
        { cod: "EQ16", desc: "CAMBIO EQUIPO - ONT/EMTA + MESH climatológico" },
        { cod: "EQ17", desc: "CAMBIO EQUIPO - STB por factores climatológicos" },
        { cod: "EQ18", desc: "CAMBIO EQUIPO - Switch con falla" },
        { cod: "FA01", desc: "FALSA AVERÍA - Avería de red" },
        { cod: "FA02", desc: "FALSA AVERÍA - Cliente con suspensión o corte" },
        { cod: "FA03", desc: "FALSA AVERÍA - Cliente informa servicio conforme" },
        { cod: "FA04", desc: "FALSA AVERÍA - Incidencia mal generada por ATC" },
        { cod: "FA05", desc: "FALSA AVERÍA - Incidencia duplicada" },
        { cod: "FA06", desc: "FALSA AVERÍA - Cliente derivado a otras áreas" },
        { cod: "FA07", desc: "FALSA AVERÍA - Solución con soporte remoto" },
        { cod: "FA08", desc: "FALSA AVERÍA - SOT con datos incorrectos" },
        { cod: "FA09", desc: "FALSA AVERÍA - Cliente dará baja" },
        { cod: "FA10", desc: "FALSA AVERÍA - Cliente no permite acceso" },
        { cod: "FA11", desc: "FALSA AVERÍA - Duplicidad cerrada por ATC" },
        { cod: "FA12", desc: "FALSA AVERÍA - Cerrado por falta de contacto" },
        { cod: "FI02", desc: "CONFIGURACIÓN - Avanzada (3+ equipos) solo negocios" },
        { cod: "FI03", desc: "CONFIGURACIÓN - Puertos EMTA/ONT" },
        { cod: "FI06", desc: "CONFIGURACIÓN - Problemas extensión WiFi" },
        { cod: "FI07", desc: "CONFIGURACIÓN - Pruebas servicio integral (supervisión Claro)" },
        { cod: "FI08", desc: "CONFIGURACIÓN - Reinicio ONT/EMTA" },
        { cod: "FI09", desc: "CONFIGURACIÓN - Instalación/configuración MESH" },
        { cod: "FI10", desc: "CONFIGURACIÓN - Reactivación internet/telefonía" },
        { cod: "FI11", desc: "CONFIGURACIÓN - Envío comandos TV" },
        { cod: "FI12", desc: "CONFIGURACIÓN - WiFi equipos Claro" },
        { cod: "FI13", desc: "CONFIGURACIÓN - WiFi equipos cliente" },
        { cod: "FI14", desc: "CONFIGURACIÓN - Aplicaciones deco IPTV" },
        { cod: "FI15", desc: "CONFIGURACIÓN - Explicación de uso del servicio" },
        { cod: "IN02", desc: "INSTALACIÓN - Inspección técnica (solo empresas)" },
        { cod: "MO01", desc: "MOVILIZACIÓN - Cliente ausente" },
        { cod: "MO02", desc: "MOVILIZACIÓN - Cliente dará baja" },
        { cod: "MO03", desc: "MOVILIZACIÓN - Cliente indica servicio conforme" },
        { cod: "MO04", desc: "MOVILIZACIÓN - No hay facilidades técnicas" },
        { cod: "MO05", desc: "MOVILIZACIÓN - Cliente ya no desea soporte" },
        { cod: "PC01", desc: "DISPOSITIVO INTERNO - Cambio patch cord" },
        { cod: "PC02", desc: "DISPOSITIVO INTERNO - Cambio de acometida" },
        { cod: "PC03", desc: "DISPOSITIVO INTERNO - Acometida + cableado interno" },
        { cod: "PC04", desc: "DISPOSITIVO INTERNO - Cable coaxial (HFC)" },
        { cod: "PC05", desc: "DISPOSITIVO INTERNO - Cambio fuente equipo" },
        { cod: "PC06", desc: "DISPOSITIVO INTERNO - Conector óptico sucio" },
        { cod: "PC07", desc: "DISPOSITIVO INTERNO - Conectores flojos" },
        { cod: "PC08", desc: "DISPOSITIVO INTERNO - Reacomodo acometida" },
        { cod: "PC09", desc: "DISPOSITIVO INTERNO - Roseta telefónica averiada" },
        { cod: "PC10", desc: "DISPOSITIVO INTERNO - Roseta óptica averiada" },
        { cod: "PC12", desc: "DISPOSITIVO INTERNO - Reacomodo (autoinstalación previa)" },
        { cod: "PC13", desc: "DISPOSITIVO INTERNO - Divisor/splitter averiado" },
        { cod: "PC14", desc: "DISPOSITIVO INTERNO - Cambio cable HDMI" },
        { cod: "PC15", desc: "DISPOSITIVO INTERNO - Cambio cable jumper UTP" },
        { cod: "PC16", desc: "DISPOSITIVO INTERNO - Cable telefónico interno" },
        { cod: "PC17", desc: "DISPOSITIVO INTERNO - Cable interno UTP/STP" },
        { cod: "PC18", desc: "DISPOSITIVO INTERNO - Cambio conector óptico (FTTH)" },
        { cod: "PC19", desc: "DISPOSITIVO INTERNO - Cambio conector RG6 (HFC)" },
        { cod: "PC20", desc: "DISPOSITIVO INTERNO - Cambio conector RJ45" },
        { cod: "PC21", desc: "DISPOSITIVO INTERNO - Cambio conector RJ11" },
        { cod: "PC22", desc: "DISPOSITIVO INTERNO - Colocación de chapa/seguro acometida" },
        { cod: "PC23", desc: "DISPOSITIVO INTERNO - Retiro cableado" },
        { cod: "TE10", desc: "TERCEROS - Acometida desconectada" },
        { cod: "TE11", desc: "TERCEROS - Acometida cortada desde el TAP" }
    ];

    // ==========================================
    // 2. MOTOR DE EXTRACCIÓN (DOM Parsing)
    // ==========================================

    const extractData = () => {
        // Función auxiliar para buscar por atributo data-label (método más preciso según tus logs)
        const getVal = (label) => {
            const el = document.querySelector(`[data-label="${label}"]`);
            if (el) return el.innerText || el.value || "";
            return "";
        };

        // Extracción directa del texto completo para Regex de respaldo
        const fullText = document.body.innerText;
        const findRegex = (regex) => (fullText.match(regex) || [])[1] || "";

        // 1. Datos Principales
        let rawSot = getVal("XA_SOT_ID") || findRegex(/SOT\s*[:]\s*(\d+)/i);
        let rawIdAgenda = getVal("XA_Agenda_ID") || findRegex(/ID Agenda\s*[:]\s*(\d+)/i);
        let rawCliente = getVal("cname") || getVal("customer_name") || findRegex(/Nombre\s*\n\s*([A-ZÁÉÍÓÚÑ\s]+)/i);
        let rawTelf = getVal("cphone") || getVal("XA_Contact_Phone_Number") || findRegex(/Tel[eé]fono\s*[:]\s*(\d+)/i);
        let rawSubTipo = getVal("XA_WorkOrderSubtype") || getVal("aworktype");
        let rawDireccion = getVal("caddress") || findRegex(/Dirección\s*[:]\s*(.+?)(?:\n|$)/i);
        let rawPlano = getVal("XA_Map") || "";
        let rawDistrito = getVal("cstate") || getVal("XA_City") || ""; // Según logs, cstate suele tener el distrito
        let rawCodCliente = getVal("customer_number") || "";

        // 2. Cálculo de Franja Horaria (SLA)
        // Log Format: "05/12/25 04:00 PM" o iso "2025-12-05 16:00:00"
        let slaInicioRaw = getVal("sla_window_start"); // Intenta obtener del data-label
        if(!slaInicioRaw) {
             // Fallback a buscar inputs específicos por ID mostrados en logs
             const inputSLA = document.querySelector('input[data-label="sla_window_start"]');
             if(inputSLA) slaInicioRaw = inputSLA.value || inputSLA.getAttribute("data-iso");
        }

        let franjaCalculada = "NO DETECTADA";
        if (slaInicioRaw) {
            // Intentar parsear la hora
            let hora = -1;
            if (slaInicioRaw.includes("AM")) {
                const parts = slaInicioRaw.split(":"); // "09:00 AM"
                hora = parseInt(parts[0].slice(-2)); // Toma los ultimos digitos de la hora
                if(hora === 12) hora = 0;
            } else if (slaInicioRaw.includes("PM")) {
                const parts = slaInicioRaw.split(":");
                hora = parseInt(parts[0].slice(-2));
                if(hora !== 12) hora += 12;
            } else if (slaInicioRaw.includes(":")) {
                // Formato ISO 16:00
                const timePart = slaInicioRaw.split(" ")[1]; // 16:00:00
                if(timePart) hora = parseInt(timePart.split(":")[0]);
            }

            // Lógica de Franjas
            if (hora >= 8 && hora < 11) franjaCalculada = "AM1 [09:00 AM - 11:00 AM]";
            else if (hora >= 11 && hora < 14) franjaCalculada = "AM2 [11:00 AM - 02:00 PM]";
            else if (hora >= 14 && hora < 16) franjaCalculada = "PM1 [02:00 PM - 04:00 PM]";
            else if (hora >= 16 && hora < 20) franjaCalculada = "PM2 [04:00 PM - 08:00 PM]";
        }

        // 3. Detección automática del tipo de orden
        let tipoDetectado = "validacion"; // default
        let subTipoLower = (rawSubTipo || "").toLowerCase();
        if (subTipoLower.includes("mantenimiento") || subTipoLower.includes("averia")) tipoDetectado = "mantenimiento";
        else if (subTipoLower.includes("instalacion") || subTipoLower.includes("alta")) tipoDetectado = "instalacion";
        else if (subTipoLower.includes("migracion") || subTipoLower.includes("punto adicional") || subTipoLower.includes("traslado")) tipoDetectado = "postventa";

        // Si no hay SOT, es Fuera de TOA
        if (!rawSot || rawSot.trim() === "") {
            tipoDetectado = "fueratoa";
        }

        return {
            sot: rawSot || "No detectado",
            idAgenda: rawIdAgenda || "No detectado",
            cliente: rawCliente ? rawCliente.trim() : "No detectado",
            telefono: rawTelf || "No detectado",
            direccion: rawDireccion || "",
            distrito: rawDistrito,
            plano: rawPlano,
            codCliente: rawCodCliente,
            subTipo: rawSubTipo || "",
            franja: franjaCalculada,
            tipoAuto: tipoDetectado,
            fecha: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }) // DD/MM
        };
    };

    // ==========================================
    // 3. INTERFAZ DE USUARIO (Floating Panel)
    // ==========================================

    const createUI = () => {
        const panel = document.createElement('div');
        panel.id = 'claro-template-panel';
        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="margin:0; color:#d32f2f; font-weight:bold;">CLARO TOA v4.0</h3>
                <button id="minBtn" style="background:none;border:none;cursor:pointer;">➖</button>
            </div>

            <div style="margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <input type="text" id="adpNameInput" placeholder="Tu Nombre (ADP)" value="${CONFIG.adpName}" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:4px;">
            </div>

            <label style="font-size:12px; font-weight:bold;">Categoría:</label>
            <select id="mainCat" style="width:100%; padding:6px; margin-bottom:8px; border-radius:4px;">
                <option value="validacion">✅ Validación / Gestión</option>
                <option value="seguimiento">📞 Seguimiento / Agendamiento</option>
                <option value="rechazo">❌ Rechazos (Mesa/Campo)</option>
                <option value="repro">🔄 Reprogramaciones</option>
                <option value="activacion">📶 Activaciones (Firmware)</option>
                <option value="fueratoa">⚠️ Fuera de TOA</option>
            </select>

            <div id="dynamicOptions" style="margin-bottom:10px;"></div>

            <div style="display:flex; gap:5px;">
                <button id="genBtn" style="flex:1; background:#d32f2f; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; font-weight:bold;">Generar</button>
                <button id="copyBtn" style="flex:1; background:#555; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">Copiar</button>
            </div>

            <textarea id="outputTxt" style="width:100%; height:120px; margin-top:10px; padding:5px; border:1px solid #ccc; border-radius:4px; font-family:monospace; font-size:11px;"></textarea>
        `;

        // Estilos del panel
        Object.assign(panel.style, {
            position: 'fixed',
            top: '60px',
            right: '20px',
            width: '320px',
            background: 'white',
            border: '2px solid #d32f2f',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: '10000',
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px'
        });

        document.body.appendChild(panel);

        // Event Listeners
        document.getElementById('minBtn').onclick = () => {
            const content = document.getElementById('outputTxt');
            const isMin = content.style.display === 'none';
            content.style.display = isMin ? 'block' : 'none';
            document.getElementById('dynamicOptions').style.display = isMin ? 'block' : 'none';
        };

        document.getElementById('adpNameInput').addEventListener('change', (e) => {
            localStorage.setItem('adp_name', e.target.value);
            CONFIG.adpName = e.target.value;
        });

        document.getElementById('mainCat').addEventListener('change', renderSubOptions);
        document.getElementById('genBtn').addEventListener('click', generateTemplate);
        document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

        // Renderizar opciones iniciales
        renderSubOptions();
    };

    // ==========================================
    // 4. LÓGICA DE SUBMENÚS Y GENERACIÓN
    // ==========================================

    function renderSubOptions() {
        const cat = document.getElementById('mainCat').value;
        const container = document.getElementById('dynamicOptions');
        container.innerHTML = ''; // Limpiar

        if (cat === 'validacion') {
            container.innerHTML = `
                <select id="subVal" style="width:100%; padding:5px;">
                    <option value="instalacion">Instalación</option>
                    <option value="postventa">Post-Venta / Migración</option>
                    <option value="mantenimiento">Mantenimiento HFC/FTTH</option>
                </select>
                <div id="mantCodesDiv" style="display:none; margin-top:5px;">
                    <select id="mantCode" style="width:100%; padding:5px;">
                        <option value="">-- Seleccionar Código --</option>
                        ${CODIGOS_MANTENIMIENTO.map(c => `<option value="${c.cod}">${c.cod} - ${c.desc}</option>`).join('')}
                    </select>
                </div>
            `;
            document.getElementById('subVal').addEventListener('change', (e) => {
                document.getElementById('mantCodesDiv').style.display = e.target.value === 'mantenimiento' ? 'block' : 'none';
            });
        }
        else if (cat === 'seguimiento') {
            container.innerHTML = `
                <select id="subSeg" style="width:100%; padding:5px;">
                    <option value="confirma">Confirma Visita</option>
                    <option value="adelanto">Adelanto Visita</option>
                    <option value="mantiene">Mantiene Fecha</option>
                    <option value="franja">Habilitar Franja</option>
                    <option value="ciclo">Ciclo de Llamadas (No contesta)</option>
                </select>
            `;
        }
        else if (cat === 'rechazo') {
            container.innerHTML = `
                <select id="subRechazo" style="width:100%; padding:5px; margin-bottom:5px;">
                    <option value="cliente">Cliente No Desea</option>
                    <option value="duplicidad">Duplicidad</option>
                    <option value="facilidades">Facilidades Técnicas (Red/Techo)</option>
                    <option value="contacto">Falta de Contacto</option>
                    <option value="direccion">Mal Ingreso Dirección</option>
                    <option value="oferta">Mala Oferta</option>
                    <option value="mudanza">Mudanza/Viaje</option>
                    <option value="soterror">Error Sistema SOT</option>
                    <option value="fraude">Posible Fraude</option>
                    <option value="red_saturada">Red Saturada (Tec)</option>
                </select>
                <select id="ubicacionRechazo" style="width:100%; padding:5px;">
                    <option value="MESA">En MESA</option>
                    <option value="CAMPO">En CAMPO</option>
                </select>
            `;
        }
        else if (cat === 'repro') {
            container.innerHTML = `
                <select id="subRepro" style="width:100%; padding:5px;">
                    <option value="claro">Por CLARO (Error SOT/Sist/Contrata)</option>
                    <option value="cliente">Por CLIENTE (Viaje/Solicitud)</option>
                </select>
                <input type="text" id="newDate" placeholder="Nueva Fecha (DD/MM - AM1)" style="width:100%; margin-top:5px; padding:5px;">
            `;
        }
    }

    function generateTemplate() {
        const data = extractData();
        const cat = document.getElementById('mainCat').value;
        const adp = document.getElementById('adpNameInput').value;
        let text = "";

        // Autodetección si se selecciona validación y el script detectó algo diferente en el pasado
        // (Simplificado: Usamos lo que selecciona el usuario, pero pre-llenamos variables)

        if (cat === 'validacion') {
            const sub = document.getElementById('subVal').value;
            if (sub === 'instalacion') {
                text = `MESA MULTISKILL HITSS\nID LLAMADA: ${data.idAgenda}\nSOT: ${data.sot}\nVALIDADO POR: ${data.cliente}\nNUMERO WSP: ${data.telefono}\nADP: ${adp}`;
            } else if (sub === 'postventa') {
                text = `MESA MULTISKILL HITSS\nID LLAMADA: ${data.idAgenda}\nSOT: ${data.sot}\nVALIDADO POR: ${data.cliente}\nNUMERO WSP: ${data.telefono}\nADP: ${adp}`;
            } else if (sub === 'mantenimiento') {
                const code = document.getElementById('mantCode').value || "[INGRESAR CODIGO]";
                text = `MESA MULTISKILL HITSS\nID LLAMADA: ${data.idAgenda}\nSOT: ${data.sot}\nCOD. SOLUCIÓN PRINCIPAL: ${code}\nVALIDADO POR: ${data.cliente}\nNUMERO WSP: ${data.telefono}\nADP: ${adp}`;
            }
        }
        else if (cat === 'seguimiento') {
            const sub = document.getElementById('subSeg').value;
            const commonHeader = `MESA MULTISKILL HITSS`;
            if (sub === 'confirma') {
                text = `${commonHeader} - CONFIRMA VISITA\nSOT: ${data.sot}\nDÍA Y FRANJA: ${data.franja}\nCLIENTE: ${data.cliente}\nNUMERO: ${data.telefono}\nCONTRATA: [INGRESAR]\nID DE LLAMADA: ${data.idAgenda}\nREALIZADO POR: ${adp}`;
            } else if (sub === 'adelanto') {
                text = `${commonHeader} - ADELANTA VISITA\nSOT: ${data.sot}\nDÍA Y FRANJA: ${data.franja}\nCLIENTE: ${data.cliente}\nNUMERO: ${data.telefono}\nCONTRATA: [INGRESAR]\nID DE LLAMADA: ${data.idAgenda}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
            } else if (sub === 'mantiene') {
                text = `${commonHeader} - MANTIENE FECHA DE VISITA\nSOT: ${data.sot}\nDÍA Y FRANJA: ${data.franja}\nCLIENTE: ${data.cliente}\nNUMERO: ${data.telefono}\nCONTRATA: [INGRESAR]\nID DE LLAMADA: ${data.idAgenda}\nREALIZADO POR: ${adp}`;
            } else if (sub === 'franja') {
                text = `${commonHeader} - FORMATO PARA HABILITAR FRANJA 📥\nSOT: ${data.sot}\n🪚 PLANO: ${data.plano || "[INGRESAR]"}\n📅 FECHA Y FRANJA: ${data.franja}\n📧 Motivo: SIN FRANJAS DISPONIBLES\n🚨‍ Sup a cargo: [INGRESAR]`;
            } else if (sub === 'ciclo') {
                text = `${commonHeader} - CICLO DE LLAMADAS\nCICLO DE LLAMADA NRO: 1\nCANTIDAD DE LLAMADAS: 4\nNUMERO: ${data.telefono}\nMOTIVO: FALTA DE CONTACTO\nSUB-MOTIVO: [Buzón/No contesta/Apagado]\nID DE LLAMADA: ${data.idAgenda}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
            }
        }
        else if (cat === 'fueratoa') {
            text = `*FUERA DE TOA*\n📥 SOT: ${data.sot}\n⚙️ SUB TIPO: ${data.subTipo}\n🏡 DIRECCIÓN: ${data.direccion}\n📍 DISTRITO: ${data.distrito}\n⚒️ SERVICIO: [INGRESAR]\n🪚 PLANO: ${data.plano}\n👨‍💻 CLIENTE: ${data.cliente}\n🔣 COD CLIENTE: ${data.codCliente}\n📱 CELULAR DEL CLIENTE: ${data.telefono}\n📅 FECHA Y FRANJA: ${data.fecha} - ${data.franja}\n✍️ REALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
        }
        else if (cat === 'rechazo') {
            const motivo = document.getElementById('subRechazo').value;
            const ubicacion = document.getElementById('ubicacionRechazo').value;
            const ubicText = ubicacion === "MESA" ? "MESA" : "CAMPO"; // Según logica 346

            text = `MESA MULTISKILL HITSS\nRECHAZO EN MESA / CAMPO: RECHAZO EN ${ubicText}\nPERSONA QUE CONTESTA: [INGRESAR]\nNUMERO DE CONTACTO: ${data.telefono}\nMOTIVO DEL RECHAZO: ${motivo.toUpperCase().replace('_', ' ')}\nSUBMOTIVO DE RECHAZO: [INGRESAR OPCIÓN]\nID DE LLAMADA: ${data.idAgenda}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;

            if(motivo === 'duplicidad') {
                 text = `MESA MULTISKILL HITSS\nRECHAZO EN MESA / CAMPO: RECHAZADO EN ${ubicText}\nNUMERO DE CONTACTO: ${data.telefono}\nMOTIVO DEL RECHAZO: RECHAZADO POR DUPLICIDAD\nPERSONA QUE CONTESTA: [NO APLICA]\nSUBMOTIVO: se atendió con otra SOT\nID DE LLAMADA: ${data.idAgenda}\nREALIZADO POR: ${adp}`;
            }
        }
        else if (cat === 'repro') {
            const motivo = document.getElementById('subRepro').value.toUpperCase();
            const nuevaFecha = document.getElementById('newDate').value;
            text = `MESA MULTISKILL HITSS\nREPROGRAMADO EN MESA (MESA/CAMPO) / REAGENDADO POR CLARO (${motivo})\nMOTIVO: ${motivo}\nCLIENTE: ${data.cliente}\nTELÉFONO: ${data.telefono}\nNUEVA FECHA Y FRANJA: ${nuevaFecha}\nOBSERVACIÓN: [INGRESAR]\nCONTRATA: [INGRESAR]\nREALIZADO POR: ${adp}\nCÓD LLAMADA: ${data.idAgenda}`;
        }
        else if (cat === 'activacion') {
             text = `MESA MULTISKILL HITSS - ACTUALIZACIÓN FIRMWARE PLUME\nSOT: ${data.sot}\nCUSTOMER ID: ${data.codCliente}\nNOMBRE CLIENTE: ${data.cliente}\nDNI: [INGRESAR]\nSERIE REPETIDOR: [INGRESAR]\nMAC REPETIDOR: [INGRESAR]\nSN/MAC: [INGRESAR]\nCORREO: [INGRESAR]\nESTADO: [INGRESAR]\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
        }

        document.getElementById('outputTxt').value = text;
    }

    function copyToClipboard() {
        const copyText = document.getElementById("outputTxt");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerText;
            btn.innerText = "¡Copiado!";
            btn.style.background = "#4CAF50";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "#555";
            }, 1500);
        });
    }

    // ==========================================
    // 5. INICIALIZACIÓN
    // ==========================================

    // Esperar a que cargue la SPA
    setTimeout(() => {
        console.log("🚀 Claro TOA Script v4.0 Cargado");
        createUI();
    }, 2000);

})();