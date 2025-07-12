/**
 * СИСТЕМА КОГНИТИВНЫХ ОТПЕЧАТКОВ ПОЛЬЗОВАТЕЛЕЙ
 * Революционная технология определения уникального "мыслительного почерка"
 * 
 * Принцип: Каждый человек имеет уникальный паттерн мышления, как отпечаток пальца.
 * Система анализирует стиль мышления, предсказывает мыслительные паттерны
 * и адаптируется к когнитивному стилю пользователя
 */

const SmartLogger = {
  cognitive: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧬🧠 [${timestamp}] COGNITIVE-PRINT: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * КОГНИТИВНЫЙ ОТПЕЧАТОК ПОЛЬЗОВАТЕЛЯ
 * Представляет уникальный профиль мышления пользователя
 */
class CognitiveFingerprint {
  constructor(userId) {
    this.userId = userId;
    this.createdAt = Date.now();
    this.lastUpdated = Date.now();
    this.confidence = 0.1; // Растет со временем
    
    // ОСНОВНЫЕ КОГНИТИВНЫЕ ХАРАКТЕРИСТИКИ
    this.cognitiveStyle = {
      // Стиль восприятия информации
      perceptionStyle: 'unknown', // visual, auditory, kinesthetic, mixed
      perceptionConfidence: 0,
      
      // Стиль обработки информации
      processingStyle: 'unknown', // analytical, intuitive, holistic, sequential
      processingConfidence: 0,
      
      // Стиль принятия решений
      decisionStyle: 'unknown', // rational, emotional, mixed, impulsive
      decisionConfidence: 0,
      
      // Коммуникативный стиль
      communicationStyle: 'unknown', // direct, indirect, formal, casual, technical, simple
      communicationConfidence: 0
    };

    // ПАТТЕРНЫ МЫШЛЕНИЯ
    this.thinkingPatterns = {
      // Глубина анализа
      analysisDepth: 'unknown', // shallow, moderate, deep, variable
      depthConsistency: 0,
      
      // Скорость мышления
      thinkingSpeed: 'unknown', // fast, moderate, slow, variable
      speedConsistency: 0,
      
      // Креативность vs логика
      creativityRatio: 0.5, // 0 = чисто логический, 1 = чисто креативный
      creativityConsistency: 0,
      
      // Конкретность vs абстрактность
      abstractionLevel: 0.5, // 0 = конкретный, 1 = абстрактный
      abstractionConsistency: 0
    };

    // ЭМОЦИОНАЛЬНЫЕ ХАРАКТЕРИСТИКИ
    this.emotionalProfile = {
      // Эмоциональная стабильность
      emotionalStability: 0.5,
      stabilityTrend: 'stable',
      
      // Оптимизм vs пессимизм
      optimismLevel: 0.5,
      optimismTrend: 'stable',
      
      // Терпеливость
      patienceLevel: 0.5,
      patienceTrend: 'stable',
      
      // Уверенность в себе
      confidenceLevel: 0.5,
      confidenceTrend: 'stable'
    };

    // ПРЕДПОЧТЕНИЯ В ЗАДАЧАХ
    this.taskPreferences = {
      // Любимые категории задач
      preferredCategories: new Map(),
      
      // Время активности
      activeHours: [],
      
      // Сложность задач
      preferredComplexity: 'unknown', // simple, moderate, complex, mixed
      
      // Стиль формулировки запросов
      queryStyle: 'unknown' // brief, detailed, conversational, formal
    };

    // ИСТОРИЯ ВЗАИМОДЕЙСТВИЙ
    this.interactionHistory = [];
    this.maxHistorySize = 200;
    
    // ПРЕДСКАЗАТЕЛЬНЫЕ МОДЕЛИ
    this.predictions = {
      nextQuery: null,
      nextCategory: null,
      nextEmotion: null,
      confidence: 0
    };
  }

  /**
   * Обновляет отпечаток на основе нового взаимодействия
   */
  updateFromInteraction(interaction) {
    SmartLogger.cognitive(`🔄 Обновление когнитивного отпечатка пользователя ${this.userId}...`);

    this.lastUpdated = Date.now();
    this.interactionHistory.push({
      timestamp: Date.now(),
      ...interaction
    });

    // Поддерживаем размер истории
    if (this.interactionHistory.length > this.maxHistorySize) {
      this.interactionHistory = this.interactionHistory.slice(-this.maxHistorySize);
    }

    // Анализируем когнитивный стиль
    this.analyzeCognitiveStyle(interaction);
    
    // Анализируем паттерны мышления
    this.analyzeThinkingPatterns(interaction);
    
    // Анализируем эмоциональный профиль
    this.analyzeEmotionalProfile(interaction);
    
    // Обновляем предпочтения
    this.updateTaskPreferences(interaction);
    
    // Генерируем предсказания
    this.generatePredictions();
    
    // Пересчитываем общую уверенность
    this.updateConfidence();

    SmartLogger.cognitive(`📊 Отпечаток обновлен. Уверенность: ${this.confidence.toFixed(3)}`);
  }

  /**
   * Анализирует когнитивный стиль
   */
  analyzeCognitiveStyle(interaction) {
    const query = interaction.query || '';
    const category = interaction.category || '';
    
    // Анализ стиля восприятия
    this.analyzePerceptionStyle(query, category);
    
    // Анализ стиля обработки
    this.analyzeProcessingStyle(query, interaction);
    
    // Анализ стиля принятия решений
    this.analyzeDecisionStyle(interaction);
    
    // Анализ коммуникативного стиля
    this.analyzeCommunicationStyle(query);
  }

  /**
   * Анализирует стиль восприятия информации
   */
  analyzePerceptionStyle(query, category) {
    let visualIndicators = 0;
    let auditoryIndicators = 0;
    let kinestheticIndicators = 0;

    // Визуальные индикаторы
    const visualWords = ['видеть', 'смотреть', 'изображение', 'картинка', 'показать', 'выглядеть', 'цвет', 'дизайн'];
    visualIndicators = visualWords.filter(word => query.toLowerCase().includes(word)).length;

    // Аудиальные индикаторы
    const auditoryWords = ['слышать', 'звучать', 'сказать', 'говорить', 'рассказать', 'объяснить'];
    auditoryIndicators = auditoryWords.filter(word => query.toLowerCase().includes(word)).length;

    // Кинестетические индикаторы
    const kinestheticWords = ['чувствовать', 'попробовать', 'сделать', 'создать', 'построить', 'реализовать'];
    kinestheticIndicators = kinestheticWords.filter(word => query.toLowerCase().includes(word)).length;

    // Категориальные индикаторы
    if (category === 'image_generation' || category === 'vectorization') {
      visualIndicators += 2;
    }
    if (category === 'conversation' || category === 'explanation') {
      auditoryIndicators += 1;
    }
    if (category === 'planning' || category === 'implementation') {
      kinestheticIndicators += 1;
    }

    // Обновляем стиль восприятия
    const totalIndicators = visualIndicators + auditoryIndicators + kinestheticIndicators;
    if (totalIndicators > 0) {
      const newStyle = visualIndicators > auditoryIndicators && visualIndicators > kinestheticIndicators ? 'visual' :
                      auditoryIndicators > kinestheticIndicators ? 'auditory' : 'kinesthetic';
      
      this.updateCognitiveStyleComponent('perceptionStyle', newStyle, totalIndicators / 5);
    }
  }

  /**
   * Анализирует стиль обработки информации
   */
  analyzeProcessingStyle(query, interaction) {
    let analyticalScore = 0;
    let intuitiveScore = 0;

    // Аналитические индикаторы
    const analyticalWords = ['анализ', 'сравнить', 'детально', 'точно', 'измерить', 'подсчитать', 'статистика'];
    analyticalScore = analyticalWords.filter(word => query.toLowerCase().includes(word)).length;

    // Интуитивные индикаторы
    const intuitiveWords = ['чувствую', 'кажется', 'интуитивно', 'примерно', 'в общем', 'как-то так'];
    intuitiveScore = intuitiveWords.filter(word => query.toLowerCase().includes(word)).length;

    // Длина запроса как индикатор
    if (query.length > 200) analyticalScore += 1; // Детальные запросы
    if (query.length < 50) intuitiveScore += 1; // Краткие запросы

    const newStyle = analyticalScore > intuitiveScore ? 'analytical' : 
                    intuitiveScore > analyticalScore ? 'intuitive' : 'mixed';
    
    this.updateCognitiveStyleComponent('processingStyle', newStyle, Math.abs(analyticalScore - intuitiveScore) / 3);
  }

  /**
   * Анализирует стиль принятия решений
   */
  analyzeDecisionStyle(interaction) {
    const query = interaction.query || '';
    let rationalScore = 0;
    let emotionalScore = 0;

    // Рациональные индикаторы
    const rationalWords = ['логично', 'разумно', 'эффективно', 'оптимально', 'лучший', 'правильный'];
    rationalScore = rationalWords.filter(word => query.toLowerCase().includes(word)).length;

    // Эмоциональные индикаторы
    const emotionalWords = ['нравится', 'хочется', 'красиво', 'приятно', 'интересно', 'привлекательно'];
    emotionalScore = emotionalWords.filter(word => query.toLowerCase().includes(word)).length;

    // Быстрота принятия решения
    if (interaction.responseTime && interaction.responseTime < 5000) {
      emotionalScore += 1; // Быстрые решения часто эмоциональны
    } else if (interaction.responseTime && interaction.responseTime > 30000) {
      rationalScore += 1; // Долгое обдумывание
    }

    const newStyle = rationalScore > emotionalScore ? 'rational' : 
                    emotionalScore > rationalScore ? 'emotional' : 'mixed';
    
    this.updateCognitiveStyleComponent('decisionStyle', newStyle, Math.abs(rationalScore - emotionalScore) / 2);
  }

  /**
   * Анализирует коммуникативный стиль
   */
  analyzeCommunicationStyle(query) {
    let formalScore = 0;
    let casualScore = 0;
    let directScore = 0;
    let indirectScore = 0;

    // Формальность
    const formalWords = ['пожалуйста', 'будьте добры', 'не могли бы', 'благодарю'];
    formalScore = formalWords.filter(word => query.toLowerCase().includes(word)).length;

    const casualWords = ['привет', 'пока', 'спасибо', 'круто', 'классно'];
    casualScore = casualWords.filter(word => query.toLowerCase().includes(word)).length;

    // Прямота
    const directWords = ['сделай', 'создай', 'покажи', 'дай', 'хочу'];
    directScore = directWords.filter(word => query.toLowerCase().includes(word)).length;

    const indirectWords = ['можно ли', 'возможно ли', 'как думаешь', 'что если'];
    indirectScore = indirectWords.filter(word => query.toLowerCase().includes(word)).length;

    let style = 'neutral';
    if (formalScore > casualScore && directScore > indirectScore) style = 'formal_direct';
    else if (formalScore > casualScore && indirectScore > directScore) style = 'formal_indirect';
    else if (casualScore > formalScore && directScore > indirectScore) style = 'casual_direct';
    else if (casualScore > formalScore && indirectScore > directScore) style = 'casual_indirect';

    this.updateCognitiveStyleComponent('communicationStyle', style, 
      (Math.abs(formalScore - casualScore) + Math.abs(directScore - indirectScore)) / 4);
  }

  /**
   * Обновляет компонент когнитивного стиля
   */
  updateCognitiveStyleComponent(component, newValue, confidence) {
    const current = this.cognitiveStyle[component];
    const currentConfidence = this.cognitiveStyle[component + 'Confidence'] || 0;

    if (current === 'unknown' || confidence > currentConfidence) {
      this.cognitiveStyle[component] = newValue;
      this.cognitiveStyle[component + 'Confidence'] = Math.min(1, confidence);
      
      SmartLogger.cognitive(`🎯 ${component} обновлен: ${newValue} (уверенность: ${confidence.toFixed(3)})`);
    }
  }

  /**
   * Анализирует паттерны мышления
   */
  analyzeThinkingPatterns(interaction) {
    const query = interaction.query || '';
    
    // Анализ глубины
    this.analyzeAnalysisDepth(query, interaction);
    
    // Анализ скорости
    this.analyzeThinkingSpeed(interaction);
    
    // Анализ креативности
    this.analyzeCreativity(query, interaction);
    
    // Анализ абстрактности
    this.analyzeAbstraction(query);
  }

  /**
   * Анализирует глубину анализа
   */
  analyzeAnalysisDepth(query, interaction) {
    let depthScore = 0;

    // Длина запроса
    if (query.length > 500) depthScore += 3;
    else if (query.length > 200) depthScore += 2;
    else if (query.length > 100) depthScore += 1;

    // Детализация
    const detailWords = ['детально', 'подробно', 'тщательно', 'всесторонне', 'глубоко'];
    depthScore += detailWords.filter(word => query.toLowerCase().includes(word)).length * 2;

    // Количество вопросов
    const questionCount = (query.match(/\?/g) || []).length;
    depthScore += Math.min(3, questionCount);

    const depthLevel = depthScore > 6 ? 'deep' : depthScore > 3 ? 'moderate' : 'shallow';
    this.updateThinkingPattern('analysisDepth', depthLevel, depthScore / 10);
  }

  /**
   * Анализирует скорость мышления
   */
  analyzeThinkingSpeed(interaction) {
    if (interaction.responseTime) {
      const speed = interaction.responseTime < 10000 ? 'fast' : 
                   interaction.responseTime < 60000 ? 'moderate' : 'slow';
      
      const confidence = Math.min(1, 30000 / interaction.responseTime); // Больше уверенности для быстрых ответов
      this.updateThinkingPattern('thinkingSpeed', speed, confidence);
    }
  }

  /**
   * Анализирует креативность
   */
  analyzeCreativity(query, interaction) {
    let creativityScore = 0;
    let logicalScore = 0;

    // Креативные индикаторы
    const creativeWords = ['творческий', 'необычный', 'оригинальный', 'уникальный', 'интересный', 'красивый'];
    creativityScore = creativeWords.filter(word => query.toLowerCase().includes(word)).length;

    // Логические индикаторы
    const logicalWords = ['точный', 'правильный', 'эффективный', 'оптимальный', 'систематический'];
    logicalScore = logicalWords.filter(word => query.toLowerCase().includes(word)).length;

    // Категория задачи
    if (interaction.category === 'image_generation') creativityScore += 2;
    if (interaction.category === 'analysis' || interaction.category === 'search') logicalScore += 2;

    const totalScore = creativityScore + logicalScore;
    if (totalScore > 0) {
      const creativityRatio = creativityScore / totalScore;
      this.updateThinkingPatternValue('creativityRatio', creativityRatio, totalScore / 5);
    }
  }

  /**
   * Анализирует уровень абстракции
   */
  analyzeAbstraction(query) {
    let abstractScore = 0;
    let concreteScore = 0;

    // Абстрактные индикаторы
    const abstractWords = ['концепция', 'идея', 'принцип', 'общий', 'философия', 'теория'];
    abstractScore = abstractWords.filter(word => query.toLowerCase().includes(word)).length;

    // Конкретные индикаторы
    const concreteWords = ['конкретно', 'именно', 'точно', 'специфично', 'детально'];
    concreteScore = concreteWords.filter(word => query.toLowerCase().includes(word)).length;

    const totalScore = abstractScore + concreteScore;
    if (totalScore > 0) {
      const abstractionLevel = abstractScore / totalScore;
      this.updateThinkingPatternValue('abstractionLevel', abstractionLevel, totalScore / 3);
    }
  }

  /**
   * Обновляет паттерн мышления
   */
  updateThinkingPattern(pattern, value, confidence) {
    const current = this.thinkingPatterns[pattern];
    const consistencyKey = pattern.replace(/Style$/, 'Consistency');
    const currentConsistency = this.thinkingPatterns[consistencyKey] || 0;

    if (current === 'unknown' || confidence > currentConsistency) {
      this.thinkingPatterns[pattern] = value;
      this.thinkingPatterns[consistencyKey] = Math.min(1, confidence);
    }
  }

  /**
   * Обновляет числовое значение паттерна мышления
   */
  updateThinkingPatternValue(pattern, value, confidence) {
    const consistencyKey = pattern + 'Consistency';
    const currentConsistency = this.thinkingPatterns[consistencyKey] || 0;

    if (confidence > currentConsistency) {
      this.thinkingPatterns[pattern] = value;
      this.thinkingPatterns[consistencyKey] = Math.min(1, confidence);
    }
  }

  /**
   * Анализирует эмоциональный профиль
   */
  analyzeEmotionalProfile(interaction) {
    const query = interaction.query || '';
    
    // Анализ оптимизма
    this.analyzeOptimism(query);
    
    // Анализ терпеливости
    this.analyzePatience(query, interaction);
    
    // Анализ уверенности
    this.analyzeUserConfidence(query, interaction);
  }

  /**
   * Анализирует уровень оптимизма
   */
  analyzeOptimism(query) {
    let optimismScore = 0;
    let pessimismScore = 0;

    const optimisticWords = ['отлично', 'прекрасно', 'замечательно', 'хорошо', 'позитивно', 'успешно'];
    optimismScore = optimisticWords.filter(word => query.toLowerCase().includes(word)).length;

    const pessimisticWords = ['плохо', 'ужасно', 'проблема', 'не получается', 'неудача'];
    pessimismScore = pessimisticWords.filter(word => query.toLowerCase().includes(word)).length;

    const totalScore = optimismScore + pessimismScore;
    if (totalScore > 0) {
      const optimismLevel = optimismScore / totalScore;
      this.updateEmotionalComponent('optimismLevel', optimismLevel, totalScore / 3);
    }
  }

  /**
   * Анализирует терпеливость
   */
  analyzePatience(query, interaction) {
    let patienceScore = 0.5;

    // Индикаторы нетерпеливости
    const impatientWords = ['быстро', 'срочно', 'немедленно', 'сейчас же', 'скорее'];
    const impatientCount = impatientWords.filter(word => query.toLowerCase().includes(word)).length;

    // Индикаторы терпеливости
    const patientWords = ['подождать', 'не спешу', 'когда удобно', 'не торопясь'];
    const patientCount = patientWords.filter(word => query.toLowerCase().includes(word)).length;

    if (impatientCount > patientCount) {
      patienceScore = Math.max(0, 0.5 - impatientCount * 0.2);
    } else if (patientCount > impatientCount) {
      patienceScore = Math.min(1, 0.5 + patientCount * 0.2);
    }

    this.updateEmotionalComponent('patienceLevel', patienceScore, Math.abs(impatientCount - patientCount) / 2);
  }

  /**
   * Анализирует уверенность пользователя
   */
  analyzeUserConfidence(query, interaction) {
    let confidenceScore = 0.5;

    // Индикаторы неуверенности
    const uncertainWords = ['не уверен', 'возможно', 'наверное', 'кажется', 'может быть'];
    const uncertainCount = uncertainWords.filter(word => query.toLowerCase().includes(word)).length;

    // Индикаторы уверенности
    const confidentWords = ['точно', 'определенно', 'уверен', 'знаю', 'несомненно'];
    const confidentCount = confidentWords.filter(word => query.toLowerCase().includes(word)).length;

    if (uncertainCount > confidentCount) {
      confidenceScore = Math.max(0, 0.5 - uncertainCount * 0.15);
    } else if (confidentCount > uncertainCount) {
      confidenceScore = Math.min(1, 0.5 + confidentCount * 0.15);
    }

    this.updateEmotionalComponent('confidenceLevel', confidenceScore, 
      Math.abs(uncertainCount - confidentCount) / 3);
  }

  /**
   * Обновляет эмоциональный компонент
   */
  updateEmotionalComponent(component, value, confidence) {
    if (confidence > 0.1) {
      const currentValue = this.emotionalProfile[component];
      const newValue = currentValue * 0.7 + value * 0.3; // Плавное обновление
      
      this.emotionalProfile[component] = newValue;
      
      // Определяем тренд
      const trend = newValue > currentValue ? 'increasing' : 
                   newValue < currentValue ? 'decreasing' : 'stable';
      this.emotionalProfile[component.replace('Level', 'Trend')] = trend;
    }
  }

  /**
   * Обновляет предпочтения в задачах
   */
  updateTaskPreferences(interaction) {
    // Обновляем предпочтения по категориям
    if (interaction.category) {
      const current = this.taskPreferences.preferredCategories.get(interaction.category) || 0;
      this.taskPreferences.preferredCategories.set(interaction.category, current + 1);
    }

    // Обновляем активные часы
    const hour = new Date().getHours();
    if (!this.taskPreferences.activeHours.includes(hour)) {
      this.taskPreferences.activeHours.push(hour);
    }

    // Анализ стиля запросов
    const query = interaction.query || '';
    if (query.length < 50) {
      this.updatePreferenceComponent('queryStyle', 'brief', 0.2);
    } else if (query.length > 200) {
      this.updatePreferenceComponent('queryStyle', 'detailed', 0.3);
    }
  }

  /**
   * Обновляет компонент предпочтений
   */
  updatePreferenceComponent(component, value, weight) {
    // Простое обновление с весом
    if (this.taskPreferences[component] === 'unknown' || Math.random() < weight) {
      this.taskPreferences[component] = value;
    }
  }

  /**
   * Генерирует предсказания
   */
  generatePredictions() {
    if (this.interactionHistory.length < 3) return;

    // Предсказание следующей категории
    this.predictNextCategory();
    
    // Предсказание стиля следующего запроса
    this.predictNextQueryStyle();
    
    // Предсказание эмоционального состояния
    this.predictNextEmotion();
    
    // Общая уверенность в предсказаниях
    this.predictions.confidence = this.confidence * 0.8; // Предсказания менее надежны
  }

  /**
   * Предсказывает следующую категорию
   */
  predictNextCategory() {
    const recentCategories = this.interactionHistory.slice(-10)
      .map(i => i.category)
      .filter(c => c);

    if (recentCategories.length > 0) {
      // Находим самую частую категорию
      const categoryFreq = {};
      recentCategories.forEach(cat => {
        categoryFreq[cat] = (categoryFreq[cat] || 0) + 1;
      });

      const mostFrequent = Object.entries(categoryFreq)
        .sort(([,a], [,b]) => b - a)[0];

      this.predictions.nextCategory = mostFrequent[0];
    }
  }

  /**
   * Предсказывает стиль следующего запроса
   */
  predictNextQueryStyle() {
    const recentQueries = this.interactionHistory.slice(-5)
      .map(i => i.query)
      .filter(q => q);

    if (recentQueries.length > 0) {
      const avgLength = recentQueries.reduce((sum, q) => sum + q.length, 0) / recentQueries.length;
      
      this.predictions.nextQuery = {
        expectedLength: Math.round(avgLength),
        style: this.taskPreferences.queryStyle,
        complexity: avgLength > 200 ? 'complex' : avgLength > 100 ? 'moderate' : 'simple'
      };
    }
  }

  /**
   * Предсказывает эмоциональное состояние
   */
  predictNextEmotion() {
    this.predictions.nextEmotion = {
      optimism: this.emotionalProfile.optimismLevel,
      patience: this.emotionalProfile.patienceLevel,
      confidence: this.emotionalProfile.confidenceLevel,
      stability: this.emotionalProfile.emotionalStability
    };
  }

  /**
   * Обновляет общую уверенность в отпечатке
   */
  updateConfidence() {
    let confidence = 0;

    // Уверенность от количества взаимодействий
    const interactionCount = this.interactionHistory.length;
    confidence += Math.min(0.3, interactionCount / 50);

    // Уверенность от когнитивного стиля
    const styleConfidences = [
      this.cognitiveStyle.perceptionConfidence,
      this.cognitiveStyle.processingConfidence,
      this.cognitiveStyle.decisionConfidence,
      this.cognitiveStyle.communicationConfidence
    ];
    confidence += styleConfidences.reduce((sum, c) => sum + c, 0) / styleConfidences.length * 0.25;

    // Уверенность от паттернов мышления
    const patternConsistencies = [
      this.thinkingPatterns.depthConsistency,
      this.thinkingPatterns.speedConsistency,
      this.thinkingPatterns.creativityConsistency,
      this.thinkingPatterns.abstractionConsistency
    ];
    confidence += patternConsistencies.reduce((sum, c) => sum + c, 0) / patternConsistencies.length * 0.25;

    // Уверенность от временной стабильности
    const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
    confidence += Math.min(0.2, daysSinceCreation / 30);

    this.confidence = Math.max(0, Math.min(1, confidence));
  }

  /**
   * Экспортирует отпечаток в сжатом виде
   */
  export() {
    return {
      userId: this.userId,
      confidence: this.confidence,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
      interactionCount: this.interactionHistory.length,
      
      cognitiveStyle: this.cognitiveStyle,
      thinkingPatterns: this.thinkingPatterns,
      emotionalProfile: this.emotionalProfile,
      
      taskPreferences: {
        preferredCategories: Object.fromEntries(this.taskPreferences.preferredCategories),
        activeHours: this.taskPreferences.activeHours,
        queryStyle: this.taskPreferences.queryStyle
      },
      
      predictions: this.predictions,
      
      summary: this.generateProfileSummary()
    };
  }

  /**
   * Генерирует краткое резюме профиля
   */
  generateProfileSummary() {
    const topCategory = Array.from(this.taskPreferences.preferredCategories.entries())
      .sort(([,a], [,b]) => b - a)[0];

    return {
      primaryCognitiveStyle: this.cognitiveStyle.perceptionStyle,
      dominantThinkingPattern: this.thinkingPatterns.analysisDepth,
      emotionalTendency: this.emotionalProfile.optimismLevel > 0.6 ? 'optimistic' : 
                        this.emotionalProfile.optimismLevel < 0.4 ? 'pessimistic' : 'balanced',
      preferredTaskType: topCategory ? topCategory[0] : 'unknown',
      interactionMaturity: this.confidence > 0.7 ? 'mature' : 
                          this.confidence > 0.4 ? 'developing' : 'early'
    };
  }
}

/**
 * МЕНЕДЖЕР КОГНИТИВНЫХ ОТПЕЧАТКОВ
 * Управляет отпечатками всех пользователей
 */
class CognitiveFingerprintManager {
  constructor() {
    this.fingerprints = new Map();
    this.similarityEngine = new SimilarityEngine();
    this.predictionEngine = new PredictionEngine();
  }

  /**
   * Получает или создает отпечаток пользователя
   */
  getFingerprintForUser(userId) {
    if (!this.fingerprints.has(userId)) {
      SmartLogger.cognitive(`🆕 Создание нового когнитивного отпечатка для пользователя ${userId}`);
      this.fingerprints.set(userId, new CognitiveFingerprint(userId));
    }
    return this.fingerprints.get(userId);
  }

  /**
   * Обновляет отпечаток пользователя
   */
  updateFingerprint(userId, interaction) {
    const fingerprint = this.getFingerprintForUser(userId);
    fingerprint.updateFromInteraction(interaction);
    
    SmartLogger.cognitive(`🔄 Отпечаток пользователя ${userId} обновлен`);
    return fingerprint;
  }

  /**
   * Адаптирует ответ под когнитивный стиль пользователя
   */
  adaptResponseToUser(userId, baseResponse, context = {}) {
    const fingerprint = this.getFingerprintForUser(userId);
    
    if (fingerprint.confidence < 0.3) {
      return baseResponse; // Недостаточно данных для адаптации
    }

    SmartLogger.cognitive(`🎯 Адаптация ответа под когнитивный стиль пользователя ${userId}...`);

    let adaptedResponse = baseResponse;

    // Адаптация под стиль восприятия
    adaptedResponse = this.adaptForPerceptionStyle(adaptedResponse, fingerprint);
    
    // Адаптация под стиль коммуникации
    adaptedResponse = this.adaptForCommunicationStyle(adaptedResponse, fingerprint);
    
    // Адаптация под эмоциональный профиль
    adaptedResponse = this.adaptForEmotionalProfile(adaptedResponse, fingerprint);
    
    // Адаптация под паттерны мышления
    adaptedResponse = this.adaptForThinkingPatterns(adaptedResponse, fingerprint);

    SmartLogger.cognitive(`✅ Ответ адаптирован под когнитивный стиль`);

    return adaptedResponse;
  }

  /**
   * Адаптирует под стиль восприятия
   */
  adaptForPerceptionStyle(response, fingerprint) {
    const style = fingerprint.cognitiveStyle.perceptionStyle;
    
    if (style === 'visual') {
      // Добавляем визуальные элементы
      response = response.replace(/(\d+)/g, '**$1**'); // Выделяем числа
      response = response.replace(/(шаг \d+)/gi, '🔸 $1'); // Добавляем иконки к шагам
    } else if (style === 'auditory') {
      // Делаем более разговорным
      response = response.replace(/\./g, '..'); // Добавляем паузы
      response = 'Послушайте, ' + response;
    } else if (style === 'kinesthetic') {
      // Добавляем акцент на действия
      response = response.replace(/сделать/g, '**выполнить**');
      response = response.replace(/создать/g, '**построить**');
    }

    return response;
  }

  /**
   * Адаптирует под стиль коммуникации
   */
  adaptForCommunicationStyle(response, fingerprint) {
    const style = fingerprint.cognitiveStyle.communicationStyle;
    
    if (style.includes('formal')) {
      // Делаем более формальным
      response = response.replace(/привет/gi, 'Здравствуйте');
      response = response.replace(/спасибо/gi, 'Благодарю');
    } else if (style.includes('casual')) {
      // Делаем более неформальным
      response = response.replace(/Здравствуйте/gi, 'Привет');
      response = response.replace(/Благодарю/gi, 'Спасибо');
    }
    
    if (style.includes('direct')) {
      // Делаем более прямым
      response = response.replace(/возможно, стоит/gi, 'нужно');
      response = response.replace(/рекомендую/gi, 'сделайте');
    }

    return response;
  }

  /**
   * Адаптирует под эмоциональный профиль
   */
  adaptForEmotionalProfile(response, fingerprint) {
    const profile = fingerprint.emotionalProfile;
    
    if (profile.optimismLevel > 0.7) {
      // Добавляем позитива
      response = response.replace(/проблема/gi, 'задача');
      response = response.replace(/сложно/gi, 'интересно');
      response += ' 🌟';
    } else if (profile.optimismLevel < 0.3) {
      // Делаем более осторожным
      response = response.replace(/легко/gi, 'можно');
      response = response.replace(/быстро/gi, 'постепенно');
    }
    
    if (profile.patienceLevel < 0.3) {
      // Для нетерпеливых - сразу к делу
      response = response.replace(/Сначала давайте разберемся/gi, 'Сразу к делу:');
      response = '⚡ ' + response;
    }

    return response;
  }

  /**
   * Адаптирует под паттерны мышления
   */
  adaptForThinkingPatterns(response, fingerprint) {
    const patterns = fingerprint.thinkingPatterns;
    
    if (patterns.analysisDepth === 'deep') {
      // Добавляем детали
      response = response.replace(/(\w+)\./g, '$1. Это важно, потому что...');
    } else if (patterns.analysisDepth === 'shallow') {
      // Делаем кратким
      response = response.split('.').slice(0, 3).join('.') + '.';
    }
    
    if (patterns.creativityRatio > 0.7) {
      // Добавляем креативности
      response = response.replace(/стандартный/gi, 'уникальный');
      response = response.replace(/обычный/gi, 'креативный');
    }

    return response;
  }

  /**
   * Предсказывает следующий запрос пользователя
   */
  predictNextUserAction(userId) {
    const fingerprint = this.getFingerprintForUser(userId);
    return this.predictionEngine.predict(fingerprint);
  }

  /**
   * Находит похожих пользователей
   */
  findSimilarUsers(userId, threshold = 0.7) {
    const targetFingerprint = this.getFingerprintForUser(userId);
    const similarUsers = [];

    for (const [otherUserId, otherFingerprint] of this.fingerprints) {
      if (otherUserId === userId) continue;
      
      const similarity = this.similarityEngine.calculateSimilarity(
        targetFingerprint, otherFingerprint
      );
      
      if (similarity > threshold) {
        similarUsers.push({
          userId: otherUserId,
          similarity,
          sharedTraits: this.similarityEngine.getSharedTraits(targetFingerprint, otherFingerprint)
        });
      }
    }

    return similarUsers.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Получает статистику всех отпечатков
   */
  getGlobalStatistics() {
    const allFingerprints = Array.from(this.fingerprints.values());
    
    return {
      totalUsers: allFingerprints.length,
      averageConfidence: allFingerprints.reduce((sum, fp) => sum + fp.confidence, 0) / allFingerprints.length,
      matureProfiles: allFingerprints.filter(fp => fp.confidence > 0.7).length,
      commonCognitiveStyles: this.calculateStyleDistribution(allFingerprints),
      activeUsers: allFingerprints.filter(fp => Date.now() - fp.lastUpdated < 24 * 60 * 60 * 1000).length
    };
  }

  /**
   * Вычисляет распределение когнитивных стилей
   */
  calculateStyleDistribution(fingerprints) {
    const distribution = {};
    
    fingerprints.forEach(fp => {
      const style = fp.cognitiveStyle.perceptionStyle;
      distribution[style] = (distribution[style] || 0) + 1;
    });
    
    return distribution;
  }
}

/**
 * ДВИЖОК СХОДСТВА
 * Вычисляет сходство между когнитивными отпечатками
 */
class SimilarityEngine {
  calculateSimilarity(fingerprint1, fingerprint2) {
    let similarity = 0;
    let components = 0;

    // Сходство когнитивных стилей
    similarity += this.compareCognitiveStyles(fingerprint1, fingerprint2) * 0.3;
    components++;

    // Сходство паттернов мышления
    similarity += this.compareThinkingPatterns(fingerprint1, fingerprint2) * 0.3;
    components++;

    // Сходство эмоциональных профилей
    similarity += this.compareEmotionalProfiles(fingerprint1, fingerprint2) * 0.2;
    components++;

    // Сходство предпочтений
    similarity += this.compareTaskPreferences(fingerprint1, fingerprint2) * 0.2;
    components++;

    return similarity / components;
  }

  compareCognitiveStyles(fp1, fp2) {
    let matches = 0;
    let total = 0;

    const styles = ['perceptionStyle', 'processingStyle', 'decisionStyle', 'communicationStyle'];
    
    styles.forEach(style => {
      if (fp1.cognitiveStyle[style] !== 'unknown' && fp2.cognitiveStyle[style] !== 'unknown') {
        total++;
        if (fp1.cognitiveStyle[style] === fp2.cognitiveStyle[style]) {
          matches++;
        }
      }
    });

    return total > 0 ? matches / total : 0;
  }

  compareThinkingPatterns(fp1, fp2) {
    let similarity = 0;
    let components = 0;

    // Сравниваем числовые значения
    const numericPatterns = ['creativityRatio', 'abstractionLevel'];
    
    numericPatterns.forEach(pattern => {
      const val1 = fp1.thinkingPatterns[pattern];
      const val2 = fp2.thinkingPatterns[pattern];
      
      if (typeof val1 === 'number' && typeof val2 === 'number') {
        similarity += 1 - Math.abs(val1 - val2);
        components++;
      }
    });

    return components > 0 ? similarity / components : 0;
  }

  compareEmotionalProfiles(fp1, fp2) {
    let similarity = 0;
    let components = 0;

    const emotions = ['optimismLevel', 'patienceLevel', 'confidenceLevel', 'emotionalStability'];
    
    emotions.forEach(emotion => {
      const val1 = fp1.emotionalProfile[emotion];
      const val2 = fp2.emotionalProfile[emotion];
      
      similarity += 1 - Math.abs(val1 - val2);
      components++;
    });

    return components > 0 ? similarity / components : 0;
  }

  compareTaskPreferences(fp1, fp2) {
    // Сравниваем предпочтения по категориям
    const categories1 = fp1.taskPreferences.preferredCategories;
    const categories2 = fp2.taskPreferences.preferredCategories;
    
    const allCategories = new Set([...categories1.keys(), ...categories2.keys()]);
    let similarity = 0;
    
    for (const category of allCategories) {
      const freq1 = categories1.get(category) || 0;
      const freq2 = categories2.get(category) || 0;
      const maxFreq = Math.max(freq1, freq2);
      
      if (maxFreq > 0) {
        similarity += Math.min(freq1, freq2) / maxFreq;
      }
    }

    return allCategories.size > 0 ? similarity / allCategories.size : 0;
  }

  getSharedTraits(fp1, fp2) {
    const traits = [];

    // Общие когнитивные стили
    if (fp1.cognitiveStyle.perceptionStyle === fp2.cognitiveStyle.perceptionStyle && 
        fp1.cognitiveStyle.perceptionStyle !== 'unknown') {
      traits.push(`Общий стиль восприятия: ${fp1.cognitiveStyle.perceptionStyle}`);
    }

    // Схожие эмоциональные характеристики
    if (Math.abs(fp1.emotionalProfile.optimismLevel - fp2.emotionalProfile.optimismLevel) < 0.2) {
      const level = fp1.emotionalProfile.optimismLevel > 0.6 ? 'высокий' : 
                   fp1.emotionalProfile.optimismLevel < 0.4 ? 'низкий' : 'средний';
      traits.push(`Схожий уровень оптимизма: ${level}`);
    }

    return traits;
  }
}

/**
 * ДВИЖОК ПРЕДСКАЗАНИЙ
 * Предсказывает будущие действия пользователя
 */
class PredictionEngine {
  predict(fingerprint) {
    if (fingerprint.confidence < 0.4) {
      return { confidence: 0, predictions: [] };
    }

    const predictions = [];

    // Предсказание на основе времени
    predictions.push(this.predictByTime(fingerprint));
    
    // Предсказание на основе паттернов
    predictions.push(this.predictByPatterns(fingerprint));
    
    // Предсказание на основе эмоций
    predictions.push(this.predictByEmotions(fingerprint));

    return {
      confidence: fingerprint.confidence * 0.8,
      predictions: predictions.filter(p => p.confidence > 0.3)
    };
  }

  predictByTime(fingerprint) {
    const currentHour = new Date().getHours();
    const activeHours = fingerprint.taskPreferences.activeHours;
    
    if (activeHours.includes(currentHour)) {
      return {
        type: 'temporal',
        description: 'Пользователь вероятно активен в это время',
        confidence: 0.7,
        action: 'likely_to_interact'
      };
    }
    
    return { confidence: 0 };
  }

  predictByPatterns(fingerprint) {
    const recentCategories = fingerprint.interactionHistory.slice(-5)
      .map(i => i.category);
    
    if (recentCategories.length > 0) {
      const lastCategory = recentCategories[recentCategories.length - 1];
      
      return {
        type: 'pattern',
        description: `Вероятно продолжит работу в категории ${lastCategory}`,
        confidence: 0.6,
        action: 'continue_category',
        category: lastCategory
      };
    }
    
    return { confidence: 0 };
  }

  predictByEmotions(fingerprint) {
    const emotions = fingerprint.emotionalProfile;
    
    if (emotions.patienceLevel < 0.3) {
      return {
        type: 'emotional',
        description: 'Пользователь нетерпелив, предпочтет быстрые решения',
        confidence: 0.8,
        action: 'prefer_quick_solutions'
      };
    }
    
    return { confidence: 0 };
  }
}

module.exports = {
  CognitiveFingerprintManager,
  CognitiveFingerprint,
  SimilarityEngine,
  PredictionEngine
};