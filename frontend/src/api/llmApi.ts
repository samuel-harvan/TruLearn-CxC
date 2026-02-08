import apiClient from './client';
import { Question } from '../types/assessment.types';
import { ENABLE_MOCK_MODE, simulateDelay, logMockCall } from '../config/mockMode';
import {
  mockVariationQuestion,
  mockState,
  biologyUploadResponse,
  calculusUploadResponse,
  biologyRound1Questions,
  biologyAdaptiveQuestions,
  calculusQuestions,
} from './mockData';

export interface GenerateQuestionsRequest {
  concept: string;
  difficulty?: string;
  num_variations?: number;
  reference_text?: string; // PDF text content
  filename?: string; // PDF filename — lets backend look up full stored summary
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  generation_time: number;
  model_used: string;
}

/**
 * Generate questions using LLM API
 * Returns 10 questions: 5 multiple choice + 5 open-ended
 */
export const generateQuestions = async (
  request: GenerateQuestionsRequest
): Promise<GenerateQuestionsResponse> => {
  // Mock mode: return round-aware question sets
  if (ENABLE_MOCK_MODE) {
    logMockCall('POST /api/questions/generate', request);
    await simulateDelay();
    mockState.generateCallCount++;

    // Round 1: Biology initial (medium difficulty)
    // Round 2: Biology adaptive (after clicking Adaptive Practice)
    // Round 3+: Calculus (after new assessment upload)
    let questions: Question[];
    if (mockState.generateCallCount === 1) {
      questions = biologyRound1Questions;
    } else if (mockState.generateCallCount === 2) {
      questions = biologyAdaptiveQuestions;
    } else {
      questions = calculusQuestions;
    }

    return {
      questions,
      generation_time: 1.85,
      model_used: 'gemini-2.5-flash (mock)'
    };
  }

  // Real API call
  const response = await apiClient.post<GenerateQuestionsResponse>(
    '/api/questions/generate',
    request
  );
  return response.data;
};

/**
 * Upload PDF and extract text + concept for question generation
 */
export const uploadPdfForQuestions = async (
  file: File
): Promise<{ text: string; concept: string; filename: string }> => {
  // Mock mode: return subject-aware upload responses
  if (ENABLE_MOCK_MODE) {
    logMockCall('POST /api/upload-reference', { filename: file.name });
    await simulateDelay(500);
    mockState.uploadCount++;

    // First upload: biology notes, subsequent uploads: calculus notes
    if (mockState.uploadCount === 1) {
      return biologyUploadResponse;
    }
    return calculusUploadResponse;
  }

  // Real API call
  const formData = new FormData();
  formData.append('pdf', file);  // Flask expects 'pdf' field name

  const response = await apiClient.post<{ text: string; concept: string; filename: string }>(
    '/api/upload-reference',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Generate a variation of a question for practice mode
 */
export const generateVariationQuestion = async (
  originalQuestion: Question,
  previousAnswer: string,
  concept: string
): Promise<{ question: Question; is_variation: boolean }> => {
  // Mock mode: return mock variation
  if (ENABLE_MOCK_MODE) {
    logMockCall('POST /api/questions/variation', { originalQuestion, previousAnswer, concept });
    await simulateDelay();
    return { question: mockVariationQuestion, is_variation: true };
  }

  // Real API call
  const response = await apiClient.post<{ question: Question; is_variation: boolean }>(
    '/api/questions/variation',
    {
      original_question: originalQuestion,
      previous_answer: previousAnswer,
      concept,
    }
  );
  return response.data;
};