/**
 * СИСТЕМА САМООЦЕНКИ И РЕФИНИРОВАНИЯ ОТВЕТОВ
 * Анализирует качество собственных ответов и улучшает их итеративно
 * 
 * Принцип: Как ChatGPT-4 анализирует свои ответы и улучшает их
 */

const SmartLogger = {
  evaluator: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎯 [${timestamp}] SELF-EVALUATOR: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * АНАЛИЗАТОР ЛОГИЧНОСТИ ОТВЕТА
 */
class LogicAnalyzer {
  constructor() {
    this.logicPatterns = {
      // Паттерны логических связок
      connections: ['потому что', 'следовательно', 'таким образом', 'поэтому', 'в результате'],
      contradictions: ['но', 'однако', 'тем не менее', 'с другой стороны'],
      sequences: ['сначала', 'затем', 'далее', 'наконец', 'в итоге'],
      examples: ['например', 'к примеру', 'допустим', 'скажем']
    };
  }

  /**
   * Анализирует логическую структуру текста
   */
  analyzeLogic(text, meta) {
    SmartLogger.evaluator('Анализируем логическую структуру ответа');

    const analysis = {
      structuralCoherence: this.checkStructuralCoherence(text),
      argumentationQuality: this.assessArgumentation(text, meta),
      logicalFlow: this.checkLogicalFlow(text),
      contradictionCheck: this.findContradictions(text),
      completenessCheck: this.checkCompleteness(text, meta)
    };

    const logicScore = this.calculateLogicScore(analysis);

    SmartLogger.evaluator(`Логический анализ завершен, оценка: ${logicScore}/10`);

    return {
      score: logicScore,
      details: analysis,
      improvements: this.suggestLogicImprovements(analysis)
    };
  }

  /**
   * Проверяет структурную связность
   */
  checkStructuralCoherence(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    let coherenceScore = 5; // базовая оценка

    // Проверка наличия логических связок
    const connectionsFound = this.logicPatterns.connections.filter(pattern => 
      text.toLowerCase().includes(pattern)
    ).length;

    if (connectionsFound > 0) coherenceScore += Math.min(2, connectionsFound * 0.5);

    // Проверка последовательности
    const sequencesFound = this.logicPatterns.sequences.filter(pattern => 
      text.toLowerCase().includes(pattern)
    ).length;

    if (sequencesFound > 1) coherenceScore += 1;

    // Проверка длины предложений (слишком длинные = плохо)
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    if (avgSentenceLength > 200) coherenceScore -= 1;
    if (avgSentenceLength < 30) coherenceScore -= 0.5;

    return Math.max(0, Math.min(10, coherenceScore));
  }

  /**
   * Оценивает качество аргументации
   */
  assessArgumentation(text, meta) {
    let argumentationScore = 5;

    // Проверка наличия примеров
    const examplesFound = this.logicPatterns.examples.filter(pattern => 
      text.toLowerCase().includes(pattern)
    ).length;

    if (examplesFound > 0) argumentationScore += 1;

    // Проверка соответствия мета-анализу
    if (meta && meta.intent) {
      const queryType = meta.intent;

      // Для технических запросов требуем более структурированные ответы
      if (queryType === 'technical' || queryType === 'how_to') {
        if (text.includes('шаг') || text.includes('этап') || text.includes('алгоритм')) {
          argumentationScore += 1;
        }
      }

      // Для creative запросов ценим разнообразие
      if (queryType === 'creative' || queryType === 'image_generation') {
        if (text.includes('вариант') || text.includes('можн') || text.includes('предлагаю')) {
          argumentationScore += 1;
        }
      }
    }

    // Проверка баланса утверждений и пояснений
    const assertionCount = (text.match(/\./g) || []).length;
    const explanationCount = (text.match(/[,:]/g) || []).length;

    if (explanationCount > assertionCount * 0.3) argumentationScore += 0.5;

    return Math.max(0, Math.min(10, argumentationScore));
  }

  /**
   * Проверяет логический поток
   */
  checkLogicalFlow(text) {
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

    let flowScore = 5;

    // Каждый параграф должен логически следовать из предыдущего
    for (let i = 1; i < paragraphs.length; i++) {
      const currentParagraph = paragraphs[i].toLowerCase();
      const previousParagraph = paragraphs[i - 1].toLowerCase();

      // Проверка связующих слов в начале параграфа
      const hasTransition = this.logicPatterns.connections.some(pattern => 
        currentParagraph.startsWith(pattern) || currentParagraph.includes(pattern)
      );

      if (hasTransition) flowScore += 0.5;
    }

    return Math.max(0, Math.min(10, flowScore));
  }

  /**
   * Ищет противоречия в тексте
   */
  findContradictions(text) {
    const lowerText = text.toLowerCase();
    let contradictionPenalty = 0;

    // Поиск явных противоречий
    const contradictionPatterns = [
      ['всегда', 'никогда'],
      ['можно', 'нельзя'],
      ['да', 'нет'],
      ['возможно', 'невозможно']
    ];

    contradictionPatterns.forEach(([positive, negative]) => {
      if (lowerText.includes(positive) && lowerText.includes(negative)) {
        // Проверяем, не разделены ли они логическими связками
        const positiveIndex = lowerText.indexOf(positive);
        const negativeIndex = lowerText.indexOf(negative);
        const between = lowerText.substring(
          Math.min(positiveIndex, negativeIndex), 
          Math.max(positiveIndex, negativeIndex)
        );

        const hasLogicalSeparator = this.logicPatterns.contradictions.some(pattern => 
          between.includes(pattern)
        );

        if (!hasLogicalSeparator) {
          contradictionPenalty += 1;
        }
      }
    });

    return Math.max(0, 10 - contradictionPenalty * 2);
  }

  /**
   * Проверяет полноту ответа
   */
  checkCompleteness(text, meta) {
    let completenessScore = 5;

    // Базовая проверка длины
    if (text.length < 50) completenessScore -= 3;
    else if (text.length < 100) completenessScore -= 1;
    else if (text.length > 500) completenessScore += 1;

    // Проверка соответствия типу запроса
    if (meta && meta.intent) {
      const queryType = meta.intent;

      if (queryType === 'question' && !text.includes('?') && text.length < 200) {
        completenessScore -= 1; // Короткий ответ на вопрос
      }

      if (queryType === 'explanation' && text.length < 300) {
        completenessScore -= 1; // Объяснение должно быть подробным
      }
    }

    return Math.max(0, Math.min(10, completenessScore));
  }

  /**
   * Вычисляет общую оценку логики
   */
  calculateLogicScore(analysis) {
    const weights = {
      structuralCoherence: 0.25,
      argumentationQuality: 0.25,
      logicalFlow: 0.2,
      contradictionCheck: 0.15,
      completenessCheck: 0.15
    };

    return Object.keys(weights).reduce((score, key) => {
      return score + (analysis[key] * weights[key]);
    }, 0);
  }

  /**
   * Предлагает улучшения логики
   */
  suggestLogicImprovements(analysis) {
    const suggestions = [];

    if (analysis.structuralCoherence < 6) {
      suggestions.push('Добавьте больше логических связок между предложениями');
    }

    if (analysis.argumentationQuality < 6) {
      suggestions.push('Включите примеры или пояснения для лучшей аргументации');
    }

    if (analysis.logicalFlow < 6) {
      suggestions.push('Улучшите переходы между абзацами');
    }

    if (analysis.contradictionCheck < 8) {
      suggestions.push('Проверьте наличие противоречий в тексте');
    }

    if (analysis.completenessCheck < 6) {
      suggestions.push('Расширьте ответ для большей полноты');
    }

    return suggestions;
  }
}

/**
 * АНАЛИЗАТОР ЭМОЦИОНАЛЬНОГО ТОНА
 */
class EmotionalToneAnalyzer {
  constructor() {
    this.emotionalMarkers = {
      positive: ['отлично', 'прекрасно', 'замечательно', 'здорово', 'великолепно'],
      negative: ['плохо', 'ужасно', 'неприятно', 'проблема', 'сложность'],
      neutral: ['возможно', 'вероятно', 'обычно', 'как правило', 'часто'],
      supportive: ['поможем', 'поддержим', 'понимаю', 'сочувствую', 'решим'],
      professional: ['рекомендую', 'предлагаю', 'оптимально', 'эффективно', 'целесообразно']
    };
  }

  /**
   * Анализирует эмоциональный тон ответа
   */
  analyzeTone(text, expectedTone = 'neutral') {
    SmartLogger.evaluator('Анализируем эмоциональный тон');

    const toneAnalysis = {
      detectedTone: this.detectTone(text),
      expectedTone,
      toneConsistency: 0,
      appropriateness: 0,
      emotionalBalance: this.checkEmotionalBalance(text)
    };

    toneAnalysis.toneConsistency = this.checkToneConsistency(toneAnalysis.detectedTone, expectedTone);
    toneAnalysis.appropriateness = this.checkToneAppropriateness(toneAnalysis.detectedTone, text);

    const toneScore = (toneAnalysis.toneConsistency + toneAnalysis.appropriateness + toneAnalysis.emotionalBalance) / 3;

    SmartLogger.evaluator(`Анализ тона завершен: ${toneAnalysis.detectedTone}, оценка: ${toneScore.toFixed(1)}/10`);

    return {
      score: toneScore,
      analysis: toneAnalysis,
      improvements: this.suggestToneImprovements(toneAnalysis)
    };
  }

  /**
   * Определяет тон текста
   */
  detectTone(text) {
    const lowerText = text.toLowerCase();
    const toneScores = {};

    // Подсчитываем маркеры каждого тона
    Object.keys(this.emotionalMarkers).forEach(tone => {
      toneScores[tone] = this.emotionalMarkers[tone].filter(marker => 
        lowerText.includes(marker)
      ).length;
    });

    // Находим доминирующий тон
    const dominantTone = Object.keys(toneScores).reduce((a, b) => 
      toneScores[a] > toneScores[b] ? a : b
    );

    return toneScores[dominantTone] > 0 ? dominantTone : 'neutral';
  }

  /**
   * Проверяет согласованность тона
   */
  checkToneConsistency(detected, expected) {
    if (detected === expected) return 10;

    // Совместимые тона
    const compatibleTones = {
      professional: ['neutral', 'supportive'],
      supportive: ['positive', 'professional'],
      positive: ['supportive', 'neutral'],
      neutral: ['professional', 'positive']
    };

    if (compatibleTones[expected]?.includes(detected)) return 7;
    if (compatibleTones[detected]?.includes(expected)) return 6;

    return 4; // несовместимые тона
  }

  /**
   * Проверяет уместность тона
   */
  checkToneAppropriateness(tone, text) {
    let appropriatenessScore = 7; // базовая оценка

    // Позитивный тон уместен для успешных результатов
    if (tone === 'positive' && (text.includes('успешно') || text.includes('готово'))) {
      appropriatenessScore += 2;
    }

    // Поддерживающий тон уместен для решения проблем
    if (tone === 'supportive' && (text.includes('поможе') || text.includes('решени'))) {
      appropriatenessScore += 2;
    }

    // Профессиональный тон всегда уместен
    if (tone === 'professional') {
      appropriatenessScore += 1;
    }

    // Негативный тон почти всегда неуместен
    if (tone === 'negative') {
      appropriatenessScore -= 3;
    }

    return Math.max(0, Math.min(10, appropriatenessScore));
  }

  /**
   * Проверяет эмоциональный баланс
   */
  checkEmotionalBalance(text) {
    const lowerText = text.toLowerCase();

    // Подсчитываем позитивные и негативные маркеры
    const positiveCount = this.emotionalMarkers.positive.filter(marker => 
      lowerText.includes(marker)
    ).length;

    const negativeCount = this.emotionalMarkers.negative.filter(marker => 
      lowerText.includes(marker)
    ).length;

    // Идеальный баланс: больше позитивных, минимум негативных
    if (positiveCount > 0 && negativeCount === 0) return 9;
    if (positiveCount >= negativeCount && negativeCount <= 1) return 7;
    if (positiveCount === 0 && negativeCount === 0) return 6; // нейтрально
    if (negativeCount > positiveCount) return 3;

    return 5;
  }

  /**
   * Предлагает улучшения тона
   */
  suggestToneImprovements(analysis) {
    const suggestions = [];

    if (analysis.toneConsistency < 6) {
      suggestions.push(`Адаптируйте тон под ожидаемый: ${analysis.expectedTone}`);
    }

    if (analysis.appropriateness < 6) {
      suggestions.push('Сделайте тон более подходящим для контекста');
    }

    if (analysis.emotionalBalance < 6) {
      suggestions.push('Улучшите эмоциональный баланс, добавьте позитивности');
    }

    return suggestions;
  }
}

/**
 * ГЛАВНЫЙ ОЦЕНЩИК КАЧЕСТВА
 */
class QualityEvaluator {
  constructor() {
    this.logicAnalyzer = new LogicAnalyzer();
    this.toneAnalyzer = new EmotionalToneAnalyzer();
  }

  /**
   * Комплексная оценка качества ответа
   */
  evaluateResponse(text, meta, context = {}) {
    SmartLogger.evaluator('Начинаем комплексную оценку качества ответа');

    const evaluation = {
      timestamp: Date.now(),
      textLength: text.length,
      logic: this.logicAnalyzer.analyzeLogic(text, meta),
      tone: this.toneAnalyzer.analyzeTone(text, context.expectedTone),
      relevance: this.checkRelevance(text, meta),
      clarity: this.checkClarity(text),
      usefulness: this.checkUsefulness(text, meta),
      safety: this.checkSafety(text)
    };

    const overallScore = this.calculateOverallScore(evaluation);

    SmartLogger.evaluator(`Оценка завершена: ${overallScore.toFixed(1)}/10`);

    return {
      score: overallScore,
      evaluation,
      improvements: this.generateImprovements(evaluation),
      needsRefinement: overallScore < 7
    };
  }

  /**
   * Проверяет релевантность ответа
   */
  checkRelevance(text, meta) {
    let relevanceScore = 5;

    if (!meta || !meta.intent) return relevanceScore;

    const lowerText = text.toLowerCase();
    const intent = meta.intent.toLowerCase();

    // Проверка соответствия намерению
    if (intent.includes('image') && lowerText.includes('изображени')) {
      relevanceScore += 2;
    }

    if (intent.includes('question') && lowerText.includes('ответ')) {
      relevanceScore += 1;
    }

    if (intent.includes('help') && lowerText.includes('поможе')) {
      relevanceScore += 1;
    }

    // Проверка наличия ключевых слов из мета-анализа
    if (meta.keywords) {
      const keywordsFound = meta.keywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      ).length;

      relevanceScore += Math.min(2, keywordsFound * 0.5);
    }

    return Math.max(0, Math.min(10, relevanceScore));
  }

  /**
   * Проверяет ясность изложения
   */
  checkClarity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let clarityScore = 7;

    // Средняя длина предложения
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    if (avgLength > 150) clarityScore -= 1;
    if (avgLength < 20) clarityScore -= 0.5;

    // Сложные слова и конструкции
    const complexWords = text.match(/\w{12,}/g) || [];
    if (complexWords.length > text.split(' ').length * 0.1) {
      clarityScore -= 1;
    }

    // Структура текста
    if (text.includes('\n') || text.includes('•') || text.includes('-')) {
      clarityScore += 0.5; // структурированный текст лучше
    }

    return Math.max(0, Math.min(10, clarityScore));
  }

  /**
   * Проверяет полезность ответа
   */
  checkUsefulness(text, meta) {
    let usefulnessScore = 5;

    // Наличие конкретных рекомендаций
    if (text.includes('рекомендую') || text.includes('предлагаю') || text.includes('советую')) {
      usefulnessScore += 1;
    }

    // Наличие примеров
    if (text.includes('например') || text.includes('к примеру')) {
      usefulnessScore += 1;
    }

    // Пошаговые инструкции
    if (text.includes('шаг') || text.includes('этап') || /\d+\./g.test(text)) {
      usefulnessScore += 1;
    }

    // Соответствие ожиданиям по типу запроса
    if (meta && meta.intent) {
      if (meta.intent === 'how_to' && !text.includes('как')) {
        usefulnessScore -= 1;
      }
      if (meta.intent === 'creative' && !text.includes('вариант')) {
        usefulnessScore -= 0.5;
      }
    }

    return Math.max(0, Math.min(10, usefulnessScore));
  }

  /**
   * Проверяет безопасность ответа
   */
  checkSafety(text) {
    const lowerText = text.toLowerCase();
    const unsafePatterns = [
      'удали', 'уничтож', 'сломай', 'взломай', 'нарушь',
      'украд', 'обман', 'мошенничеств', 'вред'
    ];

    const foundUnsafe = unsafePatterns.filter(pattern => 
      lowerText.includes(pattern)
    ).length;

    return foundUnsafe > 0 ? 0 : 10;
  }

  /**
   * Вычисляет общую оценку
   */
  calculateOverallScore(evaluation) {
    const weights = {
      logic: 0.25,
      tone: 0.15,
      relevance: 0.25,
      clarity: 0.15,
      usefulness: 0.15,
      safety: 0.05
    };

    return Object.keys(weights).reduce((score, key) => {
      const componentScore = evaluation[key].score || evaluation[key];
      return score + (componentScore * weights[key]);
    }, 0);
  }

  /**
   * Генерирует рекомендации по улучшению
   */
  generateImprovements(evaluation) {
    const improvements = [];

    Object.keys(evaluation).forEach(component => {
      if (evaluation[component].improvements) {
        improvements.push(...evaluation[component].improvements);
      }
    });

    // Дополнительные общие рекомендации
    if (evaluation.logic.score < 6 && evaluation.clarity.score < 6) {
      improvements.push('Улучшите структуру и логику изложения');
    }

    if (evaluation.usefulness.score < 6) {
      improvements.push('Добавьте больше практических советов и примеров');
    }

    return improvements;
  }
}

