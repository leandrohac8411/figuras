/**
 * Main app initialization
 */

async function initApp() {
  try {
    console.log('🚀 Initializing Álbum 2026...');

    // Connect to Supabase
    const client = await initSupabase();
    if (!client) {
      console.error('Failed to connect to Supabase');
      document.getElementById('groupContent').innerHTML = `
        <div style="padding: 20px; text-align: center; color: red;">
          <h2>❌ Erro de Conexão</h2>
          <p>Não foi possível conectar ao Supabase.</p>
          <p>Verifique as credenciais em <code>js/supabase.js</code></p>
        </div>
      `;
      return;
    }

    // Fetch initial data
    const grupos = await getGrupos();
    if (grupos.length === 0) {
      console.error('No groups found. Please run seed.html first');
      document.getElementById('groupContent').innerHTML = `
        <div style="padding: 20px; text-align: center; color: orange;">
          <h2>⚠️ Base de dados vazia</h2>
          <p>Nenhum grupo encontrado no banco de dados.</p>
          <p>Execute <code>seed.html</code> para preencher os dados.</p>
          <a href="seed.html" style="color: #667eea;">Ir para Seed</a>
        </div>
      `;
      return;
    }

    // Render UI
    console.log('📋 Rendering UI...');
    await renderGroupTabs(grupos);
    await selectGroup(grupos[0].grupo);
    await updateHeaderStats();

    // Setup handlers
    console.log('🎯 Setting up handlers...');
    setupMenuHandlers();

    console.log('✅ App initialized successfully');
  } catch (error) {
    console.error('❌ App initialization error:', error);
    document.getElementById('groupContent').innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h2>❌ Erro</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
