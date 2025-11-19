
import React, { useState } from 'react';
import { QuestionCategory, Difficulty } from '../types';
import { Button } from './Button';
import { Car, BookOpen, AlertTriangle, Map, ShieldCheck, FileText, Trophy, GraduationCap } from 'lucide-react';
import { playClickSound } from '../services/soundService';

interface StartScreenProps {
  onStart: (category: QuestionCategory, difficulty: Difficulty) => void;
  onLearnMode: () => void;
}

const categories = [
  { id: QuestionCategory.GENERAL, icon: Car, label: "General Rules", desc: "Everyday driving rules" },
  { id: QuestionCategory.SIGNS, icon: Map, label: "Road Signs", desc: "Meanings and shapes" },
  { id: QuestionCategory.SAFETY, icon: ShieldCheck, label: "Safety Margins", desc: "Stopping distances & weather" },
  { id: QuestionCategory.HAZARD, icon: AlertTriangle, label: "Hazards", desc: "Awareness and anticipation" },
  { id: QuestionCategory.MOTORWAY, icon: BookOpen, label: "Motorways", desc: "High speed rules & studs" },
  { id: QuestionCategory.DOCUMENTS, icon: FileText, label: "Documents", desc: "License, insurance & legal" },
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onLearnMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>(QuestionCategory.MOCK);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

  const handleCategorySelect = (cat: QuestionCategory) => {
    playClickSound();
    setSelectedCategory(cat);
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    playClickSound();
    setDifficulty(diff);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          UK Highway Code <span className="text-blue-600">Master</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Prepare for your official DVSA theory test with our AI-powered driving simulator. 
          Take a full mock test, practice specific topics, or learn the rules.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Main Quiz Section */}
        <div className="md:col-span-8 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Practice & Test</h3>
            
            {/* Mock Test Option */}
            <button
              onClick={() => handleCategorySelect(QuestionCategory.MOCK)}
              className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 group mb-6 flex items-center gap-4 active:scale-[0.99]
                ${selectedCategory === QuestionCategory.MOCK 
                  ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100' 
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                }`}
            >
              <div className={`p-3 rounded-full flex-shrink-0 ${selectedCategory === QuestionCategory.MOCK ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
                <Trophy className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <div className={`font-bold text-lg ${selectedCategory === QuestionCategory.MOCK ? 'text-purple-900' : 'text-slate-800'}`}>
                  Full Mock Test
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  20 Questions • Mixed Topics • Simulation Mode
                </div>
              </div>
              <div className={`flex-shrink-0 ${selectedCategory === QuestionCategory.MOCK ? 'text-purple-600' : 'text-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedCategory === QuestionCategory.MOCK ? 'border-purple-600' : 'border-slate-300'}`}>
                  {selectedCategory === QuestionCategory.MOCK && <div className="w-3 h-3 bg-purple-600 rounded-full" />}
                </div>
              </div>
            </button>

            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Or Practice by Topic</h4>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 group active:scale-[0.99]
                      ${isSelected 
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <div className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                        {cat.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Select Difficulty</h3>
            <div className="flex gap-3">
              {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`flex-1 py-2.5 rounded-lg font-medium border transition-colors text-sm active:scale-[0.98]
                    ${difficulty === diff
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => onStart(selectedCategory, difficulty)} 
            fullWidth 
            size="lg"
            className={`text-lg py-4 shadow-lg ${selectedCategory === QuestionCategory.MOCK ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {selectedCategory === QuestionCategory.MOCK ? 'Start Mock Test' : 'Start Practice'}
          </Button>
        </div>

        {/* Learn Mode Section */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4">
                 <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Learn Mode</h3>
              <p className="text-emerald-50 mb-6">
                Browse the Highway Code categories, read detailed explanations, and view common road signs.
              </p>
              <Button 
                onClick={onLearnMode}
                className="w-full bg-white text-emerald-600 hover:bg-emerald-50 border-0 shadow-none font-bold"
              >
                Start Learning
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
             <h4 className="font-bold text-slate-800 mb-3">Daily Tip</h4>
             <p className="text-slate-600 text-sm leading-relaxed">
               "Mirror - Signal - Manoeuvre" is the core routine for safe driving. Always check your mirrors before signaling or changing speed/direction.
             </p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-slate-400 text-sm">
        Powered by Google Gemini 2.5 Flash • Based on the Official Highway Code
      </div>
    </div>
  );
};
