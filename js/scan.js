/**
 * Photo Scan Module - Groq Vision API Integration
 * Handles figurinha recognition and extraction from photos
 */

// ============================================================================
// GROQ API CONFIGURATION
// ============================================================================

// Load API key from environment
const GROQ_API_KEY = process.env.GROQ_API_KEY || localStorage.getItem('groq_api_key');
const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Model configuration for vision tasks
const GROQ_VISION_MODEL = 'llama-2-vision-90b'; // Latest Groq vision model

// Vision prompt templates
const FIGURINHA_DETECTION_PROMPT = `
You are an expert at identifying FIFA 2026 World Cup figurinhas (sticker cards) in photos.

Analyze the image and:
1. Detect all visible figurinhas/cards
2. Extract player names and numbers
3. Identify the country represented
4. Estimate condition (excellent/good/fair/poor)
5. Detect duplicates if multiple cards are shown

Return a JSON object with this structure:
{
  "figurinhas": [
    {
      "number": "card_number",
      "player_name": "name",
      "country": "country",
      "condition": "excellent|good|fair|poor",
      "confidence": 0.0-1.0
    }
  ],
  "duplicates_found": ["number1", "number2"],
  "detection_errors": ["error1", "error2"],
  "scan_quality": "high|medium|low"
}
`;

// ============================================================================
// CORE SCANNING FUNCTIONS
// ============================================================================

/**
 * Initialize scan event handlers
 * Setup event listeners for camera, upload, and process buttons
 */
function initScanHandlers() {
  console.log('[SCAN] Initializing scan handlers...');

  const scanCameraBtn = document.getElementById('scanCameraBtn');
  const scanUploadBtn = document.getElementById('scanUploadBtn');
  const scanFileInput = document.getElementById('scanFileInput');
  const scanCameraInput = document.getElementById('scanCameraInput');
  const scanProcessBtn = document.getElementById('scanProcessBtn');
  const scanModalClose = document.getElementById('scanModalClose');
  const scanModalCancel = document.getElementById('scanModalCancel');

  if (scanCameraBtn) {
    scanCameraBtn.addEventListener('click', () => {
      scanCameraInput.click();
    });
  }

  if (scanUploadBtn) {
    scanUploadBtn.addEventListener('click', () => {
      scanFileInput.click();
    });
  }

  if (scanFileInput) {
    scanFileInput.addEventListener('change', (e) => {
      handlePhotoSelected(e.target.files[0]);
    });
  }

  if (scanCameraInput) {
    scanCameraInput.addEventListener('change', (e) => {
      handlePhotoSelected(e.target.files[0]);
    });
  }

  if (scanProcessBtn) {
    scanProcessBtn.addEventListener('click', processScanPhoto);
  }

  if (scanModalClose) {
    scanModalClose.addEventListener('click', () => {
      resetScanModal();
      document.getElementById('scanModalOverlay').classList.remove('active');
    });
  }

  if (scanModalCancel) {
    scanModalCancel.addEventListener('click', () => {
      resetScanModal();
      document.getElementById('scanModalOverlay').classList.remove('active');
    });
  }
}

/**
 * Open the scan modal for a specific country
 * @param {string} paisSigla - Country code (e.g., 'BRA')
 */
function openScanModal(paisSigla) {
  console.log(`[SCAN] Opening scan modal for ${paisSigla}`);

  const modal = document.getElementById('scanModalOverlay');
  if (modal) {
    modal.classList.add('active');
    // Store the country code for later use
    modal.dataset.paisSigla = paisSigla;
  }
}

/**
 * Handle photo file selection
 * Display preview and show process button
 * @param {File} file - Selected photo file
 */
