// ==UserScript==
// @name         Generador Plantillas TOA Claro Perú v8.5 (FINAL COMPLETO)
// @namespace    http://tampermonkey.net/
// @version      8.5
// @description  Solución definitiva para automatizar plantillas de Oracle Field Service (TOA). Detección automática, formularios dinámicos y base de datos completa.
// @author       Cheraxxx
// @match        https://amx-peru.fs.ocs.oraclecloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oraclecloud.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // 1. BASE DE DATOS (CONTRATAS, CÓDIGOS, MOTIVOS)
    // =========================================================================

    const DB = {
        contratas: [
            "SAVAL", "CARLEI", "TELECOM", "TELECONTACTO", "WITLINK",
            "JAMAPUC", "INSERTEL", "SOLDECOM", "CONEXIT", "DIMA", "FEBEZA", "JOLBEC"
        ],
        codigosMantenimiento: [
            { cod: "AB01", desc: "TV/Control desprogramado", sol: "VISITA INNECESARIA" },
            { cod: "AB02", desc: "Cliente desconfiguró ONT/EMTA", sol: "TRABAJO FISICO" },
            { cod: "AB03", desc: "Cliente modificó red interna", sol: "TRABAJO FISICO" },
            { cod: "AB04", desc: "Comparte señal/exceso disp.", sol: "VISITA INNECESARIA" },
            { cod: "AB05", desc: "Teléfono desconfigurado", sol: "TRABAJO FISICO" },
            { cod: "AB06", desc: "Equipos desconectados", sol: "VISITA INNECESARIA" },
            { cod: "AB07", desc: "No cuenta con minutos", sol: "VISITA INNECESARIA" },
            { cod: "AB08", desc: "Prob. equipos del cliente", sol: "TRABAJO FISICO" },
            { cod: "DE01", desc: "Conmutación llamadas", sol: "VISITA INNECESARIA" },
            { cod: "DE04", desc: "Degradación servicio (PEXT)", sol: "-" },
            { cod: "DE05", desc: "Avería Masiva (PEXT)", sol: "-" },
            { cod: "EQ01", desc: "Cambio Control Remoto", sol: "TRABAJO FISICO" },
            { cod: "EQ02", desc: "Cambio Extensor/MESH", sol: "TRABAJO FISICO" },
            { cod: "EQ05", desc: "Cambio ONT/EMTA falla", sol: "TRABAJO FISICO" },
            { cod: "EQ06", desc: "Cambio ONT/EMTA + Acometida", sol: "TRABAJO FISICO" },
            { cod: "EQ09", desc: "Cambio STB falla", sol: "TRABAJO FISICO" },
            { cod: "FI03", desc: "Config. Puertos", sol: "TRABAJO FISICO" },
            { cod: "FI08", desc: "Reinicio ONT/EMTA", sol: "TRABAJO FISICO" },
            { cod: "FI09", desc: "Instalación MESH", sol: "TRABAJO FISICO" },
            { cod: "FI12", desc: "WiFi equipos Claro", sol: "VISITA INNECESARIA" },
            { cod: "PC02", desc: "Cambio Acometida", sol: "TRABAJO FISICO" },
            { cod: "PC03", desc: "Acometida + Cableado", sol: "TRABAJO FISICO" },
            { cod: "PC04", desc: "Cable Coaxial (HFC)", sol: "TRABAJO FISICO" },
            { cod: "PC06", desc: "Conector óptico sucio", sol: "TRABAJO FISICO" },
            { cod: "PC08", desc: "Reacomodo acometida", sol: "TRABAJO FISICO" },
            { cod: "TE10", desc: "Acometida desconectada", sol: "TRABAJO FISICO" }
        ],
        reproMotivos: {
            "CLARO": {
                "Errores en la generación de la SOT": [
                    "Pérdida de fecha en agendaamiento",
                    "Caída masiva en sistemas Claro"
                ],
                "Inconvenientes con la contrata/ista": [
                    "Insistencia de cuadrillas de la contrata/ista",
                    "Retraso de técnicos de la contrata/ista durante la instalación",
                    "Incidencias en el campo durante la instalación",
                    "Falta de materiales. Detallar material",
                    "Retiro anticipado de cuadrillas en campo",
                    "Falta de herramientas"
                ],
                "Configuraciones de TOA (OFSC)": [
                    "Sobreeagendamiento de cuotas",
                    "Problemas con las configuraciones de zonas de trabajo",
                    "Cuota configurada incorrectamente"
                ]
            },
            "CLIENTE": {
                "A solicitud del Cliente": [
                    "Cambios en las fechas y franjas solicitadas",
                    "Cliente se encuentra de viaje",
                    "Solo puede domingos, horarios especiales, noche.",
                    "Cliente desconoce su fecha de agendamiento"
                ],
                "Facilidades del cliente": [
                    "Cliente no cuenta con equipos en nuevo domicilio",
                    "No brinda facilidades técnicas (ductos, permisos, etc.)",
                    "Factores climatológicos"
                ],
                "Falta de contacto": [
                    "Cliente no responde los intentos de llamada"
                ],
                "Ausente": [
                    "Cliente Ausente en Campo"
                ]
            }
        },
        rechazoMotivos: {
            "MESA": {
                "Cliente no desea servicio": [
                    "Cliente ya tiene servicio de otro operador",
                    "Titular no ha contratado ningun servicio a Claro",
                    "Demora en la atención de la solicitud, ya no desea esperar",
                    "Cliente no desea servicio por Motivos personales"
                ],
                "Por Duplicidad": [
                    "se atendió con otra SOT"
                ],
                "Facilidades Técnicas": [
                    "Dueño de Casa y/o Edificio no autoriza la instalacion",
                    "Al momento de la instalación no hay acceso al techo",
                    "Al momento de la instalación se valida ducterias obstruidas",
                    "Cliente cuenta con sot de suspensión y/o baja"
                ],
                "Falta de contacto": [
                    "No hay contacto con el cliente (números errados)"
                ],
                "Mal Ingreso de Direccion": [
                    "Dirección registrada en el sistema es errada"
                ],
                "Mala Oferta": [
                    "Tecnología incorrecta FTTH/HFC/OVERLAP [Instalación/ Post Venta]",
                    "Velocidad de Internet no es acorde a lo solicitado por el cliente",
                    "Cantidad o Modelo de Decos no es acorde a lo solicitado por el cliente",
                    "Cliente solicito atención PostVenta (Decos adicionales, traslados, etc.)",
                    "Cliente solicita adicionar la telefonía",
                    "Decodificadores descontinuados (Básico HD, Básico, Standard, DVR)"
                ],
                "Mudanza o Viaje": [
                    "Cliente salió de viaje y en el domicilio no tienen conocimiento de la Instalación",
                    "Cliente no vive en esta dirección, se mudó",
                    "Cliente indica que pronto se mudará o viajará y rechaza instalación"
                ],
                "Por SOT con errores de Sistema": [
                    "Sin workflow, sin tareas generadas",
                    "Campaña mal configurada, no figura etiquetas correctas",
                    "Solicitud mal generada: No genera reservas",
                    "Solicitud mal generada: Duplicidad de números",
                    "Solicitud mal generada: Duplicidad de etiquetas",
                    "Solicitud mal generada: Sin Co_id",
                    "Solicitud mal generada: Sin CustomerID",
                    "Solicitud mal generada: Sin plano",
                    "Solicitud mal generada: Otros"
                ],
                "Por posible fraude": [
                    "Cliente ya tiene un servicio activo en la misma dirección"
                ]
            },
            "CAMPO": {
                "Cliente no desea servicio": [
                    "Cliente ya tiene servicio de otro operador",
                    "Titular no ha contratado ningun servicio a Claro",
                    "Demora en la atención de la solicitud, ya no desea esperar",
                    "Cliente no desea servicio por Motivos personales"
                ],
                "Por Duplicidad": [
                    "se atendió con otra SOT"
                ],
                "Facilidades Técnicas": [
                    "Dueño de Casa y/o Edificio no autoriza la instalacion",
                    "Al momento de la instalación no hay acceso al techo",
                    "Al momento de la instalación se valida ducterias obstruidas",
                    "Cliente cuenta con sot de suspensión y/o baja"
                ],
                "Falta de contacto": [
                    "No hay contacto con el cliente (números errados)"
                ],
                "Mal Ingreso de Direccion": [
                    "Dirección registrada en el sistema es errada"
                ],
                "Mala Oferta": [
                    "Tecnología incorrecta FTTH/HFC/OVERLAP [Instalación/ Post Venta]",
                    "Velocidad de Internet no es acorde a lo solicitado por el cliente",
                    "Cantidad o Modelo de Decos no es acorde a lo solicitado por el cliente",
                    "Cliente solicito atención PostVenta (Decos adicionales, traslados, etc.)",
                    "Cliente solicita adicionar la telefonía",
                    "Decodificadores descontinuados (Básico HD, Básico, Standard, DVR)"
                ],
                "Mudanza o Viaje": [
                    "Cliente salió de viaje y en el domicilio no tienen conocimiento de la Instalación",
                    "Cliente no vive en esta dirección, se mudó",
                    "Cliente indica que pronto se mudará o viajará y rechaza instalación"
                ],
                "Por SOT con errores de Sistema": [
                    "Sin workflow, sin tareas generadas",
                    "Campaña mal configurada, no figura etiquetas correctas",
                    "Solicitud mal generada: No genera reservas",
                    "Solicitud mal generada: Duplicidad de números",
                    "Solicitud mal generada: Duplicidad de etiquetas",
                    "Solicitud mal generada: Sin Co_id",
                    "Solicitud mal generada: Sin CustomerID",
                    "Solicitud mal generada: Sin plano",
                    "Solicitud mal generada: Otros"
                ],
                "Por posible fraude": [
                    "Cliente ya tiene un servicio activo en la misma dirección"
                ]
            }
        },
        motivosTecnicos: {
            "HFC": [
                "Por Red Saturada",
                "Por Factibilidad Tecnica",
                "Por Cambio de Plano",
                "Por Falta de Infraestructura de Red",
                "Por Consulta de Cintillos - HFC"
            ],
            "FTTH": [
                "Por Red Saturada",
                "Por Factibilidad Tecnica",
                "Por Cambio de Plano",
                "Por Falta de Infraestructura de Red",
                "Por Consulta de Cintillos - FTTH"
            ]
        },
        cicloSubmotivos: [
            "Buzón de voz",
            "No contesta",
            "Número no existe",
            "Apagado"
        ]
    };

    // =========================================================================
    // 2. EXTRACCIÓN DE DATOS (DOM PARSING)
    // =========================================================================

    const Utils = {
        getVal: (label) => {
            const elLabel = document.querySelector(`[data-label="${label}"]`);
            if (elLabel) return elLabel.innerText || elLabel.value || "";
            return "";
        },
        getRegex: (regex, idx = 1) => {
            const match = document.body.innerText.match(regex);
            return match ? match[idx] : "";
        },
        calcFranja: (txt) => {
            if (!txt) return "NO DETECTADO";
            let h = -1;
            if (txt.includes("AM") || txt.includes("PM")) {
                const t = txt.split(" ")[1];
                const ap = txt.split(" ")[2];
                h = parseInt(t.split(":")[0]);
                if (ap === "PM" && h !== 12) h += 12;
                if (ap === "AM" && h === 12) h = 0;
            } else if (txt.includes(":")) {
                h = parseInt(txt.split(" ")[1].split(":")[0]);
            }
            if (h >= 8 && h < 11) return "AM1 [09:00 - 11:00]";
            if (h >= 11 && h < 14) return "AM2 [11:00 - 14:00]";
            if (h >= 14 && h < 16) return "PM1 [14:00 - 16:00]";
            if (h >= 16 && h < 21) return "PM2 [16:00 - 20:00]";
            return "TURNO ESPECIAL";
        },
        getCoordenadas: () => {
            let coordX = "";
            let coordY = "";

            coordX = Utils.getVal("Coordenada X") || Utils.getVal("coordenada_x");
            coordY = Utils.getVal("Coordenada Y") || Utils.getVal("coordenada_y");

            if (!coordX) {
                const matchX = document.body.innerText.match(/Coordenada\s+X[:\s]+(-?\d+\.?\d*)/i);
                coordX = matchX ? matchX[1] : "";
            }
            if (!coordY) {
                const matchY = document.body.innerText.match(/Coordenada\s+Y[:\s]+(-?\d+\.?\d*)/i);
                coordY = matchY ? matchY[1] : "";
            }

            return { coordX, coordY };
        },
        getAccionesOrden: () => {
            let acciones = Utils.getVal("Acciones Orden") || Utils.getVal("acciones_orden");

            if (!acciones) {
                const match = document.body.innerText.match(/Acciones\s+Orden[:\s]+\[?\d+\]?\s*(.+)/i);
                if (match) {
                    acciones = match[1].trim();
                }
            }

            if (!acciones) {
                const match = document.body.innerText.match(/\[\d+\]\s*([A-Z\s\-]+(?:MANTENIMIENTO|INSTALACION|MIGRACION|TRASLADO|ALTA|SISACT))/i);
                if (match) {
                    acciones = match[0].trim();
                }
            }

            return acciones || "";
        }
    };

    const extract = () => {
        let sot = Utils.getVal("XA_SOT_ID") || Utils.getRegex(/SOT\s*[:]\s*(\d+)/);
        let agenda = Utils.getVal("XA_Agenda_ID") || Utils.getRegex(/ID Agenda\s*[:]\s*(\d+)/);
        let cliente = Utils.getVal("cname") || Utils.getRegex(/Nombre\s*[:]\s*([A-ZÁÉÍÓÚÑ\s]+)/);
        let telf = Utils.getVal("cphone") || Utils.getRegex(/Tel[eé]fono\s*[:]\s*(\d+)/);
        let subTipo = Utils.getVal("XA_WorkOrderSubtype") || "";
        let sla = document.querySelector('input[data-label="sla_window_start"]')?.getAttribute('data-iso') || Utils.getVal("sla_window_start");
        let codCli = Utils.getVal("customer_number") || "";
        let plano = Utils.getVal("XA_Map") || "";
        let dire = Utils.getVal("caddress") || "";
        let dist = Utils.getVal("cstate") || "";

        const { coordX, coordY } = Utils.getCoordenadas();
        let accionesOrden = Utils.getAccionesOrden();

        let tipo = "validacion";
        if (!sot) tipo = "fueratoa";
        else if (/mantenimiento|averia/i.test(accionesOrden || subTipo)) tipo = "mantenimiento";
        else if (/instalacion|alta|sisact/i.test(accionesOrden || subTipo)) tipo = "instalacion";
        else if (/migracion|traslado|punto|postventa/i.test(accionesOrden || subTipo)) tipo = "postventa";

        return {
            sot: sot || "",
            agenda: agenda || "",
            cliente: cliente ? cliente.trim() : "",
            telf: telf || "",
            franja: Utils.calcFranja(sla),
            tipo: tipo,
            codCli,
            plano,
            dire,
            dist,
            subTipo,
            coordenadas: (coordY && coordX) ? `${coordY}, ${coordX}` : "",
            accionesOrden: accionesOrden,
            fecha: new Date().toLocaleDateString('es-PE', {day:'2-digit', month:'2-digit'})
        };
    };

    // =========================================================================
    // 3. INTERFAZ DE USUARIO (PANEL FLOTANTE)
    // =========================================================================

    const createUI = () => {
        if(document.getElementById('claro-panel-v8')) return;

        const html = `
        <div id="claro-panel-v8">
            <div class="panel-head">
                <span>🤖 TOA MASTER v8.5</span>
                <span id="p-min" style="cursor:pointer">➖</span>
            </div>
            <div id="panel-body">
                <div id="info-box" style="background:#f0f0f0; padding:8px; border-radius:4px; margin-bottom:8px; font-size:11px;">
                    <div style="display:flex; align-items:center; gap:5px; margin-bottom:4px;">
                        <strong style="width:50px;">SOT:</strong>
                        <input type="text" id="info-sot" readonly style="flex:1; padding:3px; background:white; border:1px solid #ccc; border-radius:3px;">
                        <button id="btn-copy-sot" class="btn-mini">📋</button>
                    </div>
                    <div style="display:flex; align-items:center; gap:5px;">
                        <strong style="width:50px;">COORD:</strong>
                        <input type="text" id="info-coord" readonly style="flex:1; padding:3px; background:white; border:1px solid #ccc; border-radius:3px;">
                        <button id="btn-copy-coord" class="btn-mini">📋</button>
                    </div>
                </div>

                <div class="g-row">
                    <input type="text" id="inp-adp" placeholder="Tu Nombre (ADP)" class="inp-save">
                    <input type="text" id="inp-call" placeholder="ID LLAMADA (OBLIGATORIO)" style="border:1px solid red; background:#fff0f0;">
                </div>

                <select id="sel-cat" class="main-sel">
                    <option value="validacion">✅ Validación / Gestión</option>
                    <option value="seguimiento">📞 Seguimiento / Agendamiento</option>
                    <option value="rechazo">🚫 Rechazos</option>
                    <option value="repro">🔄 Reprogramaciones</option>
                    <option value="fueratoa">⚠️ Fuera de TOA</option>
                    <option value="activacion">📶 Activación Plume</option>
                </select>

                <div id="dynamic-area"></div>

                <div class="g-row">
                    <button id="btn-gen" class="b-red">GENERAR</button>
                    <button id="btn-copy" class="b-gray">COPIAR</button>
                </div>
                <textarea id="out-txt"></textarea>
            </div>
        </div>`;

        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);

        GM_addStyle(`
            #claro-panel-v8 { position: fixed; top: 50px; right: 20px; width: 320px; background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10000; font-family: sans-serif; font-size: 12px; border: 2px solid #d32f2f; }
            .panel-head { background: #d32f2f; color: white; padding: 8px; font-weight: bold; display: flex; justify-content: space-between; cursor: grab; }
            #panel-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
            .g-row { display: flex; gap: 5px; }
            input, select { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 12px; }
            .b-red { background: #d32f2f; color: white; border: none; padding: 8px; cursor: pointer; font-weight: bold; flex: 1; border-radius: 4px; }
            .b-gray { background: #555; color: white; border: none; padding: 8px; cursor: pointer; flex: 1; border-radius: 4px; }
            textarea { height: 100px; font-family: monospace; font-size: 11px; }
            .sub-label { font-size: 10px; color: #666; margin-bottom: 2px; display: block; font-weight:bold; }
            input[type="date"] { padding: 4px 5px; }
            .btn-mini { background: #4CAF50; color: white; border: none; padding: 3px 8px; cursor: pointer; border-radius: 3px; font-size: 14px; }
            .btn-mini:hover { background: #45a049; }
            .btn-mini:active { background: #3d8b40; }
        `);

        setupLogic();
    };

    // =========================================================================
    // 4. LÓGICA DINÁMICA
    // =========================================================================

    const setupLogic = () => {
        document.getElementById('inp-adp').value = GM_getValue('adp_name', '');
        document.getElementById('inp-adp').onchange = (e) => GM_setValue('adp_name', e.target.value);

        const updateInfoBox = () => {
            const d = extract();
            document.getElementById('info-sot').value = d.sot || "NO DETECTADO";
            document.getElementById('info-coord').value = d.coordenadas || "NO DETECTADO";
        };

        updateInfoBox();

        const showCopyFeedback = (btnId) => {
            const btn = document.getElementById(btnId);
            const original = btn.innerText;
            btn.innerText = "✓";
            btn.style.background = "#2196F3";
            setTimeout(() => {
                btn.innerText = original;
                btn.style.background = "#4CAF50";
            }, 1000);
        };

        document.getElementById('btn-copy-sot').onclick = () => {
            const val = document.getElementById('info-sot').value;
            if (val && val !== "NO DETECTADO") {
                navigator.clipboard.writeText(val);
                showCopyFeedback('btn-copy-sot');
            }
        };

        document.getElementById('btn-copy-coord').onclick = () => {
            const val = document.getElementById('info-coord').value;
            if (val && val !== "NO DETECTADO") {
                navigator.clipboard.writeText(val);
                showCopyFeedback('btn-copy-coord');
            }
        };

        document.getElementById('p-min').onclick = () => {
            const b = document.getElementById('panel-body');
            b.style.display = b.style.display === 'none' ? 'flex' : 'none';
        };

        const catSel = document.getElementById('sel-cat');
        const area = document.getElementById('dynamic-area');

        const render = () => {
            const val = catSel.value;
            const d = extract();
            let html = '';

            if (val === 'validacion') {
                html = `
                    <span class="sub-label">Sub-Tipo:</span>
                    <select id="v-sub">
                        <option value="instalacion">Instalación</option>
                        <option value="postventa">Post-Venta</option>
                        <option value="mantenimiento">Mantenimiento</option>
                    </select>
                    <div id="v-mant-box" style="display:none; margin-top:5px;">
                        <span class="sub-label">Código Solución:</span>
                        <select id="v-cod">
                            <option value="">-- Seleccionar --</option>
                            ${DB.codigosMantenimiento.map(c => `<option value="${c.cod}">${c.cod} - ${c.desc}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (val === 'seguimiento') {
                html = `
                    <span class="sub-label">Acción:</span>
                    <select id="s-act">
                        <option value="confirma">Confirma Visita</option>
                        <option value="adelanto">Adelanta Visita</option>
                        <option value="mantiene">Mantiene Fecha</option>
                        <option value="franja">Habilitar Franja</option>
                        <option value="ciclo">Ciclo Llamadas</option>
                    </select>
                    <div id="s-contrata-box" style="margin-top:5px;">
                        <span class="sub-label">Contrata:</span>
                        <select id="s-contrata">
                            <option value="">-- Seleccionar --</option>
                            ${DB.contratas.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    <div id="s-extra-box" style="display:none; margin-top:5px;">
                    </div>
                `;
            } else if (val === 'rechazo') {
                html = `
                    <span class="sub-label">Tipo de Rechazo:</span>
                    <select id="r-tipo-principal">
                        <option value="MESA_CAMPO">Mesa o Campo</option>
                        <option value="TECNICO">Motivo Técnico</option>
                    </select>

                    <div id="r-mesacampo-box" style="margin-top:5px;">
                        <span class="sub-label">Rechazado en:</span>
                        <select id="r-scope">
                            <option value="MESA">MESA</option>
                            <option value="CAMPO">CAMPO</option>
                        </select>
                        <span class="sub-label" style="margin-top:5px">Motivo:</span>
                        <select id="r-mot"></select>
                        <span class="sub-label" style="margin-top:5px">Sub-Motivo:</span>
                        <select id="r-sub"></select>
                        <div id="r-extra-fields"></div>
                    </div>

                    <div id="r-tecnico-box" style="display:none; margin-top:5px;">
                        <span class="sub-label">Tecnología:</span>
                        <select id="r-tecnologia">
                            <option value="HFC">HFC</option>
                            <option value="FTTH">FTTH</option>
                        </select>
                        <span class="sub-label" style="margin-top:5px">Motivo Técnico:</span>
                        <select id="r-motivo-tec"></select>
                        <div id="r-campos-tec" style="margin-top:5px;"></div>
                    </div>
                `;
            } else if (val === 'repro') {
                html = `
                    <span class="sub-label">Reprogramado en:</span>
                    <select id="rp-scope">
                        <option value="MESA">MESA</option>
                        <option value="CAMPO">CAMPO</option>
                    </select>

                    <span class="sub-label" style="margin-top:5px">Reagendado por:</span>
                    <select id="rp-reagenda">
                        <option value="CLARO">CLARO</option>
                        <option value="CLIENTE">CLIENTE</option>
                    </select>

                    <span class="sub-label" style="margin-top:5px">Motivo:</span>
                    <select id="rp-mot"></select>

                    <span class="sub-label" style="margin-top:5px">Sub-Motivo:</span>
                    <select id="rp-submot"></select>

                    <span class="sub-label" style="margin-top:5px">Cliente:</span>
                    <input type="text" id="rp-cliente" value="${d.cliente}">

                    <span class="sub-label" style="margin-top:5px">Teléfono:</span>
                    <input type="text" id="rp-telf" value="${d.telf}">

                    <span class="sub-label" style="margin-top:5px">Nueva Fecha y Franja:</span>
                    <div class="g-row">
                        <input type="date" id="rp-fecha" style="width: 55%;">
                        <select id="rp-franja" style="width: 45%;">
                            <option value="AM1 [09:00 - 11:00]">AM1 (09-11)</option>
                            <option value="AM2 [11:00 - 14:00]">AM2 (11-14)</option>
                            <option value="PM1 [14:00 - 16:00]">PM1 (14-16)</option>
                            <option value="PM2 [16:00 - 20:00]">PM2 (16-20)</option>
                        </select>
                    </div>

                    <span class="sub-label" style="margin-top:5px">Observación:</span>
                    <input type="text" id="rp-obs" placeholder="Observación adicional">

                    <span class="sub-label" style="margin-top:5px">Contrata:</span>
                    <select id="rp-contrata">
                         <option value="">-- Contrata --</option>
                         ${DB.contratas.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                `;
            } else if (val === 'activacion') {
                html = `
                    <input type="text" id="a-dni" placeholder="DNI Cliente" style="margin-bottom:5px">
                    <input type="text" id="a-serie" placeholder="Serie Repetidor">
                    <input type="text" id="a-mac" placeholder="MAC Repetidor" style="margin-top:5px">
                `;
            } else if (val === 'fueratoa') {
                html = `
                    <span class="sub-label">Servicio (Acciones Orden):</span>
                    <input type="text" id="f-servicio" placeholder="Ej: [844] FTTH - MANTENIMIENTO" value="${d.accionesOrden || ''}">
                `;
            }

            area.innerHTML = html;
            postRenderLogic(val);
        };

        const postRenderLogic = (cat) => {
            if (cat === 'validacion') {
                document.getElementById('v-sub').onchange = (e) => {
                    document.getElementById('v-mant-box').style.display = e.target.value === 'mantenimiento' ? 'block' : 'none';
                };
            }

            if (cat === 'seguimiento') {
                const act = document.getElementById('s-act');
                act.onchange = () => {
                    const v = act.value;
                    const cBox = document.getElementById('s-contrata-box');
                    const eBox = document.getElementById('s-extra-box');

                    cBox.style.display = (v === 'confirma' || v === 'adelanto' || v === 'mantiene') ? 'block' : 'none';
                    eBox.style.display = (v === 'franja' || v === 'ciclo') ? 'block' : 'none';

                    if (v === 'franja') {
                        eBox.innerHTML = '<input type="text" id="s-input-extra" placeholder="Supervisor a cargo">';
                    }

                    if (v === 'ciclo') {
                        eBox.innerHTML = `
                            <span class="sub-label">Sub-Motivo:</span>
                            <select id="s-submotivo">
                                ${DB.cicloSubmotivos.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        `;
                    }
                };
            }

            if (cat === 'rechazo') {
                const tipoPrincipal = document.getElementById('r-tipo-principal');
                const mesaCampoBox = document.getElementById('r-mesacampo-box');
                const tecnicoBox = document.getElementById('r-tecnico-box');

                tipoPrincipal.onchange = () => {
                    if (tipoPrincipal.value === 'MESA_CAMPO') {
                        mesaCampoBox.style.display = 'block';
                        tecnicoBox.style.display = 'none';
                        fillMot();
                    } else {
                        mesaCampoBox.style.display = 'none';
                        tecnicoBox.style.display = 'block';
                        fillMotivosTec();
                    }
                };

                // LÓGICA MESA/CAMPO
                const scope = document.getElementById('r-scope');
                const mot = document.getElementById('r-mot');
                const sub = document.getElementById('r-sub');
                const extra = document.getElementById('r-extra-fields');

                const fillMot = () => {
                    const list = Object.keys(DB.rechazoMotivos[scope.value]);
                    mot.innerHTML = list.map(m => `<option value="${m}">${m}</option>`).join('');
                    fillSub();
                };

                const fillSub = () => {
                    const list = DB.rechazoMotivos[scope.value][mot.value] || [];
                    sub.innerHTML = list.map(s => `<option value="${s}">${s}</option>`).join('');
                    updateExtraFields();
                };

                const updateExtraFields = () => {
                    const d = extract();
                    const motivo = mot.value;
                    let html = '';

                    if (!motivo.includes("errores de Sistema")) {
                        html += `<input type="text" id="r-persona" placeholder="Persona que contesta" style="margin-top:5px">`;
                    }
                    html += `<input type="text" id="r-numero" placeholder="Número de contacto" value="${d.telf}" style="margin-top:5px">`;

                    if (motivo.includes("Duplicidad")) {
                        html += `<input type="text" id="r-dupli" placeholder="SOT que atendió" style="margin-top:5px">`;
                    }
                    if (motivo.includes("Mal Ingreso")) {
                        html += `<input type="text" id="r-dir-reg" placeholder="Dirección registrada" value="${d.dire}" style="margin-top:5px">`;
                        html += `<input type="text" id="r-dir-cor" placeholder="Dirección correcta" style="margin-top:5px">`;
                    }
                    if (motivo.includes("Mala Oferta")) {
                        html += `<input type="text" id="r-paq-ing" placeholder="Paquete ingresado" style="margin-top:5px">`;
                        html += `<input type="text" id="r-paq-cor" placeholder="Paquete correcto" style="margin-top:5px">`;
                    }
                    if (motivo.includes("fraude")) {
                        html += `<input type="text" id="r-custid" placeholder="Customer ID" value="${d.codCli}" style="margin-top:5px">`;
                        html += `<input type="text" id="r-autor" placeholder="Autorizado por" style="margin-top:5px">`;
                    }

                    extra.innerHTML = html;
                };

                scope.onchange = fillMot;
                mot.onchange = fillSub;

                // LÓGICA MOTIVO TÉCNICO
                const tecnologia = document.getElementById('r-tecnologia');
                const motivoTec = document.getElementById('r-motivo-tec');
                const camposTec = document.getElementById('r-campos-tec');

                const fillMotivosTec = () => {
                    const list = DB.motivosTecnicos[tecnologia.value];
                    motivoTec.innerHTML = list.map(m => `<option value="${m}">${m}</option>`).join('');
                    updateCamposTec();
                };

                const updateCamposTec = () => {
                    const d = extract();
                    const mot = motivoTec.value;
                    const tec = tecnologia.value;
                    let html = '';

                    if (mot.includes("Consulta de Cintillos")) {
                        if (tec === "HFC") {
                            html = `<input type="text" id="t-tap" placeholder="TAP: Ej. #1 NO SATURADO" style="margin-bottom:5px">`;
                        } else {
                            html = `
                                <input type="text" id="t-fat1" placeholder="FAT #1 (SATURADO/NO SATURADO)" style="margin-bottom:5px">
                                <input type="text" id="t-fat2" placeholder="FAT #2 (SATURADO/NO SATURADO)" style="margin-bottom:5px">
                                <input type="text" id="t-fat3" placeholder="FAT #3 (SATURADO/NO SATURADO)">
                            `;
                        }
                    } else if (mot.includes("Cambio de Plano")) {
                        html = `
                            <input type="text" id="t-plano-cor" placeholder="Plano correcto" style="margin-bottom:5px">
                            <input type="text" id="t-coord-cli" placeholder="Coordenada cliente" value="${d.coordenadas}">
                        `;
                    } else {
                        html = `
                            <input type="text" id="t-tecnico" placeholder="Técnico" style="margin-bottom:5px">
                            <input type="text" id="t-dni" placeholder="DNI" style="margin-bottom:5px">
                            <input type="text" id="t-coord-tec" placeholder="Coordenada del técnico">
                        `;
                    }

                    camposTec.innerHTML = html;
                };

                tecnologia.onchange = fillMotivosTec;
                motivoTec.onchange = updateCamposTec;

                // Inicializar
                fillMot();
            }

            if (cat === 'repro') {
                const reagenda = document.getElementById('rp-reagenda');
                const mot = document.getElementById('rp-mot');
                const submot = document.getElementById('rp-submot');

                const fillMotivos = () => {
                    const motivos = DB.reproMotivos[reagenda.value];
                    const list = Object.keys(motivos);
                    mot.innerHTML = list.map(m => `<option value="${m}">${m}</option>`).join('');
                    fillSubmotivos();
                };

                const fillSubmotivos = () => {
                    const submotivos = DB.reproMotivos[reagenda.value][mot.value] || [];
                    submot.innerHTML = submotivos.map(s => `<option value="${s}">${s}</option>`).join('');
                };

                reagenda.onchange = fillMotivos;
                mot.onchange = fillSubmotivos;
                fillMotivos();
            }
        };

        catSel.onchange = render;
        render();

        // GENERAR TEXTO
        document.getElementById('btn-gen').onclick = () => {
            const d = extract();
            const adp = document.getElementById('inp-adp').value.toUpperCase() || "ADP";
            const call = document.getElementById('inp-call').value || "[ID LLAMADA]";
            const cat = catSel.value;
            let txt = "";

            if (cat === 'validacion') {
                const sub = document.getElementById('v-sub').value;
                if (sub === 'mantenimiento') {
                    const cod = document.getElementById('v-cod').value;
                    const info = DB.codigosMantenimiento.find(x => x.cod === cod);
                    const desc = info ? `${info.cod} // ${info.desc} // ${info.sol}` : "[FALTA CODIGO]";
                    txt = `MESA MULTISKILL HITSS\nID LLAMADA: ${call}\nSOT: ${d.sot}\nCOD. SOLUCIÓN PRINCIPAL: ${desc}\nVALIDADO POR: ${d.cliente}\nNUMERO WSP: ${d.telf}\nADP: ${adp}`;
                } else {
                    txt = `MESA MULTISKILL HITSS\nID LLAMADA: ${call}\nSOT: ${d.sot}\nVALIDADO POR: ${d.cliente}\nNUMERO WSP: ${d.telf}\nADP: ${adp}`;
                }
            } else if (cat === 'seguimiento') {
                const act = document.getElementById('s-act').value;
                const header = "MESA MULTISKILL HITSS";

                if (act === 'ciclo') {
                    const submotivo = document.getElementById('s-submotivo').value;
                    txt = `${header} - CICLO DE LLAMADAS\nCICLO DE LLAMADA NRO: 1\nCANTIDAD DE LLAMADAS: 4\nNUMERO: ${d.telf}\nMOTIVO: FALTA DE CONTACTO\nSUB-MOTIVO: ${submotivo}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (act === 'franja') {
                    const sup = document.getElementById('s-input-extra').value || "[SUPERVISOR]";
                    txt = `${header} - FORMATO PARA HABILITAR FRANJA 📥\nSOT: ${d.sot}\n🪚 PLANO: ${d.plano}\n📅 FECHA Y FRANJA: ${d.franja}\n📧 Motivo: SIN FRANJAS DISPONIBLES\n🚨‍ Sup a cargo: ${sup}`;
                } else {
                    const contrata = document.getElementById('s-contrata').value || "[CONTRATA]";
                    let titulo = act === 'confirma' ? "CONFIRMA VISITA" : act === 'adelanto' ? "ADELANTA VISITA" : "MANTIENE FECHA DE VISITA";
                    txt = `${header} - ${titulo}\nSOT: ${d.sot}\nDÍA Y FRANJA: ${d.franja}\nCLIENTE: ${d.cliente}\nNUMERO: ${d.telf}\nCONTRATA: ${contrata}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp}`;
                }
            } else if (cat === 'rechazo') {
                const tipoPrincipal = document.getElementById('r-tipo-principal').value;

                if (tipoPrincipal === 'MESA_CAMPO') {
                    const scope = document.getElementById('r-scope').value;
                    const mot = document.getElementById('r-mot').value;
                    const sub = document.getElementById('r-sub').value;
                    const persona = document.getElementById('r-persona')?.value || "NO APLICA";
                    const numero = document.getElementById('r-numero')?.value || d.telf;

                    txt = `MESA MULTISKILL HITSS\nRECHAZO EN MESA / CAMPO: RECHAZO EN ${scope}`;

                    if (!mot.includes("errores de Sistema")) {
                        txt += `\nPERSONA QUE CONTESTA: ${persona}`;
                    }
                    txt += `\nNUMERO DE CONTACTO: ${numero}`;
                    txt += `\nMOTIVO DEL RECHAZO: ${mot.toUpperCase()}`;

                    if (mot.includes("Mal Ingreso")) {
                        const dirReg = document.getElementById('r-dir-reg')?.value || "[DIR REGISTRADA]";
                        const dirCor = document.getElementById('r-dir-cor')?.value || "[DIR CORRECTA]";
                        txt += `\nDIRECCION REGISTRADA: ${dirReg}`;
                        txt += `\nDIRECCIÓN CORRECTA: ${dirCor}`;
                    }

                    txt += `\nSUBMOTIVO DE RECHAZO: ${sub}`;

                    if (mot.includes("Duplicidad")) {
                        const dupli = document.getElementById('r-dupli')?.value || "[SOT ATENDIDA]";
                        txt += `\nSE PROCEDE AL RECHAZO DE LA SOLICITUD POR DUPLICIDAD DE SOT, SE ATENDIÓ CON LA SOT: ${dupli}`;
                    }

                    if (mot.includes("Mala Oferta")) {
                        const paqIng = document.getElementById('r-paq-ing')?.value || "[PAQUETE INGRESADO]";
                        const paqCor = document.getElementById('r-paq-cor')?.value || "[PAQUETE CORRECTO]";
                        txt += `\nPAQUETE INGRESADO: ${paqIng}`;
                        txt += `\nPAQUETE CORRECTO: ${paqCor}`;
                    }

                    if (mot.includes("errores de Sistema")) {
                        txt += `\nSE PROCEDE AL RECHAZO DE LA SOLICITUD POR TENER ERRORES DE SISTEMAS:`;
                    }

                    if (mot.includes("fraude")) {
                        const custid = document.getElementById('r-custid')?.value || d.codCli;
                        const autor = document.getElementById('r-autor')?.value || "[SUPERVISOR]";
                        txt += `\nCUSTOMER ID: ${custid}`;
                        txt += `\nAUTORIZADO POR: ${autor}`;
                    }

                    txt += `\nID DE LLAMADA: ${call}`;
                    txt += `\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;

                } else {
                    // MOTIVO TÉCNICO
                    const tec = document.getElementById('r-tecnologia').value;
                    const motTec = document.getElementById('r-motivo-tec').value;

                    if (motTec.includes("Consulta de Cintillos")) {
                        txt = `MESA MULTISKILL HITSS - CONSULTA DE CINTILLOS ${tec}\nPLANO: ${d.plano}\n`;
                        if (tec === "HFC") {
                            const tap = document.getElementById('t-tap')?.value || "[TAP INFO]";
                            txt += `TAP: ${tap}`;
                        } else {
                            const fat1 = document.getElementById('t-fat1')?.value || "[FAT 1]";
                            const fat2 = document.getElementById('t-fat2')?.value || "[FAT 2]";
                            const fat3 = document.getElementById('t-fat3')?.value || "[FAT 3]";
                            txt += `FAT ${fat1}\nFAT ${fat2}\nFAT ${fat3}`;
                        }
                        txt += `\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                    } else if (motTec.includes("Cambio de Plano")) {
                        const planoCor = document.getElementById('t-plano-cor')?.value || "[PLANO CORRECTO]";
                        const coordCli = document.getElementById('t-coord-cli')?.value || d.coordenadas;
                        txt = `MESA MULTISKILL HITSS\nMOTIVO: CAMBIO DE PLANO\nPLANO CORRECTO: ${planoCor}\nCOORDENADA CLIENTE: ${coordCli}\nREALIZADO POR: ${adp} - HITSS`;
                    } else {
                        const tecnico = document.getElementById('t-tecnico')?.value || "[TÉCNICO]";
                        const dni = document.getElementById('t-dni')?.value || "[DNI]";
                        const coordTec = document.getElementById('t-coord-tec')?.value || "[COORD TÉCNICO]";

                        let motivoTexto = "";
                        let submotivoTexto = "";
                        let observaciones = "";

                        if (motTec.includes("Red Saturada")) {
                            motivoTexto = "RED SATURADA";
                            submotivoTexto = "TAP Saturado";
                            observaciones = "PROCEDE RECHAZO se verifica con plantilla TAP SATURADO";
                        } else if (motTec.includes("Factibilidad")) {
                            motivoTexto = "FACTIBILIDAD TECNICA";
                            submotivoTexto = `Acometida excede los 85 metros (${tec})`;
                            observaciones = `PROCEDE RECHAZO, realizar quiebre en TOA. Se valida en street view domicilio de 6 pisos, cliente CN en piso 3 parte del fondo, por lo cual excede acometida ${tec}, entrará a un proceso de revisión por un supervisor de campo`;
                        } else if (motTec.includes("Falta de Infraestructura")) {
                            motivoTexto = "FALTA DE INFRAESTRUCTURA DE RED";
                            submotivoTexto = `No hay red ${tec} en la zona/avenida`;
                            observaciones = "PROCEDE RECHAZO, según coordenadas enviadas, se valida domicilio del cliente fuera de cobertura.";
                        }

                        txt = `MESA MULTISKILL HITSS\nRECHAZO EN CAMPO\nTécnico: ${tecnico} - DNI/ ${dni}\nAsesor: ${adp}\nTipo de caso: Rechazo\nTipo de actividad: Instalación\nEstado de Solicitud: Atendido\nSub-estado de Solicitud: Se Rechaza SOT\nMotivo rechazo: ${motivoTexto}\nSub-motivo rechazo: ${submotivoTexto}\nPLANO: ${d.plano}\nCoordenada cliente: ${d.coordenadas}\nCoordenada del técnico: ${coordTec}\nObservaciones: ${observaciones}`;
                    }
                }

            } else if (cat === 'repro') {
                const scope = document.getElementById('rp-scope').value;
                const reagenda = document.getElementById('rp-reagenda').value;
                const mot = document.getElementById('rp-mot').value;
                const submot = document.getElementById('rp-submot').value;
                const cliente = document.getElementById('rp-cliente').value || d.cliente;
                const telf = document.getElementById('rp-telf').value || d.telf;
                const fec = document.getElementById('rp-fecha').value;
                const fra = document.getElementById('rp-franja').value;
                const obs = document.getElementById('rp-obs').value || "[SIN OBSERVACIÓN]";
                const con = document.getElementById('rp-contrata').value || "[CONTRATA]";

                const datePart = fec ? `${fec.split('-')[2]}/${fec.split('-')[1]}/${fec.split('-')[0]}` : "[DD/MM/AAAA]";
                const newDateFormatted = `${datePart} - ${fra}`;

                txt = `MESA MULTISKILL HITSS\nREPROGRAMADO EN: ${scope}\nREAGENDADO POR: ${reagenda}\nMOTIVO DE REPROGRAMACIÓN: ${mot}\nSUB-MOTIVO DE REPROGRAMACION: ${submot}\nCLIENTE: ${cliente}\nTELÉFONO: ${telf}\nNUEVA FECHA Y FRANJA DE VISITA: ${newDateFormatted}\nOBSERVACIÓN: ${obs}\nCONTRATA: ${con}\nREALIZADO POR: ${adp}\nCÓD LLAMADA: ${call}`;

            } else if (cat === 'activacion') {
                const dni = document.getElementById('a-dni').value || "[DNI]";
                const ser = document.getElementById('a-serie').value || "[SERIE]";
                const mac = document.getElementById('a-mac').value || "[MAC]";
                txt = `MESA MULTISKILL HITSS - ACTUALIZACIÓN FIRMWARE PLUME\nSOT: ${d.sot}\nCUSTOMER ID: ${d.codCli}\nNOMBRE CLIENTE: ${d.cliente}\nDNI: ${dni}\nSERIE REPETIDOR: ${ser}\nMAC REPETIDOR: ${mac}\nSN/MAC: [INGRESAR]\nCORREO: [INGRESAR]\nESTADO: [INGRESAR]\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
            } else if (cat === 'fueratoa') {
                const servicio = document.getElementById('f-servicio').value || "[SERVICIO NO DETECTADO]";
                txt = `*FUERA DE TOA*\n📥 SOT: ${d.sot || '[SOT]'} (No en TOA)\n⚙️ SUB TIPO: ${d.subTipo}\n🏡 DIRECCIÓN: ${d.dire}\n📍 DISTRITO: ${d.dist}\n⚒️ SERVICIO: ${servicio}\n🪚 PLANO: ${d.plano}\n👨‍💻 CLIENTE: ${d.cliente}\n🔣 COD CLIENTE: ${d.codCli}\n📱 CELULAR DEL CLIENTE: ${d.telf}\n📅 FECHA Y FRANJA: ${d.fecha} - ${d.franja}\n✍️ REALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
            }

            document.getElementById('out-txt').value = txt;
        };

        // COPIAR
        document.getElementById('btn-copy').onclick = () => {
            const t = document.getElementById('out-txt');
            t.select();
            navigator.clipboard.writeText(t.value);
            const btn = document.getElementById('btn-copy');
            const original = btn.innerText;
            btn.innerText = "¡Copiado!";
            setTimeout(() => btn.innerText = original, 1500);
        };
    };

    setTimeout(createUI, 4000);
})();