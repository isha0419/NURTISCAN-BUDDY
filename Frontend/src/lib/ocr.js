import Tesseract from 'tesseract.js';

export async function extractTextFromImage(file, onProgress) {
  const { data } = await Tesseract.recognize(file, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    },
    // PSM 6 = "assume a single uniform block of text"
    // Helps on nutrition panels more than the default auto-layout mode,
    // though multi-column grids will still be imperfect.
    tessedit_pageseg_mode: '6',
  });
  return data.text;
}

export function parseNutrientsFromText(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const fullText = text.toLowerCase();

  const KEYWORD_MAP = {
    calories: ['calories', 'energy'],
    protein: ['protein'],
    carbs: ['total carbohydrate', 'carbohydrate', 'total carb', 'carbs'],
    fats: ['total fat', 'fat'],
    sugar: ['total sugars', 'sugars', 'sugar'],
    sodium: ['sodium'],
  };

  const result = {};

  for (const [field, keywords] of Object.entries(KEYWORD_MAP)) {
    let found;

    // Pass 1: keyword and number on the SAME line (most reliable)
    for (const line of lines) {
      const lower = line.toLowerCase();
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          const match = line.match(/([0-9]+(?:\.[0-9]+)?)/);
          if (match) {
            found = parseFloat(match[1]);
            break;
          }
        }
      }
      if (found !== undefined) break;
    }

    // Pass 2: fallback to proximity search across the whole text
    if (found === undefined) {
      for (const keyword of keywords) {
        const regex = new RegExp(`${keyword}[^0-9]{0,6}([0-9]+(?:\\.[0-9]+)?)`, 'i');
        const match = fullText.match(regex);
        if (match) {
          found = parseFloat(match[1]);
          break;
        }
      }
    }

    if (found !== undefined) result[field] = found;
  }

  return result;
}