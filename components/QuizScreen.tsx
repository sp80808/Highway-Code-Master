
import React, { useState } from 'react';
import { Question, QuestionCategory } from '../types';
import { Button } from './Button';
import { CheckCircle, XCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../services/soundService';

interface QuizScreenProps {
  questions: Question[];
  category: QuestionCategory;
  onComplete: (score: number, total: number, history: number[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, category, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<number[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
    
    setIsAnswered(true);
    
    // Save to history
    const newHistory = [...answerHistory, selectedOption];
    setAnswerHistory(newHistory);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score, questions.length, [...answerHistory]); // Ensure history is passed correctly
    }
  };

  // Color logic for options
  const getOptionStyle = (index: number) => {
    const baseStyle = "p-4 rounded-xl border-2 text-left transition-all duration-200 w-full flex items-start gap-3 active:scale-[0.99]";
    
    if (!isAnswered) {
      if (selectedOption === index) {
        return `${baseStyle} border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500`;
      }
      return `${baseStyle} border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700`;
    }

    // Answered state
    if (index === currentQuestion.correctIndex) {
      return `${baseStyle} border-green-500 bg-green-50 text-green-900 font-medium`;
    }
    
    if (selectedOption === index && index !== currentQuestion.correctIndex) {
      return `${baseStyle} border-red-500 bg-red-50 text-red-900`;
    }

    return `${baseStyle} border-slate-200 text-slate-400 opacity-70`;
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-20">
      {/* Header Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{category}</span>
          <span className="text-sm font-medium text-slate-500">Question {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
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
              <div className={`mt-0.5 w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold
                 ${!isAnswered && selectedOption === idx ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-400'}
                 ${isAnswered && idx === currentQuestion.correctIndex ? '!border-green-600 !text-green-600' : ''}
                 ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex ? '!border-red-500 !text-red-500' : ''}
              `}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span>{option}</span>
              
              {isAnswered && idx === currentQuestion.correctIndex && (
                <CheckCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
              )}
              {isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && (
                <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Area (Sticky on mobile conceptually, but here static) */}
      <div className="space-y-4">
        {!isAnswered ? (
          <Button 
            onClick={handleSubmitAnswer} 
            disabled={selectedOption === null}
            fullWidth
            size="lg"
            className="py-4 text-lg"
            disableSound // We handle the sound logic manually above for specific feedback
          >
            Check Answer
          </Button>
        ) : (
          <div className="animate-fade-in-up">
             {/* Explanation Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4 flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Explanation</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            <Button 
              onClick={handleNext}
              variant="secondary"
              fullWidth
              size="lg"
              className="py-4 text-lg"
            >
              {currentIndex === questions.length - 1 ? "Finish Test" : "Next Question"} <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
