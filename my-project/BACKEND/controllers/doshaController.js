// BACKEND/controllers/doshaController.js
const { 
  MOCK_DOSHA_QUESTIONS, 
  MOCK_DOSHA_RESULTS, 
  MOCK_DOSHA_RECOMMENDATIONS 
} = require('../models/doshaModel');

exports.getDoshaQuestions = (req, res, next) => {
  try {
    res.json(MOCK_DOSHA_QUESTIONS);
  } catch (err) {
    next(err);
  }
};

exports.analyzeDosha = (req, res, next) => {
  try {
    const { answers, patientName } = req.body;
    if (!answers) {
      return res.status(400).json({ error: "Answers dataset is required" });
    }

    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // scoring logic
    if (Array.isArray(answers)) {
      answers.forEach(ans => {
        const q = MOCK_DOSHA_QUESTIONS.find(item => item.id === ans.questionId);
        if (q && q.scoreMapping[ans.selectedOptionIndex]) {
          const scores = q.scoreMapping[ans.selectedOptionIndex];
          vataScore += (scores.vata || 0);
          pittaScore += (scores.pitta || 0);
          kaphaScore += (scores.kapha || 0);
        }
      });
    } else {
      // object format: { "q-1": 1, "q-2": 0 }
      Object.keys(answers).forEach(qId => {
        const selectedIdx = answers[qId];
        const q = MOCK_DOSHA_QUESTIONS.find(item => item.id === qId);
        if (q && q.scoreMapping[selectedIdx]) {
          const scores = q.scoreMapping[selectedIdx];
          vataScore += (scores.vata || 0);
          pittaScore += (scores.pitta || 0);
          kaphaScore += (scores.kapha || 0);
        }
      });
    }

    const totalScore = vataScore + pittaScore + kaphaScore;
    let vataPercentage = 33;
    let pittaPercentage = 33;
    let kaphaPercentage = 34;

    if (totalScore > 0) {
      vataPercentage = Math.round((vataScore / totalScore) * 100);
      pittaPercentage = Math.round((pittaScore / totalScore) * 100);
      kaphaPercentage = 100 - vataPercentage - pittaPercentage;
    }

    // Calculate dominant constitution
    const scoresArray = [
      { name: "Vata", value: vataPercentage },
      { name: "Pitta", value: pittaPercentage },
      { name: "Kapha", value: kaphaPercentage }
    ].sort((a, b) => b.value - a.value);

    let dominantDosha = scoresArray[0].name;
    let secondaryDosha = scoresArray[1].name;

    // If top two are within 12% of each other, it's a dual dosha
    if (scoresArray[0].value - scoresArray[1].value <= 12) {
      dominantDosha = `${scoresArray[0].name}-${scoresArray[1].name}`;
      secondaryDosha = scoresArray[2].name;
    }

    const newResult = {
      id: `res-${Date.now()}`,
      patientName: patientName || "Priyanshi Sharma",
      assessmentDate: new Date().toISOString().split('T')[0],
      vataPercentage,
      pittaPercentage,
      kaphaPercentage,
      dominantDosha,
      secondaryDosha
    };

    MOCK_DOSHA_RESULTS.unshift(newResult);

    res.status(201).json({ success: true, data: newResult });
  } catch (err) {
    next(err);
  }
};

exports.getDoshaResultById = (req, res, next) => {
  try {
    const result = MOCK_DOSHA_RESULTS.find(r => r.id === req.params.id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getDoshaRecommendations = (req, res, next) => {
  try {
    const { dosha } = req.query;
    let selectedDosha = dosha || "Pitta";
    if (selectedDosha.includes("-")) {
      selectedDosha = selectedDosha.split("-")[0];
    }
    const recom = MOCK_DOSHA_RECOMMENDATIONS[selectedDosha] || MOCK_DOSHA_RECOMMENDATIONS["Pitta"];
    res.json({ dosha: selectedDosha, ...recom });
  } catch (err) {
    next(err);
  }
};
