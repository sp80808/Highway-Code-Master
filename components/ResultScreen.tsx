
import React, { useEffect } from 'react';
import { Button } from './Button';
import { RefreshCw, CheckCircle, Home } from 'lucide-react';
import { Question } from '../types';
import { playSuccessSound, playFailureSound } from '../services/soundService';

interface ResultScreenProps {
  score: number;
  total: number;
  questions: Question[];
  userAnswers: number[];
  onRetry: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  score, 
  total, 
  questions, 
  userAnswers, 
  onRetry,
  onHome 
}) => {
  // UK Theory Test pass mark is 86% (43/50). Let's stick to that ratio.
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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className={`p-10 text-center ${isPass ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 mb-4 ${isPass ? 'border-green-200 bg-green-100 text-green-600' : 'border-red-200 bg-red-100 text-red-600'}`}>
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${isPass ? 'text-green-800' : 'text-red-800'}`}>
            {isPass ? 'Test Passed!' : 'Test Failed'}
          </h2>
          <p className={`text-lg ${isPass ? 'text-green-700' : 'text-red-700'}`}>
            You scored {score} out of {total}
          </p>
          <p className="text-slate-500 mt-4 text-sm">
            Pass mark is 86%. {isPass ? "Great job keeping our roads safe!" : "Keep practicing to improve your knowledge."}
          </p>
        </div>

        <div className="p-6 md:p-8 bg-white">
          <h3 className="font-bold text-xl text-slate-800 mb-6 border-b pb-2">Review Incorrect Answers</h3>
          
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctIndex;
              
              if (isCorrect) return null; // Only show incorrect ones

              return (
                <div key={q.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex gap-3 mb-3">
                    <span className="bg-slate-200 text-slate-700 font-bold w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-slate-900">{q.text}</p>
                  </div>
                  
                  <div className="ml-9 space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded border border-red-100">
                      <span className="font-bold">Your Answer:</span>
                      <span>{q.options[userAnswer]}</span>
                    </div>
                    <div className="flex items-start gap-2 text-green-700 bg-green-50 p-2 rounded border border-green-100">
                      <span className="font-bold">Correct Answer:</span>
                      <span>{q.options[q.correctIndex]}</span>
                      <CheckCircle className="w-4 h-4 ml-auto" />
                    </div>
                    <div className="mt-2 text-slate-600 text-xs bg-white p-3 rounded border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-1">Explanation:</span>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
            {score === total && (
              <div className="text-center text-slate-500 py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
                <p>Perfect score! Nothing to review.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={onHome} variant="outline" size="lg">
          <Home className="w-5 h-5 mr-2" /> Home
        </Button>
        <Button onClick={onRetry} size="lg" className="shadow-lg shadow-blue-200">
          <RefreshCw className="w-5 h-5 mr-2" /> Try Another Test
        </Button>
      </div>
    </div>
  );
};
