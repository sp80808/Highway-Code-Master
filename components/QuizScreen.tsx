
import React, { useState, useEffect } from 'react';
import { Question, QuestionCategory } from '../types';
import { Button } from './Button';
import { CheckCircle, XCircle, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../services/soundService';
import { saveQuizProgress, clearSavedQuizProgress } from '../services/progressService';

interface QuizScreenProps {
  questions: Question[];
  category: QuestionCategory;
  onComplete: (score: number, total: number, history: number[]) => void;
  initialState?: {
    currentIndex: number;
    score: number;
    answerHistory: number[];
  };
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, category, onComplete, initialState }) => {
  const [currentIndex, setCurrentIndex] = useState(initialState?.currentIndex || 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(initialState?.score || 0);
  const [answerHistory, setAnswerHistory] = useState<number[]>(initialState?.answerHistory || []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  // Autosave progress whenever state changes (but only if not complete)
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
       saveQuizProgress({
         questions,
         category,
         currentIndex,
         score,
         answerHistory
       });
    }
  }, [currentIndex, score, answerHistory, questions, category]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
    
    setIsAnswered(true);
    
    // Save to history
    const newHistory = [...answerHistory, selectedOption];
    setAnswerHistory(newHistory);
    
    // Save state immediately after answering
    saveQuizProgress({
       questions,
       category,
       currentIndex,
       score: newScore,
       answerHistory: newHistory
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      clearSavedQuizProgress(); // Clear save on completion
      onComplete(score, questions.length, [...answerHistory]); 
    }
  };

  // Color logic for options
  const getOptionStyle = (index: number) => {
    // Added hover:scale-[1.01] for consistent button feel
    const baseStyle = "p-4 rounded-xl border-2 text-left transition-all duration-200 w-full flex items-start gap-3 active:scale-[0.99] hover:scale-[1.01] disabled:cursor-default disabled:opacity-100 disabled:active:scale-100 disabled:hover:scale-100";
    
    if (!isAnswered) {
      if (selectedOption === index) {
        return `${baseStyle} border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500`;
      }
      return `${baseStyle} border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200`;
    }

    // Answered state - Correct Answer (Always show green)
    if (index === currentQuestion.correctIndex) {
      return `${baseStyle} border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 font-medium ring-1 ring-green-200 dark:ring-green-800`;
    }
    
    // Answered state - User's Incorrect Selection (Show red)
    if (selectedOption === index && index !== currentQuestion.correctIndex) {
      return `${baseStyle} border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 ring-1 ring-red-200 dark:ring-red-800`;
    }

    // Answered state - Unselected options
    return `${baseStyle} border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60`;
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header Progress */}
      <div className="mb-8 animate-fade-in">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{category}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Question {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Animated Container for Question Content */}
      <div key={currentIndex} className="animate-fade-in">
        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-snug">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={getOptionStyle(idx)}
              >
                <div className={`mt-0.5 w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
                  ${!isAnswered && selectedOption === idx ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'}
                  ${isAnswered && idx === currentQuestion.correctIndex ? '!border-green-600 !text-green-600 dark:!text-green-400 bg-green-100 dark:bg-green-900/50' : ''}
                  ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex ? '!border-red-500 !text-red-500 dark:!text-red-400 bg-red-100 dark:bg-red-900/50' : ''}
                `}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-grow">{option}</span>
                
                {isAnswered && idx === currentQuestion.correctIndex && (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500 ml-auto flex-shrink-0 animate-bounce-short" />
                )}
                {isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && (
                  <XCircle className="w-6 h-6 text-red-500 dark:text-red-400 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Area */}
        <div className="space-y-4">
          {!isAnswered ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedOption === null}
              fullWidth
              size="lg"
              className="py-4 text-lg shadow-lg shadow-blue-100 dark:shadow-none"
              disableSound // Sound handled in handleSubmitAnswer
            >
              Check Answer
            </Button>
          ) : (
            <div className="animate-fade-in-up">
              {/* Explanation Card */}
              <div className={`border-l-4 rounded-r-xl p-6 mb-6 flex gap-4 items-start shadow-sm ${
                selectedOption === currentQuestion.correctIndex 
                  ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500' 
                  : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500'
              }`}>
                <div className={`p-2 rounded-full shrink-0 ${
                   selectedOption === currentQuestion.correctIndex ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                }`}>
                  {selectedOption === currentQuestion.correctIndex ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                
                <div>
                  <h4 className={`font-bold text-lg mb-2 ${
                    selectedOption === currentQuestion.correctIndex ? 'text-green-900 dark:text-green-100' : 'text-blue-900 dark:text-blue-100'
                  }`}>
                    {selectedOption === currentQuestion.correctIndex ? 'Correct!' : 'Did you know?'}
                  </h4>
                  <p className={`${
                    selectedOption === currentQuestion.correctIndex ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'
                  } text-base leading-relaxed`}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                variant="secondary"
                fullWidth
                size="lg"
                className="py-4 text-lg shadow-lg dark:shadow-none"
              >
                {currentIndex === questions.length - 1 ? "Finish Test" : "Next Question"} <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
