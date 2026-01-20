
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
    },
    tvSeriesAnalysis: {
      type: Type.OBJECT,
      properties: {
        pilotStructure: {
          type: Type.OBJECT,
          properties: {
            incitingIncident: { type: Type.STRING, description: "O evento que quebra a normalidade e inicia a trama." },
            plotPoint1: { type: Type.STRING, description: "O ponto de não retorno que encerra o Ato 1." },
            midpoint: { type: Type.STRING, description: "O meio do episódio, onde as apostas sobem ou há uma revelação." },
            plotPoint2: { type: Type.STRING, description: "O momento 'tudo está perdido' ou a última preparação para o clímax." },
            climax: { type: Type.STRING, description: "O confronto final do episódio." },
            cliffhanger: { type: Type.STRING, description: "O gancho final que convence a assistir o próximo." }
          },
          required: ["incitingIncident", "plotPoint1", "midpoint", "plotPoint2", "climax", "cliffhanger"]
        },
        narrativeEngine: {
          type: Type.OBJECT,
          properties: {
            coreConflict: { type: Type.STRING, description: "O conflito central que pode sustentar múltiplas temporadas." },
            seasonPotential: { type: Type.STRING, description: "Análise se a premissa aguenta 8-22 episódios." },
            format: { type: Type.STRING, enum: ['Procedural', 'Serializada', 'Híbrida'], description: "O formato da série." }
          },
          required: ["coreConflict", "seasonPotential", "format"]
        },
        engagement: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Nota de engajamento de 0 a 10." },
            hookStrength: { type: Type.STRING, description: "Força do gancho inicial." },
            bingeFactor: { type: Type.STRING, description: "Potencial de maratona." }
          },
          required: ["score", "hookStrength", "bingeFactor"]
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

export const analyzeLiteraryText = async (text: string, analysisType: 'novel' | 'tv_pilot' = 'novel'): Promise<AnalysisResult> => {
  const isTvPilot = analysisType === 'tv_pilot';

  const baseInstructions = `
      Atue como um Analista Literário de IA de nível sênior especializado em teoria narrativa clássica e moderna. 
      Sua tarefa é realizar uma "autópsia literária" profunda do manuscrito fornecido.
      
      INSTRUÇÕES TÉCNICAS GERAIS:
      1. DIAGNÓSTICO ESTRUTURAL: Identifique frameworks clássicos (Jornada do Herói, Save the Cat, etc).
      2. ANÁLISE LEXICAL: Analise ritmo, tom e escolha de palavras.
      3. PERSONAGENS: Identifique arquétipos e arcos.
      4. IDIOMA: Português do Brasil.
      5. SCORE: Nota rigorosa de 0.0 a 10.0 baseada em qualidade técnica e criativa.
  `;

  const novelInstructions = `
      FOCO: ROMANCE/CONTO (LITERATURA)
      - Aprofunde-se na prosa, no estilo literário e na imagética sensorial.
      - Analise a estrutura clássica completa da obra.
  `;

  const tvPilotInstructions = `
      FOCO: ROTEIRO DE SÉRIE (TV PILOT / SCRIPT DOCTOR)
      
      Você está atuando como um Showrunner e Script Doctor de Hollywood.
      Sua análise deve focar na VIABILIDADE DA SÉRIE e na ESTRUTURA DO PILOTO.
      
      PREENCHA O CAMPO 'tvSeriesAnalysis' COM RIGOR:
      1. MOTOR NARRATIVO: O que gera novos episódios? Qual o conflito inesgotável?
      2. ESTRUTURA DO PILOTO: Identifique claramente Incidente Incitante, Plot Points e Ganchos.
      3. POTENCIAL DE TEMPORADA: A premissa sustenta 10+ episódios ou morre no piloto?
      4. ENGAGEMENT: O piloto vende a série?
      
      IMPORTANTE: Para roteiros, dê menos peso à "beleza da prosa" e mais peso à "eficácia dramática e visual".
  `;

  const instructions = isTvPilot ? tvPilotInstructions : novelInstructions;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `
      ${baseInstructions}
      ${instructions}
      
      O resultado DEVE ser um JSON estritamente seguindo o schema fornecido. 
      ${isTvPilot ? "PARA ROTEIROS DE SÉRIE, VOCÊ DEVE PREENCHER O OBJETO 'tvSeriesAnalysis'." : ""}

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
