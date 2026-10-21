const SUPABASE_URL = 'https://xuwucwkhzvgbsrpoxozl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5dShhUST6_TKxO9UGMmflg_GDOOfOC7';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1`;
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get('utm_source');
const utmMedium = urlParams.get('utm_medium');
const utmCampaign = urlParams.get('utm_campaign');
async function enviarEvento(tipo_evento, detalles = {}, registro_id = null) {
    try {
        await fetch(`${FUNCTION_URL}/tracking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registro_id, tipo_evento, detalles })
        });
    } catch (error) {
        console.error('Error tracking:', error);
    }
}
enviarEvento('page_view', {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    referrer: document.referrer
});
function mostrarTerminos() {
    document.getElementById('modalTerminos').style.display = 'block';
    enviarEvento('view_terms');
}
function cerrarTerminos() {
    document.getElementById('modalTerminos').style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('modalTerminos');
    if (event.target === modal) modal.style.display = 'none';
}
document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const mensajeDiv = document.getElementById('mensaje');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    
    const data = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        curso_interes: document.getElementById('curso').value,
        acepto_terminos: document.getElementById('terminos').checked
    };
    
    try {
        const response = await fetch(`${FUNCTION_URL}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            mensajeDiv.className = 'mensaje exito';
            mensajeDiv.innerHTML = `<p><strong>Registro exitoso</strong></p><p style="margin-top:10px;">Recibirás un correo con tus credenciales en los próximos minutos.</p>`;
            mensajeDiv.style.display = 'block';
            this.reset();
            mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            mensajeDiv.className = 'mensaje error';
            mensajeDiv.textContent = `Error: ${result.error || 'No se pudo completar el registro'}`;
            mensajeDiv.style.display = 'block';
        }
    } catch (error) {
        mensajeDiv.className = 'mensaje error';
        mensajeDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        mensajeDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Acceder a la Plataforma';
    }
});
document.querySelectorAll('.btn-hero, .nav-cta, .course-card').forEach(el => {
    el.addEventListener('click', () => {
        enviarEvento('link_clicked', { elemento: el.className || el.tagName });
    });
});
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        enviarEvento('scroll_depth', { porcentaje: maxScroll });
    }
});