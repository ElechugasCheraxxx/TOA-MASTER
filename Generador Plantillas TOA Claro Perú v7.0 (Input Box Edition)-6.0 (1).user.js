// ==UserScript==
// @name         Generador Plantillas TOA Claro Perú v7.0 (Input Box Edition)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Generador de plantillas con formularios interactivos. Elimina la necesidad de editar texto manualmente.
// @author       Cheraxxx
// @match        https://amx-peru.fs.ocs.oraclecloud.com/*
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
        // [cite: 18-106] y [cite: 324-368]
        codigosMantenimiento: [
            { cod: "AB01", desc: "TV/Control desprogramado" }, { cod: "AB02", desc: "Cliente desconfiguró ONT/EMTA" },
            { cod: "AB03", desc: "Cliente modificó red interna" }, { cod: "AB04", desc: "Comparte señal/exceso disp." },
            { cod: "AB05", desc: "Teléfono desconfigurado" }, { cod: "AB06", desc: "Equipos desconectados" },
            { cod: "AB07", desc: "No cuenta con minutos" }, { cod: "AB08", desc: "Prob. equipos del cliente" },
            { cod: "DE01", desc: "Conmutación llamadas" }, { cod: "DE04", desc: "Degradación servicio (PEXT)" },
            { cod: "DE05", desc: "Avería Masiva (PEXT)" }, { cod: "EQ01", desc: "Cambio Control Remoto" },
            { cod: "EQ02", desc: "Cambio Extensor/MESH" }, { cod: "EQ05", desc: "Cambio ONT/EMTA falla" },
            { cod: "EQ06", desc: "Cambio ONT/EMTA + Acometida" }, { cod: "EQ09", desc: "Cambio STB falla" },
            { cod: "FI03", desc: "Config. Puertos" }, { cod: "FI08", desc: "Reinicio ONT/EMTA" },
            { cod: "FI09", desc: "Instalación MESH" }, { cod: "FI12", desc: "WiFi equipos Claro" },
            { cod: "PC02", desc: "Cambio Acometida" }, { cod: "PC03", desc: "Acometida + Cableado" },
            { cod: "PC04", desc: "Cable Coaxial (HFC)" }, { cod: "PC06", desc: "Conector óptico sucio" },
            { cod: "PC08", desc: "Reacomodo acometida" }, { cod: "TE10", desc: "Acometida desconectada" }
        ],
        // [cite: 313-320]
        reproMotivos: {
            "CLARO": [
                "Error generación SOT / Pérdida fecha", "Caída masiva sistemas",
                "Insistencia cuadrilla contrata", "Retraso técnico instalación",
                "Incidencias en campo", "Falta materiales/herramientas",
                "Sobreagendamiento cuotas (TOA)", "Error zona de trabajo"
            ],
            "CLIENTE": [
                "Solicitud Cliente (Cambio fecha)", "Cliente de viaje",
                "Solo puede domingos/noche", "Desconoce fecha agendamiento",
                "No cuenta con equipos nuevo domicilio", "No brinda facilidades (ductos/permisos)",
                "Factores climatológicos", "Falta de contacto", "Cliente Ausente"
            ]
        },
        // [cite: 380-462]
        rechazoMotivos: {
            "MESA": {
                "Cliente no desea": ["Tiene otro operador", "No contrató servicio", "Demora atención", "Motivos personales"],
                "Duplicidad": ["Se atendió con otra SOT"],
                "Facilidades Técnicas": ["Dueño no autoriza", "Sin acceso techo", "Ducterías obstruidas", "SOT suspensión/baja"],
                "Falta de contacto": ["Números errados/No contesta"],
                "Mal Ingreso Dirección": ["Dirección registrada errada"],
                "Mala Oferta": ["Tecnología incorrecta", "Velocidad no acorde", "Decos no acordes", "Solicitó Postventa"],
                "Mudanza o Viaje": ["Cliente de viaje", "Cliente se mudó"],
                "Error Sistema": ["Sin workflow", "Campaña mal config", "Error SOT (Duplicidad/Sin ID)"],
                "Posible Fraude": ["Ya tiene servicio activo"]
            },
            "CAMPO": {
                "Cliente no desea": ["Tiene otro operador", "No contrató", "Demora", "Motivos personales"],
                "Duplicidad": ["Se atendió con otra SOT"],
                "Facilidades Técnicas": ["No autorizan", "Sin acceso techo", "Ducterías obstruidas"],
                "Falta de contacto": ["No hay contacto en visita"],
                "Mal Ingreso Dirección": ["Dirección errada"],
                "Red Saturada": ["TAP Saturado", "FAT Saturado"],
                "Factibilidad": ["Acometida excede metros", "Distancia pozo"],
                "Falta Infraestructura": ["No hay red en zona"]
            }
        }
    };

    // =========================================================================
    // 2. EXTRACCIÓN DE DATOS (DOM PARSING)
    // =========================================================================

    const Utils = {
        getVal: (label) => {
            // Prioridad: data-label -> ID input -> Regex texto
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
            // [cite: 124-138] Lógica de franjas
            let h = -1;
            if (txt.includes("AM") || txt.includes("PM")) {
                const t = txt.split(" ")[1]; const ap = txt.split(" ")[2];
                h = parseInt(t.split(":")[0]);
                if (ap === "PM" && h !== 12) h += 12;
                if (ap === "AM" && h === 12) h = 0;
            } else if (txt.includes(":")) {
                h = parseInt(txt.split(" ")[1].split(":")[0]);
            }
            if (h >= 8 && h < 11) return "AM1 [09:00 - 11:00]"; // [cite: 310]
            if (h >= 11 && h < 14) return "AM2 [11:00 - 14:00]";
            if (h >= 14 && h < 16) return "PM1 [14:00 - 16:00]";
            if (h >= 16 && h < 21) return "PM2 [16:00 - 20:00]";
            return "TURNO ESPECIAL";
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

        // Auto-detect tipo [cite: 140-143]
        let tipo = "validacion";
        if (!sot) tipo = "fueratoa";
        else if (/mantenimiento|averia/i.test(subTipo)) tipo = "mantenimiento";
        else if (/instalacion|alta/i.test(subTipo)) tipo = "instalacion";
        else if (/migracion|traslado|punto/i.test(subTipo)) tipo = "postventa";

        return {
            sot: sot || "", agenda: agenda || "", cliente: cliente ? cliente.trim() : "",
            telf: telf || "", franja: Utils.calcFranja(sla), tipo: tipo,
            codCli, plano, dire, dist, subTipo,
            fecha: new Date().toLocaleDateString('es-PE', {day:'2-digit', month:'2-digit'})
        };
    };

// =========================================================================
// 3. INTERFAZ DE USUARIO (PANEL FLOTANTE)
// =========================================================================

const createUI = () => {
    if(document.getElementById('claro-panel-v6')) return;

    const html = `
    <div id="claro-panel-v6">
        <div class="panel-head">
            <span>🤖 TOA MASTER v6.0</span>
            <span id="p-min" style="cursor:pointer">➖</span>
        </div>
        <div id="panel-body">
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

    // Estilos
    GM_addStyle(`
        #claro-panel-v6 { position: fixed; top: 50px; right: 20px; width: 320px; background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10000; font-family: sans-serif; font-size: 12px; border: 2px solid #d32f2f; }
        .panel-head { background: #d32f2f; color: white; padding: 8px; font-weight: bold; display: flex; justify-content: space-between; cursor: grab; }
        #panel-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
        .g-row { display: flex; gap: 5px; }
        input, select { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; }
        .b-red { background: #d32f2f; color: white; border: none; padding: 8px; cursor: pointer; font-weight: bold; flex: 1; border-radius: 4px; }
        .b-gray { background: #555; color: white; border: none; padding: 8px; cursor: pointer; flex: 1; border-radius: 4px; }
        textarea { height: 100px; font-family: monospace; }
        .sub-label { font-size: 10px; color: #666; margin-bottom: 2px; display: block; font-weight:bold; }
    `);

    setupLogic();
};

// =========================================================================
// 4. LÓGICA DINÁMICA
// =========================================================================

const setupLogic = () => {
    // Cargar ADP guardado
    document.getElementById('inp-adp').value = GM_getValue('adp_name', '');
    document.getElementById('inp-adp').onchange = (e) => GM_setValue('adp_name', e.target.value);

    // Minimizar
    document.getElementById('p-min').onclick = () => {
        const b = document.getElementById('panel-body');
        b.style.display = b.style.display === 'none' ? 'flex' : 'none';
    };

    // Renderizado Dinámico
    const catSel = document.getElementById('sel-cat');
    const area = document.getElementById('dynamic-area');

    const render = () => {
        const val = catSel.value;
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
                    <input type="text" id="s-input-extra" placeholder="...">
                </div>
            `;
        } else if (val === 'rechazo') {
            html = `
                <div class="g-row">
                    <select id="r-scope"><option value="MESA">En MESA</option><option value="CAMPO">En CAMPO</option></select>
                </div>
                <span class="sub-label" style="margin-top:5px">Motivo:</span>
                <select id="r-mot"></select>
                <span class="sub-label" style="margin-top:5px">Sub-Motivo:</span>
                <select id="r-sub"></select>
                <input type="text" id="r-persona" placeholder="Persona que contesta" style="margin-top:5px">
                <input type="text" id="r-dupli" placeholder="SOT que atendió (si es duplicidad)" style="margin-top:5px; display:none;">
            `;
        } else if (val === 'repro') { // <--- CAMBIO AQUÍ
            html = `
                <span class="sub-label">Origen:</span>
                <select id="rp-ori"><option value="CLARO">Por CLARO</option><option value="CLIENTE">Por CLIENTE</option></select>
                <span class="sub-label" style="margin-top:5px">Motivo Específico:</span>
                <select id="rp-mot"></select>

                <span class="sub-label" style="margin-top:5px">Nueva Fecha y Franja:</span>
                <div class="g-row">
                    <input type="date" id="rp-fecha" style="width: 55%;" title="Seleccionar fecha">
                    <select id="rp-franja" style="width: 45%;">
                        <option value="AM1 [09:00 - 11:00]">AM1 (09-11)</option>
                        <option value="AM2 [11:00 - 14:00]">AM2 (11-14)</option>
                        <option value="PM1 [14:00 - 16:00]">PM1 (14-16)</option>
                        <option value="PM2 [16:00 - 20:00]">PM2 (16-20)</option>
                    </select>
                </div>

                <select id="rp-contrata" style="margin-top:5px">
                     <option value="">-- Contrata --</option>
                     ${DB.contratas.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <input type="text" id="rp-obs" placeholder="Observación adicional" style="margin-top:5px">
            `;
        } else if (val === 'activacion') {
            html = `
                <input type="text" id="a-dni" placeholder="DNI Cliente" style="margin-bottom:5px">
                <input type="text" id="a-serie" placeholder="Serie Repetidor" style="margin-bottom:5px">
                <input type="text" id="a-mac" placeholder="MAC Repetidor">
            `;
        } else if (val === 'fueratoa') {
            html = `
                <span class="sub-label">Servicio Solicitado:</span>
                <input type="text" id="f-servicio" placeholder="Ej: HFC - Internet / FTTH - Trío">
            `;
        }

        area.innerHTML = html;
        postRenderLogic(val);
    };

    const postRenderLogic = (cat) => {
        // ... (Lógica para validación, seguimiento, rechazo NO CAMBIA) ...
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
                const eInp = document.getElementById('s-input-extra');

                cBox.style.display = (v === 'confirma' || v === 'adelanto' || v === 'mantiene') ? 'block' : 'none';
                eBox.style.display = (v === 'franja' || v === 'ciclo') ? 'block' : 'none';

                if (v === 'franja') eInp.placeholder = "Supervisor a cargo";
                if (v === 'ciclo') eInp.placeholder = "Submotivo (Buzón, Apagado...)";
            };
        }
        if (cat === 'rechazo') {
            const scope = document.getElementById('r-scope');
            const mot = document.getElementById('r-mot');
            const sub = document.getElementById('r-sub');
            const dupli = document.getElementById('r-dupli');

            const fillMot = () => {
                const list = Object.keys(DB.rechazoMotivos[scope.value]);
                mot.innerHTML = list.map(m => `<option value="${m}">${m}</option>`).join('');
                fillSub();
            };
            const fillSub = () => {
                const list = DB.rechazoMotivos[scope.value][mot.value] || [];
                sub.innerHTML = list.map(s => `<option value="${s}">${s}</option>`).join('');
                dupli.style.display = mot.value.includes("Duplicidad") ? 'block' : 'none';
            };

            scope.onchange = fillMot;
            mot.onchange = fillSub;
            fillMot();
        }
        if (cat === 'repro') {
            const ori = document.getElementById('rp-ori');
            const mot = document.getElementById('rp-mot');
            const fill = () => {
                const list = DB.reproMotivos[ori.value];
                mot.innerHTML = list.map(m => `<option value="${m}">${m}</option>`).join('');
            };
            ori.onchange = fill;
            fill();
        }
    };

    catSel.onchange = render;
    render(); // Init

    // Generar Texto
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
                const extra = document.getElementById('s-input-extra').value || "[SUBMOTIVO]";
                txt = `${header} - CICLO DE LLAMADAS\nCICLO DE LLAMADA NRO: 1\nCANTIDAD DE LLAMADAS: 4\nNUMERO: ${d.telf}\nMOTIVO: FALTA DE CONTACTO\nSUB-MOTIVO: ${extra}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
            } else if (act === 'franja') {
                const sup = document.getElementById('s-input-extra').value || "[SUPERVISOR]";
                txt = `${header} - FORMATO PARA HABILITAR FRANJA 📥\nSOT: ${d.sot}\n🪚 PLANO: ${d.plano}\n📅 FECHA Y FRANJA: ${d.franja}\n📧 Motivo: SIN FRANJAS DISPONIBLES\n🚨‍ Sup a cargo: ${sup}`;
            } else {
                const contrata = document.getElementById('s-contrata').value || "[CONTRATA]";
                let titulo = act === 'confirma' ? "CONFIRMA VISITA" : act === 'adelanto' ? "ADELANTA VISITA" : "MANTIENE FECHA DE VISITA";
                txt = `${header} - ${titulo}\nSOT: ${d.sot}\nDÍA Y FRANJA: ${d.franja}\nCLIENTE: ${d.cliente}\nNUMERO: ${d.telf}\nCONTRATA: ${contrata}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp}`;
            }
        } else if (cat === 'rechazo') {
            const scope = document.getElementById('r-scope').value;
            const mot = document.getElementById('r-mot').value.toUpperCase();
            const sub = document.getElementById('r-sub').value;
            const per = document.getElementById('r-persona').value || "[NO APLICA]";
            txt = `MESA MULTISKILL HITSS\nRECHAZO EN MESA / CAMPO: RECHAZO EN ${scope}\nPERSONA QUE CONTESTA: ${per}\nNUMERO DE CONTACTO: ${d.telf}\nMOTIVO DEL RECHAZO: ${mot}\nSUBMOTIVO DE RECHAZO: ${sub}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
            if(mot.includes("DUPLICIDAD")) {
                txt += `\nSE ATENDIÓ CON SOT: ${document.getElementById('r-dupli').value || "[SOT ATENDIDA]"}`;
            }
        } else if (cat === 'repro') {
            // --- CÓDIGO MODIFICADO AQUÍ ---
            const ori = document.getElementById('rp-ori').value;
            const mot = document.getElementById('rp-mot').value;

            const fec = document.getElementById('rp-fecha').value; // YYYY-MM-DD
            const fra = document.getElementById('rp-franja').value; // AM1, AM2, etc.

            // Formato DD/MM
            const datePart = fec ? `${fec.split('-')[2]}/${fec.split('-')[1]}` : "[DD/MM]";
            const newDateFormatted = `${datePart} - ${fra}`;

            const con = document.getElementById('rp-contrata').value || "[CONTRATA]";
            const obs = document.getElementById('rp-obs').value || "[SIN OBSERVACIÓN]";

            txt = `MESA MULTISKILL HITSS\nREPROGRAMADO EN MESA (MESA/CAMPO) / REAGENDADO POR CLARO (${ori})\nMOTIVO DE REPROGRAMACIÓN: ${ori} - ${mot}\nCLIENTE: ${d.cliente}\nTELÉFONO: ${d.telf}\nNUEVA FECHA Y FRANJA DE VISITA: ${newDateFormatted}\nOBSERVACIÓN: ${obs}\nCONTRATA: ${con}\nREALIZADO POR: ${adp}\nCÓD LLAMADA: ${call}`;
            // ---------------------------------
        } else if (cat === 'activacion') {
            const dni = document.getElementById('a-dni').value || "[DNI]";
            const ser = document.getElementById('a-serie').value || "[SERIE]";
            const mac = document.getElementById('a-mac').value || "[MAC]";
            txt = `MESA MULTISKILL HITSS - ACTUALIZACIÓN FIRMWARE PLUME\nSOT: ${d.sot}\nCUSTOMER ID: ${d.codCli}\nNOMBRE CLIENTE: ${d.cliente}\nDNI: ${dni}\nSERIE REPETIDOR: ${ser}\nMAC REPETIDOR: ${mac}\nSN/MAC: [INGRESAR]\nCORREO: [INGRESAR]\nESTADO: [INGRESAR]\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
        } else if (cat === 'fueratoa') {
            const servicio = document.getElementById('f-servicio').value || "[SERVICIO]";
            txt = `*FUERA DE TOA*\n📥 SOT: ${d.sot || '[SOT]'} (No en TOA)\n⚙️ SUB TIPO: ${d.subTipo}\n🏡 DIRECCIÓN: ${d.dire}\n📍 DISTRITO: ${d.dist}\n⚒️ SERVICIO: ${servicio}\n🪚 PLANO: ${d.plano}\n👨‍💻 CLIENTE: ${d.cliente}\n🔣 COD CLIENTE: ${d.codCli}\n📱 CELULAR DEL CLIENTE: ${d.telf}\n📅 FECHA Y FRANJA: ${d.fecha} - ${d.franja}\n✍️ REALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
        }

        document.getElementById('out-txt').value = txt;
    };

    // Copiar
    document.getElementById('btn-copy').onclick = () => {
        const t = document.getElementById('out-txt');
        t.select();
        navigator.clipboard.writeText(t.value);
    };
};

setTimeout(createUI, 2500); // Esperar carga
})();