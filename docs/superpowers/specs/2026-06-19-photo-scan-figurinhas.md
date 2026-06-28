# Photo Scan Figurinhas - Design Specification

**Date:** 2026-06-19  
**Status:** Draft  
**Feature:** Scan and auto-fill figurinhas from photo using Groq Vision API

---

## Goal

Allow users to take a photo of their physical FIFA 2026 album and automatically mark figurinhas as owned + detect duplicates, without manual entry.

---

## Architecture

**Frontend-only implementation** using Groq Vision API for OCR and duplicate detection.

**Flow:**
1. User clicks "📸 Scanear" button in a country card
2. Modal opens with camera/upload options
3. User captures/uploads photo of album page (20 figurinhas from one country)
4. Photo sent to Groq Vision API
5. Groq returns list of codes detected + frequency (for duplicates)
6. App auto-marks figurinhas as "tem" + auto-adds duplicates
7. Modal shows confirmation with summary

---

## UI Components

### New Button in Country Card
- Label: "📸 Scanear" 
- Placement: Next to "Duplicata" and "Ver Duplicatas" buttons
- Styling: Blue, consistent with app design
- Triggers: Opens ScanModal

### ScanModal
**Structure:**
- Header: "📸 Scanear Figurinhas - [Country Name]"
- Body:
  - Capture options:
    - 📷 "Tirar Foto" (camera live)
    - 📁 "Fazer Upload" (from gallery)
  - Preview area (shows selected photo)
  - "Processar" button (grayed out until photo selected)
- Footer: "Cancelar" button

### ResultModal
**Structure:**
- Header: "✅ Resultado do Scan"
- Body:
  - Summary cards:
    - "✅ X figurinhas marcadas" (green)
    - "🔴 X duplicatas adicionadas" (orange)
  - Detailed list (optional):
    - Codes marked: BRA1, BRA2, BRA3...
    - Duplicates detected: BRA5 (×2), BRA10 (×3)...
- Footer: "Confirmar e Fechar" button

---

## Data Flow

### Input (Photo)
- Format: JPEG/PNG (from camera or upload)
- Constraint: Must show ~20 figurinhas clearly (ONE country's page only)
- Angle: Top-down view of album
- ⚠️ Limitation: Photo must contain ONLY stickers from the selected country — if photo shows multiple countries, results will be incorrect

### Processing (Groq Vision)
**Request to Groq API:**
```json
{
  "model": "llama-3.2-90b-vision-preview",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,..."
          }
        },
        {
          "type": "text",
          "text": "Analyze this FIFA 2026 sticker album photo. Identify ALL visible sticker codes (e.g., BRA1, MEX15, CZE7). For each code, count how many times it appears. Return JSON format: {\"codes\": [\"BRA1\", \"BRA1\", \"BRA2\", ...]} where repeated codes mean duplicates."
        }
      ]
    }
  ]
}
```

**Response (from Groq):**
```json
{
  "codes": ["BRA1", "BRA1", "BRA2", "BRA3", "BRA3", "BRA3", "BRA4", ...]
}
```

### Processing Logic
```
1. For each unique code in response:
   - Call toggleFigurinha(codigo) to mark as "tem"
   
2. For duplicates (code appears n > 1 times):
   - Count = n - 1 (total duplicates after marking one as owned)
   - Call addDuplicata(codigo) count times
   
3. Collect summary:
   - Total unique codes marked
   - Total duplicate units added
   
4. Return summary to ResultModal
```

### Output (Database Updates)
- `figurinhas.tem` → set to true for scanned codes
- `figurinhas.duplicatas` → increment for duplicates
- `figurinhas.updated_at` → current timestamp

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Photo upload fails | Toast: "Erro ao carregar foto" |
| Groq API error | Toast: "Erro ao processar foto. Tente novamente." |
| No codes detected | Modal: "Nenhuma figurinha reconhecida. Tente outra foto." |
| Invalid codes (non-matching country) | Warn user, allow override or retry |
| Network timeout | Toast with retry option |

---

## Technical Details

### Frontend Implementation
- **Camera capture:** Use `<input type="file" capture="environment">` for mobile camera
- **File upload:** Standard `<input type="file" accept="image/*">`
- **Base64 encoding:** Convert image to data URI for Groq API
- **API key:** Store in `.env.local` (dev only; note security caveat for production)

### Dependencies
- Groq SDK or fetch API (for HTTP requests)
- No additional image processing libraries needed (Groq handles image understanding)

### Security Caveat
⚠️ **Frontend API key exposure:** This is acceptable for MVP/testing. For production, move to backend (Supabase Function) to keep API key secret.

---

## Success Criteria

✅ User can take/upload photo of album page  
✅ Groq recognizes 90%+ of visible codes correctly  
✅ Duplicates detected and auto-filled  
✅ Figurinhas marked as "tem" in real-time  
✅ User sees confirmation summary  
✅ Works on mobile (camera) and desktop (upload)  

---

## Non-Goals

- Recognize partially visible codes
- Handle blurry/low-light photos
- Scan multiple pages in one photo
- Advanced image preprocessing

---

## Testing

### Manual Tests
1. Photo of complete country (20 stickers, no repeats) → All marked, no duplicates
2. Photo with repeated stickers → Correct duplicates added
3. Blurry photo → Graceful "not recognized" message
4. Wrong country codes in photo → Handles gracefully or warns

### Edge Cases
- Photo shows stickers from multiple countries → May mark wrong country's figurinhas (caveat noted)
- Missing stickers in album → Correctly skips
- Duplicate counts vary on retry → Acceptable (depends on photo quality)

---

## Timeline & Scope

**Scope:** MVP feature for single-country photo scan  
**Complexity:** Medium (API integration + modal UX + error handling)  
**Estimated effort:** 1-2 development iterations

