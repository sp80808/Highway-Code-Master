
import React, { useState, useEffect } from 'react';
import { QuestionCategory, Difficulty, UserProgress, SavedQuizState } from '../types';
import { Button } from './Button';
import { Car, BookOpen, AlertTriangle, Map, ShieldCheck, FileText, Trophy, GraduationCap, Star, ChevronRight, Award, PlayCircle, Crown, Shield, Compass, Medal } from 'lucide-react';
import { playClickSound } from '../services/soundService';

interface StartScreenProps {
  onStart: (category: QuestionCategory, difficulty: Difficulty) => void;
  onLearnMode: () => void;
  userProgress: UserProgress;
  savedQuiz?: SavedQuizState | null;
  onResume?: () => void;
}

const categories = [
  { id: QuestionCategory.GENERAL, icon: Car, label: "General Rules", desc: "Everyday driving rules" },
  { id: QuestionCategory.SIGNS, icon: Map, label: "Road Signs", desc: "Meanings and shapes" },
  { id: QuestionCategory.SAFETY, icon: ShieldCheck, label: "Safety Margins", desc: "Stopping & weather" },
  { id: QuestionCategory.HAZARD, icon: AlertTriangle, label: "Hazards", desc: "Awareness & anticipation" },
  { id: QuestionCategory.MOTORWAY, icon: BookOpen, label: "Motorways", desc: "High speed rules" },
  { id: QuestionCategory.DOCUMENTS, icon: FileText, label: "Documents", desc: "License & insurance" },
];

const getRankBadge = (rankName: string) => {
  switch (rankName) {
    case "Learner Driver": return <Shield className="w-full h-full text-slate-500 dark:text-slate-400" />;
    case "Novice Navigator": return <Compass className="w-full h-full text-blue-500 dark:text-blue-400" />;
    case "Road Scholar": return <BookOpen className="w-full h-full text-emerald-500 dark:text-emerald-400" />;
    case "Highway Hero": return <Medal className="w-full h-full text-purple-500 dark:text-purple-400" />;
    case "Theory Master": return <GraduationCap className="w-full h-full text-amber-500 dark:text-amber-400" />;
    case "Grandmaster of Roads": return <Crown className="w-full h-full text-rose-500 dark:text-rose-400" />;
    default: return <Car className="w-full h-full text-slate-400" />;
  }
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onLearnMode, userProgress, savedQuiz, onResume }) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>(QuestionCategory.MOCK);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [xpWidth, setXpWidth] = useState(0);

  // Animate XP bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setXpWidth(userProgress.progressToNext);
    }, 100);
    return () => clearTimeout(timer);
  }, [userProgress.progressToNext]);

  const handleCategorySelect = (cat: QuestionCategory) => {
    playClickSound();
    setSelectedCategory(cat);
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    playClickSound();
    setDifficulty(diff);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Hero / Profile Section */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Title & Intro */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold tracking-wider uppercase w-fit border border-blue-100 dark:border-blue-800">
            2025 Edition
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Master the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Highway Code
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg">
            Prepare for your UK driving theory test with AI-powered practice questions and real-time feedback.
          </p>
        </div>

        {/* RPG Profile Card */}
        <div className="md:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Driver Profile</p>
                  <h2 className={`text-2xl font-black ${userProgress.currentRank.color} dark:text-white`}>
                    {userProgress.currentRank.name}
                  </h2>
                </div>
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center p-3 shadow-inner border border-slate-100 dark:border-slate-600">
                  {getRankBadge(userProgress.currentRank.name)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-600 dark:text-slate-300">Level {userProgress.level}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{userProgress.xp} XP</span>
                </div>
                
                <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${xpWidth}%` }}
                  />
                  {/* Shimmer effect */}
                   <div className="absolute top-0 left-0 w-full h-full animate-shimmer-slide opacity-30" 
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }}>
                   </div>
                </div>
                
                <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
                  {userProgress.nextRank 
                    ? `${Math.round(userProgress.nextRank.minXP - userProgress.xp)} XP to ${userProgress.nextRank.name}`
                    : "Max Rank Achieved!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Option if available */}
      {savedQuiz && onResume && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-slide-up">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
                <PlayCircle className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Resume Quiz in Progress</h3>
               <p className="text-indigo-600 dark:text-indigo-300 text-sm">
                 Continue your <strong>{savedQuiz.category}</strong> test at question {savedQuiz.currentIndex + 1}.
               </p>
             </div>
          </div>
          <Button 
            onClick={() => {
              playClickSound();
              onResume();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap w-full md:w-auto border-none hover:scale-[1.02]"
          >
            Resume Quiz <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Practice Configuration */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Featured Option: Mock Test */}
          <div 
            onClick={() => handleCategorySelect(QuestionCategory.MOCK)}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99]
              ${selectedCategory === QuestionCategory.MOCK 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
              }`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy className="w-32 h-32 dark:text-purple-200" />
            </div>
            <div className="flex items-start gap-5 relative z-10">
              <div className={`p-4 rounded-xl ${selectedCategory === QuestionCategory.MOCK ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'}`}>
                <Star className="w-8 h-8 fill-current" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Full Mock Test</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedCategory === QuestionCategory.MOCK ? 'border-purple-600 dark:border-purple-400' : 'border-slate-300 dark:border-slate-600'}`}>
                    {selectedCategory === QuestionCategory.MOCK && <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full" />}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-md">
                  Simulate the real exam with 20 mixed questions from all categories. Earn <span className="font-bold text-purple-600 dark:text-purple-400">Double XP</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500"></span> Focused Practice
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 active:scale-[0.98] hover:scale-[1.02]
                      ${isSelected 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
                      }`}
                  >
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {cat.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{cat.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Start */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex p-1 bg-white dark:bg-slate-700 rounded-xl shadow-sm sm:w-1/2">
               {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    ${difficulty === diff
                      ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => onStart(selectedCategory, difficulty)} 
              className="flex-1 rounded-xl text-lg shadow-lg shadow-blue-200 dark:shadow-none bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Start Now <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

        </div>

        {/* Right Column: Learn Mode & Tips */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Learn Mode Card */}
          <div className="relative group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/50 shadow-xl flex flex-col h-full">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Learn Mode</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                Study the official Highway Code rules, meanings of signs, and road markings before taking a test.
              </p>
              
              {/* Explicitly styled button to ensure visibility */}
              <button 
                onClick={() => {
                  playClickSound();
                  onLearnMode();
                }}
                className="mt-auto w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none transform transition-all active:scale-[0.95] hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Open Study Guide <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Pro Tip</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Consistent practice is key. Try the "Hazard Awareness" category to improve your reaction times and observation skills.
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center">
        <p className="text-slate-500 dark:text-slate-500 text-sm font-medium mb-2">
          Highway Code Master &copy; 2025
        </p>
        <p className="text-slate-400 dark:text-slate-600 text-xs flex items-center justify-center gap-1">
          Developed by <a href="http://instagram.com/sp8m8" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline font-bold">sp8m8</a>
        </p>
      </div>
    </div>
  );
};