function handlePhotoSelected(file) {
  if (!file) {
    return;
  }

  console.log(`[SCAN] Photo selected: ${file.name} (${file.size} bytes)`);

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Por favor, selecione uma imagem válida', 'error');
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('Arquivo muito grande. Máximo 5MB', 'error');
    return;
  }

  // Read and display preview
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('scanPreview');
    const previewImg = document.getElementById('scanPreviewImg');
    const processBtn = document.getElementById('scanProcessBtn');

    previewImg.src = e.target.result;
    preview.style.display = 'block';
    processBtn.style.display = 'block';

    // Store the photo data URI for later processing
    document.getElementById('scanModalOverlay').dataset.photoDataUri = e.target.result;
  };

  reader.readAsDataURL(file);
}

/**
 * Reset scan modal to initial state
 */
function resetScanModal() {
  console.log('[SCAN] Resetting scan modal');

  const fileInput = document.getElementById('scanFileInput');
  const cameraInput = document.getElementById('scanCameraInput');
  const preview = document.getElementById('scanPreview');
  const processBtn = document.getElementById('scanProcessBtn');
  const modal = document.getElementById('scanModalOverlay');

  if (fileInput) fileInput.value = '';
  if (cameraInput) cameraInput.value = '';
  if (preview) preview.style.display = 'none';
  if (processBtn) processBtn.style.display = 'none';
  if (modal) {
    delete modal.dataset.photoDataUri;
    delete modal.dataset.paisSigla;
  }
}

/**
 * Main processing function - convert image and call Groq Vision API
 */
async function processScanPhoto() {
  console.log('[SCAN] Processing scan photo...');

  const modal = document.getElementById('scanModalOverlay');
  const photoDataUri = modal.dataset.photoDataUri;
  const paisSigla = modal.dataset.paisSigla;

  if (!photoDataUri) {
    showToast('Nenhuma foto selecionada', 'error');
    return;
  }

  try {
    // Show loading state
    const processBtn = document.getElementById('scanProcessBtn');
    processBtn.disabled = true;
    processBtn.textContent = 'Processando...';
    showToast('Analisando figurinhas com IA...', 'info');

    // Call Groq Vision API
    const result = await callGroqVision(photoDataUri, paisSigla);

    if (result && result.figurinhas && result.figurinhas.length > 0) {
      // Process the results and update database
      await processScanResults(result.figurinhas, paisSigla);

      // Show result modal
      showResultModal(result);

      // Reset modal after successful processing
      resetScanModal();
      modal.classList.remove('active');
    } else {
      showToast('Nenhuma figurinha detectada na foto', 'info');
    }
  } catch (error) {
    console.error('[SCAN] Error processing photo:', error);
    showToast('Erro ao processar foto. Tente novamente.', 'error');
  } finally {
    const processBtn = document.getElementById('scanProcessBtn');
    processBtn.disabled = false;
    processBtn.textContent = 'Processar Foto';
  }
}

/**
 * Call Groq Vision API to detect figurinhas in photo
 * @param {string} photoDataUri - Base64 encoded photo data URI
 * @param {string} paisSigla - Country code for context
 * @returns {Promise<Object>} Groq API response with detected figurinhas
 */
async function callGroqVision(photoDataUri, paisSigla) {
  console.log(`[SCAN] Calling Groq Vision API for ${paisSigla}`);

  if (!GROQ_API_KEY) {
    throw new Error('Chave API Groq não configurada');
  }

  // Enhance prompt with country context
  const enhancedPrompt = `${FIGURINHA_DETECTION_PROMPT}\n\nCountry context: ${paisSigla}. Focus on finding figurinhas from this country.`;

  const payload = {
    model: GROQ_VISION_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: enhancedPrompt
          },
          {
            type: 'image_url',
            image_url: {
              url: photoDataUri
            }
          }
        ]
      }
    ],
    temperature: 0.1,
    max_tokens: 2048
  };

  try {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract JSON from response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log('[SCAN] Groq response parsed successfully:', result);
        return result;
      }
    }

    throw new Error('Invalid response format from Groq API');
  } catch (error) {
    console.error('[SCAN] Groq API error:', error);
    throw error;
  }
}