/**
 * СИСТЕМА РЕФИНИРОВАНИЯ ОТВЕТОВ
 */
class ResponseRefiner {
  constructor() {
    this.evaluator = new QualityEvaluator();
  }

  /**
   * Улучшает ответ на основе анализа качества
   */
  async refineResponse(originalThought, originalResponse, qualityScore) {
    SmartLogger.evaluator(`Начинаем рефинирование ответа (качество: ${qualityScore}/10)`);

    const evaluation = this.evaluator.evaluateResponse(
      originalResponse.response, 
      originalThought.meta
    );

    // Создаем улучшенную версию мысли
    const refinedThought = {
      ...originalThought,
      refinementContext: {
        originalQuality: qualityScore,
        evaluation: evaluation.evaluation,
        improvements: evaluation.improvements,
        focusAreas: this.identifyFocusAreas(evaluation.evaluation)
      }
    };

    // Добавляем инструкции по улучшению
    refinedThought.refinementInstructions = this.generateRefinementInstructions(evaluation);

    SmartLogger.evaluator('Рефинирование завершено, возвращаем улучшенную мысль');

    return refinedThought;
  }

  /**
   * Определяет области для улучшения
   */
  identifyFocusAreas(evaluation) {
    const focusAreas = [];

    if (evaluation.logic.score < 6) focusAreas.push('logic');
    if (evaluation.tone.score < 6) focusAreas.push('tone');
    if (evaluation.relevance < 6) focusAreas.push('relevance');
    if (evaluation.clarity < 6) focusAreas.push('clarity');
    if (evaluation.usefulness < 6) focusAreas.push('usefulness');

    return focusAreas;
  }

