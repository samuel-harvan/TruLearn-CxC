import { Question, DetectionResult } from '../types/assessment.types';

/**
 * Mock data for demo video — scripted flow:
 *
 * ROUND 1: Upload biology notes → 7 MC + 3 OE (easy/medium mix)
 *   - User answers all, gets most MC right
 *   - OE results: 1 genuine (good), 1 surface (ok), 1 memorization (bad)
 *
 * ROUND 2: Adaptive practice → difficulty adjusted
 *   - Questions that were correct → harder
 *   - Question that was ok → stays medium
 *   - Question that was bad → easier
 *   - User gets everything right this round
 *
 * ROUND 3: New assessment with calculus notes → 7 MC + 3 OE
 */

// ─── State tracker for mock flow ──────────────────────────────────────────────
export const mockState = {
  uploadCount: 0,
  generateCallCount: 0,
};

export const resetMockState = () => {
  mockState.uploadCount = 0;
  mockState.generateCallCount = 0;
};

// ─── PDF Upload Responses ─────────────────────────────────────────────────────

export const biologyUploadResponse = {
  text: "Cells are the fundamental units of life. All living organisms are composed of cells, which are the smallest units that can carry out all life processes. There are two main types of cells: prokaryotic cells (found in bacteria and archaea, lacking a nucleus) and eukaryotic cells (found in plants, animals, fungi, and protists, containing a membrane-bound nucleus). Eukaryotic cells contain organelles such as the mitochondria, which generate ATP through cellular respiration, the endoplasmic reticulum (rough ER for protein synthesis, smooth ER for lipid synthesis and detoxification), the Golgi apparatus for processing and packaging proteins, and lysosomes for breaking down waste materials. Plant cells additionally contain chloroplasts for photosynthesis and a rigid cell wall for structural support. The cell membrane is a selectively permeable phospholipid bilayer that regulates the transport of substances in and out of the cell through passive transport (diffusion, osmosis) and active transport (requiring ATP). DNA replication is a semi-conservative process where each strand of the double helix serves as a template for a new complementary strand. During mitosis, cells divide to produce two genetically identical daughter cells, progressing through the phases: prophase, metaphase, anaphase, and telophase.",
  concept: "Cell Biology",
  filename: "cell-biology-notes.pdf",
  full_summary_length: 1150
};

export const calculusUploadResponse = {
  text: "Calculus is the mathematical study of continuous change. It has two major branches: differential calculus and integral calculus. Differential calculus concerns the concept of a derivative, which represents the instantaneous rate of change of a function. The derivative of f(x) is defined as the limit of [f(x+h) - f(x)]/h as h approaches 0. Key differentiation rules include the power rule (d/dx[x^n] = nx^{n-1}), the product rule (d/dx[f·g] = f'g + fg'), the quotient rule, and the chain rule (d/dx[f(g(x))] = f'(g(x))·g'(x)). Integral calculus is the inverse of differentiation. The definite integral of a function over an interval [a,b] represents the net signed area under the curve. The Fundamental Theorem of Calculus connects differentiation and integration, stating that if F is an antiderivative of f, then the integral from a to b of f(x)dx = F(b) - F(a). Common integration techniques include substitution (u-substitution), integration by parts, and partial fractions. Applications of derivatives include finding local maxima and minima using critical points (where f'(x) = 0 or undefined), determining concavity using the second derivative test, and solving related rates problems. Applications of integrals include computing areas between curves, volumes of revolution, and accumulated quantities.",
  concept: "Calculus",
  filename: "calculus-notes.pdf",
  full_summary_length: 1280
};

// ─── ROUND 1: Biology Questions (7 MC + 3 OE, easy/medium mix) ───────────────

