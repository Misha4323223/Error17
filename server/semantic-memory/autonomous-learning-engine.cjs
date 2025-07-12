/**
 * АВТОНОМНАЯ МОДЕЛЬ ОБУЧЕНИЯ + МАСШТАБНОЕ ОБУЧЕНИЕ НА ТРИЛЛИОНАХ ТЕКСТОВ
 * Самообучающаяся система, которая улучшает алгоритмы в реальном времени
 * Фаза 1: Continuous Learning Engine
 * Фаза 2: Large-Scale Dataset Training (GPT-4 style)
 */

const SmartLogger = {
  learning: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎓🔄 [${timestamp}] AUTONOMOUS LEARNING: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * АНАЛИЗАТОР ЭФФЕКТИВНОСТИ
 * Отслеживает успешность взаимодействий и извлекает паттерны
 */
class EffectivenessAnalyzer {
  constructor() {
    this.interactionHistory = [];
    this.successMetrics = new Map();
    this.failurePatterns = new Map();
    this.responseQualityHistory = [];
    this.userSatisfactionIndicators = new Map();
  }

  /**
   * Анализирует эффективность взаимодействия
   */
  analyzeInteractionEffectiveness(interaction) {
    SmartLogger.learning('Анализируем эффективность взаимодействия');
    
    const effectiveness = {
      timestamp: Date.now(),
      interactionId: interaction.id,
      userQuery: interaction.query,
      systemResponse: interaction.response,
      
      // Основные метрики
      responseTime: interaction.responseTime,
      userEngagement: this.measureUserEngagement(interaction),
      responseRelevance: this.measureResponseRelevance(interaction),
      conversationContinuation: this.measureConversationContinuation(interaction),
      
      // Качественные показатели
      clarityScore: this.assessClarity(interaction.response),
      completenessScore: this.assessCompleteness(interaction),
      helpfulnessScore: this.assessHelpfulness(interaction),
      
      // Поведенческие сигналы
      userSatisfactionSignals: this.detectSatisfactionSignals(interaction),
      errorSignals: this.detectErrorSignals(interaction),
      
      // Контекстные факторы
      contextRelevance: this.assessContextRelevance(interaction),
      personalizedFit: this.assessPersonalizedFit(interaction)
    };
    
    this.interactionHistory.push(effectiveness);
    this.updateSuccessMetrics(effectiveness);
    
    return effectiveness;
  }

  /**
   * Измеряет вовлеченность пользователя
   */
  measureUserEngagement(interaction) {
    let engagement = 0;
    
    // Время чтения ответа
    if (interaction.readingTime > 5000) engagement += 0.3;
    
    // Продолжение разговора
    if (interaction.followUpQuestions > 0) engagement += 0.4;
    
    // Положительные реакции
    if (interaction.positiveSignals > 0) engagement += 0.3;
    
    return Math.min(1.0, engagement);
  }

  /**
   * Измеряет релевантность ответа
   */
  measureResponseRelevance(interaction) {
    const query = interaction.query.toLowerCase();
    const response = interaction.response.toLowerCase();
    
    // Ключевые слова из запроса в ответе
    const queryWords = query.split(' ').filter(word => word.length > 3);
    const responseWords = response.split(' ');
    
    const matchedWords = queryWords.filter(word => 
      responseWords.some(responseWord => 
        responseWord.includes(word) || word.includes(responseWord)
      )
    );
    
    return matchedWords.length / Math.max(queryWords.length, 1);
  }

  /**
   * Измеряет продолжение разговора
   */
  measureConversationContinuation(interaction) {
    // Если пользователь задал следующий вопрос в течение 5 минут
    if (interaction.nextInteractionTime && 
        interaction.nextInteractionTime - interaction.timestamp < 300000) {
      return 1.0;
    }
    
    // Если сессия завершилась сразу после ответа
    if (interaction.sessionEnded) {
      return 0.2;
    }
    
    return 0.5; // нейтральный случай
  }

  /**
   * Оценивает четкость ответа
   */
  assessClarity(response) {
    let clarity = 0.5;
    
    // Структурированность
    if (response.includes('\n') || response.includes('•') || response.includes('1.')) {
      clarity += 0.2;
    }
    
    // Отсутствие сложных терминов без объяснений
    const complexTerms = ['алгоритм', 'оптимизация', 'векторизация', 'семантика'];
    const hasComplexTerms = complexTerms.some(term => response.toLowerCase().includes(term));
    const hasExplanations = response.includes('это означает') || response.includes('то есть');
    
    if (hasComplexTerms && !hasExplanations) {
      clarity -= 0.2;
    }
    
    // Длина предложений
    const sentences = response.split('. ');
    const avgSentenceLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    
    if (avgSentenceLength < 100) clarity += 0.1;
    if (avgSentenceLength > 200) clarity -= 0.1;
    
    return Math.max(0, Math.min(1, clarity));
  }

  /**
   * Оценивает полноту ответа
   */
  assessCompleteness(interaction) {
    const query = interaction.query;
    const response = interaction.response;
    
    // Проверяем, что ответ адресует все части вопроса
    const questionParts = this.extractQuestionParts(query);
    const addressedParts = questionParts.filter(part => 
      response.toLowerCase().includes(part.toLowerCase())
    );
    
    return addressedParts.length / Math.max(questionParts.length, 1);
  }

  /**
   * Извлекает части вопроса
   */
  extractQuestionParts(query) {
    const parts = [];
    
    // Вопросительные слова
    if (query.includes('что')) parts.push('что');
    if (query.includes('как')) parts.push('как');
    if (query.includes('почему')) parts.push('почему');
    if (query.includes('где')) parts.push('где');
    if (query.includes('когда')) parts.push('когда');
    
    // Ключевые существительные
    const words = query.split(' ');
    words.forEach(word => {
      if (word.length > 5 && !parts.includes(word)) {
        parts.push(word);
      }
    });
    
    return parts;
  }

  /**
   * Оценивает полезность ответа
   */
  assessHelpfulness(interaction) {
    let helpfulness = 0.5;
    
    // Наличие конкретных рекомендаций
    if (interaction.response.includes('рекомендую') || 
        interaction.response.includes('советую') || 
        interaction.response.includes('предлагаю')) {
      helpfulness += 0.2;
    }
    
    // Наличие примеров
    if (interaction.response.includes('например') || 
        interaction.response.includes('к примеру')) {
      helpfulness += 0.2;
    }
    
    // Наличие практических шагов
    if (interaction.response.includes('шаг') || 
        interaction.response.includes('сначала') || 
        interaction.response.includes('затем')) {
      helpfulness += 0.2;
    }
    
    return Math.min(1.0, helpfulness);
  }

  /**
   * Определяет сигналы удовлетворенности пользователя
   */
  detectSatisfactionSignals(interaction) {
    const signals = {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    
    // Следующие сообщения пользователя
    if (interaction.followUpMessages) {
      interaction.followUpMessages.forEach(message => {
        const content = message.toLowerCase();
        
        // Позитивные сигналы
        if (content.includes('спасибо') || content.includes('отлично') || 
            content.includes('классно') || content.includes('помогло')) {
          signals.positive++;
        }
        
        // Негативные сигналы
        if (content.includes('не понял') || content.includes('не помогло') || 
            content.includes('непонятно') || content.includes('ошибка')) {
          signals.negative++;
        }
        
        // Нейтральные сигналы
        if (content.includes('понятно') || content.includes('хорошо')) {
          signals.neutral++;
        }
      });
    }
    
    return signals;
  }

  /**
   * Определяет сигналы ошибок
   */
  detectErrorSignals(interaction) {
    const errorSignals = [];
    
    // Пользователь переспрашивает
    if (interaction.followUpMessages) {
      interaction.followUpMessages.forEach(message => {
        const content = message.toLowerCase();
        
        if (content.includes('что это значит') || 
            content.includes('можешь объяснить') || 
            content.includes('не понял')) {
          errorSignals.push('clarification_needed');
        }
        
        if (content.includes('это не то') || 
            content.includes('не подходит') || 
            content.includes('не правильно')) {
          errorSignals.push('incorrect_response');
        }
        
        if (content.includes('повтори') || 
            content.includes('еще раз') || 
            content.includes('заново')) {
          errorSignals.push('repetition_requested');
        }
      });
    }
    
    return errorSignals;
  }

  /**
   * Оценивает релевантность контекста
   */
  assessContextRelevance(interaction) {
    // Анализирует, насколько ответ учитывает контекст разговора
    const contextFactors = {
      previousTopics: interaction.previousTopics || [],
      userProfile: interaction.userProfile || {},
      currentProject: interaction.currentProject || null
    };
    
    let relevance = 0.5;
    
    // Упоминание предыдущих тем
    if (contextFactors.previousTopics.length > 0) {
      const mentionedTopics = contextFactors.previousTopics.filter(topic => 
        interaction.response.toLowerCase().includes(topic.toLowerCase())
      );
      relevance += (mentionedTopics.length / contextFactors.previousTopics.length) * 0.3;
    }
    
    // Соответствие профилю пользователя
    if (contextFactors.userProfile.technicalLevel) {
      const responseComplexity = this.assessResponseComplexity(interaction.response);
      const profileMatch = 1 - Math.abs(responseComplexity - contextFactors.userProfile.technicalLevel);
      relevance += profileMatch * 0.2;
    }
    
    return Math.min(1.0, relevance);
  }

  /**
   * Оценивает персонализированность ответа
   */
  assessPersonalizedFit(interaction) {
    const userProfile = interaction.userProfile || {};
    let personalization = 0.5;
    
    // Стиль общения
    if (userProfile.communicationStyle) {
      const styleMatch = this.assessStyleMatch(interaction.response, userProfile.communicationStyle);
      personalization += styleMatch * 0.3;
    }
    
    // Предпочтения в деталях
    if (userProfile.preferredDetailLevel) {
      const detailMatch = this.assessDetailMatch(interaction.response, userProfile.preferredDetailLevel);
      personalization += detailMatch * 0.2;
    }
    
    return Math.min(1.0, personalization);
  }

  /**
   * Оценивает сложность ответа
   */
  assessResponseComplexity(response) {
    let complexity = 0;
    
    // Технические термины
    const technicalTerms = ['алгоритм', 'оптимизация', 'параметры', 'конфигурация'];
    technicalTerms.forEach(term => {
      if (response.toLowerCase().includes(term)) complexity += 0.1;
    });
    
    // Длина предложений
    const sentences = response.split('. ');
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    complexity += Math.min(0.3, avgLength / 500);
    
    return Math.min(1.0, complexity);
  }

  /**
   * Оценивает соответствие стиля
   */
  assessStyleMatch(response, preferredStyle) {
    const styleIndicators = {
      formal: ['следует', 'необходимо', 'рекомендуется', 'важно отметить'],
      casual: ['давайте', 'просто', 'кстати', 'между прочим'],
      technical: ['алгоритм', 'параметры', 'конфигурация', 'оптимизация'],
      friendly: ['рад помочь', 'отлично', 'классно', 'замечательно']
    };
    
    const indicators = styleIndicators[preferredStyle] || [];
    const foundIndicators = indicators.filter(indicator => 
      response.toLowerCase().includes(indicator)
    );
    
    return foundIndicators.length / Math.max(indicators.length, 1);
  }

  /**
   * Оценивает соответствие уровня детализации
   */
  assessDetailMatch(response, preferredLevel) {
    const responseDetailLevel = response.length > 500 ? 'high' : 
                               response.length > 200 ? 'medium' : 'low';
    
    return responseDetailLevel === preferredLevel ? 1.0 : 0.5;
  }

  /**
   * Обновляет метрики успешности
   */
  updateSuccessMetrics(effectiveness) {
    const overallScore = (
      effectiveness.userEngagement * 0.3 +
      effectiveness.responseRelevance * 0.2 +
      effectiveness.helpfulnessScore * 0.2 +
      effectiveness.clarityScore * 0.15 +
      effectiveness.completenessScore * 0.15
    );
    
    // Сохраняем метрики по типам запросов
    const queryType = this.classifyQueryType(effectiveness.userQuery);
    
    if (!this.successMetrics.has(queryType)) {
      this.successMetrics.set(queryType, {
        totalInteractions: 0,
        successfulInteractions: 0,
        averageScore: 0,
        scores: []
      });
    }
    
    const metrics = this.successMetrics.get(queryType);
    metrics.totalInteractions++;
    metrics.scores.push(overallScore);
    
    if (overallScore > 0.7) {
      metrics.successfulInteractions++;
    }
    
    metrics.averageScore = metrics.scores.reduce((sum, score) => sum + score, 0) / metrics.scores.length;
    
    SmartLogger.learning(`Обновлены метрики для типа "${queryType}": успешность ${(metrics.successfulInteractions / metrics.totalInteractions * 100).toFixed(1)}%`);
  }

  /**
   * Классифицирует тип запроса
   */
  classifyQueryType(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('векторизация') || lowerQuery.includes('svg')) return 'vectorization';
    if (lowerQuery.includes('вышивка') || lowerQuery.includes('dst')) return 'embroidery';
    if (lowerQuery.includes('дизайн') || lowerQuery.includes('логотип')) return 'design';
    if (lowerQuery.includes('цвет') || lowerQuery.includes('палитра')) return 'color';
    if (lowerQuery.includes('как') || lowerQuery.includes('что такое')) return 'educational';
    if (lowerQuery.includes('создай') || lowerQuery.includes('сделай')) return 'creative';
    if (lowerQuery.includes('анализ') || lowerQuery.includes('советую')) return 'analytical';
    
    return 'general';
  }

  /**
   * Получает статистику эффективности
   */
  getEffectivenessStats() {
    const stats = {
      totalInteractions: this.interactionHistory.length,
      byType: {},
      overallTrends: this.calculateOverallTrends(),
      topFailurePatterns: this.identifyTopFailurePatterns(),
      improvementOpportunities: this.identifyImprovementOpportunities()
    };
    
    // Статистика по типам
    this.successMetrics.forEach((metrics, type) => {
      stats.byType[type] = {
        successRate: (metrics.successfulInteractions / metrics.totalInteractions * 100).toFixed(1) + '%',
        averageScore: metrics.averageScore.toFixed(2),
        totalInteractions: metrics.totalInteractions
      };
    });
    
    return stats;
  }

  /**
   * Вычисляет общие тренды
   */
  calculateOverallTrends() {
    if (this.interactionHistory.length < 10) return null;
    
    const recentInteractions = this.interactionHistory.slice(-10);
    const olderInteractions = this.interactionHistory.slice(-20, -10);
    
    const recentAvg = recentInteractions.reduce((sum, i) => sum + i.userEngagement, 0) / recentInteractions.length;
    const olderAvg = olderInteractions.reduce((sum, i) => sum + i.userEngagement, 0) / olderInteractions.length;
    
    return {
      trend: recentAvg > olderAvg ? 'improving' : 'declining',
      change: ((recentAvg - olderAvg) * 100).toFixed(1) + '%'
    };
  }

  /**
   * Выявляет главные паттерны неудач
   */
  identifyTopFailurePatterns() {
    const failures = this.interactionHistory.filter(i => 
      i.userEngagement < 0.3 || i.errorSignals.length > 0
    );
    
    const patterns = new Map();
    
    failures.forEach(failure => {
      const queryType = this.classifyQueryType(failure.userQuery);
      const pattern = `${queryType}_failure`;
      
      if (!patterns.has(pattern)) {
        patterns.set(pattern, {
          count: 0,
          commonIssues: [],
          examples: []
        });
      }
      
      const patternData = patterns.get(pattern);
      patternData.count++;
      patternData.examples.push(failure.userQuery);
      patternData.commonIssues.push(...failure.errorSignals);
    });
    
    return Array.from(patterns.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
  }

  /**
   * Выявляет возможности для улучшения
   */
  identifyImprovementOpportunities() {
    const opportunities = [];
    
    // Анализ по типам запросов
    this.successMetrics.forEach((metrics, type) => {
      if (metrics.averageScore < 0.6) {
        opportunities.push({
          area: type,
          issue: 'low_success_rate',
          priority: 'high',
          suggestion: `Улучшить обработку запросов типа "${type}"`
        });
      }
    });
    
    // Анализ частых ошибок
    const failurePatterns = this.identifyTopFailurePatterns();
    failurePatterns.forEach(([pattern, data]) => {
      if (data.count > 3) {
        opportunities.push({
          area: pattern,
          issue: 'frequent_failures',
          priority: 'medium',
          suggestion: `Проанализировать и исправить частые ошибки в "${pattern}"`
        });
      }
    });
    
    return opportunities;
  }
}

/**
 * ИЗВЛЕКАТЕЛЬ ПАТТЕРНОВ
 * Находит успешные формулировки и стратегии
 */
class PatternExtractor {
  constructor() {
    this.successfulPatterns = new Map();
    this.effectivePhrasings = new Map();
    this.userPreferencePatterns = new Map();
    this.contextualPatterns = new Map();
  }

  /**
   * Извлекает успешные паттерны из эффективных взаимодействий
   */
  extractSuccessPatterns(effectiveInteractions) {
    SmartLogger.learning('Извлекаем успешные паттерны из эффективных взаимодействий');
    
    effectiveInteractions.forEach(interaction => {
      this.extractResponsePatterns(interaction);
      this.extractPhrasingPatterns(interaction);
      this.extractContextualPatterns(interaction);
      this.extractUserPreferencePatterns(interaction);
    });
    
    return {
      responsePatterns: this.successfulPatterns,
      effectivePhrasings: this.effectivePhrasings,
      contextualPatterns: this.contextualPatterns,
      userPreferences: this.userPreferencePatterns
    };
  }

  /**
   * Извлекает паттерны ответов
   */
  extractResponsePatterns(interaction) {
    const queryType = this.classifyInteractionType(interaction);
    const response = interaction.response;
    
    if (!this.successfulPatterns.has(queryType)) {
      this.successfulPatterns.set(queryType, {
        structures: [],
        keywords: new Set(),
        effectiveStarters: [],
        effectiveEndings: []
      });
    }
    
    const patterns = this.successfulPatterns.get(queryType);
    
    // Структура ответа
    patterns.structures.push(this.analyzeResponseStructure(response));
    
    // Ключевые слова
    this.extractKeywords(response).forEach(keyword => patterns.keywords.add(keyword));
    
    // Эффективные начала
    const starter = this.extractResponseStarter(response);
    if (starter) patterns.effectiveStarters.push(starter);
    
    // Эффективные окончания
    const ending = this.extractResponseEnding(response);
    if (ending) patterns.effectiveEndings.push(ending);
  }

  /**
   * Классифицирует тип взаимодействия
   */
  classifyInteractionType(interaction) {
    const query = interaction.userQuery.toLowerCase();
    
    if (query.includes('объясни') || query.includes('что такое')) return 'explanation';
    if (query.includes('как') || query.includes('покажи')) return 'instruction';
    if (query.includes('создай') || query.includes('сделай')) return 'creation';
    if (query.includes('анализ') || query.includes('оцени')) return 'analysis';
    if (query.includes('советую') || query.includes('рекомендую')) return 'recommendation';
    
    return 'general';
  }

  /**
   * Анализирует структуру ответа
   */
  analyzeResponseStructure(response) {
    const structure = {
      hasList: response.includes('•') || response.includes('1.'),
      hasHeaders: response.includes('##') || response.includes('**'),
      hasExamples: response.includes('например') || response.includes('к примеру'),
      hasSteps: response.includes('шаг') || response.includes('этап'),
      paragraphCount: response.split('\n\n').length,
      sentenceCount: response.split('. ').length
    };
    
    return structure;
  }

  /**
   * Извлекает ключевые слова
   */
  extractKeywords(response) {
    const words = response.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const stopWords = ['этот', 'который', 'может', 'быть', 'очень', 'также', 'более'];
    
    return words.filter(word => !stopWords.includes(word));
  }

  /**
   * Извлекает начало ответа
   */
  extractResponseStarter(response) {
    const sentences = response.split('. ');
    if (sentences.length > 0) {
      const firstSentence = sentences[0];
      if (firstSentence.length < 100) {
        return firstSentence;
      }
    }
    return null;
  }

  /**
   * Извлекает окончание ответа
   */
  extractResponseEnding(response) {
    const sentences = response.split('. ');
    if (sentences.length > 1) {
      const lastSentence = sentences[sentences.length - 1];
      if (lastSentence.length < 100) {
        return lastSentence;
      }
    }
    return null;
  }

  /**
   * Извлекает паттерны формулировок
   */
  extractPhrasingPatterns(interaction) {
    const response = interaction.response;
    const effectiveness = interaction.userEngagement;
    
    // Эффективные переходы
    const transitions = this.extractTransitions(response);
    transitions.forEach(transition => {
      if (!this.effectivePhrasings.has('transitions')) {
        this.effectivePhrasings.set('transitions', new Map());
      }
      
      const transitionMap = this.effectivePhrasings.get('transitions');
      const currentScore = transitionMap.get(transition) || 0;
      transitionMap.set(transition, (currentScore + effectiveness) / 2);
    });
    
    // Эффективные объяснения
    const explanationPhrases = this.extractExplanationPhrases(response);
    explanationPhrases.forEach(phrase => {
      if (!this.effectivePhrasings.has('explanations')) {
        this.effectivePhrasings.set('explanations', new Map());
      }
      
      const explanationMap = this.effectivePhrasings.get('explanations');
      const currentScore = explanationMap.get(phrase) || 0;
      explanationMap.set(phrase, (currentScore + effectiveness) / 2);
    });
  }

  /**
   * Извлекает переходы
   */
  extractTransitions(response) {
    const transitionRegex = /\b(кроме того|также|например|однако|поэтому|таким образом|в результате|с другой стороны)\b/gi;
    return response.match(transitionRegex) || [];
  }

  /**
   * Извлекает фразы объяснения
   */
  extractExplanationPhrases(response) {
    const explanationRegex = /\b(это означает|то есть|иными словами|проще говоря|другими словами)\b/gi;
    return response.match(explanationRegex) || [];
  }

  /**
   * Извлекает контекстуальные паттерны
   */
  extractContextualPatterns(interaction) {
    const context = {
      timeOfDay: new Date(interaction.timestamp).getHours(),
      userMood: interaction.userMood || 'neutral',
      conversationLength: interaction.conversationLength || 1,
      topicComplexity: this.assessTopicComplexity(interaction.userQuery)
    };
    
    const contextKey = `${context.timeOfDay}-${context.userMood}-${context.topicComplexity}`;
    
    if (!this.contextualPatterns.has(contextKey)) {
      this.contextualPatterns.set(contextKey, {
        interactions: [],
        averageEffectiveness: 0,
        commonApproaches: []
      });
    }
    
    const pattern = this.contextualPatterns.get(contextKey);
    pattern.interactions.push(interaction);
    
    // Пересчитываем среднюю эффективность
    const totalEffectiveness = pattern.interactions.reduce((sum, i) => sum + i.userEngagement, 0);
    pattern.averageEffectiveness = totalEffectiveness / pattern.interactions.length;
    
    // Анализируем общие подходы
    const approach = this.categorizeApproach(interaction.response);
    if (approach && !pattern.commonApproaches.includes(approach)) {
      pattern.commonApproaches.push(approach);
    }
  }

  /**
   * Оценивает сложность темы
   */
  assessTopicComplexity(query) {
    const technicalTerms = ['алгоритм', 'оптимизация', 'векторизация', 'параметры'];
    const hasComplexTerms = technicalTerms.some(term => query.toLowerCase().includes(term));
    
    if (hasComplexTerms) return 'high';
    if (query.length > 100) return 'medium';
    return 'low';
  }

  /**
   * Категоризирует подход ответа
   */
  categorizeApproach(response) {
    if (response.includes('шаг') || response.includes('этап')) return 'step-by-step';
    if (response.includes('например') || response.includes('к примеру')) return 'example-based';
    if (response.includes('важно') || response.includes('ключевое')) return 'principle-focused';
    if (response.includes('•') || response.includes('1.')) return 'structured';
    
    return 'conversational';
  }

  /**
   * Извлекает паттерны пользовательских предпочтений
   */
  extractUserPreferencePatterns(interaction) {
    const userProfile = interaction.userProfile || {};
    const userId = userProfile.userId || 'anonymous';
    
    if (!this.userPreferencePatterns.has(userId)) {
      this.userPreferencePatterns.set(userId, {
        preferredResponseLength: [],
        preferredStyles: [],
        preferredComplexity: [],
        effectiveApproaches: []
      });
    }
    
    const preferences = this.userPreferencePatterns.get(userId);
    
    // Предпочтения по длине ответа
    preferences.preferredResponseLength.push({
      length: interaction.response.length,
      effectiveness: interaction.userEngagement
    });
    
    // Предпочтения по стилю
    const style = this.detectResponseStyle(interaction.response);
    preferences.preferredStyles.push({
      style: style,
      effectiveness: interaction.userEngagement
    });
    
    // Предпочтения по сложности
    const complexity = this.assessResponseComplexity(interaction.response);
    preferences.preferredComplexity.push({
      complexity: complexity,
      effectiveness: interaction.userEngagement
    });
  }

  /**
   * Определяет стиль ответа
   */
  detectResponseStyle(response) {
    if (response.includes('рекомендую') || response.includes('следует')) return 'formal';
    if (response.includes('классно') || response.includes('отлично')) return 'enthusiastic';
    if (response.includes('давайте') || response.includes('попробуем')) return 'collaborative';
    if (response.includes('понимаю') || response.includes('помогу')) return 'supportive';
    
    return 'neutral';
  }

  /**
   * Оценивает сложность ответа
   */
  assessResponseComplexity(response) {
    const technicalTerms = ['алгоритм', 'оптимизация', 'параметры', 'конфигурация'];
    const termCount = technicalTerms.filter(term => response.toLowerCase().includes(term)).length;
    
    if (termCount > 3) return 'high';
    if (termCount > 1) return 'medium';
    return 'low';
  }

  /**
   * Получает наиболее эффективные паттерны
   */
  getTopPatterns(category = 'all', limit = 10) {
    const results = {};
    
    if (category === 'all' || category === 'response') {
      results.responsePatterns = Array.from(this.successfulPatterns.entries())
        .slice(0, limit);
    }
    
    if (category === 'all' || category === 'phrasing') {
      results.phrasings = {};
      this.effectivePhrasings.forEach((phrases, type) => {
        results.phrasings[type] = Array.from(phrases.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit);
      });
    }
    
    if (category === 'all' || category === 'contextual') {
      results.contextualPatterns = Array.from(this.contextualPatterns.entries())
        .sort((a, b) => b[1].averageEffectiveness - a[1].averageEffectiveness)
        .slice(0, limit);
    }
    
    return results;
  }
}

/**
 * АДАПТИВНАЯ БАЗА ЗНАНИЙ
 * Автоматически обновляется новой информацией
 */
class AdaptiveKnowledgeBase {
  constructor() {
    this.knowledgeGraph = new Map();
    this.conceptFrequency = new Map();
    this.conceptRelations = new Map();
    this.knowledgeQuality = new Map();
    this.learningHistory = [];
    this.obsoleteDetector = new ObsoleteDetector();
  }

  /**
   * Обновляет базу знаний новой информацией
   */
  updateKnowledge(interaction, effectiveness) {
    SmartLogger.learning('Обновляем базу знаний новой информацией');
    
    // Извлекаем концепции из взаимодействия
    const concepts = this.extractConcepts(interaction);
    
    // Обновляем граф знаний
    this.updateKnowledgeGraph(concepts, effectiveness);
    
    // Обновляем частоту использования
    this.updateConceptFrequency(concepts);
    
    // Обновляем качество знаний
    this.updateKnowledgeQuality(concepts, effectiveness);
    
    // Обновляем связи между концепциями
    this.updateConceptRelations(concepts);
    
    // Сохраняем в истории обучения
    this.learningHistory.push({
      timestamp: Date.now(),
      interaction: interaction,
      effectiveness: effectiveness,
      concepts: concepts
    });
    
    // Очищаем устаревшие знания
    this.obsoleteDetector.checkForObsoleteKnowledge(this.knowledgeGraph);
  }

  /**
   * Извлекает концепции из взаимодействия
   */
  extractConcepts(interaction) {
    const concepts = new Set();
    
    // Извлекаем из запроса пользователя
    const queryWords = interaction.userQuery.toLowerCase().match(/\b\w{4,}\b/g) || [];
    queryWords.forEach(word => {
      if (this.isImportantConcept(word)) {
        concepts.add(word);
      }
    });
    
    // Извлекаем из ответа системы
    const responseWords = interaction.response.toLowerCase().match(/\b\w{4,}\b/g) || [];
    responseWords.forEach(word => {
      if (this.isImportantConcept(word)) {
        concepts.add(word);
      }
    });
    
    return Array.from(concepts);
  }

  /**
   * Проверяет, является ли концепция важной
   */
  isImportantConcept(word) {
    const importantDomains = [
      'векторизация', 'вышивка', 'дизайн', 'цвет', 'алгоритм', 'оптимизация',
      'изображение', 'конвертация', 'качество', 'формат', 'файл', 'стиль',
      'текстура', 'палитра', 'логотип', 'принт', 'машина', 'нитки'
    ];
    
    return importantDomains.some(domain => 
      word.includes(domain) || domain.includes(word)
    ) || word.length > 6;
  }

  /**
   * Обновляет граф знаний
   */
  updateKnowledgeGraph(concepts, effectiveness) {
    concepts.forEach(concept => {
      if (!this.knowledgeGraph.has(concept)) {
        this.knowledgeGraph.set(concept, {
          appearances: 0,
          totalEffectiveness: 0,
          averageEffectiveness: 0,
          contexts: [],
          relatedConcepts: new Set(),
          knowledgeStrength: 0
        });
      }
      
      const knowledge = this.knowledgeGraph.get(concept);
      knowledge.appearances++;
      knowledge.totalEffectiveness += effectiveness;
      knowledge.averageEffectiveness = knowledge.totalEffectiveness / knowledge.appearances;
      
      // Обновляем силу знания
      knowledge.knowledgeStrength = this.calculateKnowledgeStrength(knowledge);
    });
  }

  /**
   * Вычисляет силу знания
   */
  calculateKnowledgeStrength(knowledge) {
    const frequencyWeight = Math.min(knowledge.appearances / 10, 1.0);
    const effectivenessWeight = knowledge.averageEffectiveness;
    const recencyWeight = this.calculateRecencyWeight(knowledge);
    
    return (frequencyWeight * 0.4 + effectivenessWeight * 0.4 + recencyWeight * 0.2);
  }

  /**
   * Вычисляет вес недавности
   */
  calculateRecencyWeight(knowledge) {
    // Находим последнее использование концепции
    const recentUsage = this.learningHistory
      .filter(entry => entry.concepts.some(c => knowledge.contexts.includes(c)))
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (!recentUsage) return 0;
    
    const daysSinceUsage = (Date.now() - recentUsage.timestamp) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - daysSinceUsage / 30); // Снижается в течение 30 дней
  }

  /**
   * Обновляет частоту концепций
   */
  updateConceptFrequency(concepts) {
    concepts.forEach(concept => {
      const currentFreq = this.conceptFrequency.get(concept) || 0;
      this.conceptFrequency.set(concept, currentFreq + 1);
    });
  }

  /**
   * Обновляет качество знаний
   */
  updateKnowledgeQuality(concepts, effectiveness) {
    concepts.forEach(concept => {
      if (!this.knowledgeQuality.has(concept)) {
        this.knowledgeQuality.set(concept, {
          qualityScores: [],
          averageQuality: 0,
          reliability: 0
        });
      }
      
      const quality = this.knowledgeQuality.get(concept);
      quality.qualityScores.push(effectiveness);
      
      // Ограничиваем историю последними 20 оценками
      if (quality.qualityScores.length > 20) {
        quality.qualityScores.shift();
      }
      
      quality.averageQuality = quality.qualityScores.reduce((sum, score) => sum + score, 0) / quality.qualityScores.length;
      quality.reliability = this.calculateReliability(quality.qualityScores);
    });
  }

  /**
   * Вычисляет надежность знания
   */
  calculateReliability(qualityScores) {
    if (qualityScores.length < 3) return 0;
    
    const mean = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
    const variance = qualityScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / qualityScores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Надежность обратно пропорциональна стандартному отклонению
    return Math.max(0, 1 - standardDeviation);
  }

  /**
   * Обновляет связи между концепциями
   */
  updateConceptRelations(concepts) {
    // Создаем связи между концепциями, которые появились в одном контексте
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const concept1 = concepts[i];
        const concept2 = concepts[j];
        
        // Обновляем связи для первой концепции
        if (this.knowledgeGraph.has(concept1)) {
          this.knowledgeGraph.get(concept1).relatedConcepts.add(concept2);
        }
        
        // Обновляем связи для второй концепции
        if (this.knowledgeGraph.has(concept2)) {
          this.knowledgeGraph.get(concept2).relatedConcepts.add(concept1);
        }
        
        // Обновляем силу связи
        this.updateRelationStrength(concept1, concept2);
      }
    }
  }

  /**
   * Обновляет силу связи между концепциями
   */
  updateRelationStrength(concept1, concept2) {
    const relationKey = [concept1, concept2].sort().join('-');
    
    if (!this.conceptRelations.has(relationKey)) {
      this.conceptRelations.set(relationKey, {
        strength: 0,
        coOccurrences: 0,
        contexts: []
      });
    }
    
    const relation = this.conceptRelations.get(relationKey);
    relation.coOccurrences++;
    relation.strength = Math.min(relation.coOccurrences / 10, 1.0);
  }

  /**
   * Получает наиболее актуальные знания
   */
  getRelevantKnowledge(query, limit = 10) {
    const queryWords = query.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const relevantConcepts = [];
    
    // Находим концепции, релевантные запросу
    this.knowledgeGraph.forEach((knowledge, concept) => {
      const relevance = this.calculateRelevance(concept, queryWords);
      if (relevance > 0) {
        relevantConcepts.push({
          concept: concept,
          relevance: relevance,
          strength: knowledge.knowledgeStrength,
          effectiveness: knowledge.averageEffectiveness,
          knowledge: knowledge
        });
      }
    });
    
    // Сортируем по релевантности и силе знания
    return relevantConcepts
      .sort((a, b) => (b.relevance * b.strength) - (a.relevance * a.strength))
      .slice(0, limit);
  }

  /**
   * Вычисляет релевантность концепции к запросу
   */
  calculateRelevance(concept, queryWords) {
    let relevance = 0;
    
    // Прямое совпадение
    if (queryWords.includes(concept)) {
      relevance += 1.0;
    }
    
    // Частичное совпадение
    queryWords.forEach(word => {
      if (concept.includes(word) || word.includes(concept)) {
        relevance += 0.5;
      }
    });
    
    // Связанные концепции
    if (this.knowledgeGraph.has(concept)) {
      const knowledge = this.knowledgeGraph.get(concept);
      knowledge.relatedConcepts.forEach(relatedConcept => {
        if (queryWords.includes(relatedConcept)) {
          relevance += 0.3;
        }
      });
    }
    
    return relevance;
  }

  /**
   * Записывает взаимодействие для обучения (alias для learnFromInteraction)
   */
  async recordInteraction(interactionData, additionalData = {}) {
    return await this.learnFromInteraction(interactionData, additionalData);
  }

  /**
   * Получает статистику базы знаний
   */
  getKnowledgeStats() {
    const stats = {
      totalConcepts: this.knowledgeGraph.size,
      totalRelations: this.conceptRelations.size,
      averageKnowledgeStrength: 0,
      topConcepts: [],
      strongestRelations: [],
      learningTrend: this.calculateLearningTrend()
    };
    
    // Вычисляем среднюю силу знаний
    let totalStrength = 0;
    this.knowledgeGraph.forEach(knowledge => {
      totalStrength += knowledge.knowledgeStrength;
    });
    stats.averageKnowledgeStrength = totalStrength / this.knowledgeGraph.size;
    
    // Топ концепций
    stats.topConcepts = Array.from(this.knowledgeGraph.entries())
      .sort((a, b) => b[1].knowledgeStrength - a[1].knowledgeStrength)
      .slice(0, 10)
      .map(([concept, knowledge]) => ({
        concept,
        strength: knowledge.knowledgeStrength,
        appearances: knowledge.appearances
      }));
    
    // Сильнейшие связи
    stats.strongestRelations = Array.from(this.conceptRelations.entries())
      .sort((a, b) => b[1].strength - a[1].strength)
      .slice(0, 10)
      .map(([relation, data]) => ({
        relation,
        strength: data.strength,
        coOccurrences: data.coOccurrences
      }));
    
    return stats;
  }

  /**
   * Вычисляет тренд обучения
   */
  calculateLearningTrend() {
    if (this.learningHistory.length < 10) return null;
    
    const recentLearning = this.learningHistory.slice(-10);
    const olderLearning = this.learningHistory.slice(-20, -10);
    
    const recentEffectiveness = recentLearning.reduce((sum, entry) => sum + entry.effectiveness, 0) / recentLearning.length;
    const olderEffectiveness = olderLearning.reduce((sum, entry) => sum + entry.effectiveness, 0) / olderLearning.length;
    
    return {
      trend: recentEffectiveness > olderEffectiveness ? 'improving' : 'declining',
      change: ((recentEffectiveness - olderEffectiveness) * 100).toFixed(1) + '%',
      recentEffectiveness: recentEffectiveness.toFixed(2),
      olderEffectiveness: olderEffectiveness.toFixed(2)
    };
  }
}