/**
 * Process scan results and update database
 * Toggle figurinhas and add duplicates
 * @param {Array} codesDetected - Array of figurinha objects detected
 * @param {string} paisSigla - Country code
 */
async function processScanResults(codesDetected, paisSigla) {
  console.log(`[SCAN] Processing ${codesDetected.length} detected figurinhas`);

  const codeCount = {};

  // Count occurrences of each code
  codesDetected.forEach(fig => {
    const code = fig.number || fig.codigo;
    if (code) {
      codeCount[code] = (codeCount[code] || 0) + 1;
    }
  });

  // Process each unique code
  for (const [code, count] of Object.entries(codeCount)) {
    try {
      // Mark the figurinha as owned (toggle to true)
      await toggleFigurinha(code);

      // If count > 1, add duplicates
      // count = 2 means 1 marked + 1 duplicate
      // count = 3 means 1 marked + 2 duplicates, etc.
      if (count > 1) {
        for (let i = 1; i < count; i++) {
          await addDuplicata(code);
        }
      }

      console.log(`[SCAN] Processed ${code}: marked + ${count - 1} duplicates`);
    } catch (error) {
      console.error(`[SCAN] Error processing ${code}:`, error);
    }
  }

  // Update UI stats
  await updateHeaderStats();
  await refreshCurrentGroup();
}

/**
 * Display results modal with summary of detected figurinhas
 * @param {Object} result - Result object from Groq API
 */
function showResultModal(result) {
  console.log('[SCAN] Showing result modal');

  const modal = document.getElementById('resultModalOverlay');
  const content = document.getElementById('resultModalContent');
  const closeBtn = document.getElementById('resultModalClose');
  const okBtn = document.getElementById('resultModalOk');

  if (!modal || !content) {
    console.error('[SCAN] Result modal elements not found');
    return;
  }

  // Build result HTML
  let html = '<div class="scan-results">';

  if (result.figurinhas && result.figurinhas.length > 0) {
    html += `<div class="result-summary">
      <div class="result-icon">✅</div>
      <div class="result-count">${result.figurinhas.length} figurinha(s) detectada(s)</div>
    </div>`;

    html += '<div class="result-list">';
    result.figurinhas.forEach(fig => {
      const condition = fig.condition ? ` • ${fig.condition}` : '';
      const confidence = fig.confidence ? Math.round(fig.confidence * 100) : 0;

      html += `<div class="result-item">
        <div class="result-item-code">${fig.number || fig.codigo}</div>
        <div class="result-item-details">
          <div>${fig.player_name || fig.nome || 'Sem nome'}</div>
          <div class="result-item-meta">Confiança: ${confidence}%${condition}</div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (result.duplicates_found && result.duplicates_found.length > 0) {
    html += `<div class="result-duplicates">
      <h4>Duplicatas Detectadas:</h4>
      <p>${result.duplicates_found.join(', ')}</p>
    </div>`;
  }

  if (result.detection_errors && result.detection_errors.length > 0) {
    html += `<div class="result-errors">
      <p><small>Notas: ${result.detection_errors.join('; ')}</small></p>
    </div>`;
  }

  html += '</div>';
  content.innerHTML = html;

  // Setup modal buttons
  closeBtn.onclick = () => modal.classList.remove('active');
  okBtn.onclick = () => modal.classList.remove('active');

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  };

  // Show modal
  modal.classList.add('active');

  // Show success toast
  showToast('✅ Figurinhas adicionadas com sucesso!', 'success');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert image file to base64 for API transmission
 * @param {File|Blob} file - Image file
 * @returns {Promise<string>} Base64 encoded image data URI
 */
async function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initScanHandlers,
    openScanModal,
    handlePhotoSelected,
    resetScanModal,
    processScanPhoto,
    callGroqVision,
    processScanResults,
    showResultModal,
    imageToBase64
  };
}
