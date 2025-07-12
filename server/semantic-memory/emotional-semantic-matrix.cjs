/**
 * ЭМОЦИОНАЛЬНО-СЕМАНТИЧЕСКАЯ МАТРИЦА
 * Революционная система анализа эмоциональных подтекстов в реальном времени
 * 
 * Принцип: Синхронизация с эмоциональным состоянием пользователя и предсказание
 * эмоциональных потребностей до их озвучивания
 */

const SmartLogger = {
  emotional: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`💝🧠 [${timestamp}] EMOTIONAL-MATRIX: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * ЭМОЦИОНАЛЬНОЕ СОСТОЯНИЕ
 * Представляет текущее эмоциональное состояние пользователя
 */
class EmotionalState {
  constructor() {
    this.timestamp = Date.now();
    
    // Базовые эмоции (модель Экмана)
    this.basicEmotions = {
      joy: 0.5,        // Радость
      sadness: 0.5,    // Грусть
      anger: 0.5,      // Гнев
      fear: 0.5,       // Страх
      surprise: 0.5,   // Удивление
      disgust: 0.5     // Отвращение
    };

    // Сложные эмоции
    this.complexEmotions = {
      excitement: 0.5,     // Волнение
      frustration: 0.5,    // Фрустрация
      confidence: 0.5,     // Уверенность
      anxiety: 0.5,        // Тревожность
      curiosity: 0.5,      // Любопытство
      satisfaction: 0.5,   // Удовлетворение
      anticipation: 0.5,   // Предвкушение
      empathy: 0.5         // Эмпатия
    };

    // Мета-эмоциональные характеристики
    this.metaEmotions = {
      emotionalStability: 0.5,    // Эмоциональная стабильность
      emotionalIntensity: 0.5,    // Интенсивность эмоций
      emotionalClarity: 0.5,      // Ясность эмоций
      emotionalControl: 0.5,      // Контроль эмоций
      emotionalAdaptability: 0.5  // Адаптивность эмоций
    };

    // Контекстуальные факторы
    this.contextualFactors = {
      timeOfDay: this.getTimeOfDayFactor(),
      seasonality: this.getSeasonalityFactor(),
      socialContext: 0.5,
      workContext: 0.5,
      personalContext: 0.5
    };

    this.dominantEmotion = null;
    this.emotionalVector = this.calculateEmotionalVector();
    this.confidence = 0.3; // Начальная уверенность низкая
  }

  /**
   * Обновляет эмоциональное состояние на основе текста
   */
  updateFromText(text, context = {}) {
    SmartLogger.emotional(`🔄 Обновление эмоционального состояния из текста: "${text.substring(0, 30)}..."`);

    // Анализируем базовые эмоции
    this.analyzeBasicEmotions(text);
    
    // Анализируем сложные эмоции
    this.analyzeComplexEmotions(text);
    
    // Анализируем мета-эмоции
    this.analyzeMetaEmotions(text, context);
    
    // Обновляем контекстуальные факторы
    this.updateContextualFactors(context);
    
    // Пересчитываем доминирующую эмоцию и вектор
    this.dominantEmotion = this.findDominantEmotion();
    this.emotionalVector = this.calculateEmotionalVector();
    this.confidence = this.calculateConfidence();
    
    this.timestamp = Date.now();

    SmartLogger.emotional(`📊 Доминирующая эмоция: ${this.dominantEmotion} (уверенность: ${(this.confidence * 100).toFixed(1)}%)`);
  }

  /**
   * Анализирует базовые эмоции в тексте
   */
  analyzeBasicEmotions(text) {
    const lowerText = text.toLowerCase();

    // Радость
    const joyWords = ['счастлив', 'рад', 'отлично', 'прекрасно', 'замечательно', 'круто', 'супер'];
    const joyScore = this.calculateEmotionScore(lowerText, joyWords);
    this.basicEmotions.joy = this.smoothUpdate(this.basicEmotions.joy, joyScore, 0.3);

    // Грусть
    const sadnessWords = ['грустно', 'печально', 'расстроен', 'плохо', 'ужасно'];
    const sadnessScore = this.calculateEmotionScore(lowerText, sadnessWords);
    this.basicEmotions.sadness = this.smoothUpdate(this.basicEmotions.sadness, sadnessScore, 0.3);

    // Гнев/Фрустрация
    const angerWords = ['злой', 'раздражен', 'бесит', 'достало', 'ненавижу'];
    const angerScore = this.calculateEmotionScore(lowerText, angerWords);
    this.basicEmotions.anger = this.smoothUpdate(this.basicEmotions.anger, angerScore, 0.3);

    // Страх/Тревога
    const fearWords = ['боюсь', 'страшно', 'тревожно', 'волнуюсь', 'переживаю'];
    const fearScore = this.calculateEmotionScore(lowerText, fearWords);
    this.basicEmotions.fear = this.smoothUpdate(this.basicEmotions.fear, fearScore, 0.3);

    // Удивление
    const surpriseWords = ['удивительно', 'неожиданно', 'вау', 'ого', 'не может быть'];
    const surpriseScore = this.calculateEmotionScore(lowerText, surpriseWords);
    this.basicEmotions.surprise = this.smoothUpdate(this.basicEmotions.surprise, surpriseScore, 0.3);
  }

  /**
   * Анализирует сложные эмоции
   */
  analyzeComplexEmotions(text) {
    const lowerText = text.toLowerCase();

    // Волнение
    const excitementWords = ['интересно', 'захватывающе', 'не могу дождаться', 'предвкушаю'];
    const excitementScore = this.calculateEmotionScore(lowerText, excitementWords);
    this.complexEmotions.excitement = this.smoothUpdate(this.complexEmotions.excitement, excitementScore, 0.2);

    // Фрустрация
    const frustrationWords = ['не получается', 'не работает', 'сложно', 'проблема'];
    const frustrationScore = this.calculateEmotionScore(lowerText, frustrationWords);
    this.complexEmotions.frustration = this.smoothUpdate(this.complexEmotions.frustration, frustrationScore, 0.3);

    // Уверенность
    const confidenceWords = ['уверен', 'точно', 'определенно', 'знаю', 'понимаю'];
    const confidenceScore = this.calculateEmotionScore(lowerText, confidenceWords);
    this.complexEmotions.confidence = this.smoothUpdate(this.complexEmotions.confidence, confidenceScore, 0.2);

    // Любопытство
    const curiosityWords = ['интересно', 'хочу узнать', 'как это', 'почему', 'что если'];
    const curiosityScore = this.calculateEmotionScore(lowerText, curiosityWords);
    this.complexEmotions.curiosity = this.smoothUpdate(this.complexEmotions.curiosity, curiosityScore, 0.2);

    // Тревожность
    const anxietyWords = ['переживаю', 'волнуюсь', 'беспокоюсь', 'не уверен'];
    const anxietyScore = this.calculateEmotionScore(lowerText, anxietyWords);
    this.complexEmotions.anxiety = this.smoothUpdate(this.complexEmotions.anxiety, anxietyScore, 0.3);
  }

  /**
   * Анализирует мета-эмоции
   */
  analyzeMetaEmotions(text, context) {
    // Эмоциональная стабильность (на основе консистентности)
    const variability = this.calculateEmotionalVariability();
    this.metaEmotions.emotionalStability = 1 - Math.min(1, variability);

    // Интенсивность эмоций
    const intensity = this.calculateEmotionalIntensity();
    this.metaEmotions.emotionalIntensity = intensity;

    // Ясность эмоций (количество восклицательных знаков, капса)
    const exclamationCount = (text.match(/!/g) || []).length;
    const capsRatio = (text.match(/[A-ZА-Я]/g) || []).length / text.length;
    const clarityScore = Math.min(1, (exclamationCount / 3) + (capsRatio * 2));
    this.metaEmotions.emotionalClarity = this.smoothUpdate(this.metaEmotions.emotionalClarity, clarityScore, 0.2);

    // Эмоциональный контроль (на основе структурированности текста)
    const controlScore = this.assessEmotionalControl(text);
    this.metaEmotions.emotionalControl = this.smoothUpdate(this.metaEmotions.emotionalControl, controlScore, 0.1);
  }

  /**
   * Вычисляет оценку эмоции на основе ключевых слов
   */
  calculateEmotionScore(text, keywords) {
    let score = 0;
    let wordCount = 0;

    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
        wordCount += matches.length;
      }
    }

    // Нормализуем по длине текста
    const normalizedScore = Math.min(1, score / Math.max(1, text.length / 100));
    return normalizedScore;
  }

  /**
   * Плавное обновление значения
   */
  smoothUpdate(currentValue, newValue, learningRate) {
    return currentValue * (1 - learningRate) + newValue * learningRate;
  }

  /**
   * Вычисляет эмоциональную вариативность
   */
  calculateEmotionalVariability() {
    const allEmotions = {...this.basicEmotions, ...this.complexEmotions};
    const values = Object.values(allEmotions);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Вычисляет интенсивность эмоций
   */
  calculateEmotionalIntensity() {
    const allEmotions = {...this.basicEmotions, ...this.complexEmotions};
    const values = Object.values(allEmotions);
    const intensity = values.reduce((sum, val) => sum + Math.abs(val - 0.5), 0) / values.length;
    return intensity * 2; // Нормализуем к [0, 1]
  }

  /**
   * Оценивает эмоциональный контроль
   */
  assessEmotionalControl(text) {
    let controlScore = 0.5;

    // Структурированность (наличие пунктуации)
    const punctuationRatio = (text.match(/[.!?,:;]/g) || []).length / text.length;
    controlScore += Math.min(0.3, punctuationRatio * 10);

    // Отсутствие чрезмерной эмоциональности
    const excessiveEmotions = (text.match(/!{2,}|[A-ZА-Я]{3,}/g) || []).length;
    controlScore -= Math.min(0.3, excessiveEmotions / 5);

    return Math.max(0, Math.min(1, controlScore));
  }

  /**
   * Находит доминирующую эмоцию
   */
  findDominantEmotion() {
    const allEmotions = {...this.basicEmotions, ...this.complexEmotions};
    let maxValue = 0;
    let dominantEmotion = null;

    for (const [emotion, value] of Object.entries(allEmotions)) {
      if (value > maxValue && value > 0.6) { // Порог значимости
        maxValue = value;
        dominantEmotion = emotion;
      }
    }

    return dominantEmotion;
  }

  /**
   * Вычисляет эмоциональный вектор
   */
  calculateEmotionalVector() {
    // Создаем двумерный вектор: валентность (положительность) и возбуждение (энергия)
    const valence = this.calculateValence();
    const arousal = this.calculateArousal();

    return { valence, arousal };
  }

  /**
   * Вычисляет валентность (положительность эмоций)
   */
  calculateValence() {
    const positive = this.basicEmotions.joy + this.complexEmotions.excitement + 
                    this.complexEmotions.satisfaction + this.complexEmotions.confidence;
    const negative = this.basicEmotions.sadness + this.basicEmotions.anger + 
                    this.basicEmotions.fear + this.complexEmotions.frustration + 
                    this.complexEmotions.anxiety;

    return (positive - negative) / 8 + 0.5; // Нормализуем к [0, 1]
  }

  /**
   * Вычисляет возбуждение (энергетический уровень)
   */
  calculateArousal() {
    const highArousal = this.basicEmotions.anger + this.basicEmotions.surprise + 
                       this.complexEmotions.excitement + this.complexEmotions.anxiety;
    const lowArousal = this.basicEmotions.sadness + this.complexEmotions.satisfaction;

    return (highArousal - lowArousal) / 6 + 0.5; // Нормализуем к [0, 1]
  }

  /**
   * Получает фактор времени дня
   */
  getTimeOfDayFactor() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 0.7; // Утро - умеренная энергия
    if (hour >= 12 && hour < 18) return 0.8; // День - высокая энергия
    if (hour >= 18 && hour < 22) return 0.6; // Вечер - снижение энергии
    return 0.4; // Ночь - низкая энергия
  }

  /**
   * Получает сезонный фактор
   */
  getSeasonalityFactor() {
    const month = new Date().getMonth();
    
    // Весна (март-май): рост энергии
    if (month >= 2 && month <= 4) return 0.8;
    // Лето (июнь-август): высокая энергия
    if (month >= 5 && month <= 7) return 0.9;
    // Осень (сентябрь-ноябрь): снижение энергии
    if (month >= 8 && month <= 10) return 0.6;
    // Зима (декабрь-февраль): низкая энергия
    return 0.5;
  }

  /**
   * Обновляет контекстуальные факторы
   */
  updateContextualFactors(context) {
    if (context.socialInteraction) {
      this.contextualFactors.socialContext = 0.8;
    }
    if (context.workRelated) {
      this.contextualFactors.workContext = 0.7;
    }
    if (context.personalMatter) {
      this.contextualFactors.personalContext = 0.9;
    }
  }

  /**
   * Вычисляет общую уверенность в эмоциональной оценке
   */
  calculateConfidence() {
    let confidence = 0.3; // Базовая уверенность

    // Уверенность от ясности доминирующей эмоции
    if (this.dominantEmotion) {
      const dominantValue = this.basicEmotions[this.dominantEmotion] || 
                           this.complexEmotions[this.dominantEmotion] || 0;
      confidence += dominantValue * 0.4;
    }

    // Уверенность от эмоциональной ясности
    confidence += this.metaEmotions.emotionalClarity * 0.2;

    // Уверенность от стабильности
    confidence += this.metaEmotions.emotionalStability * 0.1;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Экспортирует состояние в компактном виде
   */
  export() {
    return {
      timestamp: this.timestamp,
      dominantEmotion: this.dominantEmotion,
      emotionalVector: this.emotionalVector,
      confidence: this.confidence,
      basicEmotions: this.basicEmotions,
      complexEmotions: this.complexEmotions,
      metaEmotions: this.metaEmotions,
      contextualFactors: this.contextualFactors
    };
  }
}

/**
 * ПРЕДИКТОР ЭМОЦИОНАЛЬНЫХ ПОТРЕБНОСТЕЙ
 * Предсказывает эмоциональные потребности до их озвучивания
 */
class EmotionalNeedsPredictor {
  constructor() {
    this.emotionalPatterns = new Map();
    this.transitionMatrix = new Map(); // Матрица переходов между эмоциональными состояниями
    this.predictionHistory = [];
    this.maxHistorySize = 100;
    
    this.initializePredictionModels();
  }

  /**
   * Инициализирует модели предсказания
   */
  initializePredictionModels() {
    // Типичные эмоциональные потребности для каждого состояния
    this.emotionalNeeds = {
      joy: ['maintain_positivity', 'share_success', 'amplify_happiness'],
      sadness: ['provide_comfort', 'offer_hope', 'gentle_support'],
      anger: ['acknowledge_frustration', 'offer_solutions', 'calm_approach'],
      fear: ['provide_reassurance', 'offer_guidance', 'reduce_uncertainty'],
      surprise: ['provide_explanation', 'help_process', 'offer_context'],
      excitement: ['match_enthusiasm', 'provide_opportunities', 'encourage_action'],
      frustration: ['offer_alternatives', 'simplify_approach', 'provide_patience'],
      confidence: ['challenge_appropriately', 'provide_advanced_options', 'respect_expertise'],
      anxiety: ['provide_structure', 'reduce_complexity', 'offer_reassurance'],
      curiosity: ['provide_detailed_information', 'offer_exploration', 'encourage_learning']
    };

    SmartLogger.emotional('🧠 Модели предсказания эмоциональных потребностей инициализированы');
  }

  /**
   * Предсказывает эмоциональные потребности
   */
  predictEmotionalNeeds(currentState, context = {}) {
    SmartLogger.emotional(`🔮 Предсказание эмоциональных потребностей для состояния: ${currentState.dominantEmotion}`);

    const predictions = {
      immediate: [], // Немедленные потребности
      shortTerm: [], // Краткосрочные потребности
      anticipated: [], // Предвосхищаемые потребности
      preventive: [] // Превентивные меры
    };

    // 1. Анализ текущего состояния
    this.analyzeCurrentNeeds(currentState, predictions);

    // 2. Предсказание на основе эмоциональных переходов
    this.predictTransitionNeeds(currentState, predictions);

    // 3. Контекстуальные предсказания
    this.addContextualPredictions(currentState, context, predictions);

    // 4. Предсказание на основе истории
    this.addHistoricalPredictions(currentState, predictions);

    // 5. Превентивные предсказания
    this.addPreventivePredictions(currentState, predictions);

    SmartLogger.emotional(`📊 Предсказано потребностей: ${Object.values(predictions).flat().length}`);

    return predictions;
  }

  /**
   * Анализирует текущие потребности
   */
  analyzeCurrentNeeds(state, predictions) {
    if (state.dominantEmotion && this.emotionalNeeds[state.dominantEmotion]) {
      const needs = this.emotionalNeeds[state.dominantEmotion];
      
      needs.forEach(need => {
        predictions.immediate.push({
          type: need,
          confidence: state.confidence,
          intensity: this.calculateNeedIntensity(state, need),
          reasoning: `Текущее доминирующее состояние: ${state.dominantEmotion}`
        });
      });
    }

    // Дополнительные потребности на основе мета-эмоций
    if (state.metaEmotions.emotionalStability < 0.4) {
      predictions.immediate.push({
        type: 'emotional_stabilization',
        confidence: 0.8,
        intensity: 1 - state.metaEmotions.emotionalStability,
        reasoning: 'Низкая эмоциональная стабильность'
      });
    }

    if (state.metaEmotions.emotionalClarity < 0.5) {
      predictions.immediate.push({
        type: 'clarification_support',
        confidence: 0.7,
        intensity: 1 - state.metaEmotions.emotionalClarity,
        reasoning: 'Неясность эмоционального состояния'
      });
    }
  }

  /**
   * Предсказывает потребности на основе переходов
   */
  predictTransitionNeeds(state, predictions) {
    const likelyTransitions = this.predictEmotionalTransitions(state);
    
    likelyTransitions.forEach(transition => {
      if (transition.probability > 0.6) {
        const targetNeeds = this.emotionalNeeds[transition.targetEmotion] || [];
        
        targetNeeds.forEach(need => {
          predictions.shortTerm.push({
            type: need,
            confidence: transition.probability,
            intensity: 0.6,
            reasoning: `Возможный переход к: ${transition.targetEmotion}`,
            timeframe: '5-15 минут'
          });
        });
      }
    });
  }

  /**
   * Предсказывает эмоциональные переходы
   */
  predictEmotionalTransitions(state) {
    const transitions = [];

    // На основе эмоционального вектора
    const { valence, arousal } = state.emotionalVector;

    // Высокое возбуждение + негативная валентность → вероятен переход к фрустрации
    if (arousal > 0.7 && valence < 0.4) {
      transitions.push({
        targetEmotion: 'frustration',
        probability: 0.8,
        timeframe: 'short'
      });
    }

    // Низкая стабильность → вероятны резкие переходы
    if (state.metaEmotions.emotionalStability < 0.4) {
      transitions.push({
        targetEmotion: 'anxiety',
        probability: 0.7,
        timeframe: 'immediate'
      });
    }

    // Высокое любопытство → вероятен переход к удовлетворению или фрустрации
    if (state.complexEmotions.curiosity > 0.7) {
      transitions.push({
        targetEmotion: 'satisfaction',
        probability: 0.6,
        timeframe: 'medium'
      });
    }

    return transitions;
  }

  /**
   * Добавляет контекстуальные предсказания
   */
  addContextualPredictions(state, context, predictions) {
    // Временной контекст
    const hour = new Date().getHours();
    if (hour > 20 || hour < 8) {
      predictions.anticipated.push({
        type: 'fatigue_support',
        confidence: 0.6,
        intensity: 0.7,
        reasoning: 'Позднее время может вызвать усталость',
        timeframe: 'continuous'
      });
    }

    // Рабочий контекст
    if (context.workRelated) {
      predictions.anticipated.push({
        type: 'productivity_support',
        confidence: 0.7,
        intensity: 0.6,
        reasoning: 'Рабочий контекст требует продуктивности',
        timeframe: 'session'
      });
    }

    // Социальный контекст
    if (context.socialInteraction) {
      predictions.anticipated.push({
        type: 'social_comfort',
        confidence: 0.5,
        intensity: 0.5,
        reasoning: 'Социальное взаимодействие может требовать комфорта',
        timeframe: 'interaction'
      });
    }
  }

  /**
   * Добавляет предсказания на основе истории
   */
  addHistoricalPredictions(state, predictions) {
    // Анализируем паттерны из истории
    const historicalPatterns = this.analyzeHistoricalPatterns(state);
    
    historicalPatterns.forEach(pattern => {
      if (pattern.confidence > 0.6) {
        predictions.anticipated.push({
          type: pattern.predictedNeed,
          confidence: pattern.confidence,
          intensity: pattern.intensity,
          reasoning: `Исторический паттерн: ${pattern.description}`,
          timeframe: pattern.timeframe
        });
      }
    });
  }

  /**
   * Анализирует исторические паттерны
   */
  analyzeHistoricalPatterns(state) {
    const patterns = [];
    
    // Простой анализ на основе доминирующей эмоции
    if (this.predictionHistory.length > 5) {
      const recentStates = this.predictionHistory.slice(-5);
      const emotionFreq = {};
      
      recentStates.forEach(entry => {
        const emotion = entry.dominantEmotion;
        emotionFreq[emotion] = (emotionFreq[emotion] || 0) + 1;
      });

      // Ищем повторяющиеся паттерны
      for (const [emotion, freq] of Object.entries(emotionFreq)) {
        if (freq >= 3 && emotion === state.dominantEmotion) {
          patterns.push({
            predictedNeed: 'pattern_break_support',
            confidence: 0.7,
            intensity: 0.6,
            description: `Повторяющееся состояние: ${emotion}`,
            timeframe: 'medium'
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Добавляет превентивные предсказания
   */
  addPreventivePredictions(state, predictions) {
    // Предотвращение эмоционального выгорания
    if (state.metaEmotions.emotionalIntensity > 0.8) {
      predictions.preventive.push({
        type: 'intensity_regulation',
        confidence: 0.8,
        intensity: state.metaEmotions.emotionalIntensity,
        reasoning: 'Высокая эмоциональная интенсивность может привести к выгоранию',
        preventionStrategy: 'Предложить перерыв или смену активности'
      });
    }

    // Предотвращение фрустрации
    if (state.complexEmotions.curiosity > 0.7 && state.complexEmotions.confidence < 0.4) {
      predictions.preventive.push({
        type: 'frustration_prevention',
        confidence: 0.7,
        intensity: 0.6,
        reasoning: 'Высокое любопытство + низкая уверенность = риск фрустрации',
        preventionStrategy: 'Предоставить структурированную помощь'
      });
    }

    // Предотвращение тревожности
    if (state.basicEmotions.fear > 0.6 || state.complexEmotions.anxiety > 0.6) {
      predictions.preventive.push({
        type: 'anxiety_prevention',
        confidence: 0.8,
        intensity: Math.max(state.basicEmotions.fear, state.complexEmotions.anxiety),
        reasoning: 'Повышенные страх или тревожность',
        preventionStrategy: 'Предоставить дополнительную поддержку и уверенность'
      });
    }
  }

  /**
   * Вычисляет интенсивность потребности
   */
  calculateNeedIntensity(state, needType) {
    // Базовая интенсивность зависит от интенсивности эмоций
    intensity = state.metaEmotions.emotionalIntensity;

    // Корректировки для конкретных типов потребностей
    switch (needType) {
      case 'provide_comfort':
      case 'offer_hope':
        intensity *= state.basicEmotions.sadness;
        break;
      case 'acknowledge_frustration':
      case 'offer_solutions':
        intensity *= state.complexEmotions.frustration;
        break;
      case 'provide_reassurance':
        intensity *= (state.basicEmotions.fear + state.complexEmotions.anxiety) / 2;
        break;
      case 'match_enthusiasm':
        intensity *= state.complexEmotions.excitement;
        break;
    }

    return Math.max(0, Math.min(1, intensity));
  }

  /**
   * Сохраняет состояние в историю для обучения
   */
  recordState(state) {
    this.predictionHistory.push({
      timestamp: Date.now(),
      dominantEmotion: state.dominantEmotion,
      emotionalVector: state.emotionalVector,
      metaEmotions: {...state.metaEmotions}
    });

    // Поддерживаем размер истории
    if (this.predictionHistory.length > this.maxHistorySize) {
      this.predictionHistory = this.predictionHistory.slice(-this.maxHistorySize);
    }
  }
}

/**
 * АДАПТИВНЫЙ ГЕНЕРАТОР ОТВЕТОВ
 * Генерирует ответы, синхронизированные с эмоциональным состоянием
 */
class EmotionalResponseAdapter {
  constructor() {
    this.adaptationStrategies = new Map();
    this.responseTemplates = new Map();
    this.tonalAdjustments = new Map();
    
    this.initializeAdaptationStrategies();
  }

  /**
   * Инициализирует стратегии адаптации
   */
  initializeAdaptationStrategies() {
    // Стратегии для базовых эмоций
    this.adaptationStrategies.set('joy', {
      tone: 'enthusiastic',
      pacing: 'energetic',
      structure: 'celebratory',
      vocabulary: 'positive_amplifying'
    });

    this.adaptationStrategies.set('sadness', {
      tone: 'gentle',
      pacing: 'slow',
      structure: 'supportive',
      vocabulary: 'comforting'
    });

    this.adaptationStrategies.set('anger', {
      tone: 'calm',
      pacing: 'measured',
      structure: 'solution_focused',
      vocabulary: 'neutral_professional'
    });

    this.adaptationStrategies.set('fear', {
      tone: 'reassuring',
      pacing: 'steady',
      structure: 'step_by_step',
      vocabulary: 'confidence_building'
    });

    this.adaptationStrategies.set('frustration', {
      tone: 'understanding',
      pacing: 'patient',
      structure: 'alternative_focused',
      vocabulary: 'simplifying'
    });

    this.adaptationStrategies.set('excitement', {
      tone: 'matching_energy',
      pacing: 'dynamic',
      structure: 'opportunity_focused',
      vocabulary: 'action_oriented'
    });

    this.adaptationStrategies.set('curiosity', {
      tone: 'informative',
      pacing: 'detailed',
      structure: 'educational',
      vocabulary: 'exploratory'
    });

    this.adaptationStrategies.set('anxiety', {
      tone: 'calming',
      pacing: 'structured',
      structure: 'clear_guidance',
      vocabulary: 'certainty_providing'
    });
  }

  /**
   * Адаптирует ответ под эмоциональное состояние
   */
  adaptResponse(originalResponse, emotionalState, predictedNeeds) {
    SmartLogger.emotional(`🎭 Адаптация ответа под эмоциональное состояние: ${emotionalState.dominantEmotion}`);

    if (emotionalState.confidence < 0.4) {
      SmartLogger.emotional('⚠️ Низкая уверенность в эмоциональном состоянии, минимальная адаптация');
      return {
        response: originalResponse,
        adaptations: ['low_confidence_minimal_adaptation'],
        emotionalAlignment: 'uncertain'
      };
    }

    let adaptedResponse = originalResponse;
    const adaptations = [];

    // 1. Адаптация тона
    const toneAdaptation = this.adaptTone(adaptedResponse, emotionalState);
    adaptedResponse = toneAdaptation.response;
    adaptations.push(toneAdaptation.adaptation);

    // 2. Структурная адаптация
    const structureAdaptation = this.adaptStructure(adaptedResponse, emotionalState);
    adaptedResponse = structureAdaptation.response;
    adaptations.push(structureAdaptation.adaptation);

    // 3. Адаптация словаря
    const vocabularyAdaptation = this.adaptVocabulary(adaptedResponse, emotionalState);
    adaptedResponse = vocabularyAdaptation.response;
    adaptations.push(vocabularyAdaptation.adaptation);

    // 4. Добавление эмоциональной поддержки
    const supportAdaptation = this.addEmotionalSupport(adaptedResponse, emotionalState, predictedNeeds);
    adaptedResponse = supportAdaptation.response;
    adaptations.push(supportAdaptation.adaptation);

    // 5. Превентивные адаптации
    const preventiveAdaptation = this.addPreventiveMeasures(adaptedResponse, predictedNeeds);
    adaptedResponse = preventiveAdaptation.response;
    adaptations.push(preventiveAdaptation.adaptation);

    SmartLogger.emotional(`✨ Ответ адаптирован с ${adaptations.length} модификациями`);

    return {
      response: adaptedResponse,
      adaptations,
      emotionalAlignment: this.calculateEmotionalAlignment(emotionalState),
      originalLength: originalResponse.length,
      adaptedLength: adaptedResponse.length
    };
  }

  /**
   * Адаптирует тон ответа
   */
  adaptTone(response, state) {
    const strategy = this.adaptationStrategies.get(state.dominantEmotion);
    if (!strategy) return { response, adaptation: 'no_tone_adaptation' };

    let adaptedResponse = response;
    let adaptation = '';

    switch (strategy.tone) {
      case 'enthusiastic':
        // Добавляем энтузиазм
        adaptedResponse = '🌟 ' + adaptedResponse;
        if (!adaptedResponse.includes('!')) {
          adaptedResponse = adaptedResponse.replace(/\.$/, '!');
        }
        adaptation = 'added_enthusiasm';
        break;

      case 'gentle':
        // Смягчаем тон
        adaptedResponse = '💙 ' + adaptedResponse.replace(/!/g, '.');
        adaptation = 'gentled_tone';
        break;

      case 'calm':
        // Успокаивающий тон
        adaptedResponse = '🤝 ' + adaptedResponse.replace(/[!]{2,}/g, '.');
        adaptation = 'calmed_tone';
        break;

      case 'reassuring':
        // Добавляем уверенность
        adaptedResponse = '✅ ' + adaptedResponse;
        adaptation = 'added_reassurance';
        break;

      case 'understanding':
        // Понимающий тон
        adaptedResponse = '🤗 Понимаю ваши сложности. ' + adaptedResponse;
        adaptation = 'added_understanding';
        break;

      case 'matching_energy':
        // Соответствуем энергии
        adaptedResponse = '⚡ ' + adaptedResponse + ' Давайте действовать!';
        adaptation = 'matched_energy';
        break;

      case 'calming':
        // Успокаивающий подход
        adaptedResponse = '🌿 Давайте разберем это спокойно. ' + adaptedResponse;
        adaptation = 'added_calm';
        break;
    }

    return { response: adaptedResponse, adaptation };
  }

  /**
   * Адаптирует структуру ответа
   */
  adaptStructure(response, state) {
    const strategy = this.adaptationStrategies.get(state.dominantEmotion);
    if (!strategy) return { response, adaptation: 'no_structure_adaptation' };

    let adaptedResponse = response;
    let adaptation = '';

    switch (strategy.structure) {
      case 'step_by_step':
        // Разбиваем на шаги
        const sentences = response.split('. ');
        if (sentences.length > 2) {
          adaptedResponse = sentences.map((sentence, index) => 
            `${index + 1}. ${sentence}${sentence.endsWith('.') ? '' : '.'}`
          ).join('\n');
          adaptation = 'structured_as_steps';
        }
        break;

      case 'supportive':
        // Добавляем поддерживающие элементы
        adaptedResponse = adaptedResponse + '\n\nВы справитесь с этим. Я здесь, чтобы помочь.';
        adaptation = 'added_support';
        break;

      case 'solution_focused':
        // Фокус на решениях
        adaptedResponse = '🎯 **Решение:** ' + adaptedResponse;
        adaptation = 'solution_focused';
        break;

      case 'educational':
        // Образовательная структура
        adaptedResponse = '📚 **Объяснение:** ' + adaptedResponse + '\n\n💡 **Дополнительно:** Это поможет вам лучше понять тему.';
        adaptation = 'educational_structure';
        break;

      case 'clear_guidance':
        // Четкое руководство
        adaptedResponse = '📋 **Четкий план:** \n' + adaptedResponse;
        adaptation = 'clear_guidance';
        break;
    }

    return { response: adaptedResponse, adaptation };
  }

  /**
   * Адаптирует словарь
   */
  adaptVocabulary(response, state) {
    const strategy = this.adaptationStrategies.get(state.dominantEmotion);
    if (!strategy) return { response, adaptation: 'no_vocabulary_adaptation' };

    let adaptedResponse = response;
    let adaptation = '';

    switch (strategy.vocabulary) {
      case 'positive_amplifying':
        // Усиливаем позитивные слова
        adaptedResponse = adaptedResponse
          .replace(/хорошо/g, 'отлично')
          .replace(/неплохо/g, 'прекрасно')
          .replace(/можно/g, 'легко можно');
        adaptation = 'amplified_positive';
        break;

      case 'comforting':
        // Утешающие слова
        adaptedResponse = adaptedResponse
          .replace(/нужно/g, 'можно попробовать')
          .replace(/должен/g, 'мог бы')
          .replace(/проблема/g, 'задача');
        adaptation = 'comforting_vocabulary';
        break;

      case 'simplifying':
        // Упрощающий словарь
        adaptedResponse = adaptedResponse
          .replace(/реализовать/g, 'сделать')
          .replace(/оптимизировать/g, 'улучшить')
          .replace(/функциональность/g, 'возможности');
        adaptation = 'simplified_vocabulary';
        break;

      case 'confidence_building':
        // Строящий уверенность
        adaptedResponse = adaptedResponse
          .replace(/попробуйте/g, 'вы сможете')
          .replace(/возможно/g, 'определенно')
          .replace(/может быть/g, 'точно');
        adaptation = 'confidence_building';
        break;
    }

    return { response: adaptedResponse, adaptation };
  }

  /**
   * Добавляет эмоциональную поддержку
   */
  addEmotionalSupport(response, state, predictedNeeds) {
    let adaptedResponse = response;
    let adaptation = '';

    // Анализируем немедленные потребности
    const immediateNeeds = predictedNeeds.immediate || [];
    
    for (const need of immediateNeeds) {
      if (need.intensity > 0.7) {
        switch (need.type) {
          case 'provide_comfort':
            adaptedResponse += '\n\n💝 Помните: трудные времена проходят, и вы не одиноки в этом.';
            adaptation += 'comfort_added ';
            break;

          case 'acknowledge_frustration':
            adaptedResponse += '\n\n🤝 Понимаю, что это может расстраивать. Ваши чувства абсолютно нормальны.';
            adaptation += 'frustration_acknowledged ';
            break;

          case 'provide_reassurance':
            adaptedResponse += '\n\n✅ Все будет хорошо. Мы найдем решение шаг за шагом.';
            adaptation += 'reassurance_added ';
            break;

          case 'match_enthusiasm':
            adaptedResponse += '\n\n🎉 Ваш энтузиазм заразителен! Давайте воплотим это в жизнь!';
            adaptation += 'enthusiasm_matched ';
            break;
        }
      }
    }

    return { response: adaptedResponse, adaptation: adaptation.trim() || 'no_support_needed' };
  }

  /**
   * Добавляет превентивные меры
   */
  addPreventiveMeasures(response, predictedNeeds) {
    let adaptedResponse = response;
    let adaptation = '';

    const preventiveNeeds = predictedNeeds.preventive || [];

    for (const need of preventiveNeeds) {
      if (need.confidence > 0.7) {
        switch (need.type) {
          case 'intensity_regulation':
            adaptedResponse += '\n\n⚖️ **Совет:** Если чувствуете перегрузку, сделайте небольшой перерыв.';
            adaptation += 'intensity_regulation ';
            break;

          case 'frustration_prevention':
            adaptedResponse += '\n\n🛡️ **Важно:** Если что-то будет неясно, сразу спрашивайте - я помогу разобраться.';
            adaptation += 'frustration_prevention ';
            break;

          case 'anxiety_prevention':
            adaptedResponse += '\n\n🌿 **Помните:** Вы на правильном пути. Каждый шаг приближает к цели.';
            adaptation += 'anxiety_prevention ';
            break;
        }
      }
    }

    return { response: adaptedResponse, adaptation: adaptation.trim() || 'no_preventive_measures' };
  }

  /**
   * Вычисляет эмоциональное выравнивание
   */
  calculateEmotionalAlignment(state) {
    if (!state.dominantEmotion) return 'neutral';
    
    const valence = state.emotionalVector.valence;
    const arousal = state.emotionalVector.arousal;

    if (valence > 0.6 && arousal > 0.6) return 'high_positive_energy';
    if (valence > 0.6 && arousal < 0.4) return 'calm_positive';
    if (valence < 0.4 && arousal > 0.6) return 'high_negative_energy';
    if (valence < 0.4 && arousal < 0.4) return 'low_negative_energy';
    
    return 'balanced';
  }
}

/**
 * ГЛАВНЫЙ КЛАСС ЭМОЦИОНАЛЬНО-СЕМАНТИЧЕСКОЙ МАТРИЦЫ
 */
class EmotionalSemanticMatrix {
  constructor() {
    this.currentState = new EmotionalState();
    this.needsPredictor = new EmotionalNeedsPredictor();
    this.responseAdapter = new EmotionalResponseAdapter();
    this.analysisHistory = [];
    this.maxHistorySize = 100;
    
    SmartLogger.emotional('💝 Эмоционально-семантическая матрица инициализирована');
  }

  /**
   * Выполняет полный эмоционально-семантический анализ
   */
  async performEmotionalSemanticAnalysis(query, originalResponse, context = {}) {
    const queryStr = (typeof query === 'string') ? query : JSON.stringify(query);
    SmartLogger.emotional(`🎭 Начинаем эмоционально-семантический анализ: "${queryStr.substring(0, 40)}..."`);

    const startTime = Date.now();

    try {
      // 1. Обновляем эмоциональное состояние
      this.currentState.updateFromText(query, context);

      // 2. Предсказываем эмоциональные потребности
      const predictedNeeds = this.needsPredictor.predictEmotionalNeeds(this.currentState, context);

      // 3. Адаптируем ответ
      const adaptedResponse = this.responseAdapter.adaptResponse(
        originalResponse, 
        this.currentState, 
        predictedNeeds
      );

      // 4. Записываем состояние в историю
      this.needsPredictor.recordState(this.currentState);

      const analysisResult = {
        timestamp: Date.now(),
        query,
        originalResponse,
        emotionalState: this.currentState.export(),
        predictedNeeds,
        adaptedResponse,
        processingTime: Date.now() - startTime,
        context
      };

      this.analysisHistory.push(analysisResult);
      this.maintainHistorySize();

      SmartLogger.emotional(`✨ Эмоционально-семантический анализ завершен за ${analysisResult.processingTime}мс`);
      SmartLogger.emotional(`🎯 Доминирующая эмоция: ${this.currentState.dominantEmotion}`);
      SmartLogger.emotional(`🔮 Предсказано потребностей: ${Object.values(predictedNeeds).flat().length}`);

      return analysisResult;

    } catch (error) {
      SmartLogger.emotional(`❌ Ошибка эмоционально-семантического анализа: ${error.message}`);
      
      return {
        timestamp: Date.now(),
        query,
        originalResponse,
        emotionalState: this.currentState.export(),
        predictedNeeds: { immediate: [], shortTerm: [], anticipated: [], preventive: [] },
        adaptedResponse: { response: originalResponse, adaptations: ['error_fallback'] },
        processingTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Поддерживает размер истории
   */
  maintainHistorySize() {
    if (this.analysisHistory.length > this.maxHistorySize) {
      this.analysisHistory = this.analysisHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Получает текущее эмоциональное состояние
   */
  getCurrentEmotionalState() {
    return this.currentState.export();
  }

  /**
   * Получает статистику эмоциональной матрицы
   */
  getEmotionalMatrixStatistics() {
    const recentAnalyses = this.analysisHistory.slice(-20);
    
    return {
      totalAnalyses: this.analysisHistory.length,
      currentDominantEmotion: this.currentState.dominantEmotion,
      currentConfidence: this.currentState.confidence,
      averageProcessingTime: recentAnalyses.reduce((sum, a) => sum + a.processingTime, 0) / recentAnalyses.length,
      emotionalTrends: this.analyzeEmotionalTrends(recentAnalyses),
      adaptationSuccessRate: this.calculateAdaptationSuccessRate(recentAnalyses)
    };
  }

  /**
   * Анализирует эмоциональные тренды
   */
  analyzeEmotionalTrends(analyses) {
    emotionFreq = {};
    
    analyses.forEach(analysis => {
      emotion = analysis.emotionalState.dominantEmotion;
      if (emotion) {
        emotionFreq[emotion] = (emotionFreq[emotion] || 0) + 1;
      }
    });

    return Object.entries(emotionFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, frequency: count }));
  }

  /**
   * Вычисляет успешность адаптации
   */
  calculateAdaptationSuccessRate(analyses) {
    const successfulAdaptations = analyses.filter(a => 
      a.adaptedResponse.adaptations && 
      a.adaptedResponse.adaptations.length > 0 &&
      !a.adaptedResponse.adaptations.includes('error_fallback')
    ).length;

    return analyses.length > 0 ? successfulAdaptations / analyses.length : 0;
  }

  /**
   * Экспортирует данные эмоциональной матрицы
   */
  exportEmotionalMatrixData() {
    return {
      currentState: this.currentState.export(),
      statistics: this.getEmotionalMatrixStatistics(),
      recentAnalyses: this.analysisHistory.slice(-5).map(a => ({
        timestamp: a.timestamp,
        query: a.query.substring(0, 50),
        dominantEmotion: a.emotionalState.dominantEmotion,
        adaptationsCount: a.adaptedResponse.adaptations?.length || 0,
        processingTime: a.processingTime
      }))
    };
  }
}

// Создаем глобальный экземпляр системы
const globalEmotionalSystem = new EmotionalSemanticMatrix();

/**
 * ОСНОВНАЯ ФУНКЦИЯ для анализа эмоционального контекста (API для conversation-engine)
 * @param {string} input - Входной текст
 * @param {Object} options - Опции анализа
 * @returns {Promise<Object>} Результат эмоционального анализа
 */
async function analyzeEmotionalContext(input, options = {}) {
  try {
    SmartLogger.emotional(`🔍 Анализ эмоционального контекста для: "${input.substring(0, 50)}..."`);
    
    // Вызываем ПРАВИЛЬНЫЙ метод через глобальную систему
    const result = await globalEmotionalSystem.performEmotionalSemanticAnalysis(input, input, {
      userHistory: options.userHistory || [],
      userProfile: options.userProfile || {},
      includeDetailedAnalysis: true,
      adaptResponseEmotionally: true
    });
    
    SmartLogger.emotional(`✅ Эмоциональный анализ завершен`, {
      dominantEmotion: result.emotionalState.dominantEmotion,
      confidence: result.emotionalState.confidence,
      adaptationsCount: result.adaptedResponse?.adaptations?.length || 0
    });
    
    return result;
    
  } catch (error) {
    SmartLogger.emotional(`❌ Ошибка эмоционального анализа: ${error.message}`);
    
    // Fallback эмоциональное состояние
    return {
      emotionalState: {
        dominantEmotion: 'neutral',
        confidence: 0.5,
        basicEmotions: { joy: 0.5, sadness: 0.5, anger: 0.5, fear: 0.5, surprise: 0.5, disgust: 0.5 },
        complexEmotions: { excitement: 0.5, frustration: 0.5, confidence: 0.5, anxiety: 0.5, curiosity: 0.5, satisfaction: 0.5 },
        emotionalVector: [0.5, 0.5, 0.5]
      },
      predictedNeeds: {
        immediateNeeds: ['engagement'],
        anticipatedNeeds: ['understanding'],
        confidence: 0.3
      },
      adaptedResponse: {
        response: input,
        adaptations: ['fallback_neutral'],
        emotionalAlignment: 'neutral'
      },
      processingTime: 1
    };
  }
}

module.exports = {
  EmotionalSemanticMatrix,
  EmotionalState,
  EmotionalNeedsPredictor,
  EmotionalResponseAdapter,
  analyzeEmotionalContext,
  globalEmotionalSystem,
  
  // Функция проверки доступности
  isAvailable: function() {
    return globalEmotionalSystem && 
           globalEmotionalSystem.currentState &&
           globalEmotionalSystem.needsPredictor &&
           globalEmotionalSystem.responseAdapter &&
           typeof analyzeEmotionalContext === 'function';
  }
};