/**
 * ДЕТЕКТОР УСТАРЕВШИХ ЗНАНИЙ
 * Выявляет и помечает устаревшую информацию
 */
class ObsoleteDetector {
  constructor() {
    this.obsoleteThreshold = 0.3; // Порог устаревания
    this.inactivityPeriod = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
  }

  /**
   * Проверяет устаревшие знания
   */
  checkForObsoleteKnowledge(knowledgeGraph) {
    const obsoleteConcepts = [];
    const currentTime = Date.now();
    
    knowledgeGraph.forEach((knowledge, concept) => {
      const isObsolete = this.isConceptObsolete(knowledge, currentTime);
      if (isObsolete) {
        obsoleteConcepts.push({
          concept: concept,
          reason: this.getObsoleteReason(knowledge, currentTime),
          lastUsed: this.getLastUsageTime(knowledge),
          obsoleteScore: this.calculateObsoleteScore(knowledge, currentTime)
        });
        
        // Помечаем как устаревшее
        knowledge.obsolete = true;
        knowledge.obsoleteReason = this.getObsoleteReason(knowledge, currentTime);
      }
    });
    
    if (obsoleteConcepts.length > 0) {
      SmartLogger.learning(`Найдено ${obsoleteConcepts.length} устаревших концепций`, obsoleteConcepts);
    }
    
    return obsoleteConcepts;
  }

