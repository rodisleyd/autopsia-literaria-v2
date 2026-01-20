
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        premise: { type: Type.STRING },
        centralPlot: { type: Type.STRING },
        mainThemes: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["title", "premise", "centralPlot", "mainThemes"]
    },
    score: { type: Type.NUMBER },
    scoreJustification: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["strengths", "weaknesses"]
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        intensity: { type: Type.STRING, description: 'Lento, Médio ou Rápido' },
        intensityDescription: { type: Type.STRING, description: 'Descrição detalhada do porquê dessa intensidade' },
        rhythmScore: { type: Type.NUMBER, description: 'Nota de 0 a 10 para o pacing' },
        rhythmDescription: { type: Type.STRING, description: 'Explicação do ritmo narrativo' },
        tone: { type: Type.STRING, description: 'O tom predominante' },
        toneDescription: { type: Type.STRING, description: 'Como o tom é construído no texto' },
        toneAnalysis: {
          type: Type.OBJECT,
          properties: {
            lexicalMarkers: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Palavras ou expressões frequentes que definem o tom' },
            sentenceStructure: { type: Type.STRING, description: 'Como a sintaxe (frases curtas, longas, complexas) afeta o tom' },
            atmosphericElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Elementos de cenário ou sensação que reforçam o tom' }
          },
          required: ["lexicalMarkers", "sentenceStructure", "atmosphericElements"]
        },
        complexity: { type: Type.STRING, description: 'Simples, Moderada ou Complexa' },
        complexityDescription: { type: Type.STRING, description: 'Justificativa da complexidade da obra' }
      },
      required: ["intensity", "intensityDescription", "rhythmScore", "rhythmDescription", "tone", "toneDescription", "toneAnalysis", "complexity", "complexityDescription"]
    },
    genre: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING },
        subgenres: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["primary", "subgenres"]
    },
    narrativeStructures: {
      type: Type.OBJECT,
      properties: {
        herosJourney: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  foundInText: { type: Type.BOOLEAN },
                  evidence: { type: Type.STRING }
                }
              }
            }
          }
        },
        saveTheCat: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, stages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, description: { type: Type.STRING }, foundInText: { type: Type.BOOLEAN }, evidence: { type: Type.STRING } } } } } },
        storyCircle: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, stages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, description: { type: Type.STRING }, foundInText: { type: Type.BOOLEAN }, evidence: { type: Type.STRING } } } } } },
        sevenPointStructure: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, stages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, description: { type: Type.STRING }, foundInText: { type: Type.BOOLEAN }, evidence: { type: Type.STRING } } } } } },
        characterArc: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, stages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, description: { type: Type.STRING }, foundInText: { type: Type.BOOLEAN }, evidence: { type: Type.STRING } } } } } },
        kishotenketsu: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, stages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, description: { type: Type.STRING }, foundInText: { type: Type.BOOLEAN }, evidence: { type: Type.STRING } } } } } },
        threeActStructure: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, stages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, description: { type: Type.STRING }, foundInText: { type: Type.BOOLEAN }, evidence: { type: Type.STRING } } } } } }
      },
      required: [
        "herosJourney", "saveTheCat", "storyCircle",
        "sevenPointStructure", "characterArc", "kishotenketsu", "threeActStructure"
      ]
    },
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          arc: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          impact: { type: Type.STRING }
        }
      }
    },
    languageAndDialog: {
      type: Type.OBJECT,
      properties: {
        vocabulary: { type: Type.STRING },
        subtextEfficiency: { type: Type.NUMBER },
        dialogueQuality: { type: Type.STRING },
        expositionCheck: { type: Type.STRING }
      },
      required: ["vocabulary", "subtextEfficiency", "dialogueQuality", "expositionCheck"]
    },
    worldBuilding: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        coherence: { type: Type.NUMBER }
      }
    },
    rewritingTips: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          suggestion: { type: Type.STRING }
        }
      }
    }
  },
  required: [
    "overview", "score", "scoreJustification", "metrics", "genre",
    "narrativeStructures", "characters", "languageAndDialog",
    "worldBuilding", "rewritingTips"
  ]
};

export const analyzeLiteraryText = async (text: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `
      Atue como um Analista Literário de IA de nível sênior especializado em teoria narrativa clássica e moderna. 
      Sua tarefa é realizar uma "autópsia literária" profunda do manuscrito fornecido.
      
      INSTRUÇÕES TÉCNICAS:
      1. DIAGNÓSTICO ESTRUTURAL: Identifique com precisão os seguintes frameworks com estas etapas específicas:
         - Jornada do Herói (Vogler): Etapas clássicas.
         - Save the Cat (Snyder): Beat sheet clássico.
         - Story Circle (Harmon): 8 etapas.
         - Estrutura de Sete Pontos (Dan Wells): 1. Gancho, 2. Plot Point 1, 3. Pinch 1, 4. Ponto Médio, 5. Pinch 2, 6. Plot Point 2, 7. Resolução.
         - Arco Dramático de Personagem (McKee): 1. Desejo, 2. Conflito, 3. Escolhas, 4. Transformação.
         - Kishōtenketsu (Estrutura Oriental): 1. Ki (Introdução), 2. Sho (Desenvolvimento), 3. Ten (Virada Inesperada), 4. Ketsu (Conclusão).
         - Estrutura em Três Atos (Syd Field): 1. Ato 1 (Apresentação), 2. Ato 2 (Confronto), 3. Ato 3 (Resolução).
      Seja crítico: se um estágio não estiver presente, marque como false. Use citações diretas no campo "evidence".
      2. ANÁLISE LEXICAL E SINTÁTICA: Vá além do superficial. Analise como a escolha de palavras (marcadores lexicais) e a variação no comprimento das frases (ritmo sintático) constroem a atmosfera.
      3. PERSONAGENS: Identifique arquétipos e avalie a agência e o arco de transformação.
      4. SUBTEXTO: Diferencie o texto explícito das camadas implícitas. Avalie se há "info-dumping" (exposição excessiva).
      5. IDIOMA: Toda a análise, evidências, sugestões e descrições DEVEM ser em Português do Brasil, mesmo que o texto original esteja em outro idioma.
      6. SCORE (NOTA GLOBAL): Você deve atribuir uma nota flutuante de 0.0 a 10.0. SEJA RIGOROSO. O score deve refletir a qualidade técnica (estrutura, gramática), criativa (originalidade, personagens) e emocional. Não use valores padrão seguros (como 6.5 ou 7.0). Use a escala completa. Textos ruins devem receber notas baixas (2.0 - 5.0), textos medianos (5.1 - 7.5) e excelentes (7.6 - 9.9). Obra-prima = 10.0.
      
      O resultado DEVE ser um JSON estritamente seguindo o schema fornecido. 
      Use citações diretas do texto no campo "evidence" sempre que possível.

      Texto para análise:
      ---
      ${text}
      ---
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
    },
  });

  return JSON.parse(response.text);
};