export const biologyRound1Questions: Question[] = [
  // Multiple Choice Questions (7)
  {
    id: 1,
    type: 'multiple_choice',
    question: 'What is the basic structural and functional unit of all living organisms?',
    concept: 'Cell Biology',
    difficulty: 'easy',
    options: {
      A: 'Atom',
      B: 'Molecule',
      C: 'Cell',
      D: 'Organ'
    },
    correct_answer: 'C'
  },
  {
    id: 2,
    type: 'multiple_choice',
    question: 'Which organelle is known as the "powerhouse of the cell"?',
    concept: 'Cell Biology',
    difficulty: 'easy',
    options: {
      A: 'Golgi apparatus',
      B: 'Endoplasmic reticulum',
      C: 'Lysosome',
      D: 'Mitochondria'
    },
    correct_answer: 'D'
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: 'What type of cell lacks a membrane-bound nucleus?',
    concept: 'Cell Biology',
    difficulty: 'easy',
    options: {
      A: 'Eukaryotic cell',
      B: 'Prokaryotic cell',
      C: 'Plant cell',
      D: 'Animal cell'
    },
    correct_answer: 'B'
  },
  {
    id: 4,
    type: 'multiple_choice',
    question: 'During which phase of mitosis do chromosomes align at the cell\'s equator?',
    concept: 'Cell Biology',
    difficulty: 'medium',
    options: {
      A: 'Prophase',
      B: 'Metaphase',
      C: 'Anaphase',
      D: 'Telophase'
    },
    correct_answer: 'B'
  },
  {
    id: 5,
    type: 'multiple_choice',
    question: 'Which structure is found in plant cells but NOT in animal cells?',
    concept: 'Cell Biology',
    difficulty: 'easy',
    options: {
      A: 'Mitochondria',
      B: 'Cell membrane',
      C: 'Cell wall',
      D: 'Ribosomes'
    },
    correct_answer: 'C'
  },
  {
    id: 6,
    type: 'multiple_choice',
    question: 'What is the function of the rough endoplasmic reticulum?',
    concept: 'Cell Biology',
    difficulty: 'medium',
    options: {
      A: 'Lipid synthesis and detoxification',
      B: 'Protein synthesis',
      C: 'Energy production',
      D: 'Waste breakdown'
    },
    correct_answer: 'B'
  },
  {
    id: 7,
    type: 'multiple_choice',
    question: 'Which transport mechanism requires ATP to move substances across the cell membrane?',
    concept: 'Cell Biology',
    difficulty: 'medium',
    options: {
      A: 'Diffusion',
      B: 'Osmosis',
      C: 'Active transport',
      D: 'Facilitated diffusion'
    },
    correct_answer: 'C'
  },

  // Open-Ended Questions (3)
  {
    id: 8,
    type: 'open_ended',
    question: 'Explain the role of mitochondria in cellular respiration and why they are essential for cell function.',
    concept: 'Cell Biology',
    difficulty: 'easy',
    sample_answer: 'Mitochondria are the organelles responsible for generating ATP through cellular respiration. They convert nutrients into usable energy (ATP) that powers virtually all cellular processes, from muscle contraction to protein synthesis. Without mitochondria, cells would lack the energy needed to carry out their vital functions.'
  },
  {
    id: 9,
    type: 'open_ended',
    question: 'Describe the process of DNA replication and explain why it is described as semi-conservative.',
    concept: 'Cell Biology',
    difficulty: 'medium',
    sample_answer: 'DNA replication is semi-conservative because each strand of the original double helix serves as a template for a new complementary strand. The double helix unwinds and each parent strand pairs with new nucleotides, resulting in two DNA molecules that each contain one original strand and one newly synthesized strand. This ensures genetic information is faithfully copied during cell division.'
  },
  {
    id: 10,
    type: 'open_ended',
    question: 'Compare and contrast the key structural differences between prokaryotic and eukaryotic cells.',
    concept: 'Cell Biology',
    difficulty: 'medium',
    sample_answer: 'Prokaryotic cells are simpler and smaller, lacking a membrane-bound nucleus and organelles — their DNA floats freely in the cytoplasm. Eukaryotic cells are more complex, containing a defined nucleus enclosed by a nuclear membrane, along with membrane-bound organelles like mitochondria, the endoplasmic reticulum, and the Golgi apparatus. Both types share ribosomes and a cell membrane, but eukaryotic cells have much greater internal compartmentalization.'
  }
];

// ─── ROUND 2: Biology Adaptive Questions (difficulty adjusted) ────────────────