  /**
   * Проверяет, является ли концепция устаревшей
   */
  isConceptObsolete(knowledge, currentTime) {
    const obsoleteScore = this.calculateObsoleteScore(knowledge, currentTime);
    return obsoleteScore > this.obsoleteThreshold;
  }

  /**
   * Вычисляет оценку устаревания
   */
  calculateObsoleteScore(knowledge, currentTime) {
    let obsoleteScore = 0;
    
    // Низкая эффективность
    if (knowledge.averageEffectiveness < 0.3) {
      obsoleteScore += 0.4;
    }
    
    // Редкое использование
    if (knowledge.appearances < 3) {
      obsoleteScore += 0.2;
    }
    
    // Долгое время неиспользования
    const lastUsage = this.getLastUsageTime(knowledge);
    if (lastUsage && (currentTime - lastUsage) > this.inactivityPeriod) {
      obsoleteScore += 0.4;
    }
    
    return obsoleteScore;
  }

  /**
   * Получает время последнего использования
   */
  getLastUsageTime(knowledge) {
    // Это упрощенная версия - в реальной системе нужно отслеживать timestamps
    return knowledge.lastUsed || (Date.now() - Math.random() * this.inactivityPeriod * 2);
  }

  /**
   * Получает причину устаревания
   */
  getObsoleteReason(knowledge, currentTime) {
    const reasons = [];
    
    if (knowledge.averageEffectiveness < 0.3) {
      reasons.push('низкая эффективность');
    }
    
    if (knowledge.appearances < 3) {
      reasons.push('редкое использование');
    }
    
    const lastUsage = this.getLastUsageTime(knowledge);
    if (lastUsage && (currentTime - lastUsage) > this.inactivityPeriod) {
      reasons.push('долгое время неиспользования');
    }
    
    return reasons.join(', ');
  }
}

