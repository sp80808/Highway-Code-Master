
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, QuestionCategory, Difficulty, StudyGuide } from "../types";
import { getHighwayCodeContext } from "./highwayCodeContext";

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const questionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      questionText: {
        type: Type.STRING,
        description: "The question based on the UK Highway Code.",
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 4 possible answers.",
      },
      correctOptionIndex: {
        type: Type.INTEGER,
        description: "The index (0-3) of the correct answer.",
      },
      explanation: {
        type: Type.STRING,
        description: "A concise explanation of why the answer is correct, citing the Highway Code rule if possible.",
      },
      category: {
        type: Type.STRING,
        description: "The specific topic of the question.",
      }
    },
    required: ["questionText", "options", "correctOptionIndex", "explanation", "category"],
  },
};

const studyGuideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    introduction: { type: Type.STRING },
    keyRules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      }
    },
    commonSigns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          shape: { type: Type.STRING },
          icon: { type: Type.STRING, description: "A relevant emoji representing the sign or context (e.g., 🛑, ⚠️, 🅿️)" }
        },
        required: ["name", "description", "shape", "icon"]
      }
    }
  },
  required: ["title", "introduction", "keyRules", "commonSigns"]
};

export const fetchQuestions = async (
  category: QuestionCategory,
  difficulty: Difficulty,
  count: number
): Promise<Question[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const highwayCodeContext = getHighwayCodeContext(category);
    
    const prompt = `
      You are a strict UK Driving Theory Test examiner.
      Generate ${count} multiple-choice questions based ONLY on the official UK Highway Code text provided below.
      
      Context:
      ${highwayCodeContext}
      
      Difficulty: ${difficulty}.
      
      Instructions:
      - Create questions that directly test the rules found in the provided text.
      - Provide exactly 4 options for each question.
      - Ensure only one option is correct.
      - The explanation must quote or refer to the specific rule or section from the provided text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 0.5, // Lower temperature for more factual accuracy
      },
    });

    const rawText = response.text;
    
    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(rawText);
    
    // Map API response to our Question interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: generateId(),
      text: item.questionText,
      options: item.options,
      correctIndex: item.correctOptionIndex,
      explanation: item.explanation,
      category: item.category || (category === QuestionCategory.MOCK ? 'General' : category)
    }));

  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const fetchStudyGuide = async (category: QuestionCategory): Promise<StudyGuide> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const highwayCodeContext = getHighwayCodeContext(category);

    const prompt = `
      You are an expert driving instructor. Create a study guide for the UK Highway Code topic: "${category}".
      Use the official text provided below as the source of truth.
      
      Context:
      ${highwayCodeContext}
      
      Structure:
      1. Introduction: Brief overview of this section.
      2. Key Rules: Extract 5-7 most important rules/concepts from the text.
      3. Common Signs/Markings: Describe 4-6 relevant signs or markings mentioned or related to this text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: studyGuideSchema,
        temperature: 0.4, // Lower temperature for study guides to ensure accuracy
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Empty response from Gemini");
    
    return JSON.parse(rawText) as StudyGuide;

  } catch (error) {
    console.error("Error generating study guide:", error);
    throw error;
  }
};