export const biologyAdaptiveQuestions: Question[] = [
  // Multiple Choice Questions (7) — mostly hard now (topics user got right)
  {
    id: 11,
    type: 'multiple_choice',
    question: 'A cell is treated with a drug that disrupts the mitochondrial inner membrane. Which process would be MOST directly affected?',
    concept: 'Cell Biology',
    difficulty: 'hard',
    options: {
      A: 'DNA replication',
      B: 'Oxidative phosphorylation and ATP synthesis',
      C: 'Protein folding in the ER',
      D: 'Transcription of mRNA'
    },
    correct_answer: 'B'
  },
  {
    id: 12,
    type: 'multiple_choice',
    question: 'If a cell\'s Golgi apparatus were removed, which cellular function would be impaired?',
    concept: 'Cell Biology',
    difficulty: 'hard',
    options: {
      A: 'ATP production',
      B: 'DNA replication',
      C: 'Protein modification and sorting',
      D: 'Osmotic balance'
    },
    correct_answer: 'C'
  },
  {
    id: 13,
    type: 'multiple_choice',
    question: 'During mitosis, what would happen if the spindle fibers failed to form during metaphase?',
    concept: 'Cell Biology',
    difficulty: 'hard',
    options: {
      A: 'DNA would not replicate',
      B: 'Chromosomes could not be separated into daughter cells',
      C: 'The nuclear membrane would not reform',
      D: 'Cytokinesis would begin prematurely'
    },
    correct_answer: 'B'
  },
  {
    id: 14,
    type: 'multiple_choice',
    question: 'A plant cell is placed in a hypertonic solution. What will happen to the cell?',
    concept: 'Cell Biology',
    difficulty: 'hard',
    options: {
      A: 'It will swell and burst (lysis)',
      B: 'It will undergo plasmolysis as water leaves the cell',
      C: 'Nothing, the cell wall prevents all water movement',
      D: 'It will begin active transport of solutes'
    },
    correct_answer: 'B'
  },
  {
    id: 15,
    type: 'multiple_choice',
    question: 'Which organelle is responsible for breaking down worn-out cell parts and foreign material?',
    concept: 'Cell Biology',
    difficulty: 'medium',
    options: {
      A: 'Ribosomes',
      B: 'Smooth ER',
      C: 'Lysosomes',
      D: 'Vacuoles'
    },
    correct_answer: 'C'
  },
  {
    id: 16,
    type: 'multiple_choice',
    question: 'Why is the cell membrane described as "selectively permeable"?',
    concept: 'Cell Biology',
    difficulty: 'hard',
    options: {
      A: 'It allows all molecules to pass through freely',
      B: 'It blocks all molecules from entering or leaving',
      C: 'It allows only certain substances to pass through based on size, charge, and polarity',
      D: 'It only functions during active transport'
    },
    correct_answer: 'C'
  },
  {
    id: 17,
    type: 'multiple_choice',
    question: 'What distinguishes the rough ER from the smooth ER at a structural level?',
    concept: 'Cell Biology',
    difficulty: 'easy',
    options: {
      A: 'Rough ER has ribosomes on its surface',
      B: 'Smooth ER is located inside the nucleus',
      C: 'Rough ER produces lipids',
      D: 'Smooth ER has a double membrane'
    },
    correct_answer: 'A'
  },

  // Open-Ended Questions (3) — difficulty adjusted based on round 1 performance
  {
    id: 18,
    type: 'open_ended',
    question: 'Explain how the structure of the mitochondria (inner and outer membranes, cristae) enables efficient ATP production.',
    concept: 'Cell Biology',
    difficulty: 'hard',
    sample_answer: 'Mitochondria have a double membrane structure. The outer membrane is smooth and permeable, while the highly folded inner membrane forms cristae, which greatly increase the surface area available for the electron transport chain and ATP synthase. This folding maximizes the number of ATP-producing complexes, and the space between the membranes creates a concentration gradient of hydrogen ions essential for chemiosmosis and efficient ATP synthesis.'
  },
  {
    id: 19,
    type: 'open_ended',
    question: 'Describe the key steps of DNA replication and the role of enzymes such as helicase and DNA polymerase.',
    concept: 'Cell Biology',
    difficulty: 'medium',
    sample_answer: 'DNA replication begins when helicase unwinds the double helix by breaking hydrogen bonds between base pairs, creating a replication fork. DNA polymerase then reads each template strand and synthesizes a new complementary strand by adding nucleotides in the 5\' to 3\' direction. Primase lays down an RNA primer to initiate synthesis, and ligase joins Okazaki fragments on the lagging strand. The result is two identical DNA molecules, each with one original and one new strand.'
  },
  {
    id: 20,
    type: 'open_ended',
    question: 'What is the main difference between prokaryotic and eukaryotic cells in terms of genetic material organization?',
    concept: 'Cell Biology',
    difficulty: 'easy',
    sample_answer: 'The main difference is that eukaryotic cells store their DNA within a membrane-bound nucleus, where it is organized into linear chromosomes wrapped around histone proteins. Prokaryotic cells lack a nucleus entirely — their DNA exists as a single circular chromosome in the cytoplasm, in a region called the nucleoid. This difference in organization reflects the greater complexity of eukaryotic gene regulation.'
  }
];

