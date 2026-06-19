/**
 * UI rendering functions
 */

// Render group tabs
async function renderGroupTabs(grupos) {
  const groupTabsContainer = document.getElementById('groupTabs');
  groupTabsContainer.innerHTML = '';

  grupos.forEach((grupo, index) => {
    const tab = document.createElement('button');
    tab.className = `group-tab ${index === 0 ? 'active' : ''}`;
    tab.textContent = `Grupo ${grupo.grupo}`;
    tab.dataset.grupo = grupo.grupo;

    // Random color for each group
    const color = getGroupColor(grupo.grupo);
    tab.style.borderBottomColor = color.split(',')[0].replace('linear-gradient(135deg, ', '');

    tab.addEventListener('click', () => selectGroup(grupo.grupo));
    groupTabsContainer.appendChild(tab);
  });
}

// Render group content (all 4 countries and their stickers)
async function renderGroupContent(grupo) {
  const contentContainer = document.getElementById('groupContent');
  contentContainer.innerHTML = '<p>Carregando...</p>';

  try {
    const paises = await getPaisesByGrupo(grupo);
    contentContainer.innerHTML = '';

    for (const pais of paises) {
      const countryCard = await createCountryCard(pais);
      contentContainer.appendChild(countryCard);
    }
  } catch (error) {
    contentContainer.innerHTML = '<p>❌ Erro ao carregar figurinhas</p>';
    console.error('Error rendering group content:', error);
  }
}

// Create country card element
async function createCountryCard(pais) {
  const card = document.createElement('div');
  card.className = 'country-card';

  const figurinhas = await getFigurinhasByPais(pais.sigla);
  const stats = await getStatisticasByPais(pais.sigla);

  const color = getGroupColor(pais.grupo);

  card.innerHTML = `
    <div class="country-header" style="background: ${color}">
      <div class="country-flag">${getCountryFlag(pais.sigla)}</div>
      <div class="country-info">
        <h3>${pais.nome}</h3>
        <p>${stats.coletadas} / ${stats.total} figurinhas</p>
      </div>
      <div class="country-percent">${stats.percentual}%</div>
    </div>
    <div class="sticker-grid" data-pais="${pais.sigla}"></div>
    <div class="country-actions">
      <button class="action-btn" onclick="addDupModal('${pais.sigla}')">➕ Duplicata</button>
      <button class="action-btn danger" onclick="showDuplicatas()">🔴 Ver Duplicatas</button>
    </div>
  `;

  // Render stickers grid
  const stickerGrid = card.querySelector('.sticker-grid');
  figurinhas.forEach(fig => {
    const sticker = createStickerButton(fig);
    stickerGrid.appendChild(sticker);
  });

  return card;
}

// Create sticker button
function createStickerButton(figurinha) {
  const button = document.createElement('button');
  button.className = `sticker ${figurinha.tem ? 'has' : 'empty'}`;

  if (figurinha.duplicatas > 0) {
    button.classList.add('sticker-with-dup');
  }

  button.dataset.codigo = figurinha.codigo;
  button.title = `${figurinha.codigo} - ${figurinha.nome}`;

  // Add sticker code (BRA1, BRA2, etc)
  const codeText = document.createElement('div');
  codeText.style.fontSize = '10px';
  codeText.style.fontWeight = 'bold';
  codeText.textContent = figurinha.codigo;
  button.appendChild(codeText);

  // Add duplicate badge if exists
  if (figurinha.duplicatas > 0) {
    const badge = document.createElement('div');
    badge.className = 'sticker-dup-badge';
    badge.textContent = figurinha.duplicatas;
    button.appendChild(badge);
  }

  button.addEventListener('click', () => toggleSticker(figurinha.codigo));

  return button;
}

// Update header stats
async function updateHeaderStats() {
  const stats = await getStatisticas();
  document.getElementById('totalStats').textContent = `${stats.coletadas} / ${stats.total}`;
  document.getElementById('percentStats').textContent = `(${stats.percentual}%)`;
  document.getElementById('progressFill').style.width = `${stats.percentual}%`;
}

// Show toast notification
function showToast(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // TODO: Implement actual toast UI
}
