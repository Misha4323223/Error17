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
 * Система контекстного обучения и адаптации
 */
class LearningSystem {
  constructor() {
    this.initialized = false;
    this.learningPatterns = new Map();
    this.adaptationStrategies = this.initializeAdaptationStrategies();
    this.fewShotExamples = new Map();
  }

  /**
   * Инициализация системы обучения
   */
  initialize() {
    if (this.initialized) return;
    
    SmartLogger.learning('Инициализация системы контекстного обучения');
    
    // Инициализируем стратегии адаптации
    this.setupLearningStrategies();
    this.initialized = true;
    
    SmartLogger.learning('Система обучения готова к работе');
  }

  /**
   * Получение рекомендаций на основе обученных паттернов
   */
  async getLearnedRecommendations(userId, currentRequest, category) {
    try {
      const db = await getStorage();
      const successfulPatterns = await db.getSuccessfulPatterns(userId, category);

      if (successfulPatterns.length === 0) {
        SmartLogger.learning(`Нет обученных паттернов для пользователя ${userId} в категории ${category}`);
        return null;
      }

      // Анализируем похожие успешные паттерны
      const relevantPatterns = this.findRelevantPatterns(currentRequest, successfulPatterns);
      
      if (relevantPatterns.length === 0) {
        return null;
      }

      // Генерируем рекомендации на основе паттернов
      const recommendations = this.generateFewShotRecommendations(relevantPatterns, currentRequest);
      
      SmartLogger.learning(`Сгенерировано ${recommendations.length} рекомендаций на основе обученных паттернов`);
      
      return {
        type: 'learned_recommendations',
        patterns_used: relevantPatterns.length,
        recommendations: recommendations,
        confidence: this.calculateRecommendationConfidence(relevantPatterns),
        learning_source: 'few_shot_learning'
      };

    } catch (error) {
      SmartLogger.learning(`Ошибка получения обученных рекомендаций: ${error.message}`);
      return null;
    }
  }