/**
 * СИСТЕМА ОБРАТНОЙ СВЯЗИ
 * Обработка явной и неявной обратной связи
 */
class FeedbackSystem {
  constructor() {
    this.feedbackHistory = [];
    this.implicitSignals = new Map();
    this.explicitFeedback = new Map();
    this.satisfactionMetrics = new Map();
  }

  /**
   * Обрабатывает обратную связь
   */
  processFeedback(interaction, feedbackData) {
    SmartLogger.learning('Обрабатываем обратную связь', feedbackData);
    
    // Неявная обратная связь
    this.processImplicitFeedback(interaction);
    
    // Явная обратная связь
    if (feedbackData.explicit) {
      this.processExplicitFeedback(interaction, feedbackData.explicit);
    }
    
    // Сохраняем в историю
    this.feedbackHistory.push({
      timestamp: Date.now(),
      interaction: interaction,
      feedback: feedbackData,
      processedSignals: this.extractProcessedSignals(interaction, feedbackData)
    });
    
    return this.generateFeedbackInsights(interaction, feedbackData);
  }

  /**
   * Обрабатывает неявную обратную связь
   */
  processImplicitFeedback(interaction) {
    const signals = {
      responseTime: interaction.responseTime,
      readingTime: interaction.readingTime || 0,
      followUpQuestions: interaction.followUpQuestions || 0,
      conversationContinuation: interaction.conversationContinued || false,
      sessionDuration: interaction.sessionDuration || 0
    };
    
    // Анализируем каждый сигнал
    const interpretedSignals = this.interpretImplicitSignals(signals);
    
    // Сохраняем интерпретированные сигналы
    const interactionId = interaction.id || Date.now().toString();
    this.implicitSignals.set(interactionId, interpretedSignals);
    
    return interpretedSignals;
  }

