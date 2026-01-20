
export interface NarrativeFramework {
  name: string;
  stages: {
    label: string;
    description: string;
    foundInText: boolean;
    evidence: string;
  }[];
}

export interface Character {
  name: string;
  role: string;
  arc: string;
  strengths: string[];
  weaknesses: string[];
  impact: string;
}

export interface ToneAnalysis {
  lexicalMarkers: string[];
  sentenceStructure: string;
  atmosphericElements: string[];
}

export interface AnalysisResult {
  id: string;
  userId?: string;
  isPaid?: boolean;
  timestamp: number;
  overview: {
    title: string;
    premise: string;
    centralPlot: string;
    mainThemes: string[];
  };
  score: number;
  scoreJustification: {
    strengths: string[];
    weaknesses: string[];
  };
  metrics: {
    intensity: 'Lento' | 'Médio' | 'Rápido';
    intensityDescription: string;
    rhythmScore: number;
    rhythmDescription: string;
    tone: string;
    toneDescription: string;
    toneAnalysis: ToneAnalysis;
    complexity: 'Simples' | 'Moderada' | 'Complexa';
    complexityDescription: string;
  };
  genre: {
    primary: string;
    subgenres: string[];
  };
  narrativeStructures: {
    herosJourney: NarrativeFramework;
    saveTheCat: NarrativeFramework;
    storyCircle: NarrativeFramework;
    sevenPointStructure: NarrativeFramework;
    characterArc: NarrativeFramework;
    kishotenketsu: NarrativeFramework;
    threeActStructure: NarrativeFramework;
  };
  characters: Character[];
  languageAndDialog: {
    vocabulary: string;
    subtextEfficiency: number;
    dialogueQuality: string;
    expositionCheck: string;
  };
  worldBuilding: {
    description: string;
    coherence: number;
  };
  rewritingTips: {
    section: string;
    suggestion: string;
  }[];
  tvSeriesAnalysis?: {
    pilotStructure: {
      incitingIncident: string;
      plotPoint1: string;
      midpoint: string;
      plotPoint2: string;
      climax: string;
      cliffhanger: string;
    };
    narrativeEngine: {
      coreConflict: string;
      seasonPotential: string;
      format: 'Procedural' | 'Serializada' | 'Híbrida';
    };
    engagement: {
      score: number;
      hookStrength: string;
      bingeFactor: string;
    };
  };
}

export enum AppStatus {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  HISTORY = 'HISTORY',
  ADMIN = 'ADMIN',
  EVOLUTION = 'EVOLUTION',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  ERROR = 'ERROR'
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  isAdmin?: boolean;
  plan?: 'unitario' | 'mensal';
  historyCount: number;
  joinedAt?: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

