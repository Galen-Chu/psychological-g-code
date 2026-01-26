/**
 * Psychological G-Code Assessment Engine
 * Self-reflection and assessment system for Chakra-Kabbalah integration
 */

class AssessmentEngine {
  constructor() {
    this.responses = {};
    this.scores = {};
    this.pillarScores = {};
  }

  /**
   * Calculate score for a single level
   * @param {Array} questions - Array of question objects
   * @param {Object} responses - User's responses {questionId: score}
   * @returns {Object} Score object with total, max, and interpretation
   */
  calculateLevelScore(questions, responses) {
    let total = 0;
    let answered = 0;

    questions.forEach(q => {
      const response = responses[q.id];
      if (response !== undefined && response !== null) {
        // Reverse score if needed (1 becomes 5, 2 becomes 4, etc.)
        const score = q.reverse_scoring ? (6 - response) : response;
        total += score;
        answered++;
      }
    });

    const maxPossible = questions.length * 5;
    const percentage = (total / maxPossible) * 100;

    return {
      total,
      maxPossible,
      answered,
      percentage,
      interpretation: this.interpretScore(total, questions.length),
      balance: this.assessBalance(questions, responses)
    };
  }

  /**
   * Interpret a raw score
   */
  interpretScore(total, questionCount) {
    const maxPossible = questionCount * 5;
    const percentage = (total / maxPossible) * 100;

    if (percentage < 40) return 'very_low';
    if (percentage < 60) return 'low';
    if (percentage < 80) return 'balanced';
    return 'high';
  }

  /**
   * Assess if the level shows deficiency, excess, or balance
   */
  assessBalance(questions, responses) {
    // This would analyze the pattern of responses
    // For now, return based on overall score
    const score = this.calculateLevelScore(questions, responses);
    if (score.percentage < 40) return 'deficient';
    if (score.percentage > 85) return 'excessive';
    return 'balanced';
  }

  /**
   * Calculate all level scores
   */
  calculateAllScores(assessmentData, userResponses) {
    const results = {};

    assessmentData.levels.forEach(level => {
      results[level.level] = {
        name: level.name,
        chakra_id: level.chakra_id,
        sephira_id: level.sephira_id,
        score: this.calculateLevelScore(level.questions, userResponses),
        categoryBreakdown: this.analyzeCategories(level.questions, userResponses)
      };
    });

    return results;
  }

