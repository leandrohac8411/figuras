/**
 * Event handlers
 */

// Toggle sticker (mark as have/not have)
async function toggleSticker(codigo) {
  try {
    const result = await toggleFigurinha(codigo);
    if (result !== null) {
      showToast(`Figurinha ${codigo} ${result ? 'marcada' : 'desmarcada'}`, 'success');
      await refreshCurrentGroup();
      await updateHeaderStats();
    }
  } catch (error) {
    console.error('Error toggling sticker:', error);
    showToast('Erro ao atualizar figurinha', 'error');
  }
}

// Add duplicate
async function addDupModal(paisSigla) {
  const codigo = prompt('Digite o código da figurinha (ex: BRA1):');
  if (!codigo) return;

  try {
    const result = await addDuplicata(codigo);
    if (result !== null) {
      showToast(`Duplicata adicionada para ${codigo}`, 'success');
      await refreshCurrentGroup();
    }
  } catch (error) {
    console.error('Error adding duplicate:', error);
    showToast('Erro ao adicionar duplicata', 'error');
  }
}

// Show duplicates list
async function showDuplicatas() {
  const duplicatas = await getFigurinhasComDuplicatas();

  if (duplicatas.length === 0) {
    alert('Você não tem figurinhas duplicadas');
    return;
  }

  let message = 'Suas figurinhas duplicadas:\n\n';
  duplicatas.forEach(fig => {
    message += `${fig.codigo} - ${fig.nome}: ${fig.duplicatas}x\n`;
  });

  alert(message);
}

// Select group
async function selectGroup(grupo) {
  // Update active tab
  document.querySelectorAll('.group-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.grupo === grupo) {
      tab.classList.add('active');
    }
  });

  // Render content
  await renderGroupContent(grupo);
}

// Refresh current group content
async function refreshCurrentGroup() {
  const activeTab = document.querySelector('.group-tab.active');
  if (activeTab) {
    const grupo = activeTab.dataset.grupo;
    await renderGroupContent(grupo);
  }
}

// Menu toggle
function setupMenuHandlers() {
  const menuBtn = document.getElementById('menuBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose = document.getElementById('menuClose');

  menuBtn.addEventListener('click', () => {
    menuOverlay.classList.add('active');
  });

  menuClose.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
  });

  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove('active');
    }
  });

  // Menu links
  document.getElementById('dashboardLink').addEventListener('click', (e) => {
    e.preventDefault();
    showDashboard();
    menuOverlay.classList.remove('active');
  });

  document.getElementById('duplicatasLink').addEventListener('click', (e) => {
    e.preventDefault();
    showDuplicatas();
    menuOverlay.classList.remove('active');
  });
}

// Show dashboard (modal/alert for now)
async function showDashboard() {
  const stats = await getStatisticas();
  const grupos = await getGrupos();

  let message = `📊 Dashboard\n\nTotal: ${stats.coletadas}/${stats.total} (${stats.percentual}%)\n\n`;

  for (const grupo of grupos) {
    const groupStats = await getStatisticasByGrupo(grupo.grupo);
    message += `Grupo ${grupo.grupo}: ${groupStats.coletadas}/${groupStats.total}\n`;
  }

  alert(message);
}
