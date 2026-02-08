import { Question } from '../types/assessment.types';

/**
 * Mock data for testing UI without making real API calls
 */

export const mockPdfUploadResponse = {
  text: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a by-product. The process occurs in two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). During the light-dependent reactions, chlorophyll absorbs light energy, which is used to split water molecules, releasing oxygen and producing ATP and NADPH. These energy carriers are then used in the Calvin cycle to convert CO2 into glucose.",
  concept: "Photosynthesis",
  filename: "photosynthesis-study-guide.pdf",
  full_summary_length: 850
};

export const mockQuestions: Question[] = [
  // Multiple Choice Questions (5)
  {
    id: 1,
    type: 'multiple_choice',
    question: 'What is the primary pigment involved in photosynthesis?',
    concept: 'Photosynthesis',
    difficulty: 'easy',
    options: {
      A: 'Hemoglobin',
      B: 'Chlorophyll',
      C: 'Carotene',
      D: 'Melanin'
    },
    correct_answer: 'B'
  },
  {
    id: 2,
    type: 'multiple_choice',
    question: 'Which of the following is a product of the light-dependent reactions?',
    concept: 'Photosynthesis',
    difficulty: 'medium',
    options: {
      A: 'Glucose',
      B: 'Carbon dioxide',
      C: 'Oxygen',
      D: 'Starch'
    },
    correct_answer: 'C'
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: 'Where does the Calvin cycle take place?',
    concept: 'Photosynthesis',
    difficulty: 'medium',
    options: {
      A: 'In the thylakoid membrane',
      B: 'In the stroma of chloroplasts',
      C: 'In the mitochondria',
      D: 'In the cell wall'
    },
    correct_answer: 'B'
  },
  {
    id: 4,
    type: 'multiple_choice',
    question: 'What molecule is split during the light-dependent reactions?',
    concept: 'Photosynthesis',
    difficulty: 'easy',
    options: {
      A: 'Oxygen',
      B: 'Glucose',
      C: 'Water',
      D: 'Carbon dioxide'
    },
    correct_answer: 'C'
  },
  {
    id: 5,
    type: 'multiple_choice',
    question: 'Which energy carriers are produced in the light-dependent reactions?',
    concept: 'Photosynthesis',
    difficulty: 'hard',
    options: {
      A: 'ADP and NADP+',
      B: 'ATP and NADPH',
      C: 'Glucose and Oxygen',
      D: 'CO2 and H2O'
    },
    correct_answer: 'B'
  },

  // Open-Ended Questions (5)
  {
    id: 6,
    type: 'open_ended',
    question: 'Explain the role of chlorophyll in photosynthesis.',
    concept: 'Photosynthesis',
    difficulty: 'easy',
    sample_answer: 'Chlorophyll is the green pigment in plants that absorbs light energy from the sun. This absorbed light energy is then used to power the chemical reactions of photosynthesis, particularly the splitting of water molecules and the production of ATP and NADPH during the light-dependent reactions.'
  },
  {
    id: 7,
    type: 'open_ended',
    question: 'Describe the two main stages of photosynthesis and how they are connected.',
    concept: 'Photosynthesis',
    difficulty: 'medium',
    sample_answer: 'The two main stages are the light-dependent reactions and the Calvin cycle (light-independent reactions). In the light-dependent reactions, light energy is captured and used to produce ATP and NADPH while releasing oxygen. These energy carriers (ATP and NADPH) are then used in the Calvin cycle to convert carbon dioxide into glucose. The two stages are connected because the products of the light-dependent reactions are the inputs for the Calvin cycle.'
  },
  {
    id: 8,
    type: 'open_ended',
    question: 'What would happen to the rate of photosynthesis if a plant was placed in complete darkness?',
    concept: 'Photosynthesis',
    difficulty: 'medium',
    sample_answer: 'In complete darkness, photosynthesis would stop because the light-dependent reactions cannot occur without light energy. Without these reactions, ATP and NADPH would not be produced, which means the Calvin cycle would also stop since it requires these energy carriers. The plant would only be able to perform cellular respiration, gradually depleting its stored glucose reserves.'
  },
  {
    id: 9,
    type: 'open_ended',
    question: 'Explain how the structure of a chloroplast is suited to its function in photosynthesis.',
    concept: 'Photosynthesis',
    difficulty: 'hard',
    sample_answer: 'Chloroplasts have a specialized structure that optimizes photosynthesis. The thylakoid membranes contain chlorophyll and are arranged in stacks called grana, providing a large surface area for light absorption. The stroma, the fluid-filled space, contains enzymes needed for the Calvin cycle. This separation allows the light-dependent and light-independent reactions to occur in different locations but remain coordinated. The inner membrane also helps maintain the concentration gradients needed for ATP production.'
  },
  {
    id: 10,
    type: 'open_ended',
    question: 'Compare and contrast photosynthesis and cellular respiration in terms of inputs and outputs.',
    concept: 'Photosynthesis',
    difficulty: 'hard',
    sample_answer: 'Photosynthesis and cellular respiration are essentially opposite processes. Photosynthesis takes in carbon dioxide and water, using light energy to produce glucose and oxygen. Cellular respiration takes in glucose and oxygen to produce carbon dioxide, water, and ATP energy. Photosynthesis stores energy in chemical bonds (glucose), while respiration releases that stored energy. Together, they form a cycle where the products of one process are the reactants of the other, maintaining the balance of oxygen and carbon dioxide in the atmosphere.'
  }
];

export const mockGenerateQuestionsResponse = {
  questions: mockQuestions,
  generation_time: 2.35,
  model_used: 'gemini-2.5-flash (mock)'
};

export const mockVariationQuestion: Question = {
  id: 11,
  type: 'multiple_choice',
  question: 'Which pigment is responsible for capturing light energy in plant cells?',
  concept: 'Photosynthesis',
  difficulty: 'easy',
  options: {
    A: 'Myoglobin',
    B: 'Chlorophyll',
    C: 'Xanthophyll',
    D: 'Anthocyanin'
  },
  correct_answer: 'B',
  variation_group_id: '1'
};

export const mockDetectionResult = {
  id: Date.now(),
  answer_id: 123,
  overfitting_detected: false,
  confidence_score: 0.85,
  detection_type: 'genuine' as const,
  needs_more_practice: false,
  similarity: {
    score: 0.45,
    is_memorized: false
  },
  correctness: {
    label: 'entailment',
    scores: {
      entailment: 0.85,
      neutral: 0.10,
      contradiction: 0.05
    }
  },
  evidence: {
    similarity_score: 0.45,
    response_time: 45,
    reason: 'Good understanding demonstrated'
  },
  detected_at: new Date().toISOString()
};
