/**
 * Система контекстного обучения - Few-Shot Learning
 * Учится на успешных взаимодействиях и адаптируется к пользователю
 * ФАЗА 1: Контекстное обучение и улучшение качества ответов
 */

// Используем динамический импорт для ES модулей
let storage = null;

async function getStorage() {
  if (!storage) {
    const storageModule = await import('../storage.ts');
    storage = storageModule.storage;
  }
  return storage;
}

const SmartLogger = {
  learning: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎓🔄 [${timestamp}] LEARNING SYSTEM: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Система контекстного обучения для улучшения ответов
 */
class LearningSystem {
  constructor() {
    this.initialized = false;
    this.learningThreshold = 70; // Минимальный процент успеха для применения паттерна
    this.initializeLearningCategories();
  }

  /**
   * Инициализация категорий обучения
   */
  initializeLearningCategories() {
    // Категории для обучения
    this.learningCategories = {
      image_generation: {
        keyMetrics: ['user_satisfaction', 'prompt_quality', 'style_match'],
        successIndicators: ['отлично', 'супер', 'именно то', 'идеально'],
        failureIndicators: ['не то', 'плохо', 'не нравится', 'переделай'],
        weight: 1.2
      },

      image_consultation: {
        keyMetrics: ['advice_relevance', 'solution_practicality', 'user_understanding'],
        successIndicators: ['понятно', 'полезно', 'поможет', 'спасибо'],
        failureIndicators: ['не понял', 'сложно', 'не помогает'],
        weight: 1.0
      },

      vectorization: {
        keyMetrics: ['output_quality', 'processing_speed', 'user_expectations'],
        successIndicators: ['качественно', 'быстро', 'отлично получилось'],
        failureIndicators: ['медленно', 'плохое качество', 'ошибки'],
        weight: 1.1
      },

      web_search: {
        keyMetrics: ['information_relevance', 'answer_completeness', 'source_credibility'],
        successIndicators: ['информативно', 'полный ответ', 'именно это искал'],
        failureIndicators: ['не та информация', 'неполно', 'не помогло'],
        weight: 0.9
      },

      general_chat: {
        keyMetrics: ['response_helpfulness', 'communication_style', 'problem_solving'],
        successIndicators: ['помогли', 'понятно объяснили', 'решили проблему'],
        failureIndicators: ['не помогли', 'непонятно', 'не решили'],
        weight: 0.8
      }
    };

    SmartLogger.learning('Категории обучения инициализированы', {
      categories: Object.keys(this.learningCategories).length
    });
  }

  /**
   * Анализ успешности взаимодействия
   */
  async analyzeInteractionSuccess(userId, sessionId, interactionData) {
    try {
      const {
        userRequest,
        systemResponse,
        userFeedback,
        category,
        responseTime,
        additionalMetrics = {}
      } = interactionData;

      // Определяем успешность на основе обратной связи
      const successAnalysis = this.evaluateSuccess(userFeedback, category);

      // Извлекаем паттерн запроса
      const requestPattern = this.extractRequestPattern(userRequest);

      // Анализируем контекст
      const contextPattern = await this.analyzeRequestContext(userId, sessionId, userRequest);

      // Создаем паттерн ответа
      const responsePattern = this.createResponsePattern(systemResponse, successAnalysis, additionalMetrics);

      // Сохраняем или обновляем паттерн обучения
      await this.saveOrUpdateLearningPattern(userId, {
        category,
        requestPattern,
        contextPattern,
        responsePattern,
        successAnalysis,
        responseTime
      });

      SmartLogger.learning(`Взаимодействие проанализировано`, {
        userId,
        category,
        success: successAnalysis.isSuccess,
        confidence: successAnalysis.confidence
      });

      return successAnalysis;
    } catch (error) {
      SmartLogger.learning(`Ошибка анализа взаимодействия: ${error.message}`);
      return { isSuccess: false, confidence: 0, reason: 'analysis_error' };
    }
  }

  /**
   * Получение рекомендаций на основе обученных паттернов
   */
  async getLearnedRecommendations(userId, currentRequest, category) {
    try {
      // Получаем успешные паттерны для пользователя и категории
      const db = await getStorage();
      const successfulPatterns = await db.getSuccessfulPatterns(userId, category);

      if (successfulPatterns.length === 0) {
        SmartLogger.learning(`Нет обученных паттернов для пользователя ${userId} в категории ${category}`);
        return null;
      }

      // Находим наиболее релевантный паттерн
      const relevantPattern = this.findMostRelevantPattern(currentRequest, successfulPatterns);

      if (!relevantPattern) {
        SmartLogger.learning('Не найден релевантный паттерн');
        return null;
      }

      // Создаем рекомендации на основе паттерна
      const recommendations = this.createRecommendationsFromPattern(relevantPattern, currentRequest);

      SmartLogger.learning(`Рекомендации созданы на основе паттерна`, {
        patternId: relevantPattern.id,
        successRate: relevantPattern.successRate,
        usageCount: relevantPattern.usageCount
      });

      return recommendations;
    } catch (error) {
      SmartLogger.learning(`Ошибка получения рекомендаций: ${error.message}`);
      return null;
    }
  }

  /**
   * Адаптация промпта на основе обученных паттернов
   */
  async adaptPromptWithLearning(userId, originalPrompt, category) {
    try {
      const recommendations = await this.getLearnedRecommendations(userId, originalPrompt, category);

      if (!recommendations) {
        return originalPrompt; // Возвращаем оригинальный промпт если нет рекомендаций
      }

      let adaptedPrompt = originalPrompt;

      // Применяем рекомендации
      if (recommendations.styleAdjustments) {
        adaptedPrompt = this.applyStyleAdjustments(adaptedPrompt, recommendations.styleAdjustments);
      }

      if (recommendations.additionalElements) {
        adaptedPrompt = this.addRecommendedElements(adaptedPrompt, recommendations.additionalElements);
      }

      if (recommendations.specificPhrases) {
        adaptedPrompt = this.incorporateSuccessfulPhrases(adaptedPrompt, recommendations.specificPhrases);
      }

      SmartLogger.learning(`Промпт адаптирован на основе обучения`, {
        originalLength: originalPrompt.length,
        adaptedLength: adaptedPrompt.length,
        category
      });

      return {
        adaptedPrompt,
        learningSource: recommendations.source,
        confidence: recommendations.confidence
      };
    } catch (error) {
      SmartLogger.learning(`Ошибка адаптации промпта: ${error.message}`);
      return originalPrompt;
    }
  }

  /**
   * Обновление паттернов на основе нового успешного взаимодействия
   */
  async updatePatternsWithSuccess(userId, successData) {
    try {
      const { category, requestPattern, responseQuality, specificFactors } = successData;

      // Получаем существующие паттерны
      const existingPatterns = await db.getLearningPatterns(userId, category);

      // Ищем похожий паттерн
      const similarPattern = this.findSimilarPattern(requestPattern, existingPatterns);

      if (similarPattern) {
        // Обновляем существующий паттерн
        const updatedSuccessRate = this.calculateNewSuccessRate(
          similarPattern.successRate,
          similarPattern.usageCount,
          responseQuality
        );

        await db.updateLearningPattern(similarPattern.id, {
          successRate: updatedSuccessRate,
          usageCount: similarPattern.usageCount + 1,
          lastSuccess: new Date(),
          confidence: Math.min(similarPattern.confidence + 5, 100),
          adaptationData: JSON.stringify({
            ...JSON.parse(similarPattern.adaptationData || '{}'),
            lastSuccess: {
              quality: responseQuality,
              factors: specificFactors,
              timestamp: new Date().toISOString()
            }
          })
        });

        SmartLogger.learning(`Обновлен существующий паттерн`, {
          patternId: similarPattern.id,
          newSuccessRate: updatedSuccessRate
        });
      } else {
        // Создаем новый паттерн
        const newPattern = {
          userId,
          patternType: 'success_flow',
          category,
          inputPattern: requestPattern,
          contextPattern: JSON.stringify({}),
          responsePattern: JSON.stringify({
            quality: responseQuality,
            factors: specificFactors
          }),
          successRate: responseQuality,
          usageCount: 1,
          lastSuccess: new Date(),
          confidence: 60,
          adaptationData: JSON.stringify({
            initialSuccess: {
              quality: responseQuality,
              factors: specificFactors,
              timestamp: new Date().toISOString()
            }
          })
        };

        const createdPattern = await db.createLearningPattern(newPattern);
        SmartLogger.learning(`Создан новый паттерн успеха`, { patternId: createdPattern.id });
      }

      return true;
    } catch (error) {
      SmartLogger.learning(`Ошибка обновления паттернов: ${error.message}`);
      return false;
    }
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  evaluateSuccess(userFeedback, category) {
    if (!userFeedback) {
      return { isSuccess: false, confidence: 0, reason: 'no_feedback' };
    }

    const feedback = userFeedback.toLowerCase();
    const categoryConfig = this.learningCategories[category] || this.learningCategories.general_chat;

    let successScore = 0;
    let failureScore = 0;

    // Проверяем индикаторы успеха
    categoryConfig.successIndicators.forEach(indicator => {
      if (feedback.includes(indicator)) {
        successScore += 1;
      }
    });

    // Проверяем индикаторы неудачи
    categoryConfig.failureIndicators.forEach(indicator => {
      if (feedback.includes(indicator)) {
        failureScore += 1;
      }
    });

    const isSuccess = successScore > failureScore;
    const confidence = Math.min((Math.abs(successScore - failureScore) + 1) * 20, 100);

    return {
      isSuccess,
      confidence,
      successScore,
      failureScore,
      reason: isSuccess ? 'positive_feedback' : 'negative_feedback'
    };
  }

  extractRequestPattern(userRequest) {
    // Извлекаем ключевые элементы запроса
    const words = userRequest.toLowerCase().split(' ').filter(word => word.length > 2);
    const keyWords = words.slice(0, 10); // Берем первые 10 значимых слов

    // Определяем тип запроса
    let requestType = 'general';
    if (userRequest.includes('создай') || userRequest.includes('сделай')) {
      requestType = 'creation';
    } else if (userRequest.includes('объясни') || userRequest.includes('расскажи')) {
      requestType = 'explanation';
    } else if (userRequest.includes('найди') || userRequest.includes('поищи')) {
      requestType = 'search';
    }

    return {
      type: requestType,
      keyWords: keyWords,
      length: userRequest.length,
      hasSpecifics: this.hasSpecificRequirements(userRequest)
    };
  }

  hasSpecificRequirements(request) {
    const specificWords = ['стиль', 'цвет', 'размер', 'формат', 'качество', 'детали'];
    return specificWords.some(word => request.toLowerCase().includes(word));
  }

  async analyzeRequestContext(userId, sessionId, userRequest) {
    try {
      // Получаем контекст из истории сессии
      const recentMessages = await db.getLatestAiMessages(sessionId, 5);

      // Получаем контекст активных проектов
      const userProjects = await db.getActiveProjects(userId);

      return {
        hasRecentImages: recentMessages.some(msg => msg.imageUrl),
        activeProjectsCount: userProjects.length,
        dominantProjectType: this.findDominantProjectType(userProjects),
        sessionLength: recentMessages.length,
        timeOfDay: new Date().getHours()
      };
    } catch (error) {
      SmartLogger.learning(`Ошибка анализа контекста: ${error.message}`);
      return {};
    }
  }

  findDominantProjectType(projects) {
    if (projects.length === 0) return null;

    const typeCounts = {};
    projects.forEach(project => {
      typeCounts[project.projectType] = (typeCounts[project.projectType] || 0) + 1;
    });

    return Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b
    );
  }

  createResponsePattern(systemResponse, successAnalysis, additionalMetrics) {
    return {
      responseLength: systemResponse.length,
      wasSuccessful: successAnalysis.isSuccess,
      successConfidence: successAnalysis.confidence,
      tone: this.detectResponseTone(systemResponse),
      includedElements: this.extractResponseElements(systemResponse),
      metrics: additionalMetrics
    };
  }

  detectResponseTone(response) {
    if (response.includes('!') && response.includes('отлично')) return 'enthusiastic';
    if (response.includes('профессионально') || response.includes('качественно')) return 'professional';
    if (response.includes('попробуйте') || response.includes('рекомендую')) return 'advisory';
    return 'neutral';
  }

  extractResponseElements(response) {
    const elements = [];
    if (response.includes('рекомендую')) elements.push('recommendation');
    if (response.includes('например')) elements.push('example');
    if (response.includes('важно')) elements.push('important_note');
    if (response.includes('попробуйте')) elements.push('suggestion');
    return elements;
  }

  async saveOrUpdateLearningPattern(userId, patternData) {
    try {
      const existingPatterns = await db.getLearningPatterns(userId, patternData.category);

      // Ищем похожий паттерн
      const similarPattern = this.findSimilarPattern(patternData.requestPattern, existingPatterns);

      if (similarPattern) {
        // Обновляем существующий
        const newSuccessRate = this.calculateNewSuccessRate(
          similarPattern.successRate,
          similarPattern.usageCount,
          patternData.successAnalysis.isSuccess ? 100 : 0
        );

        await db.updateLearningPattern(similarPattern.id, {
          successRate: newSuccessRate,
          usageCount: similarPattern.usageCount + 1,
          confidence: Math.min(similarPattern.confidence + 2, 100),
          adaptationData: JSON.stringify({
            ...JSON.parse(similarPattern.adaptationData || '{}'),
            lastInteraction: {
              success: patternData.successAnalysis.isSuccess,
              responseTime: patternData.responseTime,
              timestamp: new Date().toISOString()
            }
          })
        });
      } else {
        // Создаем новый
        const newPattern = {
          userId,
          patternType: 'request_pattern',
          category: patternData.category,
          inputPattern: JSON.stringify(patternData.requestPattern),
          contextPattern: JSON.stringify(patternData.contextPattern),
          responsePattern: JSON.stringify(patternData.responsePattern),
          successRate: patternData.successAnalysis.isSuccess ? 100 : 0,
          usageCount: 1,
          confidence: 50,
          adaptationData: JSON.stringify({
            initialData: {
              success: patternData.successAnalysis.isSuccess,
              responseTime: patternData.responseTime,
              timestamp: new Date().toISOString()
            }
          })
        };

        await db.createLearningPattern(newPattern);
      }

      return true;
    } catch (error) {
      SmartLogger.learning(`Ошибка сохранения паттерна: ${error.message}`);
      return false;
    }
  }

  findSimilarPattern(requestPattern, existingPatterns) {
    if (!existingPatterns || existingPatterns.length === 0) return null;

    for (const pattern of existingPatterns) {
      try {
        const storedPattern = JSON.parse(pattern.inputPattern);
        const similarity = this.calculatePatternSimilarity(requestPattern, storedPattern);

        if (similarity > 0.7) { // 70% сходства
          return pattern;
        }
      } catch (error) {
        // Игнорируем паттерны с некорректным JSON
        continue;
      }
    }

    return null;
  }

  calculatePatternSimilarity(pattern1, pattern2) {
    if (!pattern1 || !pattern2) return 0;

    // Сравниваем типы запросов
    if (pattern1.type !== pattern2.type) return 0;

    // Сравниваем ключевые слова
    const words1 = pattern1.keyWords || [];
    const words2 = pattern2.keyWords || [];

    if (words1.length === 0 && words2.length === 0) return 0.5;

    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    const wordSimilarity = intersection.length / union.length;

    // Учитываем другие факторы
    const lengthSimilarity = 1 - Math.abs(pattern1.length - pattern2.length) / Math.max(pattern1.length, pattern2.length);
    const specificsSimilarity = pattern1.hasSpecifics === pattern2.hasSpecifics ? 1 : 0;

    return (wordSimilarity * 0.6 + lengthSimilarity * 0.2 + specificsSimilarity * 0.2);
  }

  calculateNewSuccessRate(oldRate, oldCount, newQuality) {
    const newSuccessValue = newQuality > 50 ? 100 : 0;
    return Math.round((oldRate * oldCount + newSuccessValue) / (oldCount + 1));
  }

  findMostRelevantPattern(currentRequest, patterns) {
    if (!patterns || patterns.length === 0) return null;

    const currentPattern = this.extractRequestPattern(currentRequest);
    let bestPattern = null;
    let bestScore = 0;

    for (const pattern of patterns) {
      try {
        const storedPattern = JSON.parse(pattern.inputPattern);
        const similarity = this.calculatePatternSimilarity(currentPattern, storedPattern);

        // Учитываем успешность и частоту использования
        const score = similarity * 0.6 + (pattern.successRate / 100) * 0.3 + Math.min(pattern.usageCount / 10, 1) * 0.1;

        if (score > bestScore && score > 0.5) {
          bestScore = score;
          bestPattern = pattern;
        }
      } catch (error) {
        continue;
      }
    }

    return bestPattern;
  }

  createRecommendationsFromPattern(pattern, currentRequest) {
    try {
      const responsePattern = JSON.parse(pattern.responsePattern);
      const adaptationData = JSON.parse(pattern.adaptationData || '{}');

      return {
        source: {
          patternId: pattern.id,
          successRate: pattern.successRate,
          usageCount: pattern.usageCount
        },
        confidence: pattern.confidence,
        styleAdjustments: {
          tone: responsePattern.tone,
          length: responsePattern.responseLength > 500 ? 'detailed' : 'concise',
          elements: responsePattern.includedElements
        },
        additionalElements: this.extractRecommendedElements(adaptationData),
        specificPhrases: this.extractSuccessfulPhrases(adaptationData)
      };
    } catch (error) {
      SmartLogger.learning(`Ошибка создания рекомендаций: ${error.message}`);
      return null;
    }
  }

  extractRecommendedElements(adaptationData) {
    // Извлекаем элементы, которые часто приводили к успеху
    const elements = [];

    if (adaptationData.lastSuccess?.factors?.includes('detailed_explanation')) {
      elements.push('добавить подробное объяснение');
    }

    if (adaptationData.lastSuccess?.factors?.includes('examples')) {
      elements.push('привести примеры');
    }

    return elements;
  }

  extractSuccessfulPhrases(adaptationData) {
    // Извлекаем фразы, которые хорошо работали
    const phrases = [];

    // Базовые фразы для разных случаев
    if (adaptationData.initialData?.success) {
      phrases.push('рекомендую попробовать');
      phrases.push('отличный выбор');
    }

    return phrases;
  }

  applyStyleAdjustments(prompt, adjustments) {
    let adjusted = prompt;

    if (adjustments.tone === 'enthusiastic') {
      adjusted = adjusted.replace(/\./g, '!');
    }

    if (adjustments.tone === 'professional') {
      adjusted = 'С профессиональной точки зрения: ' + adjusted;
    }

    return adjusted;
  }

  addRecommendedElements(prompt, elements) {
    let enhanced = prompt;

    elements.forEach(element => {
      if (element === 'добавить подробное объяснение' && !enhanced.includes('подробно')) {
        enhanced += ' Подробно рассмотрим каждый аспект.';
      }

      if (element === 'привести примеры' && !enhanced.includes('например')) {
        enhanced += ' Например, можно использовать такие подходы.';
      }
    });

    return enhanced;
  }

  incorporateSuccessfulPhrases(prompt, phrases) {
    let enhanced = prompt;

    phrases.forEach(phrase => {
      if (!enhanced.toLowerCase().includes(phrase.toLowerCase())) {
        enhanced = phrase.charAt(0).toUpperCase() + phrase.slice(1) + ': ' + enhanced;
      }
    });

    return enhanced;
  }
  
  /**
   * Продвинутая аналитика взаимодействий (Фаза 2)
   */
  analyzeInteractionSuccess(userQuery, aiResponse, userFeedback = null) {
    const analysis = {
      query: userQuery,
      response: aiResponse,
      feedback: userFeedback,
      timestamp: Date.now(),
      metrics: {},
      // Новые метрики Фазы 2
      interactionFlow: this.analyzeInteractionFlow(userQuery, aiResponse),
      userSatisfaction: this.calculateUserSatisfaction(userFeedback),
      responseQuality: this.assessResponseQuality(aiResponse),
      contextRelevance: this.measureContextRelevance(userQuery, aiResponse),
      taskCompletion: this.evaluateTaskCompletion(userQuery, aiResponse)
    };
  }
}

module.exports = new LearningSystem();