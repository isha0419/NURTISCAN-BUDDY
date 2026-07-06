const User = require('../models/User.model');

const analyzeFood = async (req, res) => {
  try {
    const { foodName, nutrients } = req.body;

    if (!foodName) {
      return res.status(400).json({ message: 'foodName is required' });
    }

    // Pull the user's real medical profile from DB
    const user = await User.findById(req.user.id).select('medicalConditions allergies dietaryPreferences');

    const prompt = `You are a nutrition assistant. Analyze this food item for a specific user.

Food: ${foodName}
Nutrients: ${JSON.stringify(nutrients || {})}
User's medical conditions: ${user.medicalConditions.length ? user.medicalConditions.join(', ') : 'none'}
User's allergies: ${user.allergies.length ? user.allergies.join(', ') : 'none'}
User's dietary preferences: ${user.dietaryPreferences.length ? user.dietaryPreferences.join(', ') : 'none'}

Consider the medical conditions specifically. For example, flag high sodium for hypertension, high sugar/carbs for diabetes, and check allergies strictly.

Return JSON with exactly these keys: riskCategory ("low" | "moderate" | "high"), reason (1-2 sentence explanation referencing their specific condition if relevant), suggestion (one practical alternative or tip tailored to their condition).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.4,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(502).json({ message: 'AI service error', details: data.error?.message });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { riskCategory: 'unknown', reason: rawText, suggestion: '' };
    }

    res.json(parsed);
  } catch (err) {
    console.error('analyzeFood error:', err);
    res.status(500).json({ message: err.message });
  }
};

const getCravingAlternatives = async (req, res) => {
  try {
    const { craving } = req.body;

    if (!craving) {
      return res.status(400).json({ message: 'craving is required' });
    }

    const user = await User.findById(req.user.id).select('medicalConditions allergies dietaryPreferences');

    const prompt = `You are a nutrition assistant helping someone manage a food craving in a healthy way.

The user is craving: ${craving}
Their medical conditions: ${user.medicalConditions.length ? user.medicalConditions.join(', ') : 'none'}
Their allergies: ${user.allergies.length ? user.allergies.join(', ') : 'none'}
Their dietary preferences: ${user.dietaryPreferences.length ? user.dietaryPreferences.join(', ') : 'none'}

Suggest 3 realistic alternative foods or snacks that satisfy a similar craving (texture, flavor, or satisfaction) but are safer or healthier given their conditions. Avoid anything that conflicts with their allergies or conditions.

Return JSON with exactly this structure:
{
  "originalCraving": "string",
  "riskIfEatenDirectly": "short 1-sentence note on why the original craving may be risky for this user, or 'no major concern' if conditions allow it occasionally",
  "alternatives": [
    { "name": "string", "reason": "why this satisfies the craving and is safer" },
    { "name": "string", "reason": "..." },
    { "name": "string", "reason": "..." }
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.6,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(502).json({ message: 'AI service error', details: data.error?.message });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { originalCraving: craving, riskIfEatenDirectly: '', alternatives: [] };
    }

    res.json(parsed);
  } catch (err) {
    console.error('getCravingAlternatives error:', err);
    res.status(500).json({ message: err.message });
  }
};

const scanLabelImage = async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'imageBase64 is required' });
    }

    const prompt = `You are reading a nutrition facts label from a photo. The label may be a table with rows like "Nutrients | Per 100g | %RDA Per Serve". Extract the values from the "per 100g" or main serving column (not the %RDA column).

Return JSON only, with exactly these keys (use null if a value truly isn't visible):
{
  "foodName": "best guess at product name, or null",
  "calories": number or null,
  "protein": number or null,
  "carbs": number or null,
  "fats": number or null,
  "sugar": number or null,
  "sodium": number or null
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: imageBase64,
                  },
              },
            ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.2,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini vision error:', data);
      return res.status(502).json({ message: 'AI service error', details: data.error?.message });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ message: 'Could not parse label — try a clearer photo' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('scanLabelImage error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { analyzeFood, getCravingAlternatives, scanLabelImage };