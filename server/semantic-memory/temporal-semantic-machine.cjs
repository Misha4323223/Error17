
/**
 * ⏰🧠 ВРЕМЕННАЯ СЕМАНТИЧЕСКАЯ МАШИНА
 * Анализ эволюции смысла во времени, предсказание семантических трендов
 * и путешествие по временным слоям значений
 */

const SmartLogger = {
  temporal: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`⏰🧠 [${timestamp}] TEMPORAL-SEMANTIC: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * ВРЕМЕННОЙ СЛОЙ СЕМАНТИКИ
 * Представляет семантическое состояние в определенный момент времени
 */
class TemporalSemanticLayer {
  constructor(timestamp, semanticState, context = {}) {
    this.timestamp = timestamp;
    this.semanticState = semanticState;
    this.context = context;
    this.connections = new Map(); // Связи с другими временными слоями
    this.stability = 0.5; // Стабильность семантического состояния
    this.influence = 0.5; // Влияние на соседние слои
    this.evolutionPressure = 0; // Давление эволюции
    this.semanticDrift = new Map(); // Дрейф значений
    this.emergentMeanings = []; // Новые возникшие значения
    this.obsoleteMeanings = []; // Устаревшие значения
  }

  /**
   * Вычисляет семантическое расстояние до другого слоя
   */
  calculateDistanceTo(otherLayer) {
    const timeDelta = Math.abs(this.timestamp - otherLayer.timestamp);
    const semanticDelta = this.calculateSemanticDelta(this.semanticState, otherLayer.semanticState);
    const contextDelta = this.calculateContextDelta(this.context, otherLayer.context);
    
    return {
      temporal: timeDelta,
      semantic: semanticDelta,
      contextual: contextDelta,
      total: (timeDelta / 10000) + semanticDelta + contextDelta // Нормализованное расстояние
    };
  }

  /**
   * Вычисляет семантическую дельту
   */
  calculateSemanticDelta(state1, state2) {
    // Упрощенная мера семантического различия
    const keys1 = Object.keys(state1);
    const keys2 = Object.keys(state2);
    const allKeys = new Set([...keys1, ...keys2]);
    
    let totalDifference = 0;
    for (const key of allKeys) {
      const value1 = state1[key] || 0;
      const value2 = state2[key] || 0;
      totalDifference += Math.abs(value1 - value2);
    }
    
    return totalDifference / allKeys.size;
  }

  /**
   * Вычисляет контекстуальную дельту
   */
  calculateContextDelta(context1, context2) {
    // Сравнение контекстов
    const similarities = this.findContextSimilarities(context1, context2);
    return 1 - similarities;
  }

  /**
   * Находит сходства в контекстах
   */
  findContextSimilarities(context1, context2) {
    const commonFields = ['sessionId', 'category', 'userType'];
    let similarities = 0;
    let totalFields = 0;
    
    for (const field of commonFields) {
      if (context1[field] !== undefined && context2[field] !== undefined) {
        totalFields++;
        if (context1[field] === context2[field]) {
          similarities++;
        }
      }
    }
    
    return totalFields > 0 ? similarities / totalFields : 0;
  }

  /**
   * Анализирует эволюцию к другому слою
   */
  analyzeEvolutionTo(targetLayer) {
    const distance = this.calculateDistanceTo(targetLayer);
    const evolutionVector = this.calculateEvolutionVector(targetLayer);
    const evolutionForces = this.identifyEvolutionForces(targetLayer);
    
    return {
      distance,
      evolutionVector,
      evolutionForces,
      evolutionSpeed: this.calculateEvolutionSpeed(distance, targetLayer.timestamp - this.timestamp),
      predictedIntermediateStates: this.predictIntermediateStates(targetLayer)
    };
  }

  /**
   * Вычисляет вектор эволюции
   */
  calculateEvolutionVector(targetLayer) {
    const semanticChanges = new Map();
    
    for (const [key, value] of Object.entries(this.semanticState)) {
      const targetValue = targetLayer.semanticState[key];
      if (targetValue !== undefined) {
        semanticChanges.set(key, targetValue - value);
      }
    }
    
    return {
      direction: this.calculateVectorDirection(semanticChanges),
      magnitude: this.calculateVectorMagnitude(semanticChanges),
      changes: Object.fromEntries(semanticChanges)
    };
  }

  /**
   * Идентифицирует силы эволюции
   */
  identifyEvolutionForces(targetLayer) {
    const forces = [];
    
    // Временное давление
    const timePressure = (targetLayer.timestamp - this.timestamp) / 1000000; // Нормализованное
    if (timePressure > 0.5) {
      forces.push({ type: 'temporal_pressure', strength: timePressure, description: 'Сильное временное давление' });
    }
    
    // Контекстуальные изменения
    const contextChange = this.calculateContextDelta(this.context, targetLayer.context);
    if (contextChange > 0.5) {
      forces.push({ type: 'context_shift', strength: contextChange, description: 'Значительный сдвиг контекста' });
    }
    
    // Семантическая нестабильность
    if (this.stability < 0.3) {
      forces.push({ type: 'instability', strength: 1 - this.stability, description: 'Семантическая нестабильность' });
    }
    
    return forces;
  }

  /**
   * Предсказывает промежуточные состояния
   */
  predictIntermediateStates(targetLayer) {
    const states = [];
    const steps = 5; // Количество промежуточных состояний
    const timeDelta = (targetLayer.timestamp - this.timestamp) / steps;
    
    for (let i = 1; i < steps; i++) {
      const interpolationFactor = i / steps;
      const intermediateState = this.interpolateSemanticState(this.semanticState, targetLayer.semanticState, interpolationFactor);
      
      states.push({
        timestamp: this.timestamp + (timeDelta * i),
        semanticState: intermediateState,
        interpolationFactor,
        confidence: this.calculateInterpolationConfidence(interpolationFactor)
      });
    }
    
    return states;
  }

  // Вспомогательные методы
  calculateVectorDirection(changes) {
    const positiveChanges = Array.from(changes.values()).filter(change => change > 0).length;
    const totalChanges = changes.size;
    return totalChanges > 0 ? positiveChanges / totalChanges : 0.5;
  }

  calculateVectorMagnitude(changes) {
    const squares = Array.from(changes.values()).map(change => change * change);
    return Math.sqrt(squares.reduce((sum, square) => sum + square, 0));
  }

  calculateEvolutionSpeed(distance, timeDelta) {
    return timeDelta > 0 ? distance.total / timeDelta : 0;
  }

  interpolateSemanticState(state1, state2, factor) {
    const interpolated = {};
    const allKeys = new Set([...Object.keys(state1), ...Object.keys(state2)]);
    
    for (const key of allKeys) {
      const value1 = state1[key] || 0;
      const value2 = state2[key] || 0;
      interpolated[key] = value1 + (value2 - value1) * factor;
    }
    
    return interpolated;
  }

  calculateInterpolationConfidence(factor) {
    // Уверенность в интерполяции максимальна в середине
    return 1 - Math.abs(0.5 - factor) * 2;
  }

  /**
   * Экспортирует состояние слоя
   */
  export() {
    return {
      timestamp: this.timestamp,
      semanticState: this.semanticState,
      context: this.context,
      stability: this.stability,
      influence: this.influence,
      evolutionPressure: this.evolutionPressure,
      semanticDrift: Object.fromEntries(this.semanticDrift),
      emergentMeanings: this.emergentMeanings,
      obsoleteMeanings: this.obsoleteMeanings,
      connectionsCount: this.connections.size
    };
  }
}

/**
 * ВРЕМЕННАЯ СЕМАНТИЧЕСКАЯ МАШИНА
 * Главный класс для анализа временной эволюции семантики
 */
class TemporalSemanticMachine {
  constructor() {
    this.temporalLayers = new Map(); // timestamp -> TemporalSemanticLayer
    this.semanticTimeline = []; // Упорядоченная по времени последовательность
    this.evolutionPatterns = new Map(); // Паттерны эволюции
    this.trendPredictions = []; // Предсказания трендов
    this.temporalAnchors = new Map(); // Ключевые временные точки
    this.semanticCycles = []; // Цикличные паттерны
    this.evolutionSpeed = 0.5; // Скорость эволюции значений
    this.temporalResolution = 60000; // Разрешение во времени (1 минута)
    this.maxLayersCount = 1000; // Максимальное количество слоев
    
    this.initializeMachine();
  }

  /**
   * Инициализирует машину
   */
  initializeMachine() {
    SmartLogger.temporal('⏰ Инициализация временной семантической машины');
    
    // Создаем начальный временной слой
    const initialLayer = this.createInitialLayer();
    this.addTemporalLayer(initialLayer);
    
    SmartLogger.temporal('✅ Временная семантическая машина готова к работе');
  }

  /**
   * Создает начальный слой
   */
  createInitialLayer() {
    return new TemporalSemanticLayer(Date.now(), {
      baseline: 1.0,
      stability: 0.8,
      neutrality: 1.0
    }, {
      type: 'initialization',
      source: 'system'
    });
  }

  /**
   * Анализирует запрос с временным контекстом
   */
  async analyzeWithTemporalContext(query, context = {}) {
    SmartLogger.temporal(`⏰ Временной анализ: "${query.substring(0, 50)}..."`);
    
    const startTime = Date.now();
    
    // Создаем семантическое состояние для текущего момента
    const currentSemanticState = this.extractSemanticState(query, context);
    
    // Создаем новый временной слой
    const currentLayer = new TemporalSemanticLayer(startTime, currentSemanticState, context);
    
    // Анализируем эволюцию от предыдущих состояний
    const evolutionAnalysis = this.analyzeEvolutionToCurrentState(currentLayer);
    
    // Предсказываем будущие состояния
    const futurePredictions = this.predictFutureStates(currentLayer);
    
    // Ищем временные паттерны
    const temporalPatterns = this.detectTemporalPatterns(currentLayer);
    
    // Анализируем семантические циклы
    const cyclicAnalysis = this.analyzeCyclicPatterns(currentLayer);
    
    // Добавляем слой в машину
    this.addTemporalLayer(currentLayer);
    
    const processingTime = Date.now() - startTime;
    
    return {
      timestamp: startTime,
      processingTime,
      currentLayer: currentLayer.export(),
      evolutionAnalysis,
      futurePredictions,
      temporalPatterns,
      cyclicAnalysis,
      temporalInsights: this.generateTemporalInsights(evolutionAnalysis, futurePredictions, temporalPatterns),
      machineState: this.getMachineState()
    };
  }

  /**
   * Извлекает семантическое состояние из запроса
   */
  extractSemanticState(query, context) {
    const state = {};
    const lowerQuery = query.toLowerCase();
    
    // Категориальные состояния
    state.creativity = this.measureCreativity(query);
    state.technicality = this.measureTechnicality(query);
    state.emotionality = this.measureEmotionality(query);
    state.urgency = this.measureUrgency(query);
    state.complexity = this.measureComplexity(query);
    state.specificity = this.measureSpecificity(query);
    
    // Контекстуальные состояния
    if (context.sessionId) {
      state.continuity = this.measureContinuity(context);
    }
    
    if (context.currentProject) {
      state.projectRelevance = this.measureProjectRelevance(query, context.currentProject);
    }
    
    // Временные состояния
    state.temporalFocus = this.determineTemporalFocus(query);
    state.changeIntent = this.measureChangeIntent(query);
    
    return state;
  }

  /**
   * Анализирует эволюцию к текущему состоянию
   */
  analyzeEvolutionToCurrentState(currentLayer) {
    const recentLayers = this.getRecentLayers(5); // Последние 5 слоев
    const evolutionChains = [];
    
    for (const previousLayer of recentLayers) {
      const evolution = previousLayer.analyzeEvolutionTo(currentLayer);
      evolutionChains.push({
        from: previousLayer.timestamp,
        to: currentLayer.timestamp,
        evolution
      });
    }
    
    // Анализируем общую тенденцию эволюции
    const overallTrend = this.calculateOverallEvolutionTrend(evolutionChains);
    
    // Ищем аномалии в эволюции
    const anomalies = this.detectEvolutionAnomalies(evolutionChains, overallTrend);
    
    return {
      evolutionChains,
      overallTrend,
      anomalies,
      evolutionSpeed: this.calculateCurrentEvolutionSpeed(evolutionChains),
      stabilityTrend: this.calculateStabilityTrend(recentLayers, currentLayer)
    };
  }

  /**
   * Предсказывает будущие состояния
   */
  predictFutureStates(currentLayer) {
    const predictions = [];
    const predictionHorizons = [
      { period: '1_minute', milliseconds: 60 * 1000 },
      { period: '5_minutes', milliseconds: 5 * 60 * 1000 },
      { period: '15_minutes', milliseconds: 15 * 60 * 1000 },
      { period: '1_hour', milliseconds: 60 * 60 * 1000 }
    ];
    
    for (const horizon of predictionHorizons) {
      const futureTimestamp = currentLayer.timestamp + horizon.milliseconds;
      const predictedState = this.predictSemanticStateAt(currentLayer, futureTimestamp);
      
      predictions.push({
        period: horizon.period,
        timestamp: futureTimestamp,
        predictedState,
        confidence: this.calculatePredictionConfidence(horizon.milliseconds),
        predictionMethod: this.selectPredictionMethod(horizon.milliseconds),
        uncertaintyFactors: this.identifyUncertaintyFactors(horizon.milliseconds)
      });
    }
    
    return predictions;
  }

  /**
   * Предсказывает семантическое состояние в будущем
   */
  predictSemanticStateAt(currentLayer, futureTimestamp) {
    const timeDelta = futureTimestamp - currentLayer.timestamp;
    const recentLayers = this.getRecentLayers(3);
    
    // Используем линейную экстраполяцию тренда
    if (recentLayers.length >= 2) {
      return this.extrapolateTrend(recentLayers, currentLayer, timeDelta);
    }
    
    // Если недостаточно данных, используем базовое предсказание
    return this.basePrediction(currentLayer, timeDelta);
  }

  /**
   * Экстраполирует тренд
   */
  extrapolateTrend(recentLayers, currentLayer, timeDelta) {
    const trendVector = this.calculateTrendVector(recentLayers, currentLayer);
    const predictedState = {};
    
    for (const [key, value] of Object.entries(currentLayer.semanticState)) {
      const trend = trendVector[key] || 0;
      const normalizedTimeDelta = timeDelta / 60000; // Нормализуем к минутам
      
      // Применяем тренд с затуханием
      const decayFactor = Math.exp(-normalizedTimeDelta * 0.1);
      predictedState[key] = value + (trend * normalizedTimeDelta * decayFactor);
      
      // Ограничиваем значения разумными пределами
      predictedState[key] = Math.max(0, Math.min(2, predictedState[key]));
    }
    
    return predictedState;
  }

  /**
   * Вычисляет вектор тренда
   */
  calculateTrendVector(recentLayers, currentLayer) {
    const trendVector = {};
    const allLayers = [...recentLayers, currentLayer].sort((a, b) => a.timestamp - b.timestamp);
    
    if (allLayers.length < 2) return trendVector;
    
    for (const key of Object.keys(currentLayer.semanticState)) {
      const values = allLayers.map(layer => layer.semanticState[key] || 0);
      const trend = this.calculateLinearTrend(values);
      trendVector[key] = trend;
    }
    
    return trendVector;
  }

  /**
   * Вычисляет линейный тренд
   */
  calculateLinearTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = n * (n - 1) / 2; // Сумма индексов
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6; // Сумма квадратов индексов
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return isNaN(slope) ? 0 : slope;
  }

  /**
   * Обнаруживает временные паттерны
   */
  detectTemporalPatterns(currentLayer) {
    const patterns = [];
    
    // Паттерн ускорения эволюции
    const accelerationPattern = this.detectAccelerationPattern(currentLayer);
    if (accelerationPattern) {
      patterns.push(accelerationPattern);
    }
    
    // Паттерн стабилизации
    const stabilizationPattern = this.detectStabilizationPattern(currentLayer);
    if (stabilizationPattern) {
      patterns.push(stabilizationPattern);
    }
    
    // Паттерн колебаний
    const oscillationPattern = this.detectOscillationPattern(currentLayer);
    if (oscillationPattern) {
      patterns.push(oscillationPattern);
    }
    
    // Паттерн сдвига
    const shiftPattern = this.detectShiftPattern(currentLayer);
    if (shiftPattern) {
      patterns.push(shiftPattern);
    }
    
    return patterns;
  }

  /**
   * Анализирует циклические паттерны
   */
  analyzeCyclicPatterns(currentLayer) {
    const cycles = [];
    
    // Ищем повторяющиеся семантические состояния
    const similarLayers = this.findSimilarLayers(currentLayer, 0.8); // 80% сходство
    
    if (similarLayers.length >= 2) {
      const cycle = this.analyzeCycle(similarLayers, currentLayer);
      if (cycle) {
        cycles.push(cycle);
      }
    }
    
    return {
      detectedCycles: cycles,
      cyclicTendency: this.calculateCyclicTendency(),
      nextCyclePoint: this.predictNextCyclePoint(cycles),
      cycleStability: this.assessCycleStability(cycles)
    };
  }

  /**
   * Генерирует временные инсайты
   */
  generateTemporalInsights(evolutionAnalysis, futurePredictions, temporalPatterns) {
    const insights = [];
    
    // Инсайты об эволюции
    if (evolutionAnalysis.evolutionSpeed > 0.7) {
      insights.push({
        type: 'rapid_evolution',
        description: 'Обнаружена быстрая эволюция семантических значений',
        confidence: 0.8,
        implications: ['Система быстро адаптируется', 'Возможны резкие изменения в понимании']
      });
    }
    
    // Инсайты о предсказаниях
    const shortTermPrediction = futurePredictions.find(p => p.period === '5_minutes');
    if (shortTermPrediction && shortTermPrediction.confidence > 0.8) {
      insights.push({
        type: 'high_predictability',
        description: 'Высокая предсказуемость ближайших семантических изменений',
        confidence: shortTermPrediction.confidence,
        implications: ['Стабильная траектория развития', 'Надежные краткосрочные прогнозы']
      });
    }
    
    // Инсайты о паттернах
    if (temporalPatterns.length > 2) {
      insights.push({
        type: 'pattern_richness',
        description: 'Богатство временных паттернов в семантической эволюции',
        confidence: 0.7,
        implications: ['Сложная динамика понимания', 'Многофакторная эволюция смысла']
      });
    }
    
    return insights;
  }

  /**
   * Добавляет временной слой
   */
  addTemporalLayer(layer) {
    this.temporalLayers.set(layer.timestamp, layer);
    this.updateTimeline(layer);
    this.maintainLayerCount();
    
    SmartLogger.temporal(`⏰ Добавлен временной слой: ${new Date(layer.timestamp).toLocaleTimeString()}`);
  }

  /**
   * Обновляет временную линию
   */
  updateTimeline(newLayer) {
    this.semanticTimeline.push(newLayer);
    this.semanticTimeline.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Поддерживает количество слоев
   */
  maintainLayerCount() {
    if (this.temporalLayers.size > this.maxLayersCount) {
      const oldestTimestamp = Math.min(...this.temporalLayers.keys());
      this.temporalLayers.delete(oldestTimestamp);
      this.semanticTimeline = this.semanticTimeline.filter(layer => layer.timestamp !== oldestTimestamp);
    }
  }

  /**
   * Получает недавние слои
   */
  getRecentLayers(count) {
    return this.semanticTimeline.slice(-count - 1, -1); // Исключаем самый последний
  }

  /**
   * Получает состояние машины
   */
  getMachineState() {
    return {
      totalLayers: this.temporalLayers.size,
      timelineLength: this.semanticTimeline.length,
      oldestTimestamp: this.semanticTimeline[0]?.timestamp,
      newestTimestamp: this.semanticTimeline[this.semanticTimeline.length - 1]?.timestamp,
      evolutionSpeed: this.evolutionSpeed,
      temporalResolution: this.temporalResolution,
      detectedPatterns: this.evolutionPatterns.size,
      activePredictions: this.trendPredictions.length,
      temporalAnchors: this.temporalAnchors.size,
      semanticCycles: this.semanticCycles.length
    };
  }

  // Методы измерения семантических характеристик
  measureCreativity(query) {
    const creativeWords = ['уникальный', 'оригинальный', 'креативный', 'необычный', 'нестандартный'];
    const found = creativeWords.filter(word => query.toLowerCase().includes(word)).length;
    return Math.min(1, found / 2);
  }

  measureTechnicality(query) {
    const technicalTerms = ['svg', 'вектор', 'пиксель', 'формат', 'алгоритм', 'оптимизация'];
    const found = technicalTerms.filter(term => query.toLowerCase().includes(term)).length;
    return Math.min(1, found / 3);
  }

  measureEmotionality(query) {
    const emotionalMarkers = ['!', '?', 'срочно', 'отлично', 'ужасно', 'прекрасно'];
    const found = emotionalMarkers.filter(marker => query.toLowerCase().includes(marker)).length;
    return Math.min(1, found / 2);
  }

  measureUrgency(query) {
    const urgencyWords = ['срочно', 'быстро', 'немедленно', 'сейчас', 'скорее'];
    const found = urgencyWords.filter(word => query.toLowerCase().includes(word)).length;
    return Math.min(1, found / 2);
  }

  measureComplexity(query) {
    const complexity = (query.length / 100) + (query.split(' ').length / 20);
    return Math.min(1, complexity);
  }

  measureSpecificity(query) {
    const specificWords = query.split(' ').filter(word => word.length > 6).length;
    return Math.min(1, specificWords / 5);
  }

  measureContinuity(context) {
    return context.sessionId ? 0.8 : 0.2;
  }

  measureProjectRelevance(query, project) {
    // Упрощенная оценка релевантности к проекту
    return project.title && query.toLowerCase().includes(project.title.toLowerCase()) ? 0.9 : 0.3;
  }

  determineTemporalFocus(query) {
    const pastWords = ['был', 'была', 'были', 'раньше', 'вчера'];
    const futureWords = ['будет', 'будут', 'завтра', 'потом', 'скоро'];
    
    const pastFound = pastWords.some(word => query.toLowerCase().includes(word));
    const futureFound = futureWords.some(word => query.toLowerCase().includes(word));
    
    if (pastFound) return 0.2; // Прошлое
    if (futureFound) return 0.8; // Будущее
    return 0.5; // Настоящее
  }

  measureChangeIntent(query) {
    const changeWords = ['измени', 'сделай', 'создай', 'улучши', 'исправь'];
    const found = changeWords.filter(word => query.toLowerCase().includes(word)).length;
    return Math.min(1, found / 2);
  }

  // Методы анализа эволюции
  calculateOverallEvolutionTrend(evolutionChains) {
    if (evolutionChains.length === 0) return { direction: 0, strength: 0 };
    
    const directions = evolutionChains.map(chain => chain.evolution.evolutionVector.direction);
    const avgDirection = directions.reduce((sum, dir) => sum + dir, 0) / directions.length;
    
    const magnitudes = evolutionChains.map(chain => chain.evolution.evolutionVector.magnitude);
    const avgMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length;
    
    return {
      direction: avgDirection,
      strength: avgMagnitude,
      consistency: this.calculateTrendConsistency(directions)
    };
  }

  calculateTrendConsistency(directions) {
    if (directions.length < 2) return 1;
    
    const variance = this.calculateVariance(directions);
    return Math.max(0, 1 - variance);
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / squaredDiffs.length;
  }

  detectEvolutionAnomalies(evolutionChains, overallTrend) {
    const anomalies = [];
    
    for (const chain of evolutionChains) {
      const deviation = Math.abs(chain.evolution.evolutionVector.direction - overallTrend.direction);
      
      if (deviation > 0.5) {
        anomalies.push({
          type: 'direction_anomaly',
          timestamp: chain.to,
          deviation,
          description: 'Неожиданное направление эволюции'
        });
      }
      
      if (chain.evolution.evolutionSpeed > overallTrend.strength * 2) {
        anomalies.push({
          type: 'speed_anomaly',
          timestamp: chain.to,
          speed: chain.evolution.evolutionSpeed,
          description: 'Аномально высокая скорость эволюции'
        });
      }
    }
    
    return anomalies;
  }

  calculateCurrentEvolutionSpeed(evolutionChains) {
    if (evolutionChains.length === 0) return 0;
    
    const speeds = evolutionChains.map(chain => chain.evolution.evolutionSpeed);
    return speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  }

  calculateStabilityTrend(recentLayers, currentLayer) {
    const allLayers = [...recentLayers, currentLayer];
    const stabilities = allLayers.map(layer => layer.stability);
    
    if (stabilities.length < 2) return 0;
    
    const trend = this.calculateLinearTrend(stabilities);
    return trend;
  }

  // Методы предсказания
  calculatePredictionConfidence(timeHorizon) {
    // Уверенность убывает с увеличением временного горизонта
    const minutes = timeHorizon / (60 * 1000);
    return Math.max(0.1, Math.exp(-minutes / 30)); // Экспоненциальное убывание
  }

  selectPredictionMethod(timeHorizon) {
    const minutes = timeHorizon / (60 * 1000);
    
    if (minutes <= 5) return 'linear_extrapolation';
    if (minutes <= 30) return 'trend_analysis';
    return 'pattern_based';
  }

  identifyUncertaintyFactors(timeHorizon) {
    const factors = [];
    const minutes = timeHorizon / (60 * 1000);
    
    if (minutes > 15) {
      factors.push('external_influences');
    }
    
    if (this.evolutionSpeed > 0.7) {
      factors.push('high_evolution_speed');
    }
    
    if (this.temporalLayers.size < 10) {
      factors.push('insufficient_historical_data');
    }
    
    return factors;
  }

  basePrediction(currentLayer, timeDelta) {
    // Базовое предсказание при недостатке данных
    const predictedState = { ...currentLayer.semanticState };
    
    // Небольшой дрейф к нейтральным значениям
    const driftFactor = timeDelta / (60 * 60 * 1000); // Нормализуем к часам
    
    for (const key of Object.keys(predictedState)) {
      const currentValue = predictedState[key];
      const neutralValue = 0.5;
      predictedState[key] = currentValue + (neutralValue - currentValue) * driftFactor * 0.1;
    }
    
    return predictedState;
  }

  // Методы обнаружения паттернов
  detectAccelerationPattern(currentLayer) {
    const recentLayers = this.getRecentLayers(3);
    if (recentLayers.length < 2) return null;
    
    const speeds = [];
    for (let i = 1; i < recentLayers.length; i++) {
      const evolution = recentLayers[i-1].analyzeEvolutionTo(recentLayers[i]);
      speeds.push(evolution.evolutionSpeed);
    }
    
    // Добавляем скорость к текущему слою
    if (recentLayers.length > 0) {
      const latestEvolution = recentLayers[recentLayers.length - 1].analyzeEvolutionTo(currentLayer);
      speeds.push(latestEvolution.evolutionSpeed);
    }
    
    // Проверяем ускорение
    const isAccelerating = this.isAccelerating(speeds);
    
    if (isAccelerating) {
      return {
        type: 'acceleration',
        strength: this.calculateAccelerationStrength(speeds),
        description: 'Ускорение семантической эволюции',
        confidence: 0.8
      };
    }
    
    return null;
  }

  detectStabilizationPattern(currentLayer) {
    const recentLayers = this.getRecentLayers(5);
    if (recentLayers.length < 3) return null;
    
    const stabilityValues = [...recentLayers, currentLayer].map(layer => layer.stability);
    const isStabilizing = this.isStabilizing(stabilityValues);
    
    if (isStabilizing) {
      return {
        type: 'stabilization',
        level: this.calculateStabilizationLevel(stabilityValues),
        description: 'Стабилизация семантических значений',
        confidence: 0.7
      };
    }
    
    return null;
  }

  detectOscillationPattern(currentLayer) {
    const recentLayers = this.getRecentLayers(6);
    if (recentLayers.length < 4) return null;
    
    // Ищем колебания в ключевых семантических измерениях
    const allLayers = [...recentLayers, currentLayer];
    const oscillations = this.findOscillations(allLayers);
    
    if (oscillations.length > 0) {
      return {
        type: 'oscillation',
        oscillations,
        frequency: this.calculateOscillationFrequency(oscillations),
        description: 'Колебательные паттерны в семантике',
        confidence: 0.6
      };
    }
    
    return null;
  }

  detectShiftPattern(currentLayer) {
    const recentLayers = this.getRecentLayers(3);
    if (recentLayers.length < 2) return null;
    
    // Ищем резкие изменения в семантическом пространстве
    const shifts = this.findSemanticShifts(recentLayers, currentLayer);
    
    if (shifts.length > 0) {
      return {
        type: 'shift',
        shifts,
        magnitude: this.calculateShiftMagnitude(shifts),
        description: 'Семантические сдвиги',
        confidence: 0.8
      };
    }
    
    return null;
  }

  // Методы анализа циклов
  findSimilarLayers(targetLayer, threshold) {
    const similarLayers = [];
    
    for (const layer of this.semanticTimeline) {
      if (layer.timestamp === targetLayer.timestamp) continue;
      
      const distance = targetLayer.calculateDistanceTo(layer);
      if (distance.semantic < (1 - threshold)) {
        similarLayers.push({
          layer,
          similarity: 1 - distance.semantic,
          timeDelta: Math.abs(targetLayer.timestamp - layer.timestamp)
        });
      }
    }
    
    return similarLayers.sort((a, b) => b.similarity - a.similarity);
  }

  analyzeCycle(similarLayers, currentLayer) {
    if (similarLayers.length < 2) return null;
    
    // Вычисляем средний период цикла
    const periods = [];
    for (let i = 1; i < similarLayers.length; i++) {
      const timeDelta = Math.abs(similarLayers[i].layer.timestamp - similarLayers[i-1].layer.timestamp);
      periods.push(timeDelta);
    }
    
    const avgPeriod = periods.reduce((sum, period) => sum + period, 0) / periods.length;
    
    return {
      type: 'semantic_cycle',
      period: avgPeriod,
      periodInMinutes: avgPeriod / (60 * 1000),
      similarity: similarLayers[0].similarity,
      participatingLayers: similarLayers.map(sl => sl.layer.timestamp),
      confidence: this.calculateCycleConfidence(periods, similarLayers)
    };
  }

  calculateCyclicTendency() {
    return this.semanticCycles.length / Math.max(1, this.temporalLayers.size / 10);
  }

  predictNextCyclePoint(cycles) {
    if (cycles.length === 0) return null;
    
    const lastCycle = cycles[cycles.length - 1];
    const nextCycleTime = Date.now() + lastCycle.period;
    
    return {
      timestamp: nextCycleTime,
      confidence: lastCycle.confidence * 0.8, // Снижаем уверенность для предсказания
      cycleType: lastCycle.type
    };
  }

  assessCycleStability(cycles) {
    if (cycles.length === 0) return 0;
    
    const periodsVariance = this.calculatePeriodsVariance(cycles);
    return Math.max(0, 1 - periodsVariance);
  }

  calculatePeriodsVariance(cycles) {
    const periods = cycles.map(cycle => cycle.period);
    return this.calculateVariance(periods) / Math.pow(Math.max(...periods), 2);
  }

  // Вспомогательные методы для паттернов
  isAccelerating(speeds) {
    if (speeds.length < 3) return false;
    
    for (let i = 2; i < speeds.length; i++) {
      if (speeds[i] <= speeds[i-1]) return false;
    }
    
    return true;
  }

  calculateAccelerationStrength(speeds) {
    if (speeds.length < 2) return 0;
    
    const accelerations = [];
    for (let i = 1; i < speeds.length; i++) {
      accelerations.push(speeds[i] - speeds[i-1]);
    }
    
    return accelerations.reduce((sum, acc) => sum + acc, 0) / accelerations.length;
  }

  isStabilizing(stabilityValues) {
    if (stabilityValues.length < 3) return false;
    
    const trend = this.calculateLinearTrend(stabilityValues);
    return trend > 0.1; // Положительный тренд стабильности
  }

  calculateStabilizationLevel(stabilityValues) {
    const recent = stabilityValues.slice(-3);
    return recent.reduce((sum, val) => sum + val, 0) / recent.length;
  }

  findOscillations(layers) {
    // Упрощенный поиск колебаний
    const oscillations = [];
    
    for (const key of Object.keys(layers[0].semanticState)) {
      const values = layers.map(layer => layer.semanticState[key] || 0);
      if (this.hasOscillationPattern(values)) {
        oscillations.push({
          dimension: key,
          amplitude: this.calculateAmplitude(values),
          values
        });
      }
    }
    
    return oscillations;
  }

  hasOscillationPattern(values) {
    if (values.length < 4) return false;
    
    // Простая проверка на колебания: знак производной должен меняться
    let signChanges = 0;
    for (let i = 2; i < values.length; i++) {
      const diff1 = values[i-1] - values[i-2];
      const diff2 = values[i] - values[i-1];
      
      if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
        signChanges++;
      }
    }
    
    return signChanges >= 2;
  }

  calculateAmplitude(values) {
    return (Math.max(...values) - Math.min(...values)) / 2;
  }

  calculateOscillationFrequency(oscillations) {
    if (oscillations.length === 0) return 0;
    
    const avgLength = oscillations.reduce((sum, osc) => sum + osc.values.length, 0) / oscillations.length;
    return 1 / avgLength; // Частота как обратная величина периода
  }

  findSemanticShifts(recentLayers, currentLayer) {
    const shifts = [];
    
    if (recentLayers.length === 0) return shifts;
    
    const lastLayer = recentLayers[recentLayers.length - 1];
    const distance = lastLayer.calculateDistanceTo(currentLayer);
    
    if (distance.semantic > 0.5) { // Порог для определения сдвига
      shifts.push({
        from: lastLayer.timestamp,
        to: currentLayer.timestamp,
        distance: distance.semantic,
        type: 'semantic_jump'
      });
    }
    
    return shifts;
  }

  calculateShiftMagnitude(shifts) {
    if (shifts.length === 0) return 0;
    
    return shifts.reduce((sum, shift) => sum + shift.distance, 0) / shifts.length;
  }

  calculateCycleConfidence(periods, similarLayers) {
    const periodVariance = this.calculateVariance(periods);
    const avgSimilarity = similarLayers.reduce((sum, sl) => sum + sl.similarity, 0) / similarLayers.length;
    
    const consistencyFactor = Math.max(0, 1 - periodVariance);
    const similarityFactor = avgSimilarity;
    
    return (consistencyFactor + similarityFactor) / 2;
  }

  /**
   * Получает статистику временной машины
   */
  getTemporalStatistics() {
    return {
      machineState: this.getMachineState(),
      recentEvolutionSpeed: this.evolutionSpeed,
      temporalCoverage: {
        oldestRecord: this.semanticTimeline[0]?.timestamp,
        newestRecord: this.semanticTimeline[this.semanticTimeline.length - 1]?.timestamp,
        totalTimespan: this.calculateTotalTimespan()
      },
      patternStatistics: {
        detectedEvolutionPatterns: this.evolutionPatterns.size,
        activePredictions: this.trendPredictions.length,
        semanticCycles: this.semanticCycles.length,
        temporalAnchors: this.temporalAnchors.size
      },
      analysisQuality: {
        averageLayerStability: this.calculateAverageStability(),
        predictionAccuracy: this.calculatePredictionAccuracy(),
        patternReliability: this.calculatePatternReliability()
      }
    };
  }

  calculateTotalTimespan() {
    if (this.semanticTimeline.length < 2) return 0;
    
    const oldest = this.semanticTimeline[0].timestamp;
    const newest = this.semanticTimeline[this.semanticTimeline.length - 1].timestamp;
    
    return newest - oldest;
  }

  calculateAverageStability() {
    if (this.semanticTimeline.length === 0) return 0;
    
    const stabilities = this.semanticTimeline.map(layer => layer.stability);
    return stabilities.reduce((sum, stability) => sum + stability, 0) / stabilities.length;
  }

  calculatePredictionAccuracy() {
    // Упрощенная оценка точности предсказаний
    // В реальной системе здесь был бы анализ сбывшихся предсказаний
    return 0.7;
  }

  calculatePatternReliability() {
    // Упрощенная оценка надежности паттернов
    return this.evolutionPatterns.size > 0 ? 0.8 : 0.5;
  }
}

module.exports = {
  TemporalSemanticMachine,
  TemporalSemanticLayer
};
