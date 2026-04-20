import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface TarotCard {
  name: string;
  meaning: string;
  isReversed: boolean;
}

export async function getTarotInterpretation(
  cards: TarotCard[],
  question: string,
  context: string = ""
): Promise<string> {
  const model = "gemini-3.1-flash-lite-preview";
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in the environment.");
    return "A conexão com o oráculo não foi configurada corretamente (chave de API ausente).";
  }

  const prompt = `
    Você é um mestre de Tarot intuitivo baseado no sistema Waite (Pamela Colman Smith).
    
    Tiragem de 3 cartas:
    1. ${cards[0].name} ${cards[0].isReversed ? '(Invertida)' : ''}
    2. ${cards[1].name} ${cards[1].isReversed ? '(Invertida)' : ''}
    3. ${cards[2].name} ${cards[2].isReversed ? '(Invertida)' : ''}
    
    Pergunta/Tema: ${question}
    Contexto Adicional: ${context}
    
    Instruções:
    - Forneça uma interpretação profunda e intuitiva.
    - Use uma linguagem acolhedora, mística e reflexiva.
    - Relacione o simbolismo das cartas de Waite com a situação.
    - Estruture a resposta com:
      1. Significado individual breve de cada carta no contexto da posição.
      2. Uma síntese geral da leitura.
      3. Um conselho final prático e espiritual.
    
    Responda em Português do Brasil.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    if (!result.text) {
      console.warn("Gemini returned empty text result:", result);
      return "O oráculo permaneceu em silêncio. Tente reformular sua pergunta.";
    }

    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a sabedoria das cartas. Tente novamente mais tarde.";
  }
}
