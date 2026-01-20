
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
        overview: {
          type: Type.OBJECT,
          properties: {
            logline: { type: Type.STRING },
            tone: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            centralProposal: { type: Type.STRING }
          },
          required: ["logline", "tone", "targetAudience", "centralProposal"]
        },
        pilotStructure: {
          type: Type.OBJECT,
          properties: {
            incitingIncident: { type: Type.STRING },
            act1: { type: Type.STRING },
            plotPoint1: { type: Type.STRING },
            act2: { type: Type.STRING },
            midpoint: { type: Type.STRING },
            plotPoint2: { type: Type.STRING },
            act3: { type: Type.STRING },
            climax: { type: Type.STRING },
            cliffhanger: { type: Type.STRING },
            comments: { type: Type.STRING }
          },
          required: ["incitingIncident", "act1", "plotPoint1", "act2", "midpoint", "plotPoint2", "act3", "climax", "cliffhanger", "comments"]
        },
        charactersAspects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING, enum: ['Protagonista', 'Antagonista', 'Apoio'] },
              dramaticFunction: { type: Type.STRING },
              externalDesire: { type: Type.STRING, description: "O que ele quer conscientemente." },
              internalNeed: { type: Type.STRING, description: "O que ele precisa inconscientemente." },
              seasonArc: { type: Type.STRING, description: "Potencial de evolução na temporada." },
              conflict: { type: Type.STRING }
            },
            required: ["name", "role", "dramaticFunction", "externalDesire", "internalNeed", "seasonArc", "conflict"]
          }
        },
        worldAndTheme: {
          type: Type.OBJECT,
          properties: {
            rules: { type: Type.STRING },
            socialMoralSpace: { type: Type.STRING },
            franchisePotential: { type: Type.STRING },
            centralTheme: { type: Type.STRING },
            secondaryThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            philosophicalQuestion: { type: Type.STRING }
          },
          required: ["rules", "socialMoralSpace", "franchisePotential", "centralTheme", "secondaryThemes", "philosophicalQuestion"]
        },
        narrativeEngine: {
          type: Type.OBJECT,
          properties: {
            coreConflict: { type: Type.STRING },
            seasonPotential: { type: Type.STRING },
            format: { type: Type.STRING, enum: ['Procedural', 'Serializada', 'Híbrida'] },
            engineDescription: { type: Type.STRING, description: "Explicação do que gera novos episódios." }
          },
          required: ["coreConflict", "seasonPotential", "format", "engineDescription"]
        },
        diagnosis: {
          type: Type.OBJECT,
          properties: {
            engagementScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ['Estrutura', 'Personagens', 'Gancho'] },
                  suggestion: { type: Type.STRING }
                }
              }
            },
            finalVerdict: { type: Type.STRING }
          },
          required: ["engagementScore", "strengths", "weaknesses", "improvementSuggestions", "finalVerdict"]
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
  `;

  const novelInstructions = `
      FOCO: ROMANCE/CONTO (LITERATURA)
      Instruções Padrão de Análise Literária:
      1. DIAGNÓSTICO ESTRUTURAL (Jornada, Save the Cat).
      2. ANÁLISE LEXICAL & PROSA.
      3. ARQUÉTIPOS DE PERSONAGENS.
      4. SUBTEXTO & IDIOMA.
      5. SCORE RIGOROSO (0-10).
  `;

  const tvPilotInstructions = `
      FOCO: ROTEIRO DE SÉRIE (TV PILOT / SCRIPT DOCTOR)
      
      Você é um Analista da Netflix/HBO. Sua análise deve ser um "Coverage" profissional de Script Doctor.
      
      PREENCHA 'tvSeriesAnalysis' SEGUINDO ESTES PILARES:

      1. VISÃO GERAL: Logline vendedora, Tom preciso, Público-Alvo e Proposta Central.
      2. ESTRUTURA DO PILOTO (CRUCIAL):
         - Incidente Incitante: O evento que inicia tudo.
         - Ato 1: Apresentação e Promessa.
         - Plot Point 1: A decisão sem volta.
         - Ato 2: Conflitos crescentes.
         - Midpoint: O ponto de virada ou falsa vitória/derrota.
         - Plot Point 2: Tudo está perdido.
         - Ato 3/Clímax: Resolução do episódio.
         - Cliffhanger: O gancho para o Ep 02.
      3. PERSONAGENS (DENSIDADE):
         - Diferencie: Desejo Externo (O que ele quer) vs Necessidade Interna (O que ele precisa aprender).
         - Arco de Temporada: Onde ele pode chegar no Ep 10?
      4. MUNDO & TEMA: Regras do universo e a Questão Filosófica central da série.
      5. MOTOR NARRATIVO: O que gera "story map" para 5 temporadas? É Procedural ou Serializada?
      6. DIAGNÓSTICO: Pontos Fortes, Fracos e Veredito Final (Pass or Buy?).
      
      TOM: Profissional, Analítico, "Showrunner". Sem floreios.
  `;

  const instructions = isTvPilot ? tvPilotInstructions : novelInstructions;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `
      ${baseInstructions}
      ${instructions}
      
      O resultado DEVE ser um JSON estritamente seguindo o schema fornecido. 
      ${isTvPilot ? "PARA ROTEIROS DE SÉRIE, PREENCHA O OBJETO 'tvSeriesAnalysis' COMPLETAMENTE." : "PREENCHA O SCHEMA PADRÃO."}

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
