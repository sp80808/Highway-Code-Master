
export enum QuestionCategory {
  GENERAL = "General Rules",
  SIGNS = "Road Signs",
  SAFETY = "Safety Margins",
  HAZARD = "Hazard Awareness",
  MOTORWAY = "Motorway Rules",
  DOCUMENTS = "Documents & Accidents",
  MOCK = "Full Mock Test"
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard"
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  answers: number[]; // Array of selected indices. -1 if not answered/skipped (though we enforce answering)
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SavedQuizState {
  questions: Question[];
  category: QuestionCategory;
  currentIndex: number;
  score: number;
  answerHistory: number[];
}

export enum Screen {
  START = 'START',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  LEARN = 'LEARN'
}

// content for Learn Mode
export interface StudySection {
  title: string;
  content: string;
}

export interface RoadSign {
  name: string;
  description: string;
  shape: string; // e.g., "Red Circle", "Blue Rectangle"
  icon: string; // An emoji representation if possible, or a simple code
}

export interface StudyGuide {
  title: string;
  introduction: string;
  keyRules: StudySection[];
  commonSigns: RoadSign[];
}

// RPG Progression Types
export interface Rank {
  name: string;
  minXP: number;
  icon: string;
  color: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  currentRank: Rank;
  nextRank: Rank | null;
  progressToNext: number; // Percentage 0-100
}