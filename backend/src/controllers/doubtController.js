import Doubt from "../models/Doubt.js";
import Lecture from "../models/Lecture.js";
import {
  generateEmbeddings,
  answerQuestion,
  findMostRelevantContext,
  translateText,
} from "../utils/ai.js";

export const askDoubt = async (req, res, next) => {
  try {
    const { courseId, lectureId, question, language } = req.body;

    if (!courseId || !question) {
      return res.status(400).json({
        success: false,
        message: "Course ID and question are required",
      });
    }

    // Create doubt record
    const doubt = new Doubt({
      studentId: req.userId,
      courseId,
      lectureId,
      question,
      language,
    });

    // Try to generate answer using AI
    try {
      let answer = null;
      let contexts = [];
      let questionEmbedding = null;

      // Get lecture embeddings if available
      if (lectureId) {
        const lecture = await Lecture.findById(lectureId);
        if (lecture && lecture.lectureEmbeddings && lecture.lectureContent) {
          // Generate embedding for question
          questionEmbedding = await generateEmbeddings(question);

          // Find most relevant context
          const relevantContext = findMostRelevantContext(
            questionEmbedding,
            lecture.lectureEmbeddings
          );

          if (relevantContext) {
            const chunks = lecture.lectureContent.split(" ");
            const chunkSize = 100;
            const relevantChunk = chunks
              .slice(
                relevantContext.index * chunkSize,
                (relevantContext.index + 1) * chunkSize
              )
              .join(" ");

            contexts.push(relevantChunk);

            // Get answer from QA model
            const qaResult = await answerQuestion(question, relevantChunk);
            if (qaResult.answer) {
              answer = qaResult.answer;
              doubt.confidence = qaResult.score || 0.5;
            }
          }
        }
      }

      // Fallback: simple keyword matching if no embeddings
      if (!answer) {
        answer = `Based on the lecture content, your question about "${question}" is important. Please refer to the lecture notes and discuss with your instructor for detailed explanation.`;
      }

      // Translate answer if needed
      if (language !== "english") {
        try {
          answer = await translateText(
            answer,
            language === "hindi" ? "hi" : "mr"
          );
        } catch (error) {
          console.warn("Translation failed, returning English answer");
        }
      }

      doubt.answer = answer;
      doubt.relatedContexts = contexts;
      doubt.isResolved = true;
      doubt.resolvedAt = new Date();
    } catch (aiError) {
      console.warn("AI processing failed:", aiError.message);
      doubt.answer = `Your question has been recorded. An instructor will respond soon. Question: "${question}"`;
    }

    await doubt.save();

    res.status(201).json({
      success: true,
      message: "Doubt solved",
      data: {
        id: doubt._id,
        question: doubt.question,
        answer: doubt.answer,
        language: doubt.answerLanguage,
        confidence: doubt.confidence,
        isResolved: doubt.isResolved,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find({ studentId: req.userId })
      .populate("courseId", "title")
      .populate("lectureId", "title week")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: doubts,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseDoubts = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const doubts = await Doubt.find({
      courseId,
      studentId: req.userId,
    })
      .populate("lectureId", "title week")
      .sort({ isResolved: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: doubts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoubtHelpful = async (req, res, next) => {
  try {
    const { doubtId } = req.params;

    const doubt = await Doubt.findByIdAndUpdate(
      doubtId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Thank you for your feedback",
      data: doubt,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUnresolvedDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find({ isResolved: false })
      .populate("studentId", "name email")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: doubts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoubtAnswer = async (req, res, next) => {
  try {
    const { doubtId } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const doubt = await Doubt.findByIdAndUpdate(
      doubtId,
      {
        answer,
        isResolved: true,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doubt answered",
      data: doubt,
    });
  } catch (error) {
    next(error);
  }
};
