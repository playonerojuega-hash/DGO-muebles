// Pega aquí la NUEVA URL que copiaste en el paso anterior
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbwTHwkrdpyla-_F1OuvK3mxbkmnCNSRHKSrNGVQIu72hfcRCCxKy1JH7A3BfPvjTU5t/exec";

// --- EVENTO 1: ENVIAR NUEVO PEDIDO AL TALLER ---
document.getElementById('formPedido').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btnEnviar');
    btn.innerText = "ENVIANDO...";
    btn.disabled = true;

    // Recolectamos los datos del formulario de forma automática
    const formData = new FormData(this);
    const parametros = new URLSearchParams(formData);

    // Enviamos por POST con 'no-cors' para romper el bloqueo de Google
    fetch(`${URL_SCRIPT}?${parametros.toString()}`, {
        method: 'POST',
        mode: 'no-cors'
    })
    .then(() => {
        // Con 'no-cors' asumimos éxito porque el navegador no puede leer la respuesta de Google, pero el dato ya llegó.
        document.getElementById('formPedido').reset();
        
        const msg = document.getElementById('mensajeExito');
        msg.classList.remove('oculto');
        
        btn.innerText = "ENVIAR PEDIDO";
        btn.disabled = false;
        
        setTimeout(() => {
            msg.classList.add('oculto');
        }, 6000);
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un problema de red. Verifica tu conexión.");
        btn.innerText = "ENVIAR PEDIDO";
        btn.disabled = false;
    });
});

// --- EVENTO 2: CONSULTAR ESTADO DE PEDIDO ---
document.getElementById('formConsulta').addEventListener('submit', function(e) {
    e.preventDefault();
    const tel = document.getElementById('telefonoConsulta').value.trim();
    const btn = document.getElementById('btnConsultar');
    const resultadoBox = document.getElementById('resultadoConsulta');
    
    btn.innerText = "BUSCANDO...";
    btn.disabled = true;

    fetch(`${URL_SCRIPT}?action=buscar&telefono=${tel}`)
    .then(response => response.json())
    .then(data => {
        btn.innerText = "BUSCAR MI PEDIDO";
        btn.disabled = false;
        resultadoBox.classList.remove('oculto');

        if (data.status === "encontrado") {
            document.getElementById('resMueble').innerText = "📦 " + data.mueble;
            
            const estadoSpan = document.getElementById('resEstado');
            estadoSpan.innerText = data.estado;
            estadoSpan.className = "badge status-" + data.estado.toLowerCase().replace(/ /g, "-");
            
            document.getElementById('resDetalle').innerText = `Cliente: ${data.cliente} | Especificaciones: ${data.especificaciones}`;
        } else {
            document.getElementById('resMueble').innerText = "❌ No encontrado";
            document.getElementById('resEstado').innerText = "Sin registro";
            document.getElementById('resEstado').className = "badge status-error";
            document.getElementById('resDetalle').innerText = "No encontramos ningún pedido activo con ese número de teléfono.";
        }
    })
    .catch((error) => {
        console.error("Error al buscar:", error);
        alert("No se encontró ningún registro o hubo un error en la consulta.");
        btn.innerText = "BUSCAR MI PEDIDO";
        btn.disabled = false;
    });
});