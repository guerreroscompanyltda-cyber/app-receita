
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Goal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIPromptedRecipe = async (query: string, goal: Goal): Promise<Recipe | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un chef Michelin y experto en biohacking. Genera una receta de LUJO para el objetivo: "${goal}" basada en: "${query}". 
      La receta debe incluir un ingrediente 'secreto' que potencie el metabolismo.
      Responde estrictamente en JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Desayuno', 'Almuerzo', 'Cena', 'Snack', 'Postre'] },
            time: { type: Type.STRING },
            timeValue: { type: Type.NUMBER },
            calories: { type: Type.NUMBER },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Media', 'Avanzada'] },
            dietaryRestrictions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "description", "category", "time", "timeValue", "calories", "ingredients", "instructions", "difficulty", "dietaryRestrictions"]
        }
      }
    });

    const recipeData = JSON.parse(response.text || '{}');
    const searchTerms = encodeURIComponent(`${recipeData.title} gourmet healthy food dark background`);
    
    return {
      ...recipeData,
      id: Math.random().toString(36).substr(2, 9),
      image: `https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop`, // Base image fallback or specific term
      rating: 4.9,
      reviews: Math.floor(500 + Math.random() * 1000)
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
};

export const getDailyInsight = async (goal: Goal): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera un "Insight de Poder" corto (máximo 150 caracteres) para alguien que quiere "${goal}". Debe sonar exclusivo, científico y motivador. En español.`,
    });
    return response.text || "Tu cuerpo es un templo, trátalo con excelencia hoy.";
  } catch {
    return "La disciplina es el puente entre tus metas y tus logros.";
  }
};
