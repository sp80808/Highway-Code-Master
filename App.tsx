import React, { useState } from 'react';
import { QuestionCategory, Difficulty, Screen, QuizState } from './types';
import { fetchQuestions } from './services/geminiService';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LearnScreen } from './components/LearnScreen';
import { AlertTriangle } from 'lucide-react';

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
  const [currentCategory, setCurrentCategory] = useState<QuestionCategory>(QuestionCategory.GENERAL);

  const handleStartQuiz = async (category: QuestionCategory, difficulty: Difficulty) => {
    setQuizData(prev => ({ ...prev, isLoading: true, error: null }));
    setCurrentCategory(category);
    
    try {
      // Mock test gets 20 questions for a fuller experience, normal practice gets 5
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

  const handleQuizComplete = (score: number, total: number, history: number[]) => {
    setQuizData(prev => ({
      ...prev,
      score,
      answers: history,
      isComplete: true
    }));
    setScreen(Screen.RESULT);
  };

  const handleRetry = () => {
    setScreen(Screen.START);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <header className="bg-slate-900 text-white py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => setScreen(Screen.START)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              L
            </div>
            <span>Highway Code Master</span>
          </div>
          {screen !== Screen.START && (
             <button 
               onClick={handleRetry}
               className="text-sm text-slate-400 hover:text-white transition-colors"
             >
               Exit
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        {quizData.isLoading && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm mx-4 text-center">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Generating Test...</h3>
              <p className="text-slate-500">Consulting the AI Highway Code instructor to prepare your unique questions.</p>
            </div>
          </div>
        )}

        {quizData.error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
             <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
             <h3 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
             <p className="text-red-600 mb-4">{quizData.error}</p>
             <button 
               onClick={() => setQuizData(prev => ({ ...prev, error: null, isLoading: false }))}
               className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-medium transition-colors"
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
              />
            )}

            {screen === Screen.QUIZ && quizData.questions.length > 0 && (
              <QuizScreen 
                questions={quizData.questions} 
                category={currentCategory}
                onComplete={handleQuizComplete} 
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
              />
            )}

            {screen === Screen.LEARN && (
              <LearnScreen onBack={() => setScreen(Screen.START)} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
