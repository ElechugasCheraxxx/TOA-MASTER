// ==UserScript==
// @name         Generador Plantillas TOA Claro Perú v10.0 (COMPLETO CON ACTIVACIONES)
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Solución definitiva para automatizar plantillas de Oracle Field Service (TOA). Incluye Activaciones, Cierre Mantenimiento y PEXT.
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
    // 1. BASE DE DATOS COMPLETA v10.0
    // =========================================================================

    const DB = {
        contratas: [
            "SAVAL", "CARLEI", "TELECOM", "TELECONTACTO", "WITLINK",
            "JAMAPUC", "INSERTEL", "SOLDECOM", "CONEXIT", "DIMA", "FEBEZA", "JOLBEC"
        ],
        codigosMantenimiento: [
            // AB - CLIENTE
            { cod: "AB01", esc: "CLIENTE", sol: "MANIPULACIÓN CLIENTE - Televisor / Control Remoto desprogramados o sin pilas" },
            { cod: "AB02", esc: "CLIENTE", sol: "MANIPULACIÓN CLIENTE - Cliente desconfiguro equipo ONT /EMTA" },
            { cod: "AB03", esc: "CLIENTE", sol: "MANIPULACIÓN CLIENTE - Cliente modifico red interna" },
            { cod: "AB04", esc: "CLIENTE", sol: "MANIPULACIÓN CLIENTE - Comparte señal a otras personas / varias PCs conectadas" },
            { cod: "AB05", esc: "CLIENTE", sol: "MANIPULACIÓN CLIENTE - Equipo telefónico desconfigurado o mal conectado" },
            { cod: "AB06", esc: "CLIENTE", sol: "MANIPULACIÓN CLIENTE - Equipos desconectados o problemas con las tomas de corriente" },
            { cod: "AB07", esc: "CLIENTE", sol: "PROB. CLIENTE - No cuenta con minutos para llamar" },
            { cod: "AB08", esc: "CLIENTE", sol: "PROB. CLIENTE - Problemas con Equipos propiedad del cliente" },
            { cod: "AB09", esc: "CLIENTE", sol: "PROB. CLIENTE - Reinstalación por incendio, remodelación o construcción" },
            { cod: "AB10", esc: "CLIENTE", sol: "MANIPULACION CLIENTE - Equipo telefónico averiado por cliente" },
            { cod: "AB11", esc: "CLIENTE", sol: "PROB. CLIENTE - Control remoto sin pilas o agotadas" },

            // DE - DERIVADO
            { cod: "DE01", esc: "DERIVADO", sol: "CONMUTACIÓN - Llamadas no se concentran a ciertos números detelerminados" },
            { cod: "DE02", esc: "DERIVADO", sol: "CONMUTACIÓN - Operadora indica que número no existe (llamada entrante)" },
            { cod: "DE03", esc: "DERIVADO", sol: "CONMUTACIÓN - Problemas con SVA (central Virtual, hunting, etc)" },
            { cod: "DE04", esc: "DERIVADO", sol: "DERIVADO PEXT - Degradación del servicio" },
            { cod: "DE05", esc: "DERIVADO", sol: "DERIVADO PEXT - Sin Servicio / Averia Masiva" },
            { cod: "DE06", esc: "DERIVADO", sol: "DERIVADO PEXT - Niveles RF Altos / Bajos" },
            { cod: "DE07", esc: "DERIVADO", sol: "DERIVADO PEXT - Intermitencia / Pérdida de paquetes" },
            { cod: "DE08", esc: "DERIVADO", sol: "DERIVADO PEXT - Mala Señal" },
            { cod: "DE09", esc: "DERIVADO", sol: "Derivado a segundo nivel" },

            // EQ - CAMBIO DE EQUIPO
            { cod: "EQ01", esc: "CAMBIO DE EQUIPO", sol: "Control remoto no funciona" },
            { cod: "EQ02", esc: "CAMBIO DE EQUIPO", sol: "Cambio de EXTERSOR WIFI - MESH" },
            { cod: "EQ04", esc: "CAMBIO DE EQUIPO", sol: "EMTA Cambio por tecnología / Fidelización" },
            { cod: "EQ05", esc: "CAMBIO DE EQUIPO", sol: "ONT/ EMTA - Problemas con el equipo" },
            { cod: "EQ06", esc: "CAMBIO DE EQUIPO", sol: "ONT/ EMTA - Problemas con el equipo + Cambio de Acometida" },
            { cod: "EQ07", esc: "CAMBIO DE EQUIPO", sol: "ONT/ EMTA - Problemas con el equipo + Cambio de Cableado interno" },
            { cod: "EQ08", esc: "CAMBIO DE EQUIPO", sol: "STB - Problemas con el equipo + cambio de Acometida" },
            { cod: "EQ09", esc: "CAMBIO DE EQUIPO", sol: "STB - Problemas con el equipo" },
            { cod: "EQ10", esc: "CAMBIO DE EQUIPO", sol: "STB - Problemas con el equipo + Cambio de Cable Interno" },
            { cod: "EQ11", esc: "CAMBIO DE EQUIPO", sol: "TELEFONO - Problemas con el equipo" },
            { cod: "EQ12", esc: "CAMBIO DE EQUIPO / IP FIJA", sol: "ONT/ EMTA - Problemas con el equipo - NEGOCIO + IP FIJA" },
            { cod: "EQ13", esc: "CAMBIO DE EQUIPO / IP FIJA", sol: "EMTA Cambio por tecnología / Fidelización - NEGOCIO + IP FIJA" },
            { cod: "EQ14", esc: "CAMBIO DE EQUIPO", sol: "Cambio de EMTA /ONT - STB- MESH - Factores climatologicos" },
            { cod: "EQ15", esc: "CAMBIO DE EQUIPO", sol: "Cambio de ONT / EMTA Factores climatologicos" },
            { cod: "EQ16", esc: "CAMBIO DE EQUIPO", sol: "Cambio de ONT / EMTA + MESH Factores climatologicos" },
            { cod: "EQ17", esc: "CAMBIO DE EQUIPO", sol: "Cambio STB - Factores climatologicos" },
            { cod: "EQ18", esc: "CAMBIO DE EQUIPO", sol: "SWICH problema del equipo" },

            // FA - FALSA AVERIA
            { cod: "FA01", esc: "FALSA AVERIA", sol: "AVERIA DE RED" },
            { cod: "FA02", esc: "FALSA AVERIA", sol: "Cliente con corte o suspensión" },
            { cod: "FA03", esc: "FALSA AVERIA", sol: "cliente informa servicio Conforme - OK en línea" },
            { cod: "FA04", esc: "FALSA AVERIA", sol: "Incidencia mal generada por ATC" },
            { cod: "FA05", esc: "FALSA AVERIA", sol: "Incidencia mal generada por duplicidad" },
            { cod: "FA06", esc: "FALSA AVERIA", sol: "Cliente derivado a otras áreas" },
            { cod: "FA07", esc: "FALSA AVERIA", sol: "Solución con soporte remoto" },
            { cod: "FA08", esc: "FALSA AVERIA", sol: "SOT con datos incorrectos" },
            { cod: "FA09", esc: "FALSA AVERIA", sol: "Cliente informa en línea dará de baja el servicio" },
            { cod: "FA10", esc: "FALSA AVERIA", sol: "Cliente no permite visita por disponibilidad horaria/accesos a domicilio" },
            { cod: "FA11", esc: "FALSA AVERIA", sol: "Duplicidad cerrado por ATC" },
            { cod: "FA12", esc: "FALSA AVERIA", sol: "Cerrado por falta de contacto" },

            // FI - CONFIGURACIÓN
            { cod: "FI02", esc: "CONFIGURACIÓN", sol: "Configuración Avanzada (3 a Mas Equipos) / solo para claro negocios" },
            { cod: "FI03", esc: "CONFIGURACIÓN", sol: "Configuración de Puertos EMTA /ONT" },
            { cod: "FI06", esc: "CONFIGURACIÓN", sol: "Problemas Extensión de cobertura WIFI" },
            { cod: "FI07", esc: "CONFIGURACIÓN", sol: "Puebas de servicios integral / SOT priorizados se deriva a 2N" },
            { cod: "FI08", esc: "CONFIGURACIÓN", sol: "Reinicio de ONT /EMTA" },
            { cod: "FI09", esc: "CONFIGURACIÓN", sol: "Instalación /Configuración - Externsor WIFI - MESH" },
            { cod: "FI10", esc: "CONFIGURACIÓN", sol: "Reactivación de servicios internet y/o telefonia" },
            { cod: "FI11", esc: "CONFIGURACIÓN", sol: "Envió de comandos / reactivación de servicios - TV" },
            { cod: "FI12", esc: "CONFIGURACIÓN", sol: "Configuración Wifi equipos Claro" },
            { cod: "FI13", esc: "CONFIGURACIÓN", sol: "Configuración Wifi equipos cliente" },
            { cod: "FI14", esc: "CONFIGURACIÓN", sol: "Configuración de aplicaciones en deco IPTV" },
            { cod: "FI15", esc: "CONFIGURACIÓN", sol: "Explicación de uso del servicio" },

            // IN - INSTALACIÓN
            { cod: "IN02", esc: "INSTALACIÓN", sol: "Inspección técnica (verificación de servicio contratado) - claro empresas" },

            // MO - MOVILIZACIÓN
            { cod: "MO01", esc: "MOVILIZACIÓN", sol: "Cliente ausente" },
            { cod: "MO02", esc: "MOVILIZACIÓN", sol: "Cliente dará de baja el servicio" },
            { cod: "MO03", esc: "MOVILIZACIÓN", sol: "Cliente informa servicio Conforme-visita técnica" },
            { cod: "MO04", esc: "MOVILIZACIÓN", sol: "No hay facilidades técnicas" },
            { cod: "MO05", esc: "MOVILIZACIÓN", sol: "Cliente informa ya no desea asistencia técnica" },

            // PC - DISPOSITIVO INTERNO
            { cod: "PC01", esc: "DISPOSITIVO INTERNO", sol: "Cambio o reposición de cables Patch Cord" },
            { cod: "PC02", esc: "DISPOSITIVO INTERNO", sol: "Cambio de acometida" },
            { cod: "PC03", esc: "DISPOSITIVO INTERNO", sol: "Cambio de acometida + Cambio de cables internos" },
            { cod: "PC04", esc: "DISPOSITIVO INTERNO", sol: "Cambio de cables internos coaxial / solo servicios HFC" },
            { cod: "PC05", esc: "DISPOSITIVO INTERNO", sol: "Cambio de fuente de equipo terminal" },
            { cod: "PC06", esc: "DISPOSITIVO INTERNO", sol: "Conector óptico sucio" },
            { cod: "PC07", esc: "DISPOSITIVO INTERNO", sol: "Conectores flojos" },
            { cod: "PC08", esc: "DISPOSITIVo INTERNO", sol: "Reacomodo de acometida" },
            { cod: "PC09", esc: "DISPOSITIVO INTERNO", sol: "Roseta telefonica averiada" },
            { cod: "PC10", esc: "DISPOSITIVO INTERNO", sol: "Roseta OPTICA averiada" },
            { cod: "PC12", esc: "DISPOSITIVO INTERNO", sol: "Reacomodo Acometida - Autoinstalación" },
            { cod: "PC13", esc: "DISPOSITIVO INTERNO", sol: "Divisor averiado (Splitter- Splitter RJ45)" },
            { cod: "PC14", esc: "DISPOSITIVO INTERNO", sol: "Cambio o reposición de cables HDMI" },
            { cod: "PC15", esc: "DISPOSITIVO INTERNO", sol: "Cambio o reposición de cable JUMPER UTP" },
            { cod: "PC16", esc: "DISPOSITIVO INTERNO", sol: "Cambio de cables internos telefónico" },
            { cod: "PC17", esc: "DISPOSITIVO INTERNO", sol: "Cambio de cables internos UTP /STP" },
            { cod: "PC18", esc: "DISPOSITIVO INTERNO", sol: "Cambio de conector optico / solo para FTTH" },
            { cod: "PC19", esc: "DISPOSITIVO INTERNO", sol: "Cambio de conector RG6 / solo para HFC" },
            { cod: "PC20", esc: "DISPOSITIVO INTERNO", sol: "Cambio de conector RJ45" },
            { cod: "PC21", esc: "DISPOSITIVO INTERNO", sol: "Cambio de conector RJ11" },
            { cod: "PC22", esc: "DISPOSITIVO INTERNO", sol: "Colocación de chapa Q/P / seguro para la acometida" },
            { cod: "PC23", esc: "DISPOSITIVO INTERNO", sol: "Retiro de cables internos" },

            // TE - TERCEROS
            { cod: "TE10", esc: "TERCEROS", sol: "Acometida desconectada" },
            { cod: "TE11", esc: "TERCEROS", sol: "Acometida cortada desde el TAP" }
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
                "Por Duplicidad": ["se atendió con otra SOT"],
                "Facilidades Técnicas": [
                    "Dueño de Casa y/o Edificio no autoriza la instalacion",
                    "Al momento de la instalación no hay acceso al techo",
                    "Al momento de la instalación se valida ducterias obstruidas",
                    "Cliente cuenta con sot de suspensión y/o baja"
                ],
                "Falta de contacto": ["No hay contacto con el cliente (números errados)"],
                "Mal Ingreso de Direccion": ["Dirección registrada en el sistema es errada"],
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
                "Por posible fraude": ["Cliente ya tiene un servicio activo en la misma dirección"]
            },
            "CAMPO": {
                "Cliente no desea servicio": [
                    "Cliente ya tiene servicio de otro operador",
                    "Titular no ha contratado ningun servicio a Claro",
                    "Demora en la atención de la solicitud, ya no desea esperar",
                    "Cliente no desea servicio por Motivos personales"
                ],
                "Por Duplicidad": ["se atendió con otra SOT"],
                "Facilidades Técnicas": [
                    "Dueño de Casa y/o Edificio no autoriza la instalacion",
                    "Al momento de la instalación no hay acceso al techo",
                    "Al momento de la instalación se valida ducterias obstruidas",
                    "Cliente cuenta con sot de suspensión y/o baja"
                ],
                "Falta de contacto": ["No hay contacto con el cliente (números errados)"],
                "Mal Ingreso de Direccion": ["Dirección registrada en el sistema es errada"],
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
                "Por posible fraude": ["Cliente ya tiene un servicio activo en la misma dirección"]
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
        cicloSubmotivos: ["Buzón de voz", "No contesta", "Número no existe", "Apagado"],

        // NUEVA BASE DE DATOS DE MODELOS EMTA/ONT v10.0
        modelosEquipos: {
            "HFC": {
                "CISCO": [
                    { modelo: "CISCO DPC3926", wifi: "2.4 GHZ", velocidad: "HASTA 30 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/CISCO%20DPC3926.png" },
                    { modelo: "CISCO DPQ3925", wifi: "2.4 GHZ", velocidad: "HASTA 30 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/CISCO%20DPQ3925.png" }
                ],
                "ARRIS": [
                    { modelo: "ARRIS TG862", wifi: "2.4 GHZ", velocidad: "HASTA 30 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/ARRIS%20TG862.png" },
                    { modelo: "ARRIS TG2482", wifi: "5.0 GHZ Y 2.4 GHZ", velocidad: "HASTA 300 MBPS", repetidor: "SI", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/ARRIS%20TG2482%20.png" },
                    { modelo: "ARRIS TG3442", wifi: "5.0 GHZ Y 2.4 GHZ", velocidad: "DESDE 301 HASTA 1000 MBPS", repetidor: "SI", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/ARRIS%20TG3442.png" }
                ],
                "SAGECOM": [
                    { modelo: "SAGEMCOM FAST3686V2.2", wifi: "5.0 GHZ Y 2.4 GHZ", velocidad: "HASTA 300 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/SAGEMCOM%20FAST3686V2.2%20.png" },
                    { modelo: "SAGEMCOM F3890 V3", wifi: "5.0 GHZ Y 2.4 GHZ", velocidad: "DESDE 301 HASTA 1000 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/SAGEMCOM%20F3890%20V3.png" }
                ],
                "TECNICOLOR": [
                    { modelo: "TECNICOLOR CGA2121", wifi: "5.0 GHZ Y 2.4 GHZ", velocidad: "HASTA 300 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/TECNICOLOR%20CGA2121%20.png" },
                    { modelo: "TECNICOLOR CGA4233 CLP2", wifi: "5.0 GHZ Y 2.4 GHZ", velocidad: "DESDE 301 HASTA 1000 MBPS", repetidor: "NO", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/TECNICOLOR%20CGA4233%20CLP2%20.png" }
                ]
            },
            "FTTH": {
                "HUAWEI": [
                    { modelo: "HUAWEI HG8245Q2", wifi: "2.4 GHZ", velocidad: "1000 MBPS", repetidor: "NO", antenas: "SIN ANTENAS", totalAntenas: "SIN ANTENAS", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/HUAWEI%20HG8245Q2.png" },
                    { modelo: "HUAWEI HG815V5", wifi: "2.4 GHZ", velocidad: "1000 MBPS", repetidor: "NO", antenas: "2X1", totalAntenas: "2", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/HUAWEI%20HG815V5.png" }
                ],
                "ZTE": [
                    { modelo: "ZTE ZXHNF680", wifi: "2.4 GHZ", velocidad: "1000 MBPS", repetidor: "NO", antenas: "3X2", totalAntenas: "6", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/ZTE%20ZXHNF680.png" },
                    { modelo: "ZTE F6600P v9.0.12", wifi: "2.4 GHZ", velocidad: "1000 MBPS", repetidor: "NO", antenas: "2X2", totalAntenas: "4", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/ZTE%20F6600P%20v9.0.12.png" }
                ],
                "SAGECOM": [
                    { modelo: "SAGEMCOM FAST5670 v2", wifi: "6 GHZ", velocidad: "1024 MBPS A MAS", repetidor: "NO", antenas: "SIN ANTENAS", totalAntenas: "SIN ANTENAS", link: "https://raw.githubusercontent.com/ElechugasCheraxxx/DB-EMTAandONT/refs/heads/main/SAGEMCOM%20FAST5670%20v2.png" }
                ]
            }
        }
    };

    // Variables para persistencia de códigos generados
    DB.codigosGenerados = GM_getValue('codigos_autorizacion', []);
    DB.contadorCodigos = GM_getValue('contador_codigos', 0);

    // =========================================================================
    // 2. FUNCIONES DE AYUDA
    // =========================================================================

    const generarCodigoAutorizacion = (usuarioE) => {
        const fecha = new Date();
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
        const fechaStr = `${dia}${mes}${anio}`;

        let contador = DB.contadorCodigos + 1;
        const letra = contador % 2 === 0 ? 'B' : 'A';

        const codigo = `${contador}${usuarioE}${fechaStr}${letra}`;

        // Actualizar base de datos
        DB.codigosGenerados.push(codigo);
        DB.contadorCodigos = contador;

        // Guardar en persistencia
        GM_setValue('codigos_autorizacion', DB.codigosGenerados);
        GM_setValue('contador_codigos', DB.contadorCodigos);

        return codigo;
    };

    const eliminarUltimoCodigo = () => {
        if (DB.codigosGenerados.length > 0) {
            DB.codigosGenerados.pop();
            GM_setValue('codigos_autorizacion', DB.codigosGenerados);
            return true;
        }
        return false;
    };

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
            let coordX = Utils.getVal("Coordenada X") || Utils.getVal("coordenada_x");
            let coordY = Utils.getVal("Coordenada Y") || Utils.getVal("coordenada_y");

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
                if (match) acciones = match[1].trim();
            }

            if (!acciones) {
                const match = document.body.innerText.match(/\[\d+\]\s*([A-Z\s\-]+(?:MANTENIMIENTO|INSTALACION|MIGRACION|TRASLADO|ALTA|SISACT))/i);
                if (match) acciones = match[0].trim();
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
            sot: sot || "", agenda: agenda || "", cliente: cliente ? cliente.trim() : "",
            telf: telf || "", franja: Utils.calcFranja(sla), tipo: tipo,
            codCli, plano, dire, dist, subTipo,
            coordenadas: (coordY && coordX) ? `${coordY}, ${coordX}` : "",
            accionesOrden: accionesOrden,
            fecha: new Date().toLocaleDateString('es-PE', {day:'2-digit', month:'2-digit'})
        };
    };

    // =========================================================================
    // 3. INTERFAZ DE USUARIO v10.0
    // =========================================================================

    const createUI = () => {
        if(document.getElementById('claro-panel-v10')) return;

        const html = `
        <div id="claro-panel-v10">
            <div class="panel-head">
                <span>🤖 TOA MASTER v10.0</span>
                <span id="p-min" style="cursor:pointer">➖</span>
            </div>
            <div id="panel-body">
                <div id="info-box" style="background:#f0f0f0; padding:8px; border-radius:4px; margin-bottom:8px; font-size:11px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <strong style="color:#d32f2f;">📋 DATOS DETECTADOS</strong>
                        <button id="btn-regenerar" class="btn-regenerar">🔄 REGENERAR</button>
                    </div>
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
                    <option value="activaciones">🔧 Activaciones</option>
                    <option value="cierre-mantenimiento">📋 Cierre Mantenimiento</option>
                    <option value="derivacion-pext">📡 Derivación PEXT</option>
                    <option value="fueratoa">⚠️ Fuera de TOA</option>
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
            #claro-panel-v10 { position: fixed; top: 50px; right: 20px; width: 350px; background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10000; font-family: sans-serif; font-size: 12px; border: 2px solid #d32f2f; }
            .panel-head { background: #d32f2f; color: white; padding: 8px; font-weight: bold; display: flex; justify-content: space-between; cursor: grab; }
            #panel-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; max-height: 80vh; overflow-y: auto; }
            .g-row { display: flex; gap: 5px; }
            input, select, textarea { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 12px; }
            textarea { height: 60px; font-family: monospace; font-size: 11px; resize: vertical; }
            .b-red { background: #d32f2f; color: white; border: none; padding: 8px; cursor: pointer; font-weight: bold; flex: 1; border-radius: 4px; }
            .b-gray { background: #555; color: white; border: none; padding: 8px; cursor: pointer; flex: 1; border-radius: 4px; }
            .sub-label { font-size: 10px; color: #666; margin-bottom: 2px; display: block; font-weight:bold; }
            input[type="date"] { padding: 4px 5px; }
            .btn-mini { background: #4CAF50; color: white; border: none; padding: 3px 8px; cursor: pointer; border-radius: 3px; font-size: 14px; }
            .btn-mini:hover { background: #45a049; }
            .btn-regenerar { background: #FF9800; color: white; border: none; padding: 4px 10px; cursor: pointer; border-radius: 4px; font-size: 11px; font-weight: bold; transition: all 0.3s; }
            .btn-regenerar:hover { background: #F57C00; }
            .btn-regenerar:active { background: #E65100; transform: scale(0.95); }
            .btn-regenerar.regenerando { background: #4CAF50; animation: pulse 0.5s; }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        `);

        setupLogic();
    };

    // =========================================================================
    // 4. LÓGICA COMPLETA v10.0
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

        // REGENERAR DATOS
        document.getElementById('btn-regenerar').onclick = () => {
            const btn = document.getElementById('btn-regenerar');
            btn.innerText = '⏳ Actualizando...';
            btn.classList.add('regenerando');
            btn.disabled = true;

            setTimeout(() => {
                updateInfoBox();
                render();
                document.getElementById('out-txt').value = '';

                btn.innerText = '✓ Actualizado';
                btn.classList.remove('regenerando');
                btn.disabled = false;

                setTimeout(() => {
                    btn.innerText = '🔄 REGENERAR';
                }, 1500);
            }, 300);
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
                            <option value="">-- Seleccionar Código --</option>
                            ${DB.codigosMantenimiento.map(c => `<option value="${c.cod}">${c.cod} - ${c.sol.substring(0, 45)}...</option>`).join('')}
                        </select>
                    </div>

                    <div id="v-common-fields" style="margin-top:5px;">
                        <span class="sub-label">Teléfono de Contacto:</span>
                        <input type="text" id="v-telefono" value="${d.telf}" placeholder="Número de contacto" style="margin-bottom:5px;">

                        <span class="sub-label">Observación:</span>
                        <select id="v-obs-tipo" style="margin-bottom:5px;">
                            <option value="">-- Seleccionar observación --</option>
                            <option value="RPC">Número es RPC del Técnico</option>
                            <option value="FAMILIAR">Número es de Familiar o Encargado</option>
                            <option value="OTROS">Otros</option>
                        </select>

                        <textarea id="v-obs-adicional" placeholder="Observaciones adicionales (opcional)" style="height:60px;"></textarea>
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
                    <div id="s-extra-box" style="display:none; margin-top:5px;"></div>
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
            } else if (val === 'activaciones') {
                html = `
                    <span class="sub-label">Tipo de Activación:</span>
                    <select id="a-tipo">
                        <option value="actualizacion-firmware">🔄 Actualización Firmware Plume</option>
                        <option value="instalacion">📶 Instalación</option>
                        <option value="reenvio">📡 Reenvío de Señal</option>
                        <option value="traslado-externo">🚚 Traslado Externo</option>
                        <option value="deco-adicional">📺 Decodificador Adicional</option>
                        <option value="cambio-plan">🔄 Cambio de Plan</option>
                        <option value="cambio-equipo">🔧 Cambio de Equipo</option>
                        <option value="mesh">📶 Mesh (Repetidor)</option>
                        <option value="plume">🌐 Plume (Repetidor)</option>
                        <option value="codigo-autorizacion">🔐 Código Autorización</option>
                    </select>

                    <div id="a-campos-generales" style="margin-top:5px;">
                        <span class="sub-label">Usuario E:</span>
                        <input type="text" id="a-usuario-e" placeholder="E759393" pattern="E\\d{6}" title="Formato: E seguido de 6 dígitos">

                        <span class="sub-label" style="margin-top:5px">Serie del Equipo:</span>
                        <input type="text" id="a-serie" placeholder="Ej: SN123456789">

                        <span class="sub-label" style="margin-top:5px">MAC del Equipo:</span>
                        <input type="text" id="a-mac" placeholder="Ej: AA:BB:CC:DD:EE:FF">

                        <span class="sub-label" style="margin-top:5px">Modelo EMTA/ONT:</span>
                        <select id="a-modelo">
                            <option value="">-- Seleccionar Modelo --</option>
                            ${Object.entries(DB.modelosEquipos).map(([tech, brands]) => `
                                <optgroup label="${tech}">
                                    ${Object.entries(brands).map(([brand, models]) => `
                                        ${models.map(m => `<option value="${m.modelo}">${brand} - ${m.modelo}</option>`).join('')}
                                    `).join('')}
                                </optgroup>
                            `).join('')}
                        </select>

                        <div id="a-info-modelo" style="background:#f8f9fa; padding:5px; border-radius:3px; margin-top:5px; font-size:10px; display:none;"></div>
                    </div>

                    <div id="a-campos-especificos" style="margin-top:5px;"></div>

                    <!-- Generador de Códigos -->
                    <div id="a-generador-codigos" style="margin-top:10px; border-top:1px solid #ddd; padding-top:10px; display:none;">
                        <span class="sub-label">Generador de Códigos de Autorización</span>
                        <div style="display:flex; gap:5px; margin-bottom:5px;">
                            <button id="btn-generar-codigo" class="btn-mini" style="flex:1">🔢 GENERAR CÓDIGO</button>
                            <button id="btn-eliminar-codigo" class="btn-mini" style="background:#f44336; flex:1">🗑️ ELIMINAR ÚLTIMO</button>
                        </div>
                        <div id="lista-codigos" style="max-height:100px; overflow-y:auto; border:1px solid #ddd; padding:5px; background:#fff;">
                            ${DB.codigosGenerados.map(cod => `<div style="font-family:monospace; font-size:10px; margin:2px 0;">${cod}</div>`).join('')}
                        </div>
                        <input type="text" id="a-codigo-autorizacion" placeholder="Código de autorización" style="margin-top:5px;" readonly>
                    </div>
                `;
            } else if (val === 'cierre-mantenimiento') {
                html = `
                    <span class="sub-label">Área de Cierre:</span>
                    <select id="cm-area">
                        <option value="mesa">🏢 Mesa</option>
                        <option value="campo">🏠 Campo</option>
                    </select>

                    <div id="cm-mesa-box" style="margin-top:5px;">
                        <span class="sub-label">Escenario:</span>
                        <select id="cm-mesa-escenario">
                            <option value="ok-linea">✅ OK - En Línea</option>
                            <option value="img-suspension">🚫 IMG - Suspensión</option>
                            <option value="img-atc">🚫 IMG - ATC</option>
                            <option value="img-baja">🚫 IMG - Baja</option>
                            <option value="img-duplicidad">🚫 IMG - Duplicidad</option>
                            <option value="img-falta-contacto">🚫 IMG - Falta Contacto</option>
                            <option value="img-derivado">🚫 IMG - Derivado</option>
                            <option value="img-facilidades">🚫 IMG - Facilidades</option>
                            <option value="img-datos-incorrectos">🚫 IMG - Datos Incorrectos</option>
                        </select>
                    </div>

                    <div id="cm-campo-box" style="display:none; margin-top:5px;">
                        <span class="sub-label">Escenario:</span>
                        <select id="cm-campo-escenario">
                            <option value="mo-01">🚫 MO-01 - Cliente Ausente</option>
                            <option value="mo-02">🚫 MO-02 - Cliente dará de baja</option>
                            <option value="mo-04">🚫 MO-04 - No hay facilidades</option>
                            <option value="in-02">🚫 IN-02 - Inspección técnica</option>
                        </select>
                    </div>

                    <div id="cm-campos-comunes" style="margin-top:5px;">
                        <span class="sub-label">Teléfono:</span>
                        <input type="text" id="cm-telefono" value="${d.telf}" placeholder="Teléfono de contacto">

                        <span class="sub-label" style="margin-top:5px">¿Se adjunta audio?</span>
                        <select id="cm-audio">
                            <option value="SI">✅ SI</option>
                            <option value="NO">❌ NO</option>
                        </select>

                        <span class="sub-label" style="margin-top:5px">Contrata:</span>
                        <select id="cm-contrata">
                            <option value="">-- Seleccionar --</option>
                            ${DB.contratas.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>

                        <div id="cm-campos-adicionales" style="margin-top:5px;"></div>
                    </div>
                `;
            } else if (val === 'derivacion-pext') {
                html = `
                    <span class="sub-label">Tecnología:</span>
                    <select id="dp-tecnologia">
                        <option value="hfc">📡 HFC</option>
                        <option value="ftth">🔦 FTTH</option>
                    </select>

                    <div id="dp-hfc-box" style="margin-top:5px;">
                        <span class="sub-label">Tipo de Problema HFC:</span>
                        <select id="dp-hfc-tipo">
                            <option value="tap-sin-servicio">🔌 Tap Sin Servicio</option>
                            <option value="enlace-lento">🐌 Enlace Lento</option>
                            <option value="intermitencia">⚡ Intermitencia</option>
                            <option value="mala-senal-catv">📺 Mala Señal CATV</option>
                        </select>
                    </div>

                    <div id="dp-ftth-box" style="display:none; margin-top:5px;">
                        <span class="sub-label">Tipo de Problema FTTH:</span>
                        <select id="dp-ftth-tipo">
                            <option value="sin-servicio">🔌 Sin Servicio</option>
                            <option value="niveles-fuera-rango">📊 Niveles Fuera de Rango</option>
                        </select>
                    </div>

                    <div id="dp-campos-dinamicos" style="margin-top:10px;"></div>
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
                const subSel = document.getElementById('v-sub');
                const mantBox = document.getElementById('v-mant-box');
                subSel.onchange = () => {
                    mantBox.style.display = subSel.value === 'mantenimiento' ? 'block' : 'none';
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

            if (cat === 'activaciones') {
                const tipoAct = document.getElementById('a-tipo');
                const camposEspecificos = document.getElementById('a-campos-especificos');
                const generadorCodigos = document.getElementById('a-generador-codigos');
                const modeloSelect = document.getElementById('a-modelo');
                const infoModelo = document.getElementById('a-info-modelo');

                const actualizarCamposEspecificos = () => {
                    const tipo = tipoAct.value;
                    let html = '';

                    if (tipo === 'actualizacion-firmware') {
                        html = `
                            <span class="sub-label">Correo:</span>
                            <input type="text" id="a-correo" placeholder="correo@cliente.com">
                            <span class="sub-label" style="margin-top:5px">Estado:</span>
                            <input type="text" id="a-estado" value="ATENDIDO" readonly>
                        `;
                    } else if (tipo === 'cambio-equipo') {
                        generadorCodigos.style.display = 'block';
                        html = '<span class="sub-label">Código de autorización se generará automáticamente</span>';
                    } else if (tipo === 'plume') {
                        html = `
                            <span class="sub-label">Correo:</span>
                            <input type="text" id="a-correo-plume" placeholder="correo@cliente.com">
                        `;
                    } else if (tipo === 'codigo-autorizacion') {
                        generadorCodigos.style.display = 'block';
                        html = `
                            <span class="sub-label">SN/MAC a retirar:</span>
                            <input type="text" id="a-sn-mac-retirar" placeholder="Serie y MAC del equipo a retirar">
                            <span class="sub-label" style="margin-top:5px">Motivo:</span>
                            <textarea id="a-motivo-codigo" placeholder="Detallar motivo para el código de autorización" style="height:60px;"></textarea>
                        `;
                    } else {
                        generadorCodigos.style.display = 'none';
                        html = '<span class="sub-label">Estado: ATENDIDO (automático)</span>';
                    }

                    camposEspecificos.innerHTML = html;
                };

                tipoAct.onchange = actualizarCamposEspecificos;
                actualizarCamposEspecificos();

                modeloSelect.onchange = () => {
                    const modeloSeleccionado = modeloSelect.value;
                    if (modeloSeleccionado) {
                        let info = '';
                        for (const [tech, brands] of Object.entries(DB.modelosEquipos)) {
                            for (const [brand, models] of Object.entries(brands)) {
                                const encontrado = models.find(m => m.modelo === modeloSeleccionado);
                                if (encontrado) {
                                    info = `<strong>${encontrado.modelo}</strong><br>`;
                                    info += `WiFi: ${encontrado.wifi}<br>`;
                                    info += `Velocidad: ${encontrado.velocidad}<br>`;
                                    info += `Repetidor: ${encontrado.repetidor}`;
                                    if (encontrado.antenas) {
                                        info += `<br>Antenas: ${encontrado.antenas} (${encontrado.totalAntenas})`;
                                    }
                                    break;
                                }
                            }
                            if (info) break;
                        }
                        infoModelo.innerHTML = info;
                        infoModelo.style.display = 'block';
                    } else {
                        infoModelo.style.display = 'none';
                    }
                };

                document.getElementById('btn-generar-codigo').onclick = () => {
                    const usuarioE = document.getElementById('a-usuario-e').value;
                    if (!usuarioE.match(/^E\d{6}$/)) {
                        alert('Usuario E debe tener formato E seguido de 6 dígitos (ej: E759393)');
                        return;
                    }

                    const codigo = generarCodigoAutorizacion(usuarioE);
                    document.getElementById('a-codigo-autorizacion').value = codigo;

                    const lista = document.getElementById('lista-codigos');
                    lista.innerHTML = DB.codigosGenerados.map(cod =>
                        `<div style="font-family:monospace; font-size:10px; margin:2px 0;">${cod}</div>`
                    ).join('');
                };

                document.getElementById('btn-eliminar-codigo').onclick = () => {
                    if (eliminarUltimoCodigo()) {
                        const lista = document.getElementById('lista-codigos');
                        lista.innerHTML = DB.codigosGenerados.map(cod =>
                            `<div style="font-family:monospace; font-size:10px; margin:2px 0;">${cod}</div>`
                        ).join('');
                        document.getElementById('a-codigo-autorizacion').value = DB.codigosGenerados.length > 0 ?
                            DB.codigosGenerados[DB.codigosGenerados.length - 1] : '';
                    }
                };
            }

            if (cat === 'cierre-mantenimiento') {
                const area = document.getElementById('cm-area');
                const mesaBox = document.getElementById('cm-mesa-box');
                const campoBox = document.getElementById('cm-campo-box');
                const camposAdicionales = document.getElementById('cm-campos-adicionales');

                area.onchange = () => {
                    if (area.value === 'mesa') {
                        mesaBox.style.display = 'block';
                        campoBox.style.display = 'none';
                    } else {
                        mesaBox.style.display = 'none';
                        campoBox.style.display = 'block';
                    }
                    actualizarCamposAdicionales();
                };

                const actualizarCamposAdicionales = () => {
                    const escenario = area.value === 'mesa' ?
                        document.getElementById('cm-mesa-escenario').value :
                        document.getElementById('cm-campo-escenario').value;

                    let html = '';

                    if (area.value === 'campo') {
                        html = `
                            <span class="sub-label">Persona que contesta:</span>
                            <input type="text" id="cm-persona" placeholder="Nombre de quien atiende">
                            <span class="sub-label" style="margin-top:5px">Parentesco:</span>
                            <select id="cm-parentesco">
                                <option value="TITULAR">👤 TITULAR</option>
                                <option value="FAMILIAR">👨‍👩‍👧‍👦 FAMILIAR</option>
                            </select>
                        `;

                        if (escenario === 'mo-04' || escenario === 'in-02') {
                            html += `<span class="sub-label" style="margin-top:5px">Número de contacto:</span>
                                     <input type="text" id="cm-numero-contacto" placeholder="Número adicional">`;
                        }
                    }

                    camposAdicionales.innerHTML = html;
                };

                document.getElementById('cm-mesa-escenario').onchange = actualizarCamposAdicionales;
                document.getElementById('cm-campo-escenario').onchange = actualizarCamposAdicionales;

                actualizarCamposAdicionales();
            }

            if (cat === 'derivacion-pext') {
                const tecnologia = document.getElementById('dp-tecnologia');
                const hfcBox = document.getElementById('dp-hfc-box');
                const ftthBox = document.getElementById('dp-ftth-box');
                const camposDinamicos = document.getElementById('dp-campos-dinamicos');

                tecnologia.onchange = () => {
                    if (tecnologia.value === 'hfc') {
                        hfcBox.style.display = 'block';
                        ftthBox.style.display = 'none';
                    } else {
                        hfcBox.style.display = 'none';
                        ftthBox.style.display = 'block';
                    }
                    actualizarCamposPEXT();
                };

                const actualizarCamposPEXT = () => {
                    const tipoProblema = tecnologia.value === 'hfc' ?
                        document.getElementById('dp-hfc-tipo').value :
                        document.getElementById('dp-ftth-tipo').value;

                    let html = '';
                    const d = extract();

                    if (tecnologia.value === 'hfc') {
                        if (tipoProblema === 'tap-sin-servicio') {
                            html = `
                                <span class="sub-label">Elemento relacionado:</span>
                                <input type="text" id="dp-elemento" placeholder="Elemento afectado">
                                <span class="sub-label" style="margin-top:5px">MAC CM:</span>
                                <input type="text" id="dp-mac-cm" placeholder="MAC del CM">
                                <span class="sub-label" style="margin-top:5px">Nro/Valor de Tap:</span>
                                <input type="text" id="dp-valor-tap" placeholder="Ej: 4/8">
                                <span class="sub-label" style="margin-top:5px">Ubicación TAP:</span>
                                <input type="text" id="dp-ubicacion-tap" placeholder="Dirección del TAP">
                                <span class="sub-label" style="margin-top:5px">Distrito:</span>
                                <input type="text" id="dp-distrito" value="${d.dist}">
                                <span class="sub-label" style="margin-top:5px">CMTS:</span>
                                <input type="text" id="dp-cmts" placeholder="CMTS relacionado">
                                <span class="sub-label" style="margin-top:5px">Tipo:</span>
                                <select id="dp-tipo">
                                    <option value="INSTALACION">🔧 INSTALACION</option>
                                    <option value="MANTENIMIENTO">🛠️ MANTENIMIENTO</option>
                                </select>
                            `;
                        } else if (tipoProblema === 'enlace-lento') {
                            html = `
                                <span class="sub-label">Paquetes perdidos:</span>
                                <input type="text" id="dp-paq-perdidos" placeholder="Cantidad de paquetes">
                                <span class="sub-label" style="margin-top:5px">Paquetes enviados:</span>
                                <input type="text" id="dp-paq-enviados" placeholder="Cantidad de paquetes">
                                <span class="sub-label" style="margin-top:5px">MAC CM:</span>
                                <input type="text" id="dp-mac-cm" placeholder="MAC del CM">
                                <span class="sub-label" style="margin-top:5px">TAP (Us/Ds):</span>
                                <div class="g-row">
                                    <input type="text" id="dp-tap-us" placeholder="Us" style="width:48%">
                                    <input type="text" id="dp-tap-ds" placeholder="Ds" style="width:48%">
                                </div>
                                <span class="sub-label" style="margin-top:5px">SNR (Us-Ds):</span>
                                <div class="g-row">
                                    <input type="text" id="dp-snr-us" placeholder="Us SNR" style="width:48%">
                                    <input type="text" id="dp-snr-ds" placeholder="Ds SNR" style="width:48%">
                                </div>
                                <span class="sub-label" style="margin-top:5px">Modulación (Us-Ds):</span>
                                <div class="g-row">
                                    <input type="text" id="dp-mod-us" placeholder="Us Mod" style="width:48%">
                                    <input type="text" id="dp-mod-ds" placeholder="Ds Mod" style="width:48%">
                                </div>
                            `;
                        } else if (tipoProblema === 'intermitencia') {
                            html = `
                                <span class="sub-label">Paquetes perdidos:</span>
                                <input type="text" id="dp-paq-perdidos" placeholder="Cantidad de paquetes">
                                <span class="sub-label" style="margin-top:5px">Paquetes enviados:</span>
                                <input type="text" id="dp-paq-enviados" placeholder="Cantidad de paquetes">
                                <span class="sub-label" style="margin-top:5px">MAC CM:</span>
                                <input type="text" id="dp-mac-cm" placeholder="MAC del CM">
                                <span class="sub-label" style="margin-top:5px">TAP (Us/Ds):</span>
                                <div class="g-row">
                                    <input type="text" id="dp-tap-us" placeholder="Us" style="width:48%">
                                    <input type="text" id="dp-tap-ds" placeholder="Ds" style="width:48%">
                                </div>
                                <span class="sub-label" style="margin-top:5px">SNR (Us-Ds):</span>
                                <div class="g-row">
                                    <input type="text" id="dp-snr-us" placeholder="Us SNR" style="width:48%">
                                    <input type="text" id="dp-snr-ds" placeholder="Ds SNR" style="width:48%">
                                </div>
                            `;
                        } else if (tipoProblema === 'mala-senal-catv') {
                            html = `
                                <span class="sub-label">IN BAND SNR:</span>
                                <input type="text" id="dp-inband-snr" placeholder="Relación señal/ruido">
                                <span class="sub-label" style="margin-top:5px">IN BAND S.PW:</span>
                                <input type="text" id="dp-inband-spw" placeholder="Potencia de señal">
                                <span class="sub-label" style="margin-top:5px">OBB SNR:</span>
                                <input type="text" id="dp-obb-snr" placeholder="Relación señal/ruido">
                                <span class="sub-label" style="margin-top:5px">OBB S.PW:</span>
                                <input type="text" id="dp-obb-spw" placeholder="Potencia de señal">
                                <span class="sub-label" style="margin-top:5px">Canal/Frecuencia de prueba:</span>
                                <input type="text" id="dp-canal-prueba" placeholder="Ej: 555 MHz">
                                <span class="sub-label" style="margin-top:5px">Errores/Correcciones:</span>
                                <input type="text" id="dp-errores" placeholder="Cantidad de errores">
                            `;
                        }
                    } else {
                        if (tipoProblema === 'sin-servicio') {
                            html = `
                                <span class="sub-label">FAT:</span>
                                <input type="text" id="dp-fat" placeholder="Número de FAT">
                                <span class="sub-label" style="margin-top:5px">Borne de FAT:</span>
                                <input type="text" id="dp-borne-fat" placeholder="Borne específico">
                                <span class="sub-label" style="margin-top:5px">Serie PON:</span>
                                <input type="text" id="dp-serie-pon" placeholder="Serie PON">
                                <span class="sub-label" style="margin-top:5px">Potencia óptica:</span>
                                <input type="text" id="dp-potencia" placeholder="Ej: -22 dBm">
                                <span class="sub-label" style="margin-top:5px">Dirección FAT:</span>
                                <input type="text" id="dp-direccion-fat" placeholder="Ubicación FAT">
                            `;
                        } else if (tipoProblema === 'niveles-fuera-rango') {
                            html = `
                                <span class="sub-label">ONT:</span>
                                <input type="text" id="dp-ont" placeholder="Modelo ONT">
                                <span class="sub-label" style="margin-top:5px">FAT:</span>
                                <input type="text" id="dp-fat" placeholder="Número de FAT">
                                <span class="sub-label" style="margin-top:5px">Borne de FAT:</span>
                                <input type="text" id="dp-borne-fat" placeholder="Borne específico">
                                <span class="sub-label" style="margin-top:5px">Potencia óptica:</span>
                                <input type="text" id="dp-potencia" placeholder="Ej: -22 dBm">
                                <span class="sub-label" style="margin-top:5px">Dirección de FAT:</span>
                                <input type="text" id="dp-direccion-fat" placeholder="Ubicación FAT">
                            `;
                        }
                    }

                    html += `
                        <span class="sub-label" style="margin-top:10px">Campos comunes:</span>
                        <input type="text" id="dp-cintillo-cli" placeholder="Cintillo Cliente" style="margin-top:5px">
                        <input type="text" id="dp-cintillo-ref" placeholder="Cintillo Referencia" style="margin-top:5px">
                        <input type="text" id="dp-tecnico" placeholder="Nombre del técnico" style="margin-top:5px">
                        <select id="dp-contrata" style="margin-top:5px">
                            <option value="">-- Contrata --</option>
                            ${DB.contratas.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                        <input type="text" id="dp-rpc-tec" placeholder="RPC del técnico" style="margin-top:5px">
                        <textarea id="dp-obs" placeholder="Observaciones" style="height:60px; margin-top:5px"></textarea>
                    `;

                    camposDinamicos.innerHTML = html;
                };

                document.getElementById('dp-hfc-tipo').onchange = actualizarCamposPEXT;
                document.getElementById('dp-ftth-tipo').onchange = actualizarCamposPEXT;

                actualizarCamposPEXT();
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
                const telefono = document.getElementById('v-telefono').value || d.telf;
                const obsTipo = document.getElementById('v-obs-tipo').value;
                const obsAdicional = document.getElementById('v-obs-adicional').value.trim();

                if (sub === 'mantenimiento') {
                    const cod = document.getElementById('v-cod').value;
                    const info = DB.codigosMantenimiento.find(x => x.cod === cod);
                    const desc = info ? `${info.cod} // ${info.esc} // ${info.sol}` : "[FALTA CODIGO]";
                    txt = `MESA MULTISKILL HITSS\nID LLAMADA: ${call}\nSOT: ${d.sot}\nCOD. SOLUCIÓN PRINCIPAL: ${desc}\nVALIDADO POR: ${d.cliente}\nNUMERO WSP: ${telefono}`;
                } else {
                    txt = `MESA MULTISKILL HITSS\nID LLAMADA: ${call}\nSOT: ${d.sot}\nVALIDADO POR: ${d.cliente}\nNUMERO WSP: ${telefono}`;
                }

                if (obsTipo) {
                    const obsTexto = obsTipo === 'RPC' ? 'Número es RPC del Técnico' :
                                    obsTipo === 'FAMILIAR' ? 'Número es de Familiar o Encargado' : 'Otros';
                    txt += `\nOBSERVACIÓN: ${obsTexto}`;
                    if (obsAdicional) txt += `\n${obsAdicional}`;
                }

                txt += `\nADP: ${adp} - ADP MULTISKILL HITSS`;

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

                        let motivoTexto = "", submotivoTexto = "", observaciones = "";

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

            } else if (cat === 'activaciones') {
                const tipo = document.getElementById('a-tipo').value;
                const usuarioE = document.getElementById('a-usuario-e').value;
                const serie = document.getElementById('a-serie').value;
                const mac = document.getElementById('a-mac').value;
                const modelo = document.getElementById('a-modelo').value;

                if (tipo === 'actualizacion-firmware') {
                    const correo = document.getElementById('a-correo').value || "[SOLICITAR]";
                    txt = `MESA MULTISKILL HITSS - ACTUALIZACIÓN FIRMWARE PLUME\nSOT: ${d.sot}\nCUSTOMER ID: ${d.codCli}\nNOMBRE CLIENTE: ${d.cliente}\nDNI: \nSERIE REPETIDOR: ${serie}\nMAC REPETIDOR: ${mac}\nSN/MAC: ${serie} / ${mac}\nCORREO: ${correo}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'instalacion') {
                    txt = `MESA MULTISKILL HITSS - ACTIVACION\nSOT: ${d.sot}\nEQUIPOS ACTIVADOS:\n${modelo}\n${serie}\n${mac}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'reenvio') {
                    txt = `MESA MULTISKILL HITSS - REENVÍO\nSOT: ${d.sot}\nEQUIPOS CON REENVIO DE SEÑAL:\n${modelo}\n${serie}\n${mac}\nCONFORMIDAD: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'traslado-externo') {
                    txt = `MESA MULTISKILL HITSS - TRASLADO EXTERNO\nSOT: ${d.sot}\nEQUIPOS ACTIVADOS:\n${modelo}\n${serie}\n${mac}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'deco-adicional') {
                    txt = `MESA MULTISKILL HITSS - DECO ADICIONAL\nSOT: ${d.sot}\nEQUIPOS ACTIVADOS:\n${modelo}\n${serie}\n${mac}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'cambio-plan') {
                    txt = `MESA MULTISKILL HITSS - CAMBIO DE PLAN\nSOT: ${d.sot}\nEQUIPOS ACTIVADOS:\n${modelo}\n${serie}\n${mac}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'cambio-equipo') {
                    const codigo = document.getElementById('a-codigo-autorizacion').value || "[CODIGO DE AUTORIZACION]";
                    txt = `MESA MULTISKILL HITSS - CAMBIO DE EQUIPO\nSOT: ${d.sot}\nEQUIPOS ACTIVADOS:\n${modelo}\n${serie}\n${mac}\nCODIGO DE AUT.: ${codigo}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'mesh') {
                    txt = `MESA MULTISKILL HITSS - ACTIVACION MESH\nSOT: ${d.sot}\nSERIE REPETIDOR: ${serie}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'plume') {
                    const correo = document.getElementById('a-correo-plume').value || "";
                    txt = `MESA MULTISKILL HITSS - ACTIVACIÓN PLUME\nSOT: ${d.sot}\nSERIE REPETIDOR: ${serie}\nMAC REPETIDOR: ${mac}\nCORREO: ${correo}\nESTADO: ATENDIDO\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else if (tipo === 'codigo-autorizacion') {
                    const snMacRetirar = document.getElementById('a-sn-mac-retirar').value || "[SERIE SOLICITADA] [MAC SOLICITADA]";
                    const motivo = document.getElementById('a-motivo-codigo').value || "[SOLICITAR CON TEXT BOX]";
                    const codigo = document.getElementById('a-codigo-autorizacion').value || "[CODIGO DE AUTORIZACION]";
                    txt = `MESA MULTISKILL HITSS - CODIGO AUTORIZACION\nSOT: ${d.sot}\nSE AUTORIZA CÓDIGO: ${codigo}\nSN/MAC A RETIRAR: ${snMacRetirar}\nMOTIVO: ${motivo}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                }

            } else if (cat === 'cierre-mantenimiento') {
                const area = document.getElementById('cm-area').value;
                const telefono = document.getElementById('cm-telefono').value;
                const audio = document.getElementById('cm-audio').value;
                const contrata = document.getElementById('cm-contrata').value;

                if (area === 'mesa') {
                    const escenario = document.getElementById('cm-mesa-escenario').value;
                    let motivo = "";

                    const motivos = {
                        'ok-linea': 'CLIENTE INFORMA QUE SERVICIO YA ESTA RESTABLECIDO',
                        'img-suspension': 'Cliente con corte o suspensión',
                        'img-atc': 'Incidencia mal generada por ATC',
                        'img-baja': 'Cliente informa que dará de baja el servicio',
                        'img-duplicidad': 'Incidencia mal generada por duplicidad',
                        'img-falta-contacto': 'Cerrada por falta de contacto',
                        'img-derivado': 'Cliente derivado a otras áreas',
                        'img-facilidades': 'Cliente no permite visita por disponibilidad horaria/ acceso a domicilio',
                        'img-datos-incorrectos': 'Sot con datos incorrectos'
                    };

                    motivo = motivos[escenario] || "";
                    let titulo = escenario === 'ok-linea' ? 'OK EN LINEA' :
                                escenario === 'img-falta-contacto' ? 'FALTA DE CONTACTO' : 'INCIDENCIA MAL GENERADA';

                    txt = `MESA MULTISKILL HITSS\n${titulo}\nSOT: ${d.sot}\nMOTIVO: ${motivo}\nTELÉFONO: ${telefono}\nSE ADJUNTA AUDIO: ${audio}\nCONTRATA: ${contrata}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                } else {
                    const escenario = document.getElementById('cm-campo-escenario').value;
                    const persona = document.getElementById('cm-persona').value || d.cliente;
                    const parentesco = document.getElementById('cm-parentesco').value;
                    const numeroContacto = document.getElementById('cm-numero-contacto')?.value || telefono;

                    let titulo = "", motivo = "", submotivo = "";

                    if (escenario === 'mo-01') {
                        titulo = "CIERRE - MO-01 Cliente Ausente";
                        motivo = "CLIENTE AUSENTE";
                        submotivo = "Cliente no se encuentra en el domicilio.";
                        txt = `MESA MULTISKILL HITSS\n${titulo}\nSOT: ${d.sot}\nPERSONA QUE CONTESTA: ${persona}\nPARENTESCO: ${parentesco}\nNUMERO DE CONTACTO: ${numeroContacto}\nMOTIVO DEL RECHAZO: ${motivo}\nSUB-MOTIVO DE RECHAZO: ${submotivo}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                    } else if (escenario === 'mo-02') {
                        titulo = "CIERRE - MO-02 Cliente dará de baja el servicio";
                        motivo = "CLIENTE DARÁ DE BAJA EL SERVICIO";
                        submotivo = "Cliente dará de baja el servicio.";
                        txt = `MESA MULTISKILL HITSS\n${titulo}\nSOT: ${d.sot}\nPERSONA QUE CONTESTA: ${persona}\nPARENTESCO: ${parentesco}\nMOTIVO DEL RECHAZO: ${motivo}\nSUBMOTIVO DE RECHAZO: ${submotivo}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                    } else if (escenario === 'mo-04') {
                        titulo = "CIERRE - MO-04 No hay facilidades técnicas del cliente";
                        motivo = "NO HAY FACILIDADES TÉCNICAS DEL CLIENTE";
                        submotivo = "Cliente no brinda las facilidades para realizar el mantenimiento.";
                        txt = `MESA MULTISKILL HITSS\n${titulo}\nSOT: ${d.sot}\nPERSONA QUE CONTESTA: ${persona}\nPARENTESCO: ${parentesco}\nNUMERO DE CONTACTO: ${numeroContacto}\nMOTIVO DEL RECHAZO: ${motivo}\nSUBMOTIVO DE RECHAZO: ${submotivo}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                    } else if (escenario === 'in-02') {
                        titulo = "CIERRE - IN-02 Inspección técnica";
                        motivo = "INSPECCIÓN TÉCNICA";
                        submotivo = "Se realiza inspección técnica.";
                        txt = `MESA MULTISKILL HITSS\n${titulo}\nSOT: ${d.sot}\nPERSONA QUE CONTESTA: ${persona}\nPARENTESCO: ${parentesco}\nNUMERO DE CONTACTO: ${numeroContacto}\nMOTIVO DEL RECHAZO: ${motivo}\nSUBMOTIVO DE RECHAZO: ${submotivo}\nID DE LLAMADA: ${call}\nREALIZADO POR: ${adp} - ADP MULTISKILL HITSS`;
                    }
                }

            } else if (cat === 'derivacion-pext') {
                const tecnologia = document.getElementById('dp-tecnologia').value;
                const tipoProblema = tecnologia === 'hfc' ?
                    document.getElementById('dp-hfc-tipo').value :
                    document.getElementById('dp-ftth-tipo').value;

                const cintilloCli = document.getElementById('dp-cintillo-cli')?.value || "";
                const cintilloRef = document.getElementById('dp-cintillo-ref')?.value || "";
                const tecnico = document.getElementById('dp-tecnico')?.value || "";
                const contrata = document.getElementById('dp-contrata')?.value || "";
                const rpcTec = document.getElementById('dp-rpc-tec')?.value || "";
                const obs = document.getElementById('dp-obs')?.value || "";

                if (tecnologia === 'hfc') {
                    if (tipoProblema === 'tap-sin-servicio') {
                        const elemento = document.getElementById('dp-elemento')?.value || "";
                        const macCm = document.getElementById('dp-mac-cm')?.value || "";
                        const valorTap = document.getElementById('dp-valor-tap')?.value || "";
                        const ubicacionTap = document.getElementById('dp-ubicacion-tap')?.value || "";
                        const distrito = document.getElementById('dp-distrito')?.value || d.dist;
                        const cmts = document.getElementById('dp-cmts')?.value || "";
                        const tipo = document.getElementById('dp-tipo')?.value || "";
                        const atiende = document.getElementById('dp-atiende')?.value || d.cliente;
                        const parentesco = document.getElementById('dp-parentesco')?.value || "";

                        txt = `MESA MULTISKILL HITSS - DERIVACIÓN PEXT\nTAP SIN SERVICIO\nELEMENTO RELACIONADO: ${elemento}\nSOT DE DERIVACIÓN: ${d.sot}\nMOTIVO: TAP SIN SERVICIO\nMAC CM: ${macCm}\nNro/Valor de Tap: ${valorTap}\nUbicación TAP: ${ubicacionTap}\nDistrito: ${distrito}\nCMTS: ${cmts}\nTipo: ${tipo}\nATIENDE: ${atiende}\nPARENTESCO: ${parentesco}\nCOMPLEMENTARIOS: \nCINTILLO CLI: ${cintilloCli}\nCINTILLO REF: ${cintilloRef}\nTÉCNICO: ${tecnico}\nCONTRATA: ${contrata}`;
                    } else if (tipoProblema === 'enlace-lento') {
                        const paqPerdidos = document.getElementById('dp-paq-perdidos')?.value || "";
                        const paqEnviados = document.getElementById('dp-paq-enviados')?.value || "";
                        const macCm = document.getElementById('dp-mac-cm')?.value || "";
                        const tapUs = document.getElementById('dp-tap-us')?.value || "";
                        const tapDs = document.getElementById('dp-tap-ds')?.value || "";
                        const snrUs = document.getElementById('dp-snr-us')?.value || "";
                        const snrDs = document.getElementById('dp-snr-ds')?.value || "";
                        const modUs = document.getElementById('dp-mod-us')?.value || "";
                        const modDs = document.getElementById('dp-mod-ds')?.value || "";
                        const ubicacionTap = document.getElementById('dp-ubicacion-tap')?.value || "";
                        const valorTap = document.getElementById('dp-valor-tap')?.value || "";

                        txt = `MESA MULTISKILL HITSS - DERIVACIÓN PEXT\nDEGRADACIÓN DEL SERVICIO - ENLACE LENTO\nFLAG PEXT ALARMADO\nPAQ PERDIDOS: ${paqPerdidos}\nPAQ ENVIADOS: ${paqEnviados}\nSOT DE DERIVACIÓN: ${d.sot}\nMAC CM: ${macCm}\nTAP: ${tapUs}  ${tapDs}\nSNR: ${snrUs}-${snrDs}\nModulación: ${modUs}-${modDs}\nAtenuación: mts.\nUbicación TAP: ${ubicacionTap}\nValor TAP: ${valorTap}\nCINTILLO CLI: ${cintilloCli}\nCINTILLO REF: ${cintilloRef}\nTÉCNICO: ${tecnico}\nCONTRATA: ${contrata}\nRPC TEC: ${rpcTec}\nOBS: ${obs}`;
                    } else if (tipoProblema === 'intermitencia') {
                        const paqPerdidos = document.getElementById('dp-paq-perdidos')?.value || "";
                        const paqEnviados = document.getElementById('dp-paq-enviados')?.value || "";
                        const macCm = document.getElementById('dp-mac-cm')?.value || "";
                        const tapUs = document.getElementById('dp-tap-us')?.value || "";
                        const tapDs = document.getElementById('dp-tap-ds')?.value || "";
                        const snrUs = document.getElementById('dp-snr-us')?.value || "";
                        const snrDs = document.getElementById('dp-snr-ds')?.value || "";
                        const ubicacionTap = document.getElementById('dp-ubicacion-tap')?.value || "";
                        const valorTap = document.getElementById('dp-valor-tap')?.value || "";

                        txt = `MESA MULTISKILL HITSS - DERIVACIÓN PEXT\nDEGRADACIÓN DEL SERVICIO – INTERMITENCIA\nFLAG REINICIO ALARMADO\nSOT INICIAL: ${d.sot}\nPAQ PERDIDOS: ${paqPerdidos}\nPAQ ENVIADOS: ${paqEnviados}\nMAC CM: ${macCm}\nTAP: ${tapUs}  ${tapDs}\nSNR: ${snrUs}-${snrDs}\nModulación: \nAtenuación: mts.\nUbicación TAP: ${ubicacionTap}\nValor TAP: ${valorTap}\nCINTILLO CLI: ${cintilloCli}\nCINTILLO REF: ${cintilloRef}\nTÉCNICO: ${tecnico}\nCONTRATA: ${contrata}\nRPC TEC: ${rpcTec}\nOBS: ${obs}`;
                    } else if (tipoProblema === 'mala-senal-catv') {
                        const inbandSnr = document.getElementById('dp-inband-snr')?.value || "";
                        const inbandSpw = document.getElementById('dp-inband-spw')?.value || "";
                        const obbSnr = document.getElementById('dp-obb-snr')?.value || "";
                        const obbSpw = document.getElementById('dp-obb-spw')?.value || "";
                        const canalPrueba = document.getElementById('dp-canal-prueba')?.value || "";
                        const errores = document.getElementById('dp-errores')?.value || "";
                        const valorTap = document.getElementById('dp-valor-tap')?.value || "";
                        const ubicacionTap = document.getElementById('dp-ubicacion-tap')?.value || "";
                        const atiende = document.getElementById('dp-atiende')?.value || d.cliente;

                        txt = `MESA MULTISKILL HITSS - DERIVACIÓN PEXT\nMALA SEÑAL CATV BÁSICO/DIGITAL\nIN BAND: \nSNR (RELACION SEÑAL/RUIDO): ${inbandSnr}\nS.PW (POTENCIA DE SEÑAL): ${inbandSpw}\nOBB (OUT OF BAND): \nSNR (RELACION SEÑAL/RUIDO): ${obbSnr}\nS.PW (POTENCIA DE SEÑAL): ${obbSpw}\nCANAL/FRECUENCIA DE PRUEBA: ${canalPrueba}\nERRORES /CORRECCIONES: ${errores}\nValor TAP: ${valorTap}\nUbicación TAP: ${ubicacionTap}\nPlano: ${d.plano}\nCINTILLO CLI: ${cintilloCli}\nCINTILLO REF: ${cintilloRef}\nATIENDE: ${atiende}\nTÉCNICO: ${tecnico}\nCONTRATA: ${contrata}\nRPC TEC: ${rpcTec}\nOBS: ${obs}`;
                    }
                } else {
                    if (tipoProblema === 'sin-servicio') {
                        const fat = document.getElementById('dp-fat')?.value || "";
                        const borneFat = document.getElementById('dp-borne-fat')?.value || "";
                        const seriePon = document.getElementById('dp-serie-pon')?.value || "";
                        const potencia = document.getElementById('dp-potencia')?.value || "";
                        const direccionFat = document.getElementById('dp-direccion-fat')?.value || "";

                        txt = `MESA MULTISKILL HITSS - DERIVACIÓN PEXT\nSIN SERVICIO FTTH\nFAT: ${fat}\nBORNE DE FAT: ${borneFat}\nSERIE PON: ${seriePon}\nPOTENCIA ÓPTICA: ${potencia}\nDIRECCIÓN FAT: ${direccionFat}\nPLANO: ${d.plano}\nSOT derivada: ${d.sot}\nCINTILLO CLI: ${cintilloCli}\nCINTILLO REF: ${cintilloRef}\nTÉCNICO: ${tecnico}\nCONTRATA: ${contrata}\nRPC TEC: ${rpcTec}\nOBS: ${obs}`;
                    } else if (tipoProblema === 'niveles-fuera-rango') {
                        const ont = document.getElementById('dp-ont')?.value || "";
                        const fat = document.getElementById('dp-fat')?.value || "";
                        const borneFat = document.getElementById('dp-borne-fat')?.value || "";
                        const potencia = document.getElementById('dp-potencia')?.value || "";
                        const direccionFat = document.getElementById('dp-direccion-fat')?.value || "";
                        const atiende = document.getElementById('dp-atiende')?.value || d.cliente;
                        const parentesco = document.getElementById('dp-parentesco')?.value || "";

                        txt = `MESA MULTISKILL HITSS - DERIVACIÓN PEXT\nNIVELES FUERA DE RANGO FTTH\nONT: ${ont}\nPLANO: ${d.plano}\nFAT: ${fat}\nBORNE DE FAT: ${borneFat}\nPOTENCIA ÓPTICA: ${potencia}\nDIRECCIÓN DE FAT: ${direccionFat}\nCINTILLO CLI: ${cintilloCli}\nCINTILLO REF: ${cintilloRef}\nATIENDE EN DOMICILIO: ${atiende}\nPARENTESCO: ${parentesco}\nTÉCNICO: ${tecnico}\nCONTRATA: ${contrata}\nRPC TEC: ${rpcTec}\nOBS: ${obs}`;
                    }
                }

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

    setTimeout(createUI, 5000);
})();