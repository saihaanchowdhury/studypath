const express = require("express");
const axios = require("axios");
const TutorSession = require("../models/TutorSession");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to create a title from the student's question
const createSessionTitle = (question) => {
  if (question.length <= 40) {
    return question;
  }

  return question.substring(0, 40) + "...";
};

// @route   POST /api/tutor/ask
// description:   Ask the AI tutor a question and save the session
// @access  Private
router.post("/ask", protect, async (req, res) => {
  try {
    const { subject, gradeLevel, mode, question } = req.body;

    const modeInstructions = {
      "Explain This": `
Mode Goal:
Explain the student's question clearly and step by step.

Required Format:
Title:
Quick Answer:
Step-by-Step Explanation:
Example:
Practice:
Key Takeaway:

Rules:
- Give the answer clearly if there is a direct answer.
- Explain how to get the answer.
- Keep it simple for the student's grade level.
`,

      "Practice Problems": `
Mode Goal:
Create practice problems based on the student's question.

Required Format:
Title:
Practice Problems:
1.
2.
3.
Answer Key:
Step-by-Step Solution for Problem 1:
Key Takeaway:

Rules:
- Do not write a long explanation before the problems.
- Make the problems similar to the student's question.
- Include answers.
`,

      "Quiz Me": `
Mode Goal:
Quiz the student on the topic.

Required Format:
Title:
Mini Quiz:
1.
2.
3.
4.
5.
Answer Key:
Review Tip:

Rules:
- Make exactly 5 questions.
- Use simple language.
- Include the answer key at the end.
`,

      "Simplify It": `
Mode Goal:
Explain the topic in the simplest possible way.

Required Format:
Title:
Simple Explanation:
Easy Example:
Think of it Like This:
Try It:
Key Takeaway:

Rules:
- Use very beginner-friendly language.
- Avoid advanced vocabulary.
- Use an analogy if helpful.
`,

      "Study Plan": `
Mode Goal:
Create a study plan for the topic.

Required Format:
Title:
Goal:
What to Learn First:
Practice Plan:
Day 1:
Day 2:
Day 3:
Quick Review:
Key Takeaway:

Rules:
- Do not solve the problem like a normal explanation.
- Focus on making a study plan.
- Keep the plan realistic and easy to follow.
`,

      "Writing Coach": `
Mode Goal:
Help improve the student's writing.

Required Format:
Title:
Overall Feedback:
What Works Well:
What Can Improve:
Suggested Revision:
Writing Tip:

Rules:
- Only use this mode for writing, essays, paragraphs, grammar, or wording.
- If the question is not about writing, politely say this mode is best for writing and still give a short helpful suggestion.
`,
    };

    if (!subject || !gradeLevel || !mode || !question) {
      return res.status(400).json({
        message: "Please provide your subject, grade level, mode, and question.",
      });
    }

    if (!modeInstructions[mode]) {
      return res.status(400).json({
        message: "Please choose a valid learning mode.",
      });
    }

    const prompt = `
You are StudyPath, a helpful, friendly, and supportive AI tutor.

Student Details:
- Subject: ${subject}
- Grade Level: ${gradeLevel}
- Learning Mode: ${mode}

Student Question:
${question}

Mode-Specific Instructions:
${modeInstructions[mode]}

General Rules:
- Follow the selected learning mode exactly.
- Use the required format from the selected learning mode.
- Use clear and simple language for the student's grade level.
- Do not use markdown asterisks, markdown bolding, or markdown bullet points.
- Do not use the same format for every mode.
- If there is a direct answer, include it clearly.
- Keep the response organized and easy to read.
- Be encouraging and student-friendly.
`;

    const openRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "cohere/north-mini-code:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5050",
          "X-Title": "StudyPath",
        },
      }
    );

    const aiResponse = openRouterResponse.data.choices[0].message.content;

    const session = await TutorSession.create({
      userId: req.user._id,
      title: createSessionTitle(question),
      subject,
      gradeLevel,
      mode,
      question,
      aiResponse,
    });

    res.status(201).json({
      message: "Tutor response created successfully.",
      session,
    });
  } catch (error) {
    console.error("Error creating tutor session:", error);

    if (error.message && error.message.includes("429")) {
      return res.status(429).json({
        message:
          "The AI tutor is temporarily unavailable because the AI API quota was exceeded. Please try again later.",
      });
    }

    if (error.message && error.message.includes("503")) {
      return res.status(503).json({
        message:
          "The AI tutor is currently experiencing high demand. Please try again in a moment.",
      });
    }

    res.status(500).json({
      message: "Error creating tutor session.",
      error: error.response?.data || error.message,
    });
  }
});

// @route   GET /api/tutor/sessions
// description:  Get all tutor sessions for the logged-in user
// @access  Private
router.get("/sessions", protect, async (req, res) => {
  try {
    const sessions = await TutorSession.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      message: "Failed to get sessions.",
    });
  }
});

// @route   GET /api/tutor/sessions/:id
// description:  Get one tutor session for the logged-in user
// @access  Private
router.get("/sessions/:id", protect, async (req, res) => {
  try {
    const session = await TutorSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    res.json(session);
  } catch (error) {
    console.error("Get single session error:", error);
    res.status(500).json({
      message: "Failed to get session.",
    });
  }
});

// @route   PUT /api/tutor/sessions/:id
// @description:  Update a tutor session title
// @access  Private
router.put("/sessions/:id", protect, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Please provide a title for the session.",
      });
    }

    const session = await TutorSession.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      { title },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    res.json({
      message: "Session updated successfully.",
      session,
    });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({
      message: "Failed to update session.",
    });
  }
});

// @route   DELETE /api/tutor/sessions/:id
// @description:  Delete a tutor session
// @access  Private
router.delete("/sessions/:id", protect, async (req, res) => {
  try {
    const session = await TutorSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    res.json({
      message: "Session deleted successfully.",
      session,
    });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({
      message: "Failed to delete session.",
    });
  }
});

module.exports = router;