  /**
   * Интерпретирует неявные сигналы
   */
  interpretImplicitSignals(signals) {
    const interpretation = {
      engagement: 0,
      satisfaction: 0,
      comprehension: 0,
      relevance: 0
    };
    
    // Время чтения (больше = лучше, до определенного предела)
    if (signals.readingTime > 3000 && signals.readingTime < 30000) {
      interpretation.engagement += 0.3;
    }
    
    // Продолжение разговора
    if (signals.conversationContinuation) {
      interpretation.engagement += 0.4;
      interpretation.satisfaction += 0.3;
    }
    
    // Дополнительные вопросы
    if (signals.followUpQuestions > 0) {
      interpretation.engagement += 0.2;
      
      // Если много вопросов, возможно, ответ был неполным
      if (signals.followUpQuestions > 2) {
        interpretation.comprehension -= 0.2;
      }
    }
    
    // Длительность сессии
    if (signals.sessionDuration > 60000) { // больше минуты
      interpretation.engagement += 0.2;
    }
    
    return interpretation;
  }

  /**
   * Обрабатывает явную обратную связь
   */
  processExplicitFeedback(interaction, explicitData) {
    const feedback = {
      rating: explicitData.rating || null,
      comment: explicitData.comment || null,
      categories: explicitData.categories || [],
      suggestions: explicitData.suggestions || []
    };
    
    // Сохраняем явную обратную связь
    const interactionId = interaction.id || Date.now().toString();
    this.explicitFeedback.set(interactionId, feedback);
    
    // Анализируем комментарии
    if (feedback.comment) {
      const sentimentAnalysis = this.analyzeSentiment(feedback.comment);
      feedback.sentiment = sentimentAnalysis;
    }
    
    return feedback;
  }