  /**
   * Генерирует инструкции по рефинированию
   */
  generateRefinementInstructions(evaluation) {
    const instructions = [];

    evaluation.improvements.forEach(improvement => {
      instructions.push(`УЛУЧШЕНИЕ: ${improvement}`);
    });

    // Специальные инструкции на основе оценки
    if (evaluation.evaluation.logic.score < 6) {
      instructions.push('ФОКУС: Улучшите логическую структуру и связность');
    }

    if (evaluation.evaluation.usefulness < 6) {
      instructions.push('ФОКУС: Добавьте больше практической ценности');
    }

    return instructions;
  }
}

// Создаем экземпляры
const qualityEvaluator = new QualityEvaluator();
const responseRefiner = new ResponseRefiner();

/**
 * ГЛАВНЫЕ ЭКСПОРТИРУЕМЫЕ ФУНКЦИИ
 */
const semanticQualityScore = (text, meta, context = {}) => {
  try {
    const result = qualityEvaluator.evaluateResponse(text, meta, context);
    return result.score;
  } catch (error) {
    SmartLogger.evaluator('Ошибка оценки качества:', error.message);
    return 5; // средняя оценка при ошибке
  }
};

const refineResponse = async (thought, response, qualityScore) => {
  try {
    return await responseRefiner.refineResponse(thought, response, qualityScore);
  } catch (error) {
    SmartLogger.evaluator('Ошибка рефинирования:', error.message);
    return thought; // возвращаем оригинал при ошибке
  }
};

const evaluateResponseDetailed = (text, meta, context = {}) => {
  try {
    return qualityEvaluator.evaluateResponse(text, meta, context);
  } catch (error) {
    SmartLogger.evaluator('Ошибка детальной оценки:', error.message);
    return {
      score: 5,
      evaluation: {},
      improvements: ['Произошла ошибка при анализе качества'],
      needsRefinement: false
    };
  }
};

module.exports = {
  semanticQualityScore,
  refineResponse,
  evaluateResponseDetailed,
  QualityEvaluator,
  ResponseRefiner
};