// ─── ROUND 3: Calculus Questions (7 MC + 3 OE) ──────────────────────────────

export const calculusQuestions: Question[] = [
  // Multiple Choice Questions (7)
  {
    id: 21,
    type: 'multiple_choice',
    question: 'What is the derivative of f(x) = x³ using the power rule?',
    concept: 'Calculus',
    difficulty: 'easy',
    options: {
      A: 'x²',
      B: '3x²',
      C: '3x³',
      D: '2x³'
    },
    correct_answer: 'B'
  },
  {
    id: 22,
    type: 'multiple_choice',
    question: 'What does the derivative of a function represent geometrically?',
    concept: 'Calculus',
    difficulty: 'easy',
    options: {
      A: 'The area under the curve',
      B: 'The slope of the tangent line at a point',
      C: 'The y-intercept of the function',
      D: 'The maximum value of the function'
    },
    correct_answer: 'B'
  },
  {
    id: 23,
    type: 'multiple_choice',
    question: 'According to the Fundamental Theorem of Calculus, if F\'(x) = f(x), then ∫ₐᵇ f(x)dx equals:',
    concept: 'Calculus',
    difficulty: 'medium',
    options: {
      A: 'F(a) - F(b)',
      B: 'F(b) - F(a)',
      C: 'f(b) - f(a)',
      D: 'F(a) + F(b)'
    },
    correct_answer: 'B'
  },
  {
    id: 24,
    type: 'multiple_choice',
    question: 'Which differentiation rule should be applied to find d/dx[sin(x²)]?',
    concept: 'Calculus',
    difficulty: 'medium',
    options: {
      A: 'Power rule',
      B: 'Product rule',
      C: 'Chain rule',
      D: 'Quotient rule'
    },
    correct_answer: 'C'
  },
  {
    id: 25,
    type: 'multiple_choice',
    question: 'What is the integral of 2x dx?',
    concept: 'Calculus',
    difficulty: 'easy',
    options: {
      A: '2x + C',
      B: 'x² + C',
      C: '2x² + C',
      D: 'x + C'
    },
    correct_answer: 'B'
  },
  {
    id: 26,
    type: 'multiple_choice',
    question: 'At a critical point where f\'(x) = 0 and f\'\'(x) > 0, the function has a:',
    concept: 'Calculus',
    difficulty: 'medium',
    options: {
      A: 'Local maximum',
      B: 'Local minimum',
      C: 'Point of inflection',
      D: 'Vertical asymptote'
    },
    correct_answer: 'B'
  },
  {
    id: 27,
    type: 'multiple_choice',
    question: 'Using the product rule, what is the derivative of f(x) = x·eˣ?',
    concept: 'Calculus',
    difficulty: 'medium',
    options: {
      A: 'eˣ',
      B: 'xeˣ',
      C: 'eˣ + xeˣ',
      D: 'eˣ - xeˣ'
    },
    correct_answer: 'C'
  },

  // Open-Ended Questions (3)
  {
    id: 28,
    type: 'open_ended',
    question: 'Explain the relationship between differentiation and integration as described by the Fundamental Theorem of Calculus.',
    concept: 'Calculus',
    difficulty: 'medium',
    sample_answer: 'The Fundamental Theorem of Calculus establishes that differentiation and integration are inverse operations. It states that if F is an antiderivative of f (meaning F\'(x) = f(x)), then the definite integral from a to b of f(x)dx equals F(b) - F(a). This connects the concept of accumulation (integration) with the concept of rate of change (differentiation), allowing us to evaluate definite integrals by finding antiderivatives.'
  },
  {
    id: 29,
    type: 'open_ended',
    question: 'Describe how you would use the first and second derivative tests to find and classify the extrema of a function.',
    concept: 'Calculus',
    difficulty: 'medium',
    sample_answer: 'First, find critical points by setting f\'(x) = 0 and solving for x. These are candidate locations for local maxima or minima. Then apply the second derivative test: evaluate f\'\'(x) at each critical point. If f\'\'(x) > 0, the function is concave up and the point is a local minimum. If f\'\'(x) < 0, the function is concave down and the point is a local maximum. If f\'\'(x) = 0, the test is inconclusive and you must use the first derivative test by checking sign changes of f\'(x) around the point.'
  },
  {
    id: 30,
    type: 'open_ended',
    question: 'Explain the concept of a limit and why it is foundational to the definition of the derivative.',
    concept: 'Calculus',
    difficulty: 'easy',
    sample_answer: 'A limit describes the value a function approaches as its input approaches a certain point. It is foundational to derivatives because the derivative is defined as the limit of the difference quotient [f(x+h) - f(x)]/h as h approaches 0. This limit captures the instantaneous rate of change at a point by considering the slope of the secant line as the two points get infinitely close together, becoming the tangent line.'
  }
];

