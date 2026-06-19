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
    } else {
      showToast(`Erro ao atualizar ${codigo}`, 'error');
    }
  } catch (error) {
    console.error('Error toggling sticker:', error);
    showToast('Erro ao atualizar figurinha', 'error');
  }
}

// Add duplicate with modal
async function addDupModal(paisSigla) {
  const modal = document.getElementById('dupModalOverlay');
  const input = document.getElementById('dupModalInput');
  const suggestions = document.getElementById('dupSuggestions');
  const okBtn = document.getElementById('dupModalOk');
  const cancelBtn = document.getElementById('dupModalCancel');
  const closeBtn = document.getElementById('dupModalClose');

  modal.classList.add('active');
  input.value = '';
  suggestions.innerHTML = '';
  input.focus();

  // Load all stickers for suggestions
  const figurinhas = await getFigurinhasByPais(paisSigla);

  input.addEventListener('input', () => {
    const searchTerm = input.value.toUpperCase();
    suggestions.innerHTML = '';

    if (searchTerm.length > 0) {
      const filtered = figurinhas.filter(fig =>
        fig.codigo.startsWith(searchTerm)
      );

      filtered.forEach(fig => {
        const div = document.createElement('div');
        div.className = 'dup-suggestion';
        div.innerHTML = `
          <div class="dup-suggestion-code">${fig.codigo}</div>
          <div class="dup-suggestion-name">${fig.nome}</div>
        `;
        div.addEventListener('click', () => {
          input.value = fig.codigo;
          input.focus();
        });
        suggestions.appendChild(div);
      });
    }
  });

  okBtn.onclick = async () => {
    const codigo = input.value.trim();
    if (!codigo) {
      showToast('Digite o código da figurinha', 'error');
      return;
    }

    try {
      const result = await addDuplicata(codigo);
      if (result !== null) {
        showToast(`✓ Duplicata adicionada para ${codigo}`, 'success');
        modal.classList.remove('active');
        await refreshCurrentGroup();
        await updateHeaderStats();
      } else {
        showToast('Figurinha não encontrada', 'error');
      }
    } catch (error) {
      console.error('Error adding duplicate:', error);
      showToast('Erro ao adicionar duplicata', 'error');
    }
  };

  cancelBtn.onclick = () => {
    modal.classList.remove('active');
  };

  closeBtn.onclick = () => {
    modal.classList.remove('active');
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  };
}

// Show duplicates in beautiful modal
async function showDuplicatas() {
  const modal = document.getElementById('duplicatasModalOverlay');
  const content = document.getElementById('duplicatasModalContent');
  const closeBtn = document.getElementById('duplicatasModalClose');
  const okBtn = document.getElementById('duplicatasModalOk');

  const duplicatas = await getFigurinhasComDuplicatas();

  if (duplicatas.length === 0) {
    content.innerHTML = `
      <div class="duplicatas-empty">
        <div class="duplicatas-empty-icon">📭</div>
        <p>Você ainda não tem figurinhas duplicadas</p>
      </div>
    `;
  } else {
    let html = '<div class="duplicatas-list">';
    duplicatas.forEach(fig => {
      html += `
        <div class="duplicata-item">
          <div class="duplicata-info">
            <div class="duplicata-code">${fig.codigo}</div>
            <div class="duplicata-name">${fig.nome}</div>
          </div>
          <div class="duplicata-controls">
            <button class="duplicata-remove-btn" data-codigo="${fig.codigo}">−</button>
            <div class="duplicata-count">×${fig.duplicatas}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    content.innerHTML = html;

    // Add event listeners for remove buttons
    document.querySelectorAll('.duplicata-remove-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const codigo = e.target.dataset.codigo;
        await removeDuplicata(codigo);
        showToast(`Duplicata removida de ${codigo}`, 'success');
        await updateHeaderStats();
        showDuplicatas(); // Refresh the list
      });
    });
  }

  modal.classList.add('active');

  closeBtn.onclick = () => modal.classList.remove('active');
  okBtn.onclick = () => modal.classList.remove('active');

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  };
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

// Show dashboard in beautiful modal
async function showDashboard() {
  const modal = document.getElementById('dashboardModalOverlay');
  const content = document.getElementById('dashboardModalContent');
  const closeBtn = document.getElementById('dashboardModalClose');
  const okBtn = document.getElementById('dashboardModalOk');

  const stats = await getStatisticas();
  const grupos = await getGrupos();

  let html = `
    <div class="dashboard-stats">
      <div class="dashboard-total">${stats.coletadas} / ${stats.total}</div>
      <div class="dashboard-percent">${stats.percentual}% do álbum completo</div>
    </div>

    <h3 style="margin-top: 20px; margin-bottom: 12px; color: #333;">Progresso por Grupo</h3>
    <div class="dashboard-groups">
  `;

  for (const grupo of grupos) {
    const groupStats = await getStatisticasByGrupo(grupo.grupo);
    html += `
      <div class="dashboard-group">
        <div class="dashboard-group-label">Grupo ${grupo.grupo}</div>
        <div class="dashboard-group-value">${groupStats.coletadas}/${groupStats.total}</div>
        <div class="dashboard-group-percent">${groupStats.percentual}%</div>
      </div>
    `;
  }

  html += '</div>';
  content.innerHTML = html;
  modal.classList.add('active');

  closeBtn.onclick = () => modal.classList.remove('active');
  okBtn.onclick = () => modal.classList.remove('active');

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  };
}
