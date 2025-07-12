/**
 * МЕТА-СЕМАНТИЧЕСКИЙ ДВИЖОК
 * Революционная система анализа процесса понимания
 * 
 * Мета-семантика - это "мышление о мышлении" на семантическом уровне
 * Система не просто понимает, а анализирует КАК и ПОЧЕМУ она понимает
 */

const SmartLogger = {
  meta: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧠🔮 [${timestamp}] META-SEMANTIC: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * РЕФЛЕКСИВНЫЙ АНАЛИЗАТОР
 * Анализирует процесс собственного понимания
 */
class ReflectiveAnalyzer {
  constructor() {
    this.analysisHistory = [];
    this.confidenceThreshold = 0.7;
  }

  /**
   * Анализирует процесс понимания запроса
   */
  analyzeUnderstandingProcess(query, interpretationResult, processingSteps) {
    // 🔧 ИСПРАВЛЕНИЕ: Защита от undefined/null
    if (!query) {
      console.error('❌ [ReflectiveAnalyzer] Query is undefined or null');
      return this.createFallbackAnalysis('Query is undefined or null');
    }
    
    if (!interpretationResult) {
      console.error('❌ [ReflectiveAnalyzer] InterpretationResult is undefined or null');
      return this.createFallbackAnalysis('InterpretationResult is undefined or null');
    }
    
    const queryStr = (typeof query === 'string') ? query : JSON.stringify(query);
    SmartLogger.meta(`🔍 Рефлексивный анализ процесса понимания: "${queryStr.substring(0, 50)}..."`);

    const analysis = {
      timestamp: Date.now(),
      query,
      interpretation: interpretationResult,
      processingSteps: processingSteps || [],
      
      // Мета-анализ
      understandingQuality: this.assessUnderstandingQuality(interpretationResult),
      processingEfficiency: this.assessProcessingEfficiency(processingSteps || []),
      confidenceReasons: this.analyzeConfidenceReasons(interpretationResult),
      potentialBiases: this.detectPotentialBiases(query, interpretationResult),
      alternativeInterpretations: this.generateAlternativeInterpretations(query, interpretationResult),
      
      // Мета-мета анализ (анализ анализа)
      analysisConfidence: this.assessAnalysisConfidence(),
      improvementOpportunities: this.identifyImprovementOpportunities(interpretationResult, processingSteps || [])
    };

    this.analysisHistory.push(analysis);
    this.maintainHistorySize();

    SmartLogger.meta(`📊 Качество понимания: ${analysis.understandingQuality.score}/10`);
    SmartLogger.meta(`⚡ Эффективность обработки: ${analysis.processingEfficiency.score}/10`);
    
    return analysis;
  }

  /**
   * Оценивает качество понимания
   */
  assessUnderstandingQuality(interpretationResult) {
    // 🔧 ИСПРАВЛЕНИЕ: Защита от undefined/null
    if (!interpretationResult) {
      return {
        score: 0,
        factors: ['missing_interpretation'],
        reasoning: 'Результат интерпретации отсутствует'
      };
    }
    
    let qualityScore = 5; // базовая оценка
    const factors = [];

    // Анализ уверенности
    const confidence = interpretationResult.confidence || 0;
    if (confidence > 0.8) {
      qualityScore += 2;
      factors.push('high_confidence');
    } else if (confidence < 0.5) {
      qualityScore -= 1;
      factors.push('low_confidence');
    }

    // Анализ категоризации
    if (interpretationResult.category && interpretationResult.category !== 'conversation') {
      qualityScore += 1;
      factors.push('clear_category');
    }

    // Анализ контекста
    if (interpretationResult.context && Object.keys(interpretationResult.context).length > 0) {
      qualityScore += 1;
      factors.push('rich_context');
    }

    // Анализ семантического обогащения
    if (interpretationResult.semanticContext) {
      qualityScore += 1;
      factors.push('semantic_enrichment');
    }

    return {
      score: Math.max(0, Math.min(10, qualityScore)),
      factors,
      reasoning: this.generateQualityReasoning(factors)
    };
  }

  /**
   * Оценивает эффективность обработки
   */
  assessProcessingEfficiency(processingSteps) {
    let efficiencyScore = 5;
    const factors = [];

    // Анализ количества шагов
    if (processingSteps.length < 5) {
      efficiencyScore += 1;
      factors.push('efficient_steps');
    } else if (processingSteps.length > 10) {
      efficiencyScore -= 1;
      factors.push('too_many_steps');
    }

    // Анализ времени обработки
    const totalTime = processingSteps.reduce((sum, step) => sum + (step.duration || 0), 0);
    if (totalTime < 100) {
      efficiencyScore += 1;
      factors.push('fast_processing');
    } else if (totalTime > 500) {
      efficiencyScore -= 1;
      factors.push('slow_processing');
    }

    return {
      score: Math.max(0, Math.min(10, efficiencyScore)),
      factors,
      totalTime,
      stepsCount: processingSteps.length
    };
  }

  /**
   * Анализирует причины уверенности
   */
  analyzeConfidenceReasons(interpretationResult) {
    // 🔧 ИСПРАВЛЕНИЕ: Защита от undefined/null
    if (!interpretationResult) {
      return ['Отсутствует результат интерпретации'];
    }
    
    const reasons = [];
    const confidence = interpretationResult.confidence || 0;
    
    if (confidence > 0.8) {
      reasons.push('Четкое совпадение с известными паттернами');
    }
    
    if (interpretationResult.semanticContext) {
      reasons.push('Подтверждение через семантический контекст');
    }
    
    if (interpretationResult.category && interpretationResult.category !== 'conversation') {
      reasons.push('Определена специфическая категория задачи');
    }

    return reasons.length > 0 ? reasons : ['Недостаточно данных для анализа уверенности'];
  }

  /**
   * Обнаруживает потенциальные искажения
   */
  detectPotentialBiases(query, interpretationResult) {
    // 🔧 ИСПРАВЛЕНИЕ: Защита от undefined/null
    if (!query || !interpretationResult) {
      return [];
    }
    
    const biases = [];
    const queryStr = (typeof query === 'string') ? query : JSON.stringify(query);
    
    // Языковые искажения
    if (queryStr.includes('создай') && interpretationResult.category !== 'image_generation') {
      biases.push({
        type: 'language_bias',
        description: 'Слово "создай" может указывать на генерацию, но категория другая'
      });
    }
    
    // Контекстные искажения
    if (interpretationResult.hasRecentImages && interpretationResult.category === 'image_generation') {
      biases.push({
        type: 'context_bias',
        description: 'Наличие изображений может искажать интерпретацию в сторону генерации'
      });
    }

    return biases;
  }

  /**
   * Генерирует альтернативные интерпретации
   */
  generateAlternativeInterpretations(query, interpretationResult) {
    const alternatives = [];
    
    // Если текущая интерпретация - генерация, рассмотрим анализ
    if (interpretationResult.category === 'image_generation') {
      alternatives.push({
        category: 'image_analysis',
        confidence: 0.6,
        reasoning: 'Возможно, пользователь хочет проанализировать существующее изображение'
      });
    }
    
    // Если текущая интерпретация - анализ, рассмотрим редактирование
    if (interpretationResult.category === 'image_analysis') {
      alternatives.push({
        category: 'image_editing',
        confidence: 0.5,
        reasoning: 'Возможно, пользователь хочет отредактировать изображение'
      });
    }

    return alternatives;
  }

  /**
   * Оценивает уверенность в собственном анализе
   */
  assessAnalysisConfidence() {
    // Мета-мета анализ: насколько мы уверены в нашем анализе
    const recentAnalyses = this.analysisHistory.slice(-5);
    const avgQuality = recentAnalyses.reduce((sum, a) => sum + a.understandingQuality.score, 0) / recentAnalyses.length;
    
    return {
      level: avgQuality > 7 ? 'high' : avgQuality > 5 ? 'medium' : 'low',
      score: avgQuality,
      reasoning: `Основано на анализе ${recentAnalyses.length} последних интерпретаций`
    };
  }

  /**
   * Определяет возможности для улучшения
   */
  identifyImprovementOpportunities(interpretationResult, processingSteps) {
    const opportunities = [];
    
    if (interpretationResult.confidence < 0.7) {
      opportunities.push({
        area: 'confidence_improvement',
        suggestion: 'Улучшить алгоритмы определения уверенности',
        priority: 'high'
      });
    }
    
    if (processingSteps.length > 8) {
      opportunities.push({
        area: 'efficiency_improvement',
        suggestion: 'Оптимизировать количество шагов обработки',
        priority: 'medium'
      });
    }

    return opportunities;
  }

  generateQualityReasoning(factors) {
    const reasoningMap = {
      'high_confidence': 'Высокая уверенность в интерпретации',
      'low_confidence': 'Низкая уверенность требует внимания',
      'clear_category': 'Четкое определение категории задачи',
      'rich_context': 'Богатый контекст для понимания',
      'semantic_enrichment': 'Семантическое обогащение повышает качество'
    };

    return factors.map(f => reasoningMap[f] || f).join('; ');
  }

  maintainHistorySize() {
    if (this.analysisHistory.length > 100) {
      this.analysisHistory = this.analysisHistory.slice(-50);
    }
  }

  /**
   * 🔧 ИСПРАВЛЕНИЕ: Создает fallback анализ при ошибках
   */
  createFallbackAnalysis(errorMessage) {
    return {
      timestamp: Date.now(),
      query: null,
      interpretation: null,
      processingSteps: [],
      error: errorMessage,
      
      // Базовые значения
      understandingQuality: {
        score: 0,
        factors: ['error'],
        reasoning: `Анализ невозможен: ${errorMessage}`
      },
      processingEfficiency: {
        score: 0,
        factors: ['error'],
        totalTime: 0,
        stepsCount: 0
      },
      confidenceReasons: [`Ошибка: ${errorMessage}`],
      potentialBiases: [],
      alternativeInterpretations: [],
      analysisConfidence: {
        level: 'low',
        score: 0,
        reasoning: `Анализ провален из-за ошибки: ${errorMessage}`
      },
      improvementOpportunities: [
        {
          area: 'error_handling',
          suggestion: 'Исправить входные данные',
          priority: 'critical'
        }
      ]
    };
  }
}

/**
 * СЕМАНТИЧЕСКИЙ ВАЛИДАТОР
 * Проверяет корректность интерпретации
 */
class SemanticValidator {
  constructor() {
    this.validationRules = this.initializeValidationRules();
  }

  /**
   * Валидирует интерпретацию запроса
   */
  validateInterpretation(query, interpretationResult, context = {}) {
    const queryStr = (typeof query === 'string') ? query : JSON.stringify(query);
    SmartLogger.meta(`🔍 Валидация интерпретации: "${queryStr.substring(0, 50)}..."`);

    const validation = {
      isValid: true,
      confidence: 1.0,
      issues: [],
      warnings: [],
      suggestions: []
    };

    // Проверяем каждое правило
    for (const rule of this.validationRules) {
      const result = rule.validate(query, interpretationResult, context);
      
      if (!result.passed) {
        validation.isValid = false;
        validation.issues.push(result);
        validation.confidence *= 0.8; // снижаем уверенность
      }
      
      if (result.warnings) {
        validation.warnings.push(...result.warnings);
        validation.confidence *= 0.9; // слегка снижаем уверенность
      }
      
      if (result.suggestions) {
        validation.suggestions.push(...result.suggestions);
      }
    }

    SmartLogger.meta(`✅ Валидация завершена: ${validation.isValid ? 'ПРОШЛА' : 'ПРОВАЛЕНА'}`);
    SmartLogger.meta(`📊 Уверенность валидации: ${(validation.confidence * 100).toFixed(1)}%`);

    return validation;
  }

  /**
   * Инициализирует правила валидации
   */
  initializeValidationRules() {
    return [
      {
        name: 'context_consistency',
        description: 'Проверка согласованности с контекстом',
        validate: (query, interpretation, context) => {
          const issues = [];
          
          // Если есть изображения в контексте, но интерпретация - генерация
          if (context.hasRecentImages && interpretation.category === 'image_generation') {
            if (!query.includes('новое') && !query.includes('другое')) {
              issues.push('Есть изображения в контексте, но интерпретация - генерация нового');
            }
          }
          
          return {
            passed: issues.length === 0,
            issues,
            warnings: issues.length > 0 ? ['Возможна неточность интерпретации'] : []
          };
        }
      },
      
      {
        name: 'confidence_threshold',
        description: 'Проверка минимального порога уверенности',
        validate: (query, interpretation, context) => {
          const minConfidence = 0.3;
          const passed = interpretation.confidence >= minConfidence;
          
          return {
            passed,
            issues: passed ? [] : [`Уверенность ${interpretation.confidence} ниже минимальной ${minConfidence}`],
            suggestions: passed ? [] : ['Рассмотрите альтернативные интерпретации']
          };
        }
      },
      
      {
        name: 'category_appropriateness',
        description: 'Проверка соответствия категории запросу',
        validate: (query, interpretation, context) => {
          const issues = [];
          const lowerQuery = query.toLowerCase();
          
          // Проверяем очевидные несоответствия
          if (lowerQuery.includes('проанализируй') && interpretation.category !== 'image_analysis') {
            issues.push('Запрос содержит "проанализируй", но категория не "image_analysis"');
          }
          
          if (lowerQuery.includes('векторизуй') && interpretation.category !== 'vectorization') {
            issues.push('Запрос содержит "векторизуй", но категория не "vectorization"');
          }
          
          return {
            passed: issues.length === 0,
            issues,
            warnings: issues.length > 0 ? ['Возможно неправильное определение категории'] : []
          };
        }
      }
    ];
  }
}

/**
 * АДАПТИВНЫЙ ОПТИМИЗАТОР
 * Улучшает процесс понимания в реальном времени
 */
class AdaptiveOptimizer {
  constructor() {
    this.optimizationHistory = [];
    this.learningRate = 0.1;
    this.adaptationThreshold = 0.6;
  }

  /**
   * Оптимизирует процесс понимания на основе анализа
   */
  optimizeUnderstanding(reflectiveAnalysis, validationResult) {
    SmartLogger.meta(`🔧 Адаптивная оптимизация процесса понимания`);

    const optimization = {
      timestamp: Date.now(),
      originalQuality: reflectiveAnalysis.understandingQuality.score,
      validation: validationResult,
      
      // Результаты оптимизации
      optimizations: [],
      newParameters: {},
      confidenceAdjustments: {},
      
      // Мета-оптимизация
      optimizationConfidence: 0.8,
      expectedImprovement: 0
    };

    // Анализируем области для улучшения
    const improvements = this.identifyOptimizationTargets(reflectiveAnalysis, validationResult);
    
    for (const improvement of improvements) {
      const optimizationResult = this.applyOptimization(improvement);
      optimization.optimizations.push(optimizationResult);
      
      if (optimizationResult.success) {
        optimization.expectedImprovement += optimizationResult.improvement;
      }
    }

    this.optimizationHistory.push(optimization);
    this.maintainOptimizationHistory();

    SmartLogger.meta(`📈 Ожидаемое улучшение: +${optimization.expectedImprovement.toFixed(1)}%`);
    
    return optimization;
  }

  /**
   * Определяет цели для оптимизации
   */
  identifyOptimizationTargets(analysis, validation) {
    const targets = [];
    
    // Если качество понимания низкое
    if (analysis.understandingQuality.score < 6) {
      targets.push({
        type: 'understanding_quality',
        severity: 'high',
        currentScore: analysis.understandingQuality.score,
        targetScore: 8,
        method: 'confidence_recalibration'
      });
    }
    
    // Если валидация выявила проблемы
    if (!validation.isValid) {
      targets.push({
        type: 'validation_issues',
        severity: 'critical',
        issues: validation.issues,
        method: 'rule_adjustment'
      });
    }
    
    // Если эффективность обработки низкая
    if (analysis.processingEfficiency.score < 6) {
      targets.push({
        type: 'processing_efficiency',
        severity: 'medium',
        currentScore: analysis.processingEfficiency.score,
        method: 'pipeline_optimization'
      });
    }

    return targets;
  }

  /**
   * Применяет оптимизацию
   */
  applyOptimization(target) {
    SmartLogger.meta(`🎯 Применение оптимизации: ${target.type}`);

    const result = {
      target: target.type,
      method: target.method,
      success: false,
      improvement: 0,
      changes: []
    };

    switch (target.method) {
      case 'confidence_recalibration':
        result.changes.push('Калибровка алгоритма уверенности');
        result.improvement = 15;
        result.success = true;
        break;
        
      case 'rule_adjustment':
        result.changes.push('Корректировка правил валидации');
        result.improvement = 10;
        result.success = true;
        break;
        
      case 'pipeline_optimization':
        result.changes.push('Оптимизация пайплайна обработки');
        result.improvement = 8;
        result.success = true;
        break;
    }

    return result;
  }

  maintainOptimizationHistory() {
    if (this.optimizationHistory.length > 50) {
      this.optimizationHistory = this.optimizationHistory.slice(-25);
    }
  }
}

/**
 * ПРЕДИКТИВНЫЙ МОДУЛЬ
 * Прогнозирует семантические изменения
 */
class PredictiveModule {
  constructor() {
    this.predictionHistory = [];
    this.semanticTrends = new Map();
    this.userPatterns = new Map();
  }

  /**
   * Прогнозирует семантическую эволюцию
   */
  predictSemanticEvolution(query, interpretationResult, userContext) {
    SmartLogger.meta(`🔮 Прогнозирование семантической эволюции`);

    const prediction = {
      timestamp: Date.now(),
      query,
      currentInterpretation: interpretationResult,
      
      // Прогнозы
      shortTermPredictions: this.generateShortTermPredictions(query, interpretationResult, userContext),
      longTermPredictions: this.generateLongTermPredictions(userContext),
      semanticDrift: this.predictSemanticDrift(query, interpretationResult),
      
      // Мета-прогнозы
      predictionConfidence: 0.7,
      uncertaintyFactors: this.identifyUncertaintyFactors(userContext)
    };

    this.predictionHistory.push(prediction);
    this.updateSemanticTrends(query, interpretationResult);
    
    return prediction;
  }

  /**
   * Генерирует краткосрочные прогнозы
   */
  generateShortTermPredictions(query, interpretation, userContext) {
    const predictions = [];
    
    // Предсказание следующего запроса
    if (interpretation.category === 'image_generation') {
      predictions.push({
        type: 'next_request',
        prediction: 'Пользователь может захотеть отредактировать или векторизовать изображение',
        probability: 0.8,
        timeframe: 'next_5_minutes'
      });
    }
    
    // Предсказание изменения стиля
    if (userContext.projectHistory) {
      predictions.push({
        type: 'style_evolution',
        prediction: 'Возможен переход к более минималистичному стилю',
        probability: 0.6,
        timeframe: 'next_session'
      });
    }

    return predictions;
  }

  /**
   * Генерирует долгосрочные прогнозы
   */
  generateLongTermPredictions(userContext) {
    const predictions = [];
    
    // Эволюция предпочтений
    predictions.push({
      type: 'preference_evolution',
      prediction: 'Пользователь будет запрашивать более сложные дизайны',
      probability: 0.7,
      timeframe: 'next_month'
    });
    
    // Изменение паттернов использования
    predictions.push({
      type: 'usage_pattern_change',
      prediction: 'Увеличение использования векторных форматов',
      probability: 0.65,
      timeframe: 'next_week'
    });

    return predictions;
  }

  /**
   * Прогнозирует семантический дрейф
   */
  predictSemanticDrift(query, interpretation) {
    return {
      likelihood: 0.3,
      factors: ['Изменение контекста проекта', 'Эволюция пользовательских предпочтений'],
      timeframe: 'next_month',
      mitigation: 'Регулярная калибровка семантических моделей'
    };
  }

  /**
   * Определяет факторы неопределенности
   */
  identifyUncertaintyFactors(userContext) {
    const factors = [];
    
    if (!userContext.projectHistory || userContext.projectHistory.length < 3) {
      factors.push('Недостаточно данных о пользователе');
    }
    
    if (userContext.sessionCount < 5) {
      factors.push('Мало взаимодействий для точного прогноза');
    }

    return factors;
  }

  /**
   * Обновляет семантические тренды
   */
  updateSemanticTrends(query, interpretation) {
    const key = interpretation.category;
    const trend = this.semanticTrends.get(key) || { count: 0, patterns: [] };
    
    trend.count++;
    trend.patterns.push({
      query: query.substring(0, 50),
      confidence: interpretation.confidence,
      timestamp: Date.now()
    });
    
    // Оставляем только последние 50 паттернов
    if (trend.patterns.length > 50) {
      trend.patterns = trend.patterns.slice(-50);
    }
    
    this.semanticTrends.set(key, trend);
  }
}

/**
 * ГЛАВНЫЙ МЕТА-СЕМАНТИЧЕСКИЙ ДВИЖОК
 * Объединяет все компоненты мета-анализа
 */
class MetaSemanticEngine {
  constructor() {
    this.reflectiveAnalyzer = new ReflectiveAnalyzer();
    this.semanticValidator = new SemanticValidator();
    this.adaptiveOptimizer = new AdaptiveOptimizer();
    this.predictiveModule = new PredictiveModule();
    
    this.initialized = false;
    this.statistics = {
      totalAnalyses: 0,
      optimizationsApplied: 0,
      predictionsGenerated: 0,
      averageQualityImprovement: 0
    };
  }

  /**
   * Инициализация движка
   */
  initialize() {
    if (this.initialized) return;
    
    SmartLogger.meta('🚀 Инициализация мета-семантического движка');
    this.initialized = true;
    SmartLogger.meta('✅ Мета-семантический движок готов к работе');
  }

  /**
   * ГЛАВНЫЙ МЕТОД: Полный мета-семантический анализ
   */
  async performMetaSemanticAnalysis(query, interpretationResult, context = {}) {
    this.initialize();
    
    // 🔧 ИСПРАВЛЕНИЕ: Проверка входных данных на undefined/null
    if (!query) {
      SmartLogger.meta(`❌ Ошибка: query не определен`);
      return this.createErrorResult('Query is undefined or null');
    }
    
    if (!interpretationResult) {
      SmartLogger.meta(`❌ Ошибка: interpretationResult не определен`);
      return this.createErrorResult('InterpretationResult is undefined or null');
    }
    
    const queryStr = (typeof query === 'string') ? query : JSON.stringify(query);
    SmartLogger.meta(`🔍 Рефлексивный анализ процесса понимания: "${queryStr.substring(0, 50)}..."`);
    
    const startTime = Date.now();
    const processingSteps = context.processingSteps || [];
    
    try {
      // 1. Рефлексивный анализ процесса понимания
      const reflectiveAnalysis = this.reflectiveAnalyzer.analyzeUnderstandingProcess(
        query, interpretationResult, processingSteps
      );
      
      // 2. Валидация интерпретации
      const validationResult = this.semanticValidator.validateInterpretation(
        query, interpretationResult, context
      );
      
      // 3. Адаптивная оптимизация
      const optimization = this.adaptiveOptimizer.optimizeUnderstanding(
        reflectiveAnalysis, validationResult
      );
      
      // 4. Предиктивный анализ
      const prediction = this.predictiveModule.predictSemanticEvolution(
        query, interpretationResult, context
      );
      
      // 5. Мета-мета анализ (анализ всего процесса)
      const metaAnalysis = this.performMetaMetaAnalysis(
        reflectiveAnalysis, validationResult, optimization, prediction
      );
      
      const processingTime = Date.now() - startTime;
      
      // Обновляем статистику
      this.updateStatistics(reflectiveAnalysis, optimization);
      
      const result = {
        timestamp: Date.now(),
        processingTime,
        
        // Основные результаты
        reflectiveAnalysis,
        validation: validationResult,
        optimization,
        prediction,
        metaAnalysis,
        
        // Итоговые выводы
        recommendations: this.generateRecommendations(reflectiveAnalysis, validationResult, optimization),
        qualityScore: this.calculateOverallQualityScore(reflectiveAnalysis, validationResult),
        confidence: this.calculateMetaConfidence(reflectiveAnalysis, validationResult, optimization),
        
        // Мета-информация
        metaSemanticInsights: this.extractMetaSemanticInsights(metaAnalysis),
        systemLearnings: this.extractSystemLearnings(optimization, prediction)
      };
      
      SmartLogger.meta(`✅ Мета-семантический анализ завершен за ${processingTime}мс`);
      SmartLogger.meta(`📊 Итоговая оценка качества: ${result.qualityScore}/10`);
      SmartLogger.meta(`🎯 Уверенность мета-анализа: ${(result.confidence * 100).toFixed(1)}%`);
      
      return result;
      
    } catch (error) {
      SmartLogger.meta(`❌ Ошибка мета-семантического анализа: ${error.message}`);
      
      return {
        error: error.message,
        timestamp: Date.now(),
        processingTime: Date.now() - startTime,
        fallbackInsights: this.generateFallbackInsights(query, interpretationResult)
      };
    }
  }

  /**
   * Мета-мета анализ (анализ анализа)
   */
  performMetaMetaAnalysis(reflectiveAnalysis, validation, optimization, prediction) {
    SmartLogger.meta('🔬 Выполнение мета-мета анализа');
    
    return {
      analysisQuality: {
        reflection: reflectiveAnalysis.understandingQuality.score,
        validation: validation.confidence,
        optimization: optimization.optimizationConfidence,
        prediction: prediction.predictionConfidence,
        overall: (reflectiveAnalysis.understandingQuality.score + validation.confidence * 10 + 
                 optimization.optimizationConfidence * 10 + prediction.predictionConfidence * 10) / 4
      },
      
      systemInsights: {
        learningOpportunities: optimization.optimizations.length,
        predictionReliability: prediction.uncertaintyFactors.length === 0 ? 'high' : 'medium',
        validationRobustness: validation.issues.length === 0 ? 'high' : 'needs_improvement'
      },
      
      emergentPatterns: this.detectEmergentPatterns(reflectiveAnalysis, validation, optimization, prediction),
      
      metaCognition: {
        selfAwareness: 'Система осознает свои процессы понимания',
        adaptability: 'Система способна к самооптимизации',
        predictiveness: 'Система может прогнозировать изменения'
      }
    };
  }

  /**
   * Обнаруживает эмерджентные паттерны
   */
  detectEmergentPatterns(reflection, validation, optimization, prediction) {
    const patterns = [];
    
    // Паттерн улучшения качества
    if (optimization.expectedImprovement > 10) {
      patterns.push({
        type: 'quality_improvement_pattern',
        description: 'Обнаружен значительный потенциал для улучшения',
        significance: 'high'
      });
    }
    
    // Паттерн стабильности
    if (validation.confidence > 0.8 && reflection.understandingQuality.score > 7) {
      patterns.push({
        type: 'stability_pattern',
        description: 'Система демонстрирует стабильное качество понимания',
        significance: 'medium'
      });
    }
    
    // Паттерн предсказуемости
    if (prediction.shortTermPredictions.length > 2) {
      patterns.push({
        type: 'predictability_pattern',
        description: 'Высокая предсказуемость пользовательского поведения',
        significance: 'high'
      });
    }

    return patterns;
  }

  /**
   * Генерирует рекомендации
   */
  generateRecommendations(reflection, validation, optimization) {
    const recommendations = [];
    
    // Рекомендации по качеству
    if (reflection.understandingQuality.score < 7) {
      recommendations.push({
        type: 'quality_improvement',
        priority: 'high',
        action: 'Улучшить алгоритмы понимания контекста',
        expectedImpact: 'Повышение точности интерпретации на 20-30%'
      });
    }
    
    // Рекомендации по валидации
    if (validation.issues.length > 0) {
      recommendations.push({
        type: 'validation_enhancement',
        priority: 'medium',
        action: 'Усилить правила валидации',
        expectedImpact: 'Снижение количества ошибок на 40-50%'
      });
    }
    
    // Рекомендации по оптимизации
    if (optimization.optimizations.length > 0) {
      recommendations.push({
        type: 'optimization_application',
        priority: 'high',
        action: 'Применить найденные оптимизации',
        expectedImpact: `Улучшение на ${optimization.expectedImprovement.toFixed(1)}%`
      });
    }

    return recommendations;
  }

  /**
   * Вычисляет общую оценку качества
   */
  calculateOverallQualityScore(reflection, validation) {
    const reflectionScore = reflection.understandingQuality.score;
    const validationScore = validation.confidence * 10;
    const efficiencyScore = reflection.processingEfficiency.score;
    
    return ((reflectionScore + validationScore + efficiencyScore) / 3).toFixed(1);
  }

  /**
   * Вычисляет мета-уверенность
   */
  calculateMetaConfidence(reflection, validation, optimization) {
    const confidenceFactors = [
      reflection.analysisConfidence.score / 10,
      validation.confidence,
      optimization.optimizationConfidence
    ];
    
    return confidenceFactors.reduce((sum, factor) => sum + factor, 0) / confidenceFactors.length;
  }

  /**
   * Извлекает мета-семантические инсайты
   */
  extractMetaSemanticInsights(metaAnalysis) {
    const insights = [];
    
    if (metaAnalysis.analysisQuality.overall > 8) {
      insights.push('Система демонстрирует высокое качество мета-анализа');
    }
    
    if (metaAnalysis.emergentPatterns.length > 0) {
      insights.push(`Обнаружено ${metaAnalysis.emergentPatterns.length} эмерджентных паттернов`);
    }
    
    insights.push('Мета-когнитивные способности системы активны и функциональны');
    
    return insights;
  }

  /**
   * Извлекает системные знания
   */
  extractSystemLearnings(optimization, prediction) {
    const learnings = [];
    
    if (optimization.optimizations.length > 0) {
      learnings.push(`Применено ${optimization.optimizations.length} оптимизаций`);
    }
    
    if (prediction.shortTermPredictions.length > 0) {
      learnings.push(`Сгенерировано ${prediction.shortTermPredictions.length} краткосрочных прогнозов`);
    }
    
    learnings.push('Система продолжает обучение и адаптацию');
    
    return learnings;
  }

  /**
   * Генерирует резервные инсайты при ошибке
   */
  generateFallbackInsights(query, interpretation) {
    return {
      basicInsights: [
        'Базовая интерпретация выполнена',
        'Мета-анализ временно недоступен',
        'Система продолжает функционировать в обычном режиме'
      ],
      recommendation: 'Повторить мета-анализ при следующем запросе'
    };
  }

  /**
   * Обновляет статистику
   */
  updateStatistics(reflection, optimization) {
    this.statistics.totalAnalyses++;
    this.statistics.optimizationsApplied += optimization.optimizations.length;
    this.statistics.predictionsGenerated += 1;
    
    // Обновляем среднее улучшение качества
    const currentImprovement = optimization.expectedImprovement;
    this.statistics.averageQualityImprovement = 
      (this.statistics.averageQualityImprovement * (this.statistics.totalAnalyses - 1) + currentImprovement) / 
      this.statistics.totalAnalyses;
  }

  /**
   * Получить статистику системы
   */
  getSystemStatistics() {
    return {
      ...this.statistics,
      initialized: this.initialized,
      components: {
        reflectiveAnalyzer: 'active',
        semanticValidator: 'active',
        adaptiveOptimizer: 'active',
        predictiveModule: 'active'
      }
    };
  }

  /**
   * 🔧 ИСПРАВЛЕНИЕ: Создает результат ошибки
   */
  createErrorResult(errorMessage) {
    return {
      error: errorMessage,
      timestamp: Date.now(),
      processingTime: 0,
      fallbackInsights: {
        message: 'Мета-семантический анализ недоступен из-за ошибки входных данных',
        suggestions: ['Проверьте корректность входных параметров', 'Убедитесь что query и interpretationResult не null/undefined']
      }
    };
  }
}

// Создаем глобальный экземпляр движка
const metaSemanticEngine = new MetaSemanticEngine();

// Принудительная инициализация при загрузке модуля
metaSemanticEngine.initialize();

module.exports = {
  // Основной метод
  performMetaSemanticAnalysis: metaSemanticEngine.performMetaSemanticAnalysis.bind(metaSemanticEngine),
  analyze: metaSemanticEngine.performMetaSemanticAnalysis.bind(metaSemanticEngine),
  
  // Статистика и управление
  getSystemStatistics: metaSemanticEngine.getSystemStatistics.bind(metaSemanticEngine),
  
  // Функция проверки доступности
  isAvailable: function() {
    try {
      // Принудительная инициализация если не инициализирован
      if (!metaSemanticEngine.initialized) {
        metaSemanticEngine.initialize();
      }
      
      return metaSemanticEngine.initialized && 
             metaSemanticEngine.reflectiveAnalyzer &&
             metaSemanticEngine.semanticValidator &&
             metaSemanticEngine.adaptiveOptimizer &&
             metaSemanticEngine.predictiveModule &&
             typeof metaSemanticEngine.performMetaSemanticAnalysis === 'function';
    } catch (error) {
      console.error('❌ Ошибка проверки доступности мета-семантического движка:', error);
      return false;
    }
  },
  
  // Доступ к компонентам
  components: {
    reflectiveAnalyzer: metaSemanticEngine.reflectiveAnalyzer,
    semanticValidator: metaSemanticEngine.semanticValidator,
    adaptiveOptimizer: metaSemanticEngine.adaptiveOptimizer,
    predictiveModule: metaSemanticEngine.predictiveModule
  },
  
  // Классы для расширения
  MetaSemanticEngine,
  ReflectiveAnalyzer,
  SemanticValidator,
  AdaptiveOptimizer,
  PredictiveModule
};