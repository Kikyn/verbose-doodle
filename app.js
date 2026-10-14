// app.js — Controlador principal y autenticación corregida

function updateNetworkStatus() {
    const statusBanner = document.getElementById('network-status');
    if (statusBanner) {
        if (navigator.onLine) {
            statusBanner.classList.add('hidden');
        } else {
            statusBanner.classList.remove('hidden');
        }
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

document.addEventListener('DOMContentLoaded', async () => {
    updateNetworkStatus();

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.error('SW error:', err));
    }

    const authView = document.getElementById('auth-view');
    const posView = document.getElementById('pos-view');
    const btnLogout = document.getElementById('btn-logout');
    const loginForm = document.getElementById('login-form');
    const authError = document.getElementById('auth-error');
    const userInfo = document.getElementById('user-info');

    // Comprobar si existe el cliente de Supabase
    if (typeof supabaseClient === 'undefined') {
        alert('Error: supabaseClient no está definido. Revisa supabaseClient.js');
        return;
    }

    // Comprobar sesión activa previa
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            showPosView(session.user);
        }
    } catch (err) {
        console.error('Error al verificar sesión:', err);
    }

    // Evento de Inicio de Sesión
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que el formulario recargue la página
            
            if (authError) {
                authError.classList.add('hidden');
                authError.textContent = '';
            }

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    if (authError) {
                        authError.textContent = `Error: ${error.message}`;
                        authError.classList.remove('hidden');
                    } else {
                        alert(`Error al iniciar sesión: ${error.message}`);
                    }
                } else if (data && data.user) {
                    showPosView(data.user);
                }
            } catch (err) {
                alert(`Error inesperado: ${err.message}`);
            }
        });
    }

    // Evento Cierre de Sesión
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            posView.classList.add('hidden');
            btnLogout.classList.add('hidden');
            authView.classList.remove('hidden');
            if (loginForm) loginForm.reset();
        });
    }

    function showPosView(user) {
        if (authView) authView.classList.add('hidden');
        if (posView) posView.classList.remove('hidden');
        if (btnLogout) btnLogout.classList.remove('hidden');
        if (userInfo) userInfo.textContent = `Sesión activa: ${user.email}`;
    }

    // Botón de prueba IndexedDB
    const btnTest = document.getElementById('btn-test');
    if (btnTest) {
        btnTest.addEventListener('click', async () => {
            try {
                await db.products.put({
                    id: 'prod-demo-1',
                    name: 'Blusa Casual Floral',
                    barcode: '7501234567890',
                    sku: 'BCF-M-ROJ',
                    is_active: 1
                });
                const count = await db.products.count();
                alert(`¡IndexedDB Funcional!\nProductos guardados localmente: ${count}`);
            } catch (error) {
                alert('Error al acceder a IndexedDB: ' + error.message);
            }
        });
    }
});
