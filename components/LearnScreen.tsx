
import React, { useState } from 'react';
import { QuestionCategory, StudyGuide } from '../types';
import { fetchStudyGuide } from '../services/geminiService';
import { Button } from './Button';
import { Car, BookOpen, AlertTriangle, Map, ShieldCheck, FileText, ArrowLeft, ChevronRight, Info, Sparkles } from 'lucide-react';
import { playClickSound } from '../services/soundService';

interface LearnScreenProps {
  onBack: () => void;
  onTopicOpened: () => void;
}

// Duplicate icons map
const categoryIcons: Record<string, React.ElementType> = {
  [QuestionCategory.GENERAL]: Car,
  [QuestionCategory.SIGNS]: Map,
  [QuestionCategory.SAFETY]: ShieldCheck,
  [QuestionCategory.HAZARD]: AlertTriangle,
  [QuestionCategory.MOTORWAY]: BookOpen,
  [QuestionCategory.DOCUMENTS]: FileText,
};

const categories = [
  QuestionCategory.GENERAL,
  QuestionCategory.SIGNS,
  QuestionCategory.SAFETY,
  QuestionCategory.HAZARD,
  QuestionCategory.MOTORWAY,
  QuestionCategory.DOCUMENTS
];

const SignVisual: React.FC<{ shape: string, icon: string }> = ({ shape, icon }) => {
  const s = shape.toLowerCase();
  
  const Container = ({ children, className = "", style = {} }: any) => (
    <div className={`flex items-center justify-center flex-shrink-0 ${className}`} style={style}>
      {children}
    </div>
  );

  // 1. Triangles (Warning)
  if (s.includes('triangle')) {
    const isInverted = s.includes('inverted') || s.includes('give way');
    return (
      <Container className="w-16 h-14 relative">
        <svg viewBox="0 0 100 88" className="w-full h-full drop-shadow-md">
          <path 
            d={isInverted ? "M4 4 L96 4 L50 84 Z" : "M50 4 L96 84 H4 Z"} 
            fill="white" 
            stroke="#dc2626" 
            strokeWidth="8" 
            strokeLinejoin="round" 
          />
        </svg>
        <span className={`absolute ${isInverted ? 'top-2' : 'top-5'} text-2xl z-10 text-black`}>{icon}</span>
      </Container>
    );
  }

  // 2. Circles (Orders)
  if (s.includes('circle') || s.includes('round')) {
    if (s.includes('blue')) {
      return (
        <Container className="w-14 h-14 bg-blue-600 rounded-full border-2 border-blue-700 text-white shadow-md">
           <span className="text-2xl">{icon}</span>
        </Container>
      );
    }
    // Default to Red Circle
    return (
      <Container className="w-14 h-14 bg-white rounded-full border-[5px] border-red-600 shadow-md">
         <span className="text-2xl text-slate-900 font-bold">{icon}</span>
      </Container>
    );
  }

  // 3. Octagon (Stop)
  if (s.includes('octagon') || s.includes('stop')) {
    return (
       <Container className="w-14 h-14 bg-red-600 text-white shadow-md" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"}}>
          <span className="text-xl font-bold">{icon}</span>
       </Container>
    );
  }

  // 4. Rectangles (Information/Direction)
  if (s.includes('rectangle') || s.includes('square')) {
    let bg = 'bg-blue-600';
    let text = 'text-white';
    let border = 'border-blue-700';

    if (s.includes('green')) {
        bg = 'bg-emerald-700';
        border = 'border-emerald-800';
    } else if (s.includes('white')) {
        bg = 'bg-white';
        text = 'text-slate-900';
        border = 'border-slate-300';
    } else if (s.includes('yellow')) {
        bg = 'bg-yellow-400';
        text = 'text-slate-900';
        border = 'border-yellow-500';
    } else if (s.includes('brown')) {
        bg = 'bg-amber-900';
        border = 'border-amber-950';
    }

    return (
      <Container className={`w-16 h-12 ${bg} ${text} rounded border-2 ${border} shadow-md`}>
        <span className="text-2xl">{icon}</span>
      </Container>
    );
  }
  
  // 5. Diamond
  if (s.includes('diamond')) {
      return (
        <Container className="w-14 h-14 bg-yellow-400 border-2 border-slate-900 transform rotate-45 shadow-md mb-2 mt-2">
             <div className="transform -rotate-45 text-slate-900 text-xl">{icon}</div>
        </Container>
      );
  }

  // Fallback
  return (
    <Container className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400">
      <span className="text-2xl">{icon}</span>
    </Container>
  );
};