  /**
   * Сохранение успешного взаимодействия для обучения
   */
  async learnFromInteraction(interactionData) {
    try {
      db = await getStorage();
      const existingPatterns = await db.getLearningPatterns(interactionData.userId, interactionData.category);

      // Ищем похожий паттерн
      const similarPattern = this.findSimilarPattern(interactionData, existingPatterns);

      if (similarPattern) {
        // Обновляем существующий паттерн
        await db.updateLearningPattern(similarPattern.id, {
          successCount: similarPattern.successCount + 1,
          lastUsed: new Date().toISOString(),
          confidence: Math.min(similarPattern.confidence + 0.1, 1.0),
          examples: [...similarPattern.examples, interactionData.example].slice(-10) // Оставляем последние 10
        });
        
        SmartLogger.learning(`Обновлен паттерн обучения: ${similarPattern.id}`);
      } else {
        // Создаем новый паттерн
        const newPattern = {
          userId: interactionData.userId,
          category: interactionData.category,
          pattern: interactionData.requestPattern,
          response_strategy: interactionData.responseStrategy,
          success_metrics: interactionData.successMetrics,
          examples: [interactionData.example],
          successCount: 1,
          confidence: 0.7,
          created: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        };

        const createdPattern = await db.createLearningPattern(newPattern);
        SmartLogger.learning(`Создан новый паттерн обучения: ${createdPattern.id}`);
      }

      // Обновляем локальный кэш паттернов
      this.updateLocalPatterns(interactionData);
      
      return { success: true, learned: true };

    } catch (error) {
      SmartLogger.learning(`Ошибка обучения на взаимодействии: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Адаптация ответа на основе обученных предпочтений пользователя
   */
  async adaptResponseToUser(userId, baseResponse, context) {
    try {
      db = await getStorage();
      const recentMessages = await db.getLatestAiMessages(sessionId, 5);
      const userProjects = await db.getActiveProjects(userId);

      // Анализируем предпочтения стиля ответов
      const stylePreferences = this.analyzeResponseStylePreferences(recentMessages);
      
      // Адаптируем тон и стиль
      let adaptedResponse = this.adaptResponseStyle(baseResponse, stylePreferences);
      
      // Добавляем контекст проектов, если релевантно
      if (userProjects.length > 0 && context.category !== 'general_chat') {
        adaptedResponse = this.addProjectContext(adaptedResponse, userProjects, context);
      }
      
      // Применяем обученные фразы и выражения
      adaptedResponse = this.applyLearnedPhrases(adaptedResponse, userId, context.category);
      
      SmartLogger.learning(`Ответ адаптирован под предпочтения пользователя ${userId}`);
      
      return {
        adapted_response: adaptedResponse,
        adaptations_applied: stylePreferences,
        confidence: 0.8
      };

    } catch (error) {
      SmartLogger.learning(`Ошибка адаптации ответа: ${error.message}`);
      return { adapted_response: baseResponse, error: error.message };
    }
  }

  /**
   * Записывает и анализирует новый паттерн взаимодействия
   */
  async recordInteractionPattern(patternData) {
    try {
      db = await getStorage();
      existingPatterns = await db.getLearningPatterns(patternData.userId, patternData.category);

      const analysis = {
        pattern_id: `pattern_${Date.now()}`,
        user_id: patternData.userId,
        category: patternData.category,
        request_pattern: patternData.requestPattern,
        response_quality: patternData.responseQuality,
        user_satisfaction: patternData.userSatisfaction,
        context: patternData.context,
        timestamp: new Date().toISOString()
      };

      // Ищем похожие паттерны для улучшения
      similarPattern = existingPatterns.find(pattern => 
        this.calculatePatternSimilarity(pattern.pattern, patternData.requestPattern) > 0.7
      );

      if (similarPattern) {
        // Обновляем существующий паттерн
        await db.updateLearningPattern(similarPattern.id, {
          successCount: similarPattern.successCount + 1,
          averageQuality: (similarPattern.averageQuality + patternData.responseQuality) / 2,
          lastUsed: analysis.timestamp,
          confidence: Math.min(similarPattern.confidence + 0.05, 1.0)
        });
      } else {
        // Создаем новый паттерн
        newPattern = {
          userId: patternData.userId,
          category: patternData.category,
          pattern: patternData.requestPattern,
          averageQuality: patternData.responseQuality,
          successCount: 1,
          confidence: 0.6,
          created: analysis.timestamp,
          lastUsed: analysis.timestamp,
          context: patternData.context
        };

        await db.createLearningPattern(newPattern);
      }

      return analysis;

    } catch (error) {
      SmartLogger.learning(`Ошибка записи паттерна взаимодействия: ${error.message}`);
      return null;
    }
  }

  // Вспомогательные методы
  
  findRelevantPatterns(currentRequest, patterns) {
    return patterns.filter(pattern => {
      const similarity = this.calculatePatternSimilarity(pattern.pattern, currentRequest);
      return similarity > 0.6;
    });
  }

  calculatePatternSimilarity(pattern1, pattern2) {
    const words1 = pattern1.toLowerCase().split(' ');
    const words2 = pattern2.toLowerCase().split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  }

  generateFewShotRecommendations(patterns, currentRequest) {
    recommendations = [];
    
    patterns.forEach(pattern => {
      if (pattern.confidence > 0.7) {
        recommendations.push({
          type: 'learned_pattern',
          message: `На основе успешного опыта: ${pattern.response_strategy}`,
          confidence: pattern.confidence,
          source_pattern: pattern.id
        });
      }
    });
    
    return recommendations;
  }

  calculateRecommendationConfidence(patterns) {
    if (patterns.length === 0) return 0;
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    return Math.min(avgConfidence * 1.2, 1.0); // Бонус за множественные паттерны
  }

  findSimilarPattern(interaction, existingPatterns) {
    return existingPatterns.find(pattern => 
      this.calculatePatternSimilarity(pattern.pattern, interaction.requestPattern) > 0.8
    );
  }

  updateLocalPatterns(interactionData) {
    const key = `${interactionData.userId}_${interactionData.category}`;
    if (!this.learningPatterns.has(key)) {
      this.learningPatterns.set(key, []);
    }
    this.learningPatterns.get(key).push(interactionData);
  }

  setupLearningStrategies() {
    // Инициализация стратегий обучения
    SmartLogger.learning('Настройка стратегий контекстного обучения');
  }

  initializeAdaptationStrategies() {
    return {
      style_adaptation: true,
      context_enhancement: true,
      phrase_learning: true,
      preference_tracking: true
    };
  }

  analyzeResponseStylePreferences(recentMessages) {
    // Простой анализ стиля предпочтений
    return {
      formality: 'medium',
      detail_level: 'high',
      technical_depth: 'medium'
    };
  }

  adaptResponseStyle(response, preferences) {
    // Базовая адаптация стиля
    return response;
  }

  addProjectContext(response, projects, context) {
    // Добавление контекста проектов
    return response;
  }

  applyLearnedPhrases(response, userId, category) {
    // Применение обученных фраз
    return response;
  }

  /**
   * Продвинутая аналитика взаимодействий (Фаза 2)
   */
  analyzeInteractionSuccess(userQuery, aiResponse, userFeedback = null) {
    analysis = {
      query: userQuery,
      response: aiResponse,
      feedback: userFeedback,
      timestamp: Date.now(),
      metrics: {},
      interactionFlow: this.analyzeInteractionFlow(userQuery, aiResponse),
      userSatisfaction: this.calculateUserSatisfaction(userFeedback),
      responseQuality: this.assessResponseQuality(aiResponse),
      contextRelevance: this.measureContextRelevance(userQuery, aiResponse),
      taskCompletion: this.evaluateTaskCompletion(userQuery, aiResponse)
    };
    
    return analysis;
  }

  analyzeInteractionFlow(userQuery, aiResponse) {
    return { flow: 'standard', complexity: 'medium' };
  }

  calculateUserSatisfaction(feedback) {
    return feedback ? 0.8 : 0.6;
  }

  assessResponseQuality(response) {
    return response.length > 50 ? 0.8 : 0.6;
  }

  measureContextRelevance(query, response) {
    return 0.7;
  }

  evaluateTaskCompletion(query, response) {
    return 0.8;
  }
}

const learningSystemInstance = new LearningSystem();

module.exports = {
  // Экспортируем все методы экземпляра
  getLearnedRecommendations: learningSystemInstance.getLearnedRecommendations.bind(learningSystemInstance),
  learnFromInteraction: learningSystemInstance.learnFromInteraction.bind(learningSystemInstance),
  adaptResponseToUser: learningSystemInstance.adaptResponseToUser.bind(learningSystemInstance),
  recordInteractionPattern: learningSystemInstance.recordInteractionPattern.bind(learningSystemInstance),
  analyzeInteractionSuccess: learningSystemInstance.analyzeInteractionSuccess.bind(learningSystemInstance),
  
  // Добавляем недостающий метод adaptPromptWithLearning
  adaptPromptWithLearning: async function(prompt, userId, context) {
    try {
      recommendations = await learningSystemInstance.getLearnedRecommendations(userId, prompt, context.category || 'general');
      
      if (recommendations && recommendations.recommendations.length > 0) {
        const learningInsights = recommendations.recommendations.map(r => r.message).join('. ');
        return `${prompt}\n\nОсновано на успешном опыте: ${learningInsights}`;
      }
      
      return prompt;
    } catch (error) {
      console.error('Ошибка адаптации промпта с обучением:', error);
      return prompt;
    }
  },

  // Также экспортируем сам экземпляр для обратной совместимости
  instance: learningSystemInstance,

  // Экспортируем класс
  LearningSystem: LearningSystem
};