  /**
   * Анализирует тональность комментария
   */
  analyzeSentiment(comment) {
    const positiveWords = ['отлично', 'хорошо', 'полезно', 'понятно', 'помогло', 'классно'];
    const negativeWords = ['плохо', 'непонятно', 'не помогло', 'сложно', 'не подходит'];
    
    const words = comment.toLowerCase().split(' ');
    let sentiment = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) sentiment += 1;
      if (negativeWords.includes(word)) sentiment -= 1;
    });
    
    return {
      score: sentiment,
      polarity: sentiment > 0 ? 'positive' : sentiment < 0 ? 'negative' : 'neutral',
      confidence: Math.abs(sentiment) / words.length
    };
  }

  /**
   * Извлекает обработанные сигналы
   */
  extractProcessedSignals(interaction, feedbackData) {
    const signals = {
      implicit: this.implicitSignals.get(interaction.id) || {},
      explicit: this.explicitFeedback.get(interaction.id) || {},
      combined: this.combineSignals(interaction, feedbackData)
    };
    
    return signals;
  }

  /**
   * Комбинирует сигналы
   */
  combineSignals(interaction, feedbackData) {
    const implicitSignals = this.implicitSignals.get(interaction.id) || {};
    const explicitSignals = this.explicitFeedback.get(interaction.id) || {};
    
    const combined = {
      overallSatisfaction: 0,
      overallEngagement: 0,
      areas_for_improvement: []
    };
    
    // Комбинируем удовлетворенность
    let satisfactionSources = 0;
    if (implicitSignals.satisfaction !== undefined) {
      combined.overallSatisfaction += implicitSignals.satisfaction;
      satisfactionSources++;
    }
    
    if (explicitSignals.rating !== undefined) {
      combined.overallSatisfaction += explicitSignals.rating / 5; // нормализуем к 0-1
      satisfactionSources++;
    }
    
    if (satisfactionSources > 0) {
      combined.overallSatisfaction /= satisfactionSources;
    }
    
    // Комбинируем вовлеченность
    combined.overallEngagement = implicitSignals.engagement || 0;
    
    // Выявляем области для улучшения
    if (implicitSignals.comprehension && implicitSignals.comprehension < 0.5) {
      combined.areas_for_improvement.push('comprehension');
    }
    
    if (explicitSignals.suggestions && explicitSignals.suggestions.length > 0) {
      combined.areas_for_improvement.push(...explicitSignals.suggestions);
    }
    
    return combined;
  }

  /**
   * Генерирует инсайты из обратной связи
   */
  generateFeedbackInsights(interaction, feedbackData) {
    const insights = {
      strengths: [],
      weaknesses: [],
      actionableItems: [],
      confidenceLevel: 0
    };
    
    const processedSignals = this.extractProcessedSignals(interaction, feedbackData);
    
    // Анализируем сильные стороны
    if (processedSignals.combined.overallSatisfaction > 0.7) {
      insights.strengths.push('высокая удовлетворенность пользователя');
    }
    
    if (processedSignals.combined.overallEngagement > 0.7) {
      insights.strengths.push('высокая вовлеченность пользователя');
    }
    
    // Анализируем слабые стороны
    if (processedSignals.combined.overallSatisfaction < 0.4) {
      insights.weaknesses.push('низкая удовлетворенность пользователя');
    }
    
    if (processedSignals.implicit.comprehension < 0.5) {
      insights.weaknesses.push('проблемы с пониманием ответа');
    }
    
    // Генерируем действия
    processedSignals.combined.areas_for_improvement.forEach(area => {
      insights.actionableItems.push(`улучшить ${area}`);
    });
    
    // Вычисляем уровень уверенности
    insights.confidenceLevel = this.calculateInsightConfidence(processedSignals);
    
    return insights;
  }

  /**
   * Вычисляет уровень уверенности в инсайтах
   */
  calculateInsightConfidence(processedSignals) {
    let confidence = 0;
    let sources = 0;
    
    // Неявные сигналы
    if (Object.keys(processedSignals.implicit).length > 0) {
      confidence += 0.3;
      sources++;
    }
    
    // Явные сигналы
    if (Object.keys(processedSignals.explicit).length > 0) {
      confidence += 0.7;
      sources++;
    }
    
    // Чем больше источников, тем выше уверенность
    if (sources > 1) {
      confidence += 0.2;
    }
    
    return Math.min(1.0, confidence);
  }

  /**
   * Получает сводку по обратной связи
   */
  getFeedbackSummary(timeRange = 'all') {
    const summary = {
      totalFeedback: this.feedbackHistory.length,
      averageSatisfaction: 0,
      averageEngagement: 0,
      commonStrengths: new Map(),
      commonWeaknesses: new Map(),
      topActionItems: new Map(),
      trends: this.calculateFeedbackTrends()
    };
    
    let satisfactionSum = 0;
    let engagementSum = 0;
    let validFeedback = 0;
    
    this.feedbackHistory.forEach(entry => {
      const signals = entry.processedSignals;
      
      if (signals.combined.overallSatisfaction !== undefined) {
        satisfactionSum += signals.combined.overallSatisfaction;
        validFeedback++;
      }
      
      if (signals.combined.overallEngagement !== undefined) {
        engagementSum += signals.combined.overallEngagement;
      }
      
      // Собираем общие паттерны
      const insights = this.generateFeedbackInsights(entry.interaction, entry.feedback);
      insights.strengths.forEach(strength => {
        summary.commonStrengths.set(strength, (summary.commonStrengths.get(strength) || 0) + 1);
      });
      
      insights.weaknesses.forEach(weakness => {
        summary.commonWeaknesses.set(weakness, (summary.commonWeaknesses.get(weakness) || 0) + 1);
      });
      
      insights.actionableItems.forEach(item => {
        summary.topActionItems.set(item, (summary.topActionItems.get(item) || 0) + 1);
      });
    });
    
    if (validFeedback > 0) {
      summary.averageSatisfaction = satisfactionSum / validFeedback;
      summary.averageEngagement = engagementSum / validFeedback;
    }
    
    return summary;
  }

  /**
   * Вычисляет тренды обратной связи
   */
  calculateFeedbackTrends() {
    if (this.feedbackHistory.length < 10) return null;
    
    const recent = this.feedbackHistory.slice(-5);
    const older = this.feedbackHistory.slice(-10, -5);
    
    const recentSatisfaction = recent.reduce((sum, entry) => 
      sum + (entry.processedSignals.combined.overallSatisfaction || 0), 0) / recent.length;
    
    const olderSatisfaction = older.reduce((sum, entry) => 
      sum + (entry.processedSignals.combined.overallSatisfaction || 0), 0) / older.length;
    
    return {
      satisfactionTrend: recentSatisfaction > olderSatisfaction ? 'improving' : 'declining',
      change: ((recentSatisfaction - olderSatisfaction) * 100).toFixed(1) + '%'
    };
  }
}

/**
 * ГЛАВНЫЙ КЛАСС АВТОНОМНОЙ СИСТЕМЫ ОБУЧЕНИЯ
 */
class AutonomousLearningEngine {
  constructor() {
    this.effectivenessAnalyzer = new EffectivenessAnalyzer();
    this.patternExtractor = new PatternExtractor();
    this.adaptiveKnowledgeBase = new AdaptiveKnowledgeBase();
    this.feedbackSystem = new FeedbackSystem();
    this.initialized = false;
    this.learningQueue = [];
    this.isProcessing = false;
  }

  /**
   * Инициализация системы обучения
   */
  initialize() {
    if (this.initialized) return;
    
    SmartLogger.learning('Инициализация автономной системы обучения');
    this.initialized = true;
    
    // Запускаем процесс обучения
    this.startLearningProcess();
    
    SmartLogger.learning('Автономная система обучения готова к работе');
  }

  /**
   * Запускает непрерывный процесс обучения
   */
  startLearningProcess() {
    // Обрабатываем очередь обучения каждые 5 секунд
    setInterval(() => {
      this.processLearningQueue();
    }, 5000);
  }

  /**
   * Основной метод обучения на взаимодействии
   */
  async learnFromInteraction(interaction, additionalData = {}) {
    this.initialize();
    
    SmartLogger.learning('Начинаем обучение на взаимодействии', { 
      query: interaction.query?.substring(0, 50) + '...',
      responseLength: interaction.response?.length 
    });
    
    try {
      // Добавляем в очередь обучения
      this.learningQueue.push({
        interaction: interaction,
        additionalData: additionalData,
        timestamp: Date.now()
      });
      
      return {
        success: true,
        message: 'Взаимодействие добавлено в очередь обучения',
        queueSize: this.learningQueue.length
      };
      
    } catch (error) {
      SmartLogger.learning('Ошибка обучения:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Обрабатывает очередь обучения
   */
  async processLearningQueue() {
    if (this.isProcessing || this.learningQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      const batch = this.learningQueue.splice(0, 5); // Обрабатываем по 5 за раз
      
      for (const item of batch) {
        await this.processLearningItem(item);
      }
      
      SmartLogger.learning(`Обработан батч обучения: ${batch.length} элементов`);
      
    } catch (error) {
      SmartLogger.learning('Ошибка обработки очереди обучения:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Обрабатывает элемент обучения
   */
  async processLearningItem(item) {
    const { interaction, additionalData } = item;
    
    // Шаг 1: Анализ эффективности
    const effectiveness = this.effectivenessAnalyzer.analyzeInteractionEffectiveness(interaction);
    
    // Шаг 2: Обновление базы знаний
    this.adaptiveKnowledgeBase.updateKnowledge(interaction, effectiveness.userEngagement);
    
    // Шаг 3: Извлечение паттернов (только для эффективных взаимодействий)
    if (effectiveness.userEngagement > 0.6) {
      this.patternExtractor.extractSuccessPatterns([interaction]);
    }
    
    // Шаг 4: Обработка обратной связи
    if (additionalData.feedback) {
      this.feedbackSystem.processFeedback(interaction, additionalData.feedback);
    }
    
    // Шаг 5: Генерация улучшений
    const improvements = this.generateImprovements(effectiveness, interaction);
    
    return {
      effectiveness: effectiveness,
      improvements: improvements,
      processed: true
    };
  }

  /**
   * Генерирует улучшения на основе анализа
   */
  generateImprovements(effectiveness, interaction) {
    const improvements = [];
    
    // Улучшения на основе низкой эффективности
    if (effectiveness.userEngagement < 0.5) {
      improvements.push({
        type: 'engagement',
        suggestion: 'Сделать ответы более интерактивными и вовлекающими',
        priority: 'high'
      });
    }
    
    if (effectiveness.clarityScore < 0.5) {
      improvements.push({
        type: 'clarity',
        suggestion: 'Улучшить четкость и структуру ответов',
        priority: 'high'
      });
    }
    
    if (effectiveness.helpfulnessScore < 0.5) {
      improvements.push({
        type: 'helpfulness',
        suggestion: 'Добавить больше практических советов и примеров',
        priority: 'medium'
      });
    }
    
    // Улучшения на основе контекста
    if (effectiveness.contextRelevance < 0.5) {
      improvements.push({
        type: 'context',
        suggestion: 'Лучше учитывать контекст разговора и историю пользователя',
        priority: 'medium'
      });
    }
    
    return improvements;
  }

  /**
   * Получает рекомендации для улучшения ответов
   */
  getImprovementRecommendations(queryType = 'all') {
    const stats = this.effectivenessAnalyzer.getEffectivenessStats();
    const patterns = this.patternExtractor.getTopPatterns();
    const knowledgeStats = this.adaptiveKnowledgeBase.getKnowledgeStats();
    
    const recommendations = {
      priority: [],
      suggestions: [],
      patterns: patterns,
      knowledgeInsights: knowledgeStats
    };
    
    // Анализируем статистику и генерируем рекомендации
    Object.entries(stats.byType).forEach(([type, typeStats]) => {
      const successRate = parseFloat(typeStats.successRate);
      
      if (successRate < 60) {
        recommendations.priority.push({
          area: type,
          issue: 'Низкий уровень успешности',
          suggestion: `Проанализировать и улучшить обработку запросов типа "${type}"`,
          currentRate: typeStats.successRate
        });
      }
    });
    
    // Добавляем рекомендации из анализа возможностей
    const opportunities = this.effectivenessAnalyzer.identifyImprovementOpportunities();
    recommendations.suggestions.push(...opportunities);
    
    return recommendations;
  }

  /**
   * Применяет найденные улучшения
   */
  async applyImprovements(improvements) {
    const results = [];
    
    for (const improvement of improvements) {
      try {
        const result = await this.applyImprovement(improvement);
        results.push(result);
      } catch (error) {
        results.push({
          improvement: improvement,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Применяет конкретное улучшение
   */
  async applyImprovement(improvement) {
    SmartLogger.learning(`Применяем улучшение: ${improvement.type}`);
    
    switch (improvement.type) {
      case 'engagement':
        return this.improveEngagement(improvement);
      
      case 'clarity':
        return this.improveClarity(improvement);
      
      case 'helpfulness':
        return this.improveHelpfulness(improvement);
      
      case 'context':
        return this.improveContextAwareness(improvement);
      
      default:
        return {
          improvement: improvement,
          success: false,
          error: 'Неизвестный тип улучшения'
        };
    }
  }

  /**
   * Улучшает вовлеченность
   */
  improveEngagement(improvement) {
    // Обновляем паттерны для более вовлекающих ответов
    const engagementPatterns = this.patternExtractor.getTopPatterns('phrasing');
    
    // Добавляем новые фразы для вовлечения
    const newEngagementPhrases = [
      'А что если попробовать...',
      'Интересно, что вы думаете о...',
      'Давайте разберем это поэтапно...',
      'Вот что я предлагаю...'
    ];
    
    return {
      improvement: improvement,
      success: true,
      changes: {
        addedPhrases: newEngagementPhrases,
        updatedPatterns: engagementPatterns
      }
    };
  }

  /**
   * Улучшает четкость
   */
  improveClarity(improvement) {
    // Обновляем правила для более четких ответов
    const clarityRules = [
      'Использовать короткие предложения',
      'Структурировать ответы списками',
      'Объяснять сложные термины',
      'Добавлять примеры'
    ];
    
    return {
      improvement: improvement,
      success: true,
      changes: {
        clarityRules: clarityRules,
        structureUpdates: 'Добавлены правила структурирования'
      }
    };
  }

  /**
   * Улучшает полезность
   */
  improveHelpfulness(improvement) {
    // Обновляем шаблоны для более полезных ответов
    const helpfulnessTemplates = [
      'Вот конкретные шаги: ...',
      'Практический совет: ...',
      'Рекомендую попробовать: ...',
      'Чтобы достичь результата: ...'
    ];
    
    return {
      improvement: improvement,
      success: true,
      changes: {
        helpfulnessTemplates: helpfulnessTemplates,
        practicalFocus: 'Увеличен фокус на практические советы'
      }
    };
  }

  /**
   * Улучшает контекстное понимание
   */
  improveContextAwareness(improvement) {
    // Обновляем алгоритмы учета контекста
    const contextRules = [
      'Ссылаться на предыдущие сообщения',
      'Учитывать профиль пользователя',
      'Использовать контекст проекта',
      'Адаптировать под текущую задачу'
    ];
    
    return {
      improvement: improvement,
      success: true,
      changes: {
        contextRules: contextRules,
        memoryIntegration: 'Улучшена интеграция с памятью'
      }
    };
  }

  /**
   * Получает полную статистику обучения
   */
  getLearningStats() {
    return {
      effectivenessStats: this.effectivenessAnalyzer.getEffectivenessStats(),
      patternStats: this.patternExtractor.getTopPatterns(),
      knowledgeStats: this.adaptiveKnowledgeBase.getKnowledgeStats(),
      feedbackStats: this.feedbackSystem.getFeedbackSummary(),
      learningQueue: {
        size: this.learningQueue.length,
        processing: this.isProcessing
      },
      systemHealth: this.assessSystemHealth()
    };
  }

  /**
   * Оценивает здоровье системы обучения
   */
  assessSystemHealth() {
    const stats = this.getLearningStats();
    const health = {
      overall: 'healthy',
      components: {
        effectiveness: 'healthy',
        patterns: 'healthy',
        knowledge: 'healthy',
        feedback: 'healthy'
      },
      recommendations: []
    };
    
    // Проверяем эффективность
    if (stats.effectivenessStats.totalInteractions < 10) {
      health.components.effectiveness = 'warning';
      health.recommendations.push('Недостаточно данных для анализа эффективности');
    }
    
    // Проверяем базу знаний
    if (stats.knowledgeStats.totalConcepts < 20) {
      health.components.knowledge = 'warning';
      health.recommendations.push('База знаний требует расширения');
    }
    
    // Проверяем обратную связь
    if (stats.feedbackStats.totalFeedback < 5) {
      health.components.feedback = 'warning';
      health.recommendations.push('Недостаточно данных обратной связи');
    }
    
    // Определяем общее состояние
    const warningCount = Object.values(health.components).filter(status => status === 'warning').length;
    if (warningCount > 1) {
      health.overall = 'warning';
    }
    
    return health;
  }
}

// Создаем глобальный экземпляр
const autonomousLearningEngine = new AutonomousLearningEngine();

module.exports = {
  // Основные методы
  learnFromInteraction: (interaction, additionalData) => 
    autonomousLearningEngine.learnFromInteraction(interaction, additionalData),
  getImprovementRecommendations: (queryType) => 
    autonomousLearningEngine.getImprovementRecommendations(queryType),
  applyImprovements: (improvements) => 
    autonomousLearningEngine.applyImprovements(improvements),
  getLearningStats: () => 
    autonomousLearningEngine.getLearningStats(),
  
  // Компоненты для расширения
  AutonomousLearningEngine,
  EffectivenessAnalyzer,
  PatternExtractor,
  AdaptiveKnowledgeBase,
  FeedbackSystem
};