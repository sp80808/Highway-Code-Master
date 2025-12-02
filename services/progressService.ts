
import { Rank, UserProgress, Question, QuestionCategory, SavedQuizState } from "../types";

export const RANKS: Rank[] = [
  { name: "Learner Driver", minXP: 0, icon: "🔰", color: "text-slate-600" },
  { name: "Novice Navigator", minXP: 100, icon: "🚗", color: "text-blue-600" },
  { name: "Road Scholar", minXP: 300, icon: "📚", color: "text-emerald-600" },
  { name: "Highway Hero", minXP: 600, icon: "🛣️", color: "text-purple-600" },
  { name: "Theory Master", minXP: 1000, icon: "🎓", color: "text-amber-600" },
  { name: "Grandmaster of Roads", minXP: 2000, icon: "👑", color: "text-rose-600" },
];

const STORAGE_KEY = "highway_code_master_xp";
const QUIZ_STORAGE_KEY = "highway_code_quiz_progress";

export const getStoredXP = (): number => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

export const saveXP = (xp: number) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, xp.toString());
};

export const calculateProgress = (currentXP: number): UserProgress => {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];
  let level = 1;

  for (let i = 0; i < RANKS.length; i++) {
    if (currentXP >= RANKS[i].minXP) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      level = i + 1;
    }
  }

  let progressToNext = 0;
  if (nextRank) {
    const xpInCurrentRank = currentXP - currentRank.minXP;
    const xpRequiredForNext = nextRank.minXP - currentRank.minXP;
    progressToNext = (xpInCurrentRank / xpRequiredForNext) * 100;
  } else {
    progressToNext = 100; // Max rank achieved
  }

  return {
    xp: currentXP,
    level,
    currentRank,
    nextRank,
    progressToNext
  };
};

export const addXP = (amount: number): UserProgress => {
  const current = getStoredXP();
  const newAmount = current + amount;
  saveXP(newAmount);
  return calculateProgress(newAmount);
};

export const saveQuizProgress = (state: SavedQuizState) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
};

export const clearSavedQuizProgress = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUIZ_STORAGE_KEY);
};

export const getSavedQuizProgress = (): SavedQuizState | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse saved quiz progress", e);
    return null;
  }
};