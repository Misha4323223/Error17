/**
 * КВАНТОВАЯ СЕМАНТИЧЕСКАЯ СУПЕРПОЗИЦИЯ
 * Революционный модуль для обработки противоречивых интерпретаций одновременно
 * 
 * Принцип: Подобно квантовой механике, система держит все возможные значения
 * в "суперпозиции" до момента "коллапса" в оптимальную интерпретацию
 */

const { createLogger } = require('../semantic-logger.cjs');
const SmartLogger = createLogger('QUANTUM-SEMANTIC');

/**
 * КВАНТОВОЕ СОСТОЯНИЕ СЕМАНТИКИ
 * Представляет несколько возможных интерпретаций одновременно
 */
class SemanticSuperposition {
  constructor(query) {
    this.originalQuery = query;
    this.states = new Map(); // Возможные состояния с их весами
    this.entanglements = new Map(); // Связи между состояниями
    this.collapsed = false;
    this.finalState = null;
    this.createdAt = Date.now();
  }

  /**
   * Добавляет новое возможное состояние в суперпозицию
   */
  addState(interpretation, probability, context = {}) {
    const stateId = `state_${this.states.size + 1}`;
    
    const state = {
      id: stateId,
      interpretation,
      probability,
      context,
      coherence: this.calculateCoherence(interpretation, context),
      timestamp: Date.now()
    };

    this.states.set(stateId, state);
    SmartLogger.quantum(`➕ Добавлено квантовое состояние: ${interpretation.category || 'unknown'} (P=${probability.toFixed(3)})`);
    
    return stateId;
  }

  /**
   * Создает квантовое запутывание между состояниями
   */
  entangleStates(stateId1, stateId2, correlation) {
    const entanglementId = `${stateId1}_${stateId2}`;
    
    this.entanglements.set(entanglementId, {
      states: [stateId1, stateId2],
      correlation,
      type: correlation > 0 ? 'constructive' : 'destructive',
      strength: Math.abs(correlation)
    });

    SmartLogger.quantum(`🔗 Создано запутывание между ${stateId1} и ${stateId2} (корреляция: ${correlation.toFixed(3)})`);
  }

  /**
   * Вычисляет когерентность состояния
   */
  calculateCoherence(interpretation, context) {
    let coherence = 0.5; // базовая когерентность

    // Анализ внутренней согласованности
    if (interpretation.confidence > 0.7) coherence += 0.2;
    if (interpretation.category && interpretation.category !== 'conversation') coherence += 0.1;
    if (context && Object.keys(context).length > 2) coherence += 0.1;

    // Анализ семантической целостности
    if (interpretation.semanticContext) {
      const semanticKeys = Object.keys(interpretation.semanticContext);
      coherence += Math.min(0.2, semanticKeys.length * 0.05);
    }

    return Math.max(0, Math.min(1, coherence));
  }

  /**
   * Применяет квантовые интерференции между состояниями
   */
  applyInterference() {
    SmartLogger.quantum(`🌊 Применение квантовых интерференций...`);
    
    for (const [entanglementId, entanglement] of this.entanglements) {
      const [state1Id, state2Id] = entanglement.states;
      const state1 = this.states.get(state1Id);
      const state2 = this.states.get(state2Id);

      if (!state1 || !state2) continue;

      // Конструктивная интерференция
      if (entanglement.type === 'constructive') {
        const boost = entanglement.strength * 0.1;
        state1.probability = Math.min(1, state1.probability + boost);
        state2.probability = Math.min(1, state2.probability + boost);
        
        SmartLogger.quantum(`📈 Конструктивная интерференция: ${state1Id} и ${state2Id} усилены`);
      }
      // Деструктивная интерференция
      else {
        const reduction = entanglement.strength * 0.15;
        state1.probability = Math.max(0, state1.probability - reduction);
        state2.probability = Math.max(0, state2.probability - reduction);
        
        SmartLogger.quantum(`📉 Деструктивная интерференция: ${state1Id} и ${state2Id} ослаблены`);
      }
    }

    this.normalizeProvabilities();
  }

  /**
   * Нормализует вероятности всех состояний
   */
  normalizeProvabilities() {
    const totalProbability = Array.from(this.states.values())
      .reduce((sum, state) => sum + state.probability, 0);

    if (totalProbability > 0) {
      for (const state of this.states.values()) {
        state.probability = state.probability / totalProbability;
      }
    }
  }

  /**
   * Коллапсирует суперпозицию в одно определенное состояние
   */
  collapse(contextualFactors = {}) {
    if (this.collapsed) return this.finalState;

    SmartLogger.quantum(`⚡ Коллапс квантовой суперпозиции...`);

    // Применяем интерференции перед коллапсом
    this.applyInterference();

    // Учитываем контекстуальные факторы
    this.applyContextualBias(contextualFactors);

    // Выбираем состояние с наивысшей вероятностью
    let maxProbability = 0;
    let selectedState = null;

    for (const state of this.states.values()) {
      const finalProbability = state.probability * state.coherence;
      
      if (finalProbability > maxProbability) {
        maxProbability = finalProbability;
        selectedState = state;
      }
    }

    this.finalState = selectedState;
    this.collapsed = true;

    SmartLogger.quantum(`🎯 Коллапс завершен: выбрано состояние ${selectedState?.id} с вероятностью ${maxProbability.toFixed(3)}`);

    return this.finalState;
  }

  /**
   * Применяет контекстуальные смещения к вероятностям
   */
  applyContextualBias(contextualFactors) {
    for (const state of this.states.values()) {
      let bias = 1.0;

      // Временной контекст
      if (contextualFactors.timeOfDay) {
        // Утром пользователи более склонны к планированию
        if (contextualFactors.timeOfDay === 'morning' && 
            state.interpretation.category === 'planning') {
          bias *= 1.2;
        }
      }

      // Предыдущие взаимодействия
      if (contextualFactors.previousCategory) {
        if (state.interpretation.category === contextualFactors.previousCategory) {
          bias *= 1.1; // Небольшое предпочтение похожих задач
        }
      }

      // Эмоциональный контекст
      if (contextualFactors.emotionalState) {
        if (contextualFactors.emotionalState === 'creative' && 
            state.interpretation.category === 'image_generation') {
          bias *= 1.3;
        }
      }

      state.probability *= bias;
    }

    this.normalizeProvabilities();
  }

  /**
   * Возвращает информацию о текущем состоянии суперпозиции
   */
  getQuantumState() {
    return {
      collapsed: this.collapsed,
      statesCount: this.states.size,
      entanglementsCount: this.entanglements.size,
      finalState: this.finalState,
      states: Array.from(this.states.values()).map(state => ({
        id: state.id,
        category: state.interpretation.category,
        probability: state.probability,
        coherence: state.coherence
      }))
    };
  }
}

/**
 * КВАНТОВЫЙ СЕМАНТИЧЕСКИЙ ПРОЦЕССОР
 * Управляет созданием и обработкой квантовых суперпозиций
 */