export const LearnScreen: React.FC<LearnScreenProps> = ({ onBack, onTopicOpened }) => {
  const [selectedTopic, setSelectedTopic] = useState<QuestionCategory | null>(null);
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTopicSelect = async (topic: QuestionCategory) => {
    playClickSound();
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    setGuide(null);
    
    onTopicOpened(); // Award XP

    try {
      const data = await fetchStudyGuide(topic);
      setGuide(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load study content. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTopic = () => {
    playClickSound();
    setSelectedTopic(null);
    setGuide(null);
  };

  // --- View: Category Selection ---
  if (!selectedTopic) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in pb-12">
        <div className="mb-10">
          <Button onClick={onBack} variant="outline" size="sm" className="mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
               <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">The Highway Code</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
             Explore official rules, road signs, and safety guidelines. Select a topic to begin studying and earn XP.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Car;
            return (
              <button
                key={cat}
                onClick={() => handleTopicSelect(cat)}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-1 hover:scale-[1.02] transition-all text-left group active:scale-[0.99] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Icon className="w-24 h-24 dark:text-white" />
                </div>
                
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors relative z-10">
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="relative z-10">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">{cat}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Detailed rules & explanations.</p>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                    Read Guide <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- View: Loading ---
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pt-20 text-center animate-fade-in">
        <div className="w-20 h-20 border-4 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Fetching Knowledge...</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Consulting the Highway Code for {selectedTopic}</p>
      </div>
    );
  }

  // --- View: Error ---
  if (error) {
     return (
      <div className="max-w-md mx-auto pt-20 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Unable to Load</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
        <div className="flex flex-col gap-3">
            <Button onClick={() => handleTopicSelect(selectedTopic)} variant="primary" fullWidth>Try Again</Button>
            <button onClick={handleCloseTopic} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm py-2">Cancel</button>
        </div>
      </div>
    );
  }

  // --- View: Content ---
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-24">
      {/* Sticky Header */}
      <div className="mb-8 flex items-center justify-between sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur py-4 z-20 border-b border-slate-200/60 dark:border-slate-800/60 px-2 -mx-2">
        <Button onClick={handleCloseTopic} variant="outline" size="sm" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" /> Topics
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>+15 XP Earned</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Title Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-full -mr-20 -mt-20 blur-3xl opacity-60"></div>
          <div className="relative z-10">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wide text-sm uppercase mb-2 block">{selectedTopic}</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">{guide?.title}</h1>
              <div className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-emerald-400 dark:border-emerald-600 pl-6">
                {guide?.introduction}
              </div>
          </div>
        </div>

        {/* Key Rules */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Info className="w-6 h-6" />
            </div>
            Key Rules & Concepts
          </h2>
          <div className="grid gap-6">
            {guide?.keyRules.map((rule, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 flex items-start gap-3">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded mt-1">
                        {idx + 1}
                    </span>
                    {rule.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-11">{rule.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Signs */}
        {guide?.commonSigns && guide.commonSigns.length > 0 && (
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Map className="w-6 h-6" />
                </div>
                Common Signs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.commonSigns.map((sign, idx) => (
                <div key={idx} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-5 items-start hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
                  <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
                    <SignVisual shape={sign.shape} icon={sign.icon} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{sign.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {sign.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800">
                          {sign.shape}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">Hover/Tap for info</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
