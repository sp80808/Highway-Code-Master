
import React, { useEffect } from 'react';
import { Button } from './Button';
import { RefreshCw, CheckCircle, Home, Star, Award, ArrowRight } from 'lucide-react';
import { Question } from '../types';
import { playSuccessSound, playFailureSound } from '../services/soundService';

interface ResultScreenProps {
  score: number;
  total: number;
  questions: Question[];
  userAnswers: number[];
  onRetry: () => void;
  onHome: () => void;
  xpGained: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  score, 
  total, 
  questions, 
  userAnswers, 
  onRetry,
  onHome,
  xpGained
}) => {
  const percentage = Math.round((score / total) * 100);
  const isPass = percentage >= 86;

  useEffect(() => {
    if (isPass) {
      playSuccessSound();
    } else {
      playFailureSound();
    }
  }, [isPass]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">
      {/* Result Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden mb-8 relative transition-colors duration-300">
        
        <div className={`p-12 text-center relative overflow-hidden ${isPass ? 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800' : 'bg-gradient-to-b from-red-50 to-white dark:from-red-900/20 dark:to-slate-800'}`}>
          <div className="relative z-10">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-8 mb-6 shadow-lg animate-pop-in ${isPass ? 'border-emerald-200 bg-white text-emerald-600 dark:bg-slate-800 dark:border-emerald-800 dark:text-emerald-400' : 'border-red-200 bg-white text-red-600 dark:bg-slate-800 dark:border-red-800 dark:text-red-400'}`}>
              <span className="text-4xl font-black">{percentage}%</span>
            </div>
            
            <h2 className={`text-4xl font-extrabold mb-2 tracking-tight ${isPass ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'}`}>
              {isPass ? 'Test Passed!' : 'Test Failed'}
            </h2>
            <p className={`text-xl font-medium mb-6 ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              You scored {score} out of {total}
            </p>
            
            {/* XP Pill */}
            <div className="inline-flex items-center gap-3 bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-full shadow-xl border border-slate-700 dark:border-slate-600 animate-slide-up">
              <div className="bg-yellow-500 p-1 rounded-full">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold tracking-wide">+{xpGained} XP EARNED</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div>
            <span className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">Review</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctIndex;
              
              if (isCorrect) return null; // Only show incorrect ones

              return (
                <div key={q.id} className="bg-red-50/50 dark:bg-red-900/10 rounded-xl p-6 border border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-lg flex items-center justify-center font-bold text-sm border border-red-200 dark:border-red-800">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-slate-900 dark:text-slate-200 text-lg mb-3">{q.text}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                          <div className="mt-0.5 min-w-[20px] font-bold">You:</div>
                          <span>{q.options[userAnswer]}</span>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                          <div className="mt-0.5 min-w-[20px] font-bold">Ans:</div>
                          <span>{q.options[q.correctIndex]}</span>
                          <CheckCircle className="w-5 h-5 ml-auto flex-shrink-0 text-emerald-600 dark:text-emerald-500" />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-red-100 dark:border-red-900/30 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300 mr-2">Explanation:</span>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {score === total && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">Perfect Score!</h3>
                   <p className="text-slate-500 dark:text-slate-400">You really know your stuff. Keep it up!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={onHome} variant="outline" size="lg" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
          <Home className="w-5 h-5 mr-2" /> Dashboard
        </Button>
        <Button onClick={onRetry} size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none text-white border-none">
          Try Again <RefreshCw className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
