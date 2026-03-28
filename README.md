# TruLearn 💡

**Project Goal**

TruLearn is an AI-powered study tool that detects whether you're truly understanding material or just memorizing it. Upload your study notes as a PDF, take an auto-generated quiz, and get feedback on how deeply you actually know the content.
While AI within education does not have to be inherently bad at all time, more often then not, AI is promoting superficial learning. Rather than actually learning and exercising their brains, many students now rely on AI to provide an easy escape from the first signs of struggle. This overreliance has created a need for tools that encourage critical thinking and active engagement within educational settings.

**Our solution: Think Harder, Learn Smarter**

TruLearn is an AI-powered adaptive learning platform that goes beyond simple quizzing. TruLearn is an application that was designed to detect whether someone is genuinely understanding material or is just reciting memorized definitions. 

**Project Inspiration**

The idea was first inspited by it's similarity to the concept of overfitting in machine learning contexts. Much like how a machine learning model overfits when left to learn unsupervised, many students are "overfitting" on educational material. An LLM gives you an answer, you memorize the methadology, fix your answer, and move onto the next problem. 

---

## How It Works

1. **Upload a PDF 🗂️** - Via pdf download, anything from lecture notes to textbook chapters can be submitted. TruLearn then uses Google Gemini to extract and summarize the key concepts from your material.

2. **Quiz generation ❓** - Using this summarization, Gemini then generates 10 questions tailored to your content: a smart mix of multiple-choice and open-ended questions at a varied difficulty level (Easy, Medium, or Hard).

3. **Question responses 📝** - Users will then be prompted to answer these questions. The multiple choice answers are meant to collect information regarding the user's knowledge, understanding and overall grasp of the material. Open-reponse questions are meant to collect information regarding how well the user is able to apply their thinking process to the information they have uploaded.

4. **Depth analysis** - Open-ended answers are evaluated bidirectionally by a fine-tuned NLI model trained specifically to distinguish:
   - **Deep understanding** - User explains the **why**, makes well-formed connections using rationale thinking, logic and examples. If the user answers questions to this depth, they should be able to teach the topic to another person. 
   - **Shallow** - While the answer does have the rationale and correctness of an answer that would be classified as deep understanding, it sounds almost like a rehearsed definition from a textbook. These answers contain the **what** but not the **why**.
   - **Incorrect** - These answers contain factual errors or contradict the expected response.

5. **Results** - The model will then analyze each answer based on these criteria and will output both an overall score and individual scores for each question. Based on these results the user can then be prompted to either continue to a different set of notes or to enter adaptive practice mode.

    - **Adaptive practice** - After a question set has been fully answered and analyzed, based on preset thresholds, the application will then work to adjust the difficulty of each     question topic based on how well the user answered that specific question. The application will then generate a new question set targeting the concepts the user struggled with the most, while also increasing the difficulty of the questions based on the user's strongest topics. 

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Material UI |
| Backend | Python, Flask |
| AI / LLM | Google Gemini 2.5 Flash |
| Depth Evaluation | Fine-tuned `cross-encoder/nli-deberta-v3-base` via `sentence-transformers` |
| PDF Processing | Google Gemini multimodal API |

---