// ─── Scripted Detection Results (per question ID) ─────────────────────────────

// Round 1 open-ended results: 1 good, 1 ok, 1 bad
// Round 2 open-ended results: all genuine (user gets everything right)

export const scriptedDetectionResults: Record<number, DetectionResult> = {
  // Round 1 — Question 8: GENUINE (good score)
  8: {
    id: 1001,
    answer_id: 8,
    overfitting_detected: false,
    confidence_score: 0.22,
    detection_type: 'genuine',
    evidence: {
      similarity_score: 0.22,
      response_time: 52,
      reason: 'Excellent understanding demonstrated — answer reflects genuine comprehension of the material'
    },
    detected_at: new Date().toISOString()
  },

  // Round 1 — Question 9: SURFACE (ok score)
  9: {
    id: 1002,
    answer_id: 9,
    overfitting_detected: false,
    confidence_score: 0.58,
    detection_type: 'surface',
    evidence: {
      similarity_score: 0.58,
      response_time: 38,
      reason: 'Partial understanding — answer covers key points but lacks depth in explaining the mechanism'
    },
    detected_at: new Date().toISOString()
  },

  // Round 1 — Question 10: MEMORIZATION (bad score)
  10: {
    id: 1003,
    answer_id: 10,
    overfitting_detected: true,
    confidence_score: 0.91,
    detection_type: 'memorization',
    evidence: {
      similarity_score: 0.91,
      response_time: 15,
      reason: 'High similarity to source material detected — answer appears to be copied rather than understood'
    },
    detected_at: new Date().toISOString()
  },

  // Round 2 — All genuine (user gets everything right)
  18: {
    id: 2001,
    answer_id: 18,
    overfitting_detected: false,
    confidence_score: 0.18,
    detection_type: 'genuine',
    evidence: {
      similarity_score: 0.18,
      response_time: 65,
      reason: 'Excellent understanding demonstrated — detailed and accurate explanation in own words'
    },
    detected_at: new Date().toISOString()
  },
  19: {
    id: 2002,
    answer_id: 19,
    overfitting_detected: false,
    confidence_score: 0.25,
    detection_type: 'genuine',
    evidence: {
      similarity_score: 0.25,
      response_time: 58,
      reason: 'Strong understanding — clearly explains the process with original phrasing'
    },
    detected_at: new Date().toISOString()
  },
  20: {
    id: 2003,
    answer_id: 20,
    overfitting_detected: false,
    confidence_score: 0.20,
    detection_type: 'genuine',
    evidence: {
      similarity_score: 0.20,
      response_time: 42,
      reason: 'Good understanding demonstrated — concise and accurate comparison'
    },
    detected_at: new Date().toISOString()
  },
};

// ─── Legacy exports (kept for compatibility) ──────────────────────────────────

export const mockPdfUploadResponse = biologyUploadResponse;

export const mockQuestions = biologyRound1Questions;

export const mockGenerateQuestionsResponse = {
  questions: biologyRound1Questions,
  generation_time: 2.35,
  model_used: 'gemini-2.5-flash (mock)'
};

export const mockVariationQuestion: Question = {
  id: 99,
  type: 'multiple_choice',
  question: 'Which organelle generates the majority of ATP in eukaryotic cells?',
  concept: 'Cell Biology',
  difficulty: 'easy',
  options: {
    A: 'Nucleus',
    B: 'Mitochondria',
    C: 'Chloroplast',
    D: 'Ribosome'
  },
  correct_answer: 'B',
  variation_group_id: '1'
};

export const mockDetectionResult = scriptedDetectionResults[8]; // Default: genuine
