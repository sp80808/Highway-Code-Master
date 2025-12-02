
import React, { useState, useEffect } from 'react';
import { QuestionCategory, Difficulty, Screen, QuizState, UserProgress, SavedQuizState } from './types';
import { fetchQuestions } from './services/geminiService';
import { getStoredXP, calculateProgress, addXP, getSavedQuizProgress } from './services/progressService';
import { playLevelUpSound, playClickSound } from './services/soundService';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LearnScreen } from './components/LearnScreen';
import { AlertTriangle, Moon, Sun } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.START);
  const [quizData, setQuizData] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    isComplete: false,
    isLoading: false,
    error: null
  });
  const [resumeState, setResumeState] = useState<{
    currentIndex: number;
    score: number;
    answerHistory: number[];
  } | undefined>(undefined);

  const [currentCategory, setCurrentCategory] = useState<QuestionCategory>(QuestionCategory.GENERAL);
  const [progress, setProgress] = useState<UserProgress>(calculateProgress(0));
  const [savedQuiz, setSavedQuiz] = useState<SavedQuizState | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load initial progress, saved quiz, and theme
  useEffect(() => {
    const xp = getStoredXP();
    setProgress(calculateProgress(xp));
    
    const saved = getSavedQuizProgress();
    if (saved) {
      setSavedQuiz(saved);
    }

    // Check system preference or local storage
    const savedTheme = localStorage.getItem('highway_code_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  }, []);

  // Apply Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('highway_code_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('highway_code_theme', 'light');
    }
  }, [darkMode]);

  // Check for Resume updates on screen change
  useEffect(() => {
    if (screen === Screen.START) {
      const saved = getSavedQuizProgress();
      if (saved) setSavedQuiz(saved);
    }
  }, [screen]);

  const toggleDarkMode = () => {
    playClickSound();
    setDarkMode(!darkMode);
  };

  const handleStartQuiz = async (category: QuestionCategory, difficulty: Difficulty) => {
    setQuizData(prev => ({ ...prev, isLoading: true, error: null }));
    setCurrentCategory(category);
    setResumeState(undefined);
    
    try {
      const questionCount = category === QuestionCategory.MOCK ? 20 : 5;
      const questions = await fetchQuestions(category, difficulty, questionCount);
      setQuizData({
        questions,
        currentIndex: 0,
        score: 0,
        answers: [],
        isComplete: false,
        isLoading: false,
        error: null
      });
      setScreen(Screen.QUIZ);
    } catch (error) {
      console.error(error);
      setQuizData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to generate questions. Please check your connection or API key and try again." 
      }));
    }
  };

  const handleResumeQuiz = () => {
    if (!savedQuiz) return;
    
    setCurrentCategory(savedQuiz.category);
    setResumeState({
      currentIndex: savedQuiz.currentIndex,
      score: savedQuiz.score,
      answerHistory: savedQuiz.answerHistory
    });
    
    setQuizData({
      questions: savedQuiz.questions,
      currentIndex: savedQuiz.currentIndex,
      score: savedQuiz.score,
      answers: savedQuiz.answerHistory,
      isComplete: false,
      isLoading: false,
      error: null
    });
    
    setScreen(Screen.QUIZ);
  };

  const handleQuizComplete = (score: number, total: number, history: number[]) => {
    const percentage = (score / total) * 100;
    let xpEarned = score * 10;
    if (percentage >= 86) {
      xpEarned += 50;
    }

    const currentRankName = progress.currentRank.name;
    const newProgress = addXP(xpEarned);
    setProgress(newProgress);

    if (newProgress.currentRank.name !== currentRankName) {
      playLevelUpSound();
    }

    setQuizData(prev => ({
      ...prev,
      score,
      answers: history,
      isComplete: true
    }));
    setSavedQuiz(null);
    setScreen(Screen.RESULT);
  };

  const handleStudyTopicOpened = () => {
    const currentRankName = progress.currentRank.name;
    const newProgress = addXP(15);
    setProgress(newProgress);

    if (newProgress.currentRank.name !== currentRankName) {
      playLevelUpSound();
    }
  };

  const handleRetry = () => {
    setScreen(Screen.START);
    setResumeState(undefined);
    setQuizData({
      questions: [],
      currentIndex: 0,
      score: 0,
      answers: [],
      isComplete: false,
      isLoading: false,
      error: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-slate-900 dark:bg-slate-950 text-white py-4 sticky top-0 z-50 shadow-md border-b border-slate-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setScreen(Screen.START)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
              L
            </div>
            <span className="hidden sm:inline">Highway Code Master</span>
            <span className="sm:hidden">HCM</span>
          </div>
          <div className="flex items-center gap-4">
            {screen !== Screen.START && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                <span className="text-xl">{progress.currentRank.icon}</span>
                <span className="text-xs font-semibold text-blue-200">{progress.currentRank.name}</span>
                <span className="text-xs text-slate-400">| {progress.xp} XP</span>
              </div>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {screen !== Screen.START && (
               <button 
                 onClick={handleRetry}
                 className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
               >
                 Exit
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        {quizData.isLoading && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm mx-4 text-center border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Generating Test...</h3>
              <p className="text-slate-500 dark:text-slate-400">Consulting the AI Highway Code instructor to prepare your unique questions.</p>
            </div>
          </div>
        )}

        {quizData.error && (
          <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center mb-8">
             <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
             <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">Something went wrong</h3>
             <p className="text-red-600 dark:text-red-400 mb-4">{quizData.error}</p>
             <button 
               onClick={() => setQuizData(prev => ({ ...prev, error: null, isLoading: false }))}
               className="px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-800 dark:text-red-200 rounded-lg font-medium transition-colors"
             >
               Dismiss
             </button>
          </div>
        )}

        {!quizData.isLoading && (
          <>
            {screen === Screen.START && (
              <StartScreen 
                onStart={handleStartQuiz} 
                onLearnMode={() => setScreen(Screen.LEARN)}
                userProgress={progress}
                savedQuiz={savedQuiz}
                onResume={handleResumeQuiz}
              />
            )}

            {screen === Screen.QUIZ && quizData.questions.length > 0 && (
              <QuizScreen 
                questions={quizData.questions} 
                category={currentCategory}
                onComplete={handleQuizComplete} 
                initialState={resumeState}
              />
            )}

            {screen === Screen.RESULT && (
              <ResultScreen 
                score={quizData.score} 
                total={quizData.questions.length} 
                questions={quizData.questions}
                userAnswers={quizData.answers}
                onRetry={handleRetry}
                onHome={handleRetry}
                xpGained={(quizData.score * 10) + ((quizData.score / quizData.questions.length) >= 0.86 ? 50 : 0)}
              />
            )}

            {screen === Screen.LEARN && (
              <LearnScreen 
                onBack={() => setScreen(Screen.START)} 
                onTopicOpened={handleStudyTopicOpened}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