class QuantumSemanticProcessor {
  constructor() {
    this.activeSuperpositions = new Map();
    this.quantumHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Создает квантовую суперпозицию для запроса
   */
  createSuperposition(query, possibleInterpretations) {
    SmartLogger.quantum(`🌀 Создание квантовой суперпозиции для: "${query.substring(0, 50)}..."`);

    const superposition = new SemanticSuperposition(query);
    const superpositionId = `quantum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Добавляем все возможные интерпретации как квантовые состояния
    for (const interpretation of possibleInterpretations) {
      const probability = interpretation.confidence || 0.5;
      superposition.addState(interpretation, probability, interpretation.context);
    }

    // Создаем запутывания между связанными состояниями
    this.createQuantumEntanglements(superposition, possibleInterpretations);

    this.activeSuperpositions.set(superpositionId, superposition);
    
    SmartLogger.quantum(`✨ Суперпозиция создана с ${possibleInterpretations.length} состояниями`);

    return { superpositionId, superposition };
  }

  /**
   * Создает квантовые запутывания между состояниями
   */
  createQuantumEntanglements(superposition, interpretations) {
    const states = Array.from(superposition.states.keys());

    for (let i = 0; i < states.length; i++) {
      for (let j = i + 1; j < states.length; j++) {
        const state1 = superposition.states.get(states[i]);
        const state2 = superposition.states.get(states[j]);

        const correlation = this.calculateStateCorrelation(
          state1.interpretation, 
          state2.interpretation
        );

        if (Math.abs(correlation) > 0.1) { // Только значимые корреляции
          superposition.entangleStates(states[i], states[j], correlation);
        }
      }
    }
  }

  /**
   * Вычисляет корреляцию между двумя состояниями
   */
  calculateStateCorrelation(interpretation1, interpretation2) {
    let correlation = 0;

    // Корреляция по категории
    if (interpretation1.category === interpretation2.category) {
      correlation += 0.3;
    } else if (this.areRelatedCategories(interpretation1.category, interpretation2.category)) {
      correlation += 0.1;
    } else {
      correlation -= 0.2; // Деструктивная интерференция для несвязанных категорий
    }

    // Корреляция по уверенности
    const confidenceDiff = Math.abs(interpretation1.confidence - interpretation2.confidence);
    if (confidenceDiff < 0.2) {
      correlation += 0.1;
    }

    // Корреляция по семантическому контексту
    if (interpretation1.semanticContext && interpretation2.semanticContext) {
      const commonKeys = Object.keys(interpretation1.semanticContext)
        .filter(key => interpretation2.semanticContext.hasOwnProperty(key));
      
      correlation += commonKeys.length * 0.05;
    }

    return Math.max(-1, Math.min(1, correlation));
  }

  /**
   * Проверяет, связаны ли категории
   */
  areRelatedCategories(cat1, cat2) {
    const relatedGroups = [
      ['image_generation', 'image_consultation', 'vectorization'],
      ['search', 'web_analysis', 'information_lookup'],
      ['conversation', 'explanation', 'help']
    ];

    return relatedGroups.some(group => 
      group.includes(cat1) && group.includes(cat2)
    );
  }

  /**
   * Обрабатывает квантовую суперпозицию с контекстом
   */
  async processQuantumSuperposition(superpositionId, contextualFactors = {}) {
    const superposition = this.activeSuperpositions.get(superpositionId);
    if (!superposition) {
      throw new Error(`Квантовая суперпозиция ${superpositionId} не найдена`);
    }

    SmartLogger.quantum(`⚛️ Обработка квантовой суперпозиции ${superpositionId}...`);

    // Добавляем дополнительные состояния на основе контекста
    await this.enrichSuperpositionWithContext(superposition, contextualFactors);

    // Коллапсируем суперпозицию
    const finalState = superposition.collapse(contextualFactors);

    // Сохраняем в историю
    this.quantumHistory.push({
      timestamp: Date.now(),
      superpositionId,
      query: superposition.originalQuery,
      statesCount: superposition.states.size,
      finalState: finalState,
      quantumState: superposition.getQuantumState()
    });

    this.maintainHistorySize();

    // Удаляем из активных суперпозиций
    this.activeSuperpositions.delete(superpositionId);

    SmartLogger.quantum(`🎯 Квантовая обработка завершена: ${finalState?.interpretation?.category || 'unknown'}`);

    return finalState;
  }

  /**
   * Обогащает суперпозицию дополнительными состояниями на основе контекста
   */
  async enrichSuperpositionWithContext(superposition, contextualFactors) {
    // Анализ предыдущих успешных коллапсов
    if (this.quantumHistory.length > 0) {
      const recentHistory = this.quantumHistory.slice(-10);
      const patterns = this.analyzeQuantumPatterns(recentHistory);
      
      if (patterns.length > 0) {
        SmartLogger.quantum(`🔍 Найдено ${patterns.length} квантовых паттернов`);
        
        for (const pattern of patterns) {
          if (pattern.confidence > 0.6) {
            // Создаем дополнительное состояние на основе паттерна
            const patternBasedInterpretation = this.createPatternBasedInterpretation(
              superposition.originalQuery, 
              pattern
            );
            
            superposition.addState(
              patternBasedInterpretation, 
              pattern.confidence * 0.8, // Немного снижаем вероятность
              { source: 'quantum_pattern', pattern: pattern.type }
            );
          }
        }
      }
    }
  }

  /**
   * Анализирует паттерны в квантовой истории
   */
  analyzeQuantumPatterns(history) {
    const patterns = [];

    // Паттерн повторяющихся категорий
    const categoryFreq = {};
    history.forEach(entry => {
      const category = entry.finalState?.interpretation?.category;
      if (category) {
        categoryFreq[category] = (categoryFreq[category] || 0) + 1;
      }
    });

    for (const [category, freq] of Object.entries(categoryFreq)) {
      if (freq >= 3) {
        patterns.push({
          type: 'recurring_category',
          category,
          confidence: Math.min(0.8, freq / history.length),
          frequency: freq
        });
      }
    }

    // Временные паттерны
    const hourlyPatterns = this.analyzeTemporalPatterns(history);
    patterns.push(...hourlyPatterns);

    return patterns;
  }

  /**
   * Анализирует временные паттерны
   */
  analyzeTemporalPatterns(history) {
    const patterns = [];
    const hourlyActivity = {};

    history.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      const category = entry.finalState?.interpretation?.category;
      
      if (!hourlyActivity[hour]) hourlyActivity[hour] = {};
      if (!hourlyActivity[hour][category]) hourlyActivity[hour][category] = 0;
      
      hourlyActivity[hour][category]++;
    });

    const currentHour = new Date().getHours();
    if (hourlyActivity[currentHour]) {
      for (const [category, count] of Object.entries(hourlyActivity[currentHour])) {
        if (count >= 2) {
          patterns.push({
            type: 'temporal_preference',
            category,
            hour: currentHour,
            confidence: Math.min(0.7, count / 5)
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Создает интерпретацию на основе паттерна
   */
  createPatternBasedInterpretation(query, pattern) {
    return {
      category: pattern.category,
      confidence: pattern.confidence,
      context: {
        source: 'quantum_pattern',
        patternType: pattern.type,
        patternConfidence: pattern.confidence
      },
      semanticContext: {
        pattern_based: true,
        historical_preference: pattern.category
      }
    };
  }

  /**
   * Поддерживает размер истории
   */
  maintainHistorySize() {
    if (this.quantumHistory.length > this.maxHistorySize) {
      this.quantumHistory = this.quantumHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Получает статистику квантовых операций
   */
  getQuantumStatistics() {
    return {
      activeSuperpositions: this.activeSuperpositions.size,
      historySize: this.quantumHistory.length,
      recentActivity: this.quantumHistory.slice(-10).map(entry => ({
        timestamp: entry.timestamp,
        category: entry.finalState?.interpretation?.category,
        statesCount: entry.statesCount
      }))
    };
  }
}

// Создаем глобальный экземпляр для использования в системе
const quantumProcessor = new QuantumSemanticProcessor();

// Основная функция для внешнего использования
function processQuantumSemantics(inputData, options = {}) {
  SmartLogger.quantum('🚀 Запуск квантово-семантической обработки');
  
  try {
    // Создаем суперпозицию для входных данных
    const superposition = quantumProcessor.createSuperposition(inputData);
    
    // Добавляем возможные интерпретации
    if (inputData.query) {
      superposition.addState({
        category: 'direct_interpretation',
        confidence: 0.8,
        semanticContext: { directQuery: true }
      }, 0.8);
      
      superposition.addState({
        category: 'contextual_interpretation', 
        confidence: 0.6,
        semanticContext: { contextualQuery: true }
      }, 0.6);
    }
    
    // Коллапсируем в финальное состояние
    const result = quantumProcessor.collapseSuperposition(superposition.id);
    
    SmartLogger.quantum('✅ Квантово-семантическая обработка завершена');
    return {
      success: true,
      result: result,
      superpositionId: superposition.id,
      quantumState: superposition.getQuantumState()
    };
    
  } catch (error) {
    SmartLogger.quantum('❌ Ошибка квантово-семантической обработки:', error.message);
    return {
      success: false,
      error: error.message,
      fallback: 'quantum_semantic_fallback'
    };
  }
}

// Система динамического расширения
const dynamicExtensions = {
  extend: function(methodName, implementation) {
    if (typeof implementation === 'function') {
      this[methodName] = implementation;
      SmartLogger.quantum(`🔧 Динамическое расширение: добавлен метод ${methodName}`);
      return true;
    }
    return false;
  },
  
  checkHealth: function() {
    return {
      module: 'quantum-semantic-processor',
      status: 'healthy',
      activeSuperpositions: quantumProcessor.activeSuperpositions.size,
      historySize: quantumProcessor.quantumHistory.length,
      lastActivity: quantumProcessor.quantumHistory.length > 0 ? 
        quantumProcessor.quantumHistory[quantumProcessor.quantumHistory.length - 1].timestamp : null
    };
  }
};

module.exports = {
  QuantumSemanticProcessor,
  SemanticSuperposition,
  processQuantumSemantics,
  default: quantumProcessor,
  ...dynamicExtensions
};