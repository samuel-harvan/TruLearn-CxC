import apiClient from './client';
import { Question } from '../types/assessment.types';
import { ENABLE_MOCK_MODE, simulateDelay, logMockCall } from '../config/mockMode';
import {
  mockPdfUploadResponse,
  mockGenerateQuestionsResponse,
  mockVariationQuestion,
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
  // Mock mode: return mock data without API call
  if (ENABLE_MOCK_MODE) {
    logMockCall('POST /api/questions/generate', request);
    await simulateDelay();
    return mockGenerateQuestionsResponse;
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
  // Mock mode: return mock data without API call
  if (ENABLE_MOCK_MODE) {
    logMockCall('POST /api/upload-reference', { filename: file.name });
    await simulateDelay(1200); // Longer delay for file upload
    return mockPdfUploadResponse;
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