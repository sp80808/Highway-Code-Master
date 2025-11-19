
import React, { useState } from 'react';
import { QuestionCategory, StudyGuide } from '../types';
import { fetchStudyGuide } from '../services/geminiService';
import { Button } from './Button';
import { Car, BookOpen, AlertTriangle, Map, ShieldCheck, FileText, ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { playClickSound } from '../services/soundService';

interface LearnScreenProps {
  onBack: () => void;
}

// Duplicate icons map since we can't import the StartScreen specific array easily if it's not exported cleanly
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

export const LearnScreen: React.FC<LearnScreenProps> = ({ onBack }) => {
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

    try {
      const data = await fetchStudyGuide(topic);
      setGuide(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load study content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTopic = () => {
    // playClickSound(); // Button component handles this via onClick, but onBack/onClose might not be wrapped in Button everywhere
    setSelectedTopic(null);
    setGuide(null);
  };

  // --- View: Category Selection ---
  if (!selectedTopic) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8 flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm" className="px-3">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Highway Code Library</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Car;
            return (
              <button
                key={cat}
                onClick={() => handleTopicSelect(cat)}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 hover:ring-2 hover:ring-emerald-50 transition-all text-left group active:scale-[0.99]"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-emerald-800">{cat}</h3>
                <p className="text-sm text-slate-500 mb-4">Study key rules and signs.</p>
                <div className="flex items-center text-emerald-600 text-sm font-semibold">
                  View Guide <ChevronRight className="w-4 h-4 ml-1" />
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
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800">Generating Study Guide...</h2>
        <p className="text-slate-500 mt-2">Consulting the Highway Code for {selectedTopic}</p>
      </div>
    );
  }

  // --- View: Error ---
  if (error) {
     return (
      <div className="max-w-4xl mx-auto pt-20 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Oops!</h2>
        <p className="text-slate-500 mt-2 mb-6">{error}</p>
        <Button onClick={() => handleTopicSelect(selectedTopic)} variant="primary">Try Again</Button>
        <div className="mt-4">
          <button onClick={handleCloseTopic} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
        </div>
      </div>
    );
  }

  // --- View: Content ---
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-6 flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur py-4 z-20 border-b border-slate-200/50">
        <Button onClick={handleCloseTopic} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> All Topics
        </Button>
        <span className="font-bold text-slate-700 hidden md:block">{guide?.title}</span>
        <div className="w-20"></div> {/* Spacer for centering alignment if needed */}
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 relative z-10">{guide?.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed relative z-10">
            {guide?.introduction}
          </p>
        </div>

        {/* Key Rules Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" /> Key Rules & Concepts
          </h2>
          <div className="grid gap-4">
            {guide?.keyRules.map((rule, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-2">{rule.title}</h3>
                <p className="text-slate-600">{rule.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Signs */}
        {guide?.commonSigns && guide.commonSigns.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-600" /> Common Signs & Markings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.commonSigns.map((sign, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-start">
                  <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 border border-slate-100">
                    {sign.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{sign.name}</h3>
                      <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{sign.shape}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-snug">{sign.description}</p>
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
