const SUPABASE_URL = 'https://xuwucwkhzvgbsrpoxozl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5dShhUST6_TKxO9UGMmflg_GDOOfOC7';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1`;
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    
    if (usuario === 'Mateo123*' && password === 'HoySeComePollito597*') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        cargarDatos();
        setInterval(cargarDatos, 30000);
    } else {
        const msg = document.getElementById('loginMensaje');
        msg.textContent = 'Credenciales inválidas';
        msg.className = 'mensaje error';
        msg.style.display = 'block';
    }
});

async function cargarDatos() {
    try {
        const statsRes = await fetch(`${FUNCTION_URL}/admin-stats`);
        const stats = await statsRes.json();
        document.getElementById('totalRegistros').textContent = stats.total_registros;
        document.getElementById('registrosHoy').textContent = stats.registros_hoy;
        document.getElementById('usuariosApp').textContent = stats.usuarios_app_movil;
        document.getElementById('porcentajeApp').textContent = `${stats.porcentaje_app}%`;
        const regRes = await fetch(`${FUNCTION_URL}/admin-registros`);
        const registros = await regRes.json();
        const tbody = document.getElementById('tablaBody');
        tbody.innerHTML = '';
        
        registros.forEach(r => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${r.id}</td>
                <td>${r.nombre}</td>
                <td>${r.apellido}</td>
                <td>${r.correo}</td>
                <td>${r.curso_interes || '-'}</td>
                <td>${new Date(r.fecha_registro).toLocaleString()}</td>
                <td>${r.usa_app_movil ? 'Sí' : 'No'}</td>
                <td>${r.ip_address || '-'}</td>
            `;
        });
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

function cerrarSesion() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
}

function exportarDatos() {
    const table = document.getElementById('tablaRegistros');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    let csv = 'ID,Nombre,Apellido,Correo,Curso,Fecha,App Móvil,IP\n';
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        csv += cells.map(c => `"${c.textContent}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registros_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}