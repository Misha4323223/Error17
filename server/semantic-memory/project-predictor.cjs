/**
 * Предиктор проектов для семантической системы
 * Предсказывает следующие шаги на основе анализа проекта
 */

const SmartLogger = require('./smart-logger.cjs');

class ProjectPredictor {
  constructor() {
    this.predictionCache = new Map();
    this.patterns = this.initializePredictionPatterns();
    SmartLogger.predictor('ProjectPredictor initialized');
  }

  /**
   * Предсказывает следующие шаги проекта
   */
  async predictNext(projectData) {
    try {
      const { userMessage, entities, semantics, context } = projectData;
      
      // Анализируем тип запроса
      const requestType = this.analyzeRequestType(userMessage, entities);
      
      // Определяем контекст
      const projectContext = this.analyzeContext(context, semantics);
      
      // Генерируем предсказания
      const predictions = this.generatePredictions(requestType, projectContext, entities);
      
      // Определяем временные рамки
      const timeline = this.estimateTimeline(requestType, predictions);
      
      // Рассчитываем уверенность
      const confidence = this.calculateConfidence(predictions, requestType);
      
      const result = {
        predictions: predictions.actions,
        nextSteps: predictions.steps,
        timeline,
        confidence,
        reasoning: predictions.reasoning,
        alternatives: predictions.alternatives
      };
      
      SmartLogger.predictor(`Predictions generated for ${requestType}`, {
        predictions: predictions.actions.length,
        confidence
      });
      
      return result;
    } catch (error) {
      SmartLogger.predictor(`Error in prediction: ${error.message}`);
      return this.getFallbackPrediction();
    }
  }

  /**
   * Анализирует тип запроса
   */
  analyzeRequestType(userMessage, entities) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Анализ по ключевым словам
    if (lowerMessage.includes('создай') || lowerMessage.includes('сгенерируй')) {
      if (lowerMessage.includes('изображение') || lowerMessage.includes('картинку')) {
        return 'image_creation';
      } else if (lowerMessage.includes('вектор') || lowerMessage.includes('svg')) {
        return 'vectorization';
      } else {
        return 'creation';
      }
    }
    
    if (lowerMessage.includes('анализ') || lowerMessage.includes('проанализируй')) {
      return 'analysis';
    }
    
    if (lowerMessage.includes('помоги') || lowerMessage.includes('объясни')) {
      return 'consultation';
    }
    
    if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
      return 'conversation';
    }
    
    // Анализ по сущностям
    if (entities.actions && entities.actions.length > 0) {
      const action = entities.actions[0];
      if (action.category === 'create') return 'creation';
      if (action.category === 'analyze') return 'analysis';
    }
    
    return 'general';
  }

  /**
   * Анализирует контекст проекта
   */
  analyzeContext(context, semantics) {
    return {
      domain: this.extractDomain(context, semantics),
      complexity: this.assessComplexity(context),
      urgency: this.assessUrgency(context),
      resources: this.identifyRequiredResources(context, semantics)
    };
  }

  /**
   * Генерирует предсказания на основе анализа
   */
  generatePredictions(requestType, projectContext, entities) {
    const pattern = this.patterns[requestType] || this.patterns.general;
    
    const predictions = {
      actions: [...pattern.actions],
      steps: [...pattern.steps],
      reasoning: pattern.reasoning,
      alternatives: [...pattern.alternatives]
    };
    
    // Адаптируем под контекст
    if (projectContext.complexity === 'high') {
      predictions.steps.push('детальное_планирование', 'поэтапная_реализация');
    }
    
    if (projectContext.urgency === 'high') {
      predictions.steps.unshift('быстрая_обработка');
    }
    
    // Добавляем специфичные для домена предсказания
    if (projectContext.domain === 'visual') {
      predictions.actions.push('визуальная_оптимизация', 'цветовая_корректировка');
    }
    
    return predictions;
  }

  /**
   * Оценивает временные рамки
   */
  estimateTimeline(requestType, predictions) {
    const timelineMap = {
      'conversation': 'immediate',
      'consultation': 'short_term',
      'image_creation': 'medium_term',
      'vectorization': 'medium_term',
      'analysis': 'short_term',
      'creation': 'long_term'
    };
    
    return timelineMap[requestType] || 'medium_term';
  }

  /**
   * Рассчитывает уверенность в предсказаниях
   */
  calculateConfidence(predictions, requestType) {
    let confidence = 0.5; // базовая уверенность
    
    // Увеличиваем уверенность для знакомых типов
    if (['conversation', 'image_creation', 'analysis'].includes(requestType)) {
      confidence += 0.3;
    }
    
    // Увеличиваем за количество предсказаний
    confidence += Math.min(predictions.actions.length * 0.05, 0.2);
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Извлекает домен из контекста
   */
  extractDomain(context, semantics) {
    if (semantics && semantics.semantic_cluster) {
      const cluster = semantics.semantic_cluster.name;
      if (cluster.includes('image') || cluster.includes('visual')) return 'visual';
      if (cluster.includes('vector')) return 'vector';
      if (cluster.includes('conversation')) return 'conversational';
    }
    
    return 'general';
  }

  /**
   * Оценивает сложность
   */
  assessComplexity(context) {
    if (context.userId && context.sessionId) {
      return 'medium'; // есть контекст пользователя
    }
    return 'low';
  }

  /**
   * Оценивает срочность
   */
  assessUrgency(context) {
    // По умолчанию все запросы имеют обычную срочность
    return 'normal';
  }

  /**
   * Идентифицирует необходимые ресурсы
   */
  identifyRequiredResources(context, semantics) {
    const resources = [];
    
    if (semantics && semantics.semantic_cluster) {
      const cluster = semantics.semantic_cluster.name;
      if (cluster.includes('image')) resources.push('image_generator');
      if (cluster.includes('vector')) resources.push('vectorizer');
      if (cluster.includes('analysis')) resources.push('analyzer');
    }
    
    return resources;
  }

  /**
   * Инициализирует паттерны предсказаний
   */
  initializePredictionPatterns() {
    return {
      conversation: {
        actions: ['ответить', 'продолжить_диалог', 'предоставить_информацию'],
        steps: ['анализ_намерения', 'формирование_ответа', 'отправка'],
        reasoning: 'Пользователь инициирует общение',
        alternatives: ['задать_уточняющий_вопрос', 'предложить_помощь']
      },
      
      image_creation: {
        actions: ['генерация_изображения', 'оптимизация_качества', 'предоставление_результата'],
        steps: ['анализ_запроса', 'выбор_стиля', 'генерация', 'постобработка'],
        reasoning: 'Пользователь хочет создать изображение',
        alternatives: ['предложить_варианты_стилей', 'уточнить_детали']
      },
      
      vectorization: {
        actions: ['конвертация_в_вектор', 'оптимизация_путей', 'экспорт_результата'],
        steps: ['загрузка_изображения', 'анализ_цветов', 'трассировка', 'оптимизация'],
        reasoning: 'Пользователь хочет векторизовать изображение',
        alternatives: ['предложить_настройки', 'показать_превью']
      },
      
      analysis: {
        actions: ['проведение_анализа', 'формирование_выводов', 'представление_результатов'],
        steps: ['сбор_данных', 'обработка', 'анализ', 'формирование_отчета'],
        reasoning: 'Пользователь запрашивает анализ',
        alternatives: ['предложить_дополнительные_метрики', 'глубокий_анализ']
      },
      
      consultation: {
        actions: ['предоставление_консультации', 'рекомендации', 'обучение'],
        steps: ['понимание_проблемы', 'анализ_контекста', 'формирование_советов'],
        reasoning: 'Пользователь нуждается в консультации',
        alternatives: ['предложить_примеры', 'пошаговое_руководство']
      },
      
      general: {
        actions: ['анализ_запроса', 'определение_намерения', 'выбор_действия'],
        steps: ['семантический_анализ', 'планирование', 'выполнение'],
        reasoning: 'Общий запрос требует детального анализа',
        alternatives: ['уточнить_намерения', 'предложить_варианты']
      }
    };
  }

  /**
   * Возвращает fallback предсказания
   */
  getFallbackPrediction() {
    return {
      predictions: ['анализ_запроса', 'формирование_ответа'],
      nextSteps: ['понимание_контекста', 'генерация_решения'],
      timeline: 'medium_term',
      confidence: 0.3,
      reasoning: 'Базовое предсказание',
      alternatives: ['уточнение_деталей']
    };
  }
}

module.exports = new ProjectPredictor();