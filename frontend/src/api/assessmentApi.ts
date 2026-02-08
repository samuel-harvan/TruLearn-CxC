import apiClient from './client';
import { DetectionResult } from '../types/assessment.types';
import { ENABLE_MOCK_MODE, simulateDelay, logMockCall } from '../config/mockMode';
import { mockDetectionResult } from './mockData';

export interface CreateAssessmentRequest {
  title: string;
  concept: string;
  question_ids: number[];
}

export interface CreateAssessmentResponse {
  id: number;
  title: string;
  concept: string;
  questions: number[];
  created_at: string;
}

export interface SubmitAnswerRequest {
  question_id: number;
  student_id: number;
  answer_text: string;
  response_time_seconds: number;
  reference_pdf?: string;
  sample_answer?: string;
  concept?: string;
}

export interface SubmitAnswerResponse {
  answer_id: number;
  status: 'submitted' | 'processing' | 'analyzed';
  detection?: DetectionResult;
}


//Create new assessment

export const createAssessment = async (
  request: CreateAssessmentRequest
): Promise<CreateAssessmentResponse> => {
  try {
    const response = await apiClient.post<CreateAssessmentResponse>(
      '/api/assessments',
      request
    );
    return response.data;
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
};

/**
 * Submit student answer
 */
export const submitAnswer = async (
  request: SubmitAnswerRequest
): Promise<SubmitAnswerResponse> => {
  // Mock mode: return mock response
  if (ENABLE_MOCK_MODE) {
    logMockCall('POST /api/answers', request);
    await simulateDelay(300);
    return {
      answer_id: Math.floor(Math.random() * 1000),
      status: 'submitted',
    };
  }

  // Real API call
  try {
    const response = await apiClient.post<SubmitAnswerResponse>(
      '/api/answers',
      request
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};


//Run detection on submitted answer (Update: connected to flask backend)
export const runDetection = async (
  answerId: number,
  answerData: SubmitAnswerRequest
): Promise<DetectionResult> => {
  // Mock mode: return mock detection result
  if (ENABLE_MOCK_MODE) {
    logMockCall(`POST /api/answers/${answerId}/detect`, answerData);
    await simulateDelay(600);

    // Return varied mock results for testing different scenarios
    const mockScore = Math.random();
    return {
      ...mockDetectionResult,
      id: Math.floor(Math.random() * 1000),
      answer_id: answerId,
      overfitting_detected: mockScore > 0.6,
      confidence_score: mockScore,
      detection_type: mockScore > 0.8 ? 'memorization' : mockScore > 0.6 ? 'surface' : 'genuine',
      evidence: {
        similarity_score: mockScore,
        response_time: answerData?.response_time_seconds || 45,
        reason: mockScore > 0.6
          ? 'High similarity to reference material detected'
          : 'Good understanding demonstrated'
      },
    };
  }

  // Real API call
  try {
    const response = await apiClient.post<DetectionResult>(
      `/api/answers/${answerId}/detect`,
      answerData  // ← FIXED: Flask needs this data for detection
    );
    return response.data;
  } catch (error) {
    console.error('Error running detection:', error);
    throw error;
  }
};

// get assesment details by ID
export const getAssessment = async (assessmentId: number) => {
  try {
    const response = await apiClient.get(`/api/assessments/${assessmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
};