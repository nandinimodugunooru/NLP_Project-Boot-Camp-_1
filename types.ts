
export interface CorrectionItem {
  original: string;
  fixed: string;
  reason: string;
}

export interface TranslationData {
  telugu: string;
  hindi: string;
  marathi?: string;
  kannada?: string;
}

export interface CorrectionResult {
  correctedSentence: string;
  explanation: string;
  corrections: CorrectionItem[];
  translations: TranslationData;
}

export interface HistoryItem extends CorrectionResult {
  id: string;
  originalSentence: string;
  timestamp: number;
}