  /**
   * Analyze responses by category within a level
   */
  analyzeCategories(questions, responses) {
    const categories = {};

    questions.forEach(q => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, count: 0, responses: [] };
      }
      if (responses[q.id] !== undefined) {
        const score = q.reverse_scoring ? (6 - responses[q.id]) : responses[q.id];
        categories[q.category].total += score;
        categories[q.category].count++;
        categories[q.category].responses.push(score);
      }
    });

    // Calculate averages
    Object.keys(categories).forEach(cat => {
      const data = categories[cat];
      categories[cat].average = data.count > 0 ? data.total / data.count : 0;
      categories[cat].maxPossible = data.count * 5;
      categories[cat].percentage = (data.total / data.maxPossible) * 100;
    });

    return categories;
  }

  /**
   * Determine pillar dominance
   */
  calculatePillarDominance(pillarResponses) {
    const pillars = {
      mercy: 0,
      severity: 0,
      balance: 0
    };

    // Calculate average for each pillar
    ['mercy', 'severity', 'balance'].forEach(pillar => {
      const responses = pillarResponses[pillar] || [];
      if (responses.length > 0) {
        pillars[pillar] = responses.reduce((a, b) => a + b, 0) / responses.length;
      }
    });

    // Determine dominant pillar
    let dominant = 'balance';
    if (pillars.mercy > pillars.severity && pillars.mercy > pillars.balance) {
      dominant = 'mercy';
    } else if (pillars.severity > pillars.mercy && pillars.severity > pillars.balance) {
      dominant = 'severity';
    }

    return {
      dominant,
      scores: pillars,
      interpretation: this.interpretPillarDominance(dominant, pillars)
    };
  }

  /**
   * Interpret pillar dominance
   */
  interpretPillarDominance(dominant, scores) {
    const interpretations = {
      mercy: {
        title: "Pillar of Mercy Dominant",
        description: "You tend toward expansion, emotion, and creativity. Your strength is compassion and flexibility. Growth opportunity: Develop more structure and discipline.",
        strengths: ["Compassion", "Creativity", "Flexibility", "Generosity", "Intuition"],
        challenges: ["Boundaries", "Discipline", "Structure", "Follow-through"],
        practices: ["Set clear boundaries", "Create routines", "Practice discernment", "Develop willpower"]
      },
      severity: {
        title: "Pillar of Severity Dominant",
        description: "You tend toward structure, discipline, and analysis. Your strength is clarity and reliability. Growth opportunity: Cultivate mercy and flow.",
        strengths: ["Discipline", "Organization", "Clarity", "Reliability", "Analysis"],
        challenges: ["Rigidity", "Emotional expression", "Flexibility", "Self-compassion"],
        practices: ["Practice self-compassion", "Embrace spontaneity", "Connect with emotions", "Softening boundaries"]
      },
      balance: {
        title: "Pillar of Balance",
        description: "You show good integration of mercy and severity. You can access both qualities as needed. Continue refining this balance.",
        strengths: ["Integration", "Flexibility", "Awareness", "Adaptability"],
        challenges: ["May avoid extremes", "Could develop either pillar more"],
        practices: ["Deepen both pillars", "Recognize when each is needed", "Refine discernment"]
      }
    };

    return interpretations[dominant];
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(allScores, pillarResult) {
    const recommendations = [];

    // Check each level
    Object.values(allScores).forEach(level => {
      const { name, score, chakra_id, sephira_id } = level;

      if (score.interpretation === 'very_low') {
        recommendations.push({
          priority: 'high',
          level: name,
          chakra: chakra_id,
          sephira: sephira_id,
          type: 'deficiency',
          message: `${name} needs significant attention.`,
          practices: this.getPracticesForLevel(level, 'deficiency')
        });
      } else if (score.interpretation === 'low') {
        recommendations.push({
          priority: 'medium',
          level: name,
          chakra: chakra_id,
          sephira: sephira_id,
          type: 'deficiency',
          message: `${name} could benefit from some attention.`,
          practices: this.getPracticesForLevel(level, 'deficiency')
        });
      } else if (score.balance === 'excessive') {
        recommendations.push({
          priority: 'medium',
          level: name,
          chakra: chakra_id,
          sephira: sephira_id,
          type: 'excess',
          message: `${name} may be overactive. Find balance.`,
          practices: this.getPracticesForLevel(level, 'excess')
        });
      }
    });

    // Add pillar-specific recommendations
    recommendations.push({
      priority: 'medium',
      type: 'pillar',
      message: pillarResult.interpretation.description,
      practices: pillarResult.interpretation.practices
    });

    return recommendations;
  }

  /**
   * Get practices for a specific level and condition
   */
  getPracticesForLevel(level, condition) {
    const practicesByLevel = {
      1: { // Foundation
        deficiency: ["Grounding exercises", "Nature walks", "Physical exercise", "Establish routine", "Financial planning"],
        excess: ["Practice letting go", "Release rigidity", "Embrace change", "Share resources"]
      },
      2: { // Emotional
        deficiency: ["Emotional journaling", "Creative expression", "Pleasure recovery", "Dance/movement", "Therapy"],
        excess: ["Emotional regulation", "Boundary setting", "Mindfulness", "Grounding"]
      },
      3: { // Power
        deficiency: ["Confidence building", "Goal setting", "Physical strength", "Take action", "Claim your power"],
        excess: ["Practice surrender", "Compassion", "Delegate", "Listen to others"]
      },
      4: { // Heart
        deficiency: ["Self-love practices", "Gratitude journal", "Connection", "Forgiveness work", "Therapy"],
        excess: ["Boundary setting", "Self-care", "Say no", "Receive from others"]
      },
      5: { // Expression
        deficiency: ["Speak your truth", "Join a speaking group", "Creative expression", "Assertiveness training"],
        excess: ["Practice listening", "Reflect before speaking", "Write before speaking"]
      },
      6: { // Vision
        deficiency: ["Meditation", "Dream journaling", "Intuition exercises", "Creative visualization", "Retreat"],
        excess: ["Grounding practices", "Practical action", "Test intuition against reality"]
      },
      7: { // Transcendence
        deficiency: ["Meditation", "Spiritual study", "Nature immersion", "Service", "Contemplation"],
        excess: ["Ground in body", "Practical service", "Avoid spiritual bypassing", "Embrace human experience"]
      }
    };

    return practicesByLevel[level.level]?.[condition] || ["Seek guidance", "Self-reflection", "Meditation"];
  }

  /**
   * Generate a full assessment report
   */
  generateReport(assessmentData, userResponses, pillarResponses) {
    const allScores = this.calculateAllScores(assessmentData, userResponses);
    const pillarResult = this.calculatePillarDominance(pillarResponses);
    const recommendations = this.generateRecommendations(allScores, pillarResult);

    // Calculate overall balance
    const scoreValues = Object.values(allScores).map(l => l.score.percentage);
    const overallBalance = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;

    return {
      timestamp: new Date().toISOString(),
      overallBalance,
      overallInterpretation: this.interpretScore(overallBalance, 1),
      levels: allScores,
      pillar: pillarResult,
      recommendations,
      summary: this.generateSummary(allScores, pillarResult, overallBalance)
    };
  }

  /**
   * Generate a narrative summary
   */
  generateSummary(allScores, pillarResult, overallBalance) {
    const levelCount = Object.keys(allScores).length;
    const balancedCount = Object.values(allScores).filter(l => l.score.interpretation === 'balanced').length;
    const deficientLevels = Object.values(allScores).filter(l => ['very_low', 'low'].includes(l.score.interpretation));

    let summary = `Your assessment shows ${balancedCount} of ${levelCount} levels in balance. `;

    if (overallBalance >= 60) {
      summary += "Overall, you demonstrate good integration across the chakra-sephira system. ";
    } else {
      summary += "Overall, there are areas that could benefit from attention and support. ";
    }

    if (deficientLevels.length > 0) {
      summary += `The areas showing the most need for attention are: ${deficientLevels.map(l => l.name).join(", ")}. `;
    }

    summary += `Your dominant archetype is the ${pillarResult.interpretation.title}. `;

    return summary;
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AssessmentEngine;
}
