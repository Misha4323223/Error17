/**
 * ДИНАМИЧЕСКАЯ АРХИТЕКТУРА НЕЙРОННОЙ СЕТИ
 * Революционная система, которая перестраивает свою архитектуру под каждую задачу
 * 
 * Принцип: Подобно мозгу, система создает новые нейронные пути для неизвестных паттернов
 * и самооптимизируется без внешнего вмешательства
 */

const { createLogger } = require('../semantic-logger.cjs');
const SmartLogger = createLogger('NEURAL-ARCHITECT');

/**
 * НЕЙРОННЫЙ УЗЕЛ
 * Представляет отдельный узел в динамической архитектуре
 */
class NeuralNode {
  constructor(id, type, initialWeight = 0.5) {
    this.id = id;
    this.type = type; // 'input', 'hidden', 'output', 'memory', 'processing'
    this.weight = initialWeight;
    this.bias = Math.random() * 0.2 - 0.1; // Случайное смещение
    this.connections = new Map(); // Связи с другими узлами
    this.activations = []; // История активаций
    this.learningRate = 0.01;
    this.lastActivation = 0;
    this.createdAt = Date.now();
    this.usageCount = 0;
    this.effectiveness = 0.5;
  }

  /**
   * Вычисляет активацию узла
   */
  activate(inputs) {
    let sum = this.bias;
    
    // Суммируем взвешенные входы
    for (const [nodeId, input] of Object.entries(inputs)) {
      const connectionWeight = this.connections.get(nodeId) || 0;
      sum += input * connectionWeight;
    }

    // Применяем функцию активации (сигмоида)
    const activation = 1 / (1 + Math.exp(-sum));
    
    this.lastActivation = activation;
    this.activations.push({
      timestamp: Date.now(),
      value: activation,
      inputs: Object.keys(inputs).length
    });

    // Поддерживаем размер истории
    if (this.activations.length > 100) {
      this.activations = this.activations.slice(-50);
    }

    this.usageCount++;
    return activation;
  }

  /**
   * Добавляет или обновляет связь с другим узлом
   */
  addConnection(nodeId, weight) {
    this.connections.set(nodeId, weight);
    SmartLogger.neural(`🔗 Узел ${this.id} связан с ${nodeId} (вес: ${weight.toFixed(3)})`);
  }

  /**
   * Обновляет веса связей на основе обратного распространения
   */
  updateWeights(error, learningInputs) {
    const deltaWeight = this.learningRate * error;
    
    for (const [nodeId, input] of Object.entries(learningInputs)) {
      const currentWeight = this.connections.get(nodeId) || 0;
      const newWeight = currentWeight + deltaWeight * input;
      this.connections.set(nodeId, Math.max(-1, Math.min(1, newWeight))); // Ограничиваем веса
    }

    // Обновляем смещение
    this.bias += deltaWeight;
    this.bias = Math.max(-1, Math.min(1, this.bias));
  }

  /**
   * Оценивает эффективность узла
   */
  evaluateEffectiveness() {
    if (this.activations.length < 5) return 0.5;

    // Анализируем стабильность активаций
    const recentActivations = this.activations.slice(-10).map(a => a.value);
    const variance = this.calculateVariance(recentActivations);
    const meanActivation = recentActivations.reduce((sum, val) => sum + val, 0) / recentActivations.length;

    // Эффективность = стабильность + полезность
    const stability = 1 - Math.min(1, variance * 2);
    const utility = Math.abs(meanActivation - 0.5) * 2; // Избегаем нейтральных узлов

    this.effectiveness = (stability + utility) / 2;
    return this.effectiveness;
  }

  /**
   * Вычисляет дисперсию
   */
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Экспортирует состояние узла
   */
  export() {
    return {
      id: this.id,
      type: this.type,
      weight: this.weight,
      bias: this.bias,
      connectionsCount: this.connections.size,
      usageCount: this.usageCount,
      effectiveness: this.effectiveness,
      lastActivation: this.lastActivation,
      age: Date.now() - this.createdAt
    };
  }
}

/**
 * НЕЙРОННЫЙ СЛОЙ
 * Группа узлов, работающих вместе
 */
class NeuralLayer {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.nodes = new Map();
    this.connections = new Map(); // Связи между слоями
    this.createdAt = Date.now();
    this.lastOptimization = Date.now();
  }

  /**
   * Добавляет узел в слой
   */
  addNode(node) {
    this.nodes.set(node.id, node);
    SmartLogger.neural(`➕ Узел ${node.id} добавлен в слой ${this.name}`);
  }

  /**
   * Удаляет неэффективный узел
   */
  removeNode(nodeId) {
    if (this.nodes.has(nodeId)) {
      this.nodes.delete(nodeId);
      SmartLogger.neural(`➖ Узел ${nodeId} удален из слоя ${this.name}`);
      return true;
    }
    return false;
  }

  /**
   * Обрабатывает входные данные через слой
   */
  process(inputs) {
    const outputs = {};
    
    for (const [nodeId, node] of this.nodes) {
      outputs[nodeId] = node.activate(inputs);
    }

    return outputs;
  }

  /**
   * Оптимизирует слой, удаляя неэффективные узлы
   */
  optimize() {
    const ineffectiveNodes = [];
    
    for (const [nodeId, node] of this.nodes) {
      node.evaluateEffectiveness();
      
      if (node.effectiveness < 0.3 && node.usageCount > 20) {
        ineffectiveNodes.push(nodeId);
      }
    }

    // Удаляем неэффективные узлы (но не все)
    const maxToRemove = Math.floor(this.nodes.size * 0.2); // Не более 20%
    const toRemove = ineffectiveNodes.slice(0, maxToRemove);
    
    toRemove.forEach(nodeId => this.removeNode(nodeId));
    
    this.lastOptimization = Date.now();
    
    SmartLogger.neural(`🔧 Слой ${this.name} оптимизирован: удалено ${toRemove.length} узлов`);
    
    return toRemove.length;
  }

  /**
   * Экспортирует состояние слоя
   */
  export() {
    return {
      name: this.name,
      type: this.type,
      nodesCount: this.nodes.size,
      averageEffectiveness: Array.from(this.nodes.values())
        .reduce((sum, node) => sum + node.effectiveness, 0) / this.nodes.size,
      age: Date.now() - this.createdAt,
      timeSinceOptimization: Date.now() - this.lastOptimization
    };
  }
}

/**
 * ДИНАМИЧЕСКИЙ НЕЙРОННЫЙ АРХИТЕКТОР
 * Управляет всей динамической архитектурой
 */
class DynamicNeuralArchitect {
  constructor() {
    this.layers = new Map();
    this.nodeCounter = 0;
    this.layerCounter = 0;
    this.taskSpecificArchitectures = new Map();
    this.performanceHistory = [];
    this.optimizationInterval = 60000; // 1 минута
    this.lastGlobalOptimization = Date.now();
    this.learningCurve = [];
    
    // Инициализируем базовую архитектуру
    this.initializeBaseArchitecture();
    
    SmartLogger.neural('🏗️ Динамический нейронный архитектор инициализирован');
  }

  /**
   * Инициализирует базовую архитектуру
   */
  initializeBaseArchitecture() {
    // Входной слой
    const inputLayer = new NeuralLayer('input_layer', 'input');
    ['semantic_input', 'context_input', 'user_input'].forEach(id => {
      inputLayer.addNode(new NeuralNode(id, 'input', 1.0));
    });
    this.layers.set('input', inputLayer);

    // Семантический слой
    const semanticLayer = new NeuralLayer('semantic_layer', 'processing');
    ['intent_processor', 'category_analyzer', 'confidence_calculator'].forEach(id => {
      semanticLayer.addNode(new NeuralNode(id, 'processing', 0.7));
    });
    this.layers.set('semantic', semanticLayer);

    // Выходной слой
    const outputLayer = new NeuralLayer('output_layer', 'output');
    ['interpretation_output', 'confidence_output', 'recommendations_output'].forEach(id => {
      outputLayer.addNode(new NeuralNode(id, 'output', 0.8));
    });
    this.layers.set('output', outputLayer);

    // Создаем базовые связи
    this.createBasicConnections();
  }

  /**
   * Создает базовые связи между слоями
   */
  createBasicConnections() {
    const inputLayer = this.layers.get('input');
    const semanticLayer = this.layers.get('semantic');
    const outputLayer = this.layers.get('output');

    // Связываем входной слой с семантическим
    for (const [inputId, inputNode] of inputLayer.nodes) {
      for (const [semanticId, semanticNode] of semanticLayer.nodes) {
        semanticNode.addConnection(inputId, Math.random() * 0.4 + 0.3); // 0.3-0.7
      }
    }

    // Связываем семантический слой с выходным
    for (const [semanticId, semanticNode] of semanticLayer.nodes) {
      for (const [outputId, outputNode] of outputLayer.nodes) {
        outputNode.addConnection(semanticId, Math.random() * 0.4 + 0.3);
      }
    }
  }

  /**
   * Динамически адаптирует архитектуру под задачу
   */
  async adaptArchitectureForTask(taskType, taskComplexity, context = {}) {
    SmartLogger.neural(`🎯 Адаптация архитектуры для задачи: ${taskType} (сложность: ${taskComplexity})`);

    const adaptationId = `${taskType}_${taskComplexity}_${Date.now()}`;
    
    // Проверяем, есть ли готовая архитектура для этого типа задач
    const existingArch = this.findSimilarArchitecture(taskType, taskComplexity);
    
    if (existingArch) {
      SmartLogger.neural(`♻️ Использую существующую архитектуру: ${existingArch.id}`);
      return existingArch;
    }

    // Создаем новую специализированную архитектуру
    const specializedLayers = await this.createSpecializedLayers(taskType, taskComplexity);
    
    // Добавляем специализированные узлы
    const additionalNodes = this.createTaskSpecificNodes(taskType, context);
    
    const architecture = {
      id: adaptationId,
      taskType,
      taskComplexity,
      specializedLayers,
      additionalNodes,
      createdAt: Date.now(),
      usageCount: 0,
      performance: 0.5
    };

    this.taskSpecificArchitectures.set(adaptationId, architecture);
    
    SmartLogger.neural(`✨ Создана новая архитектура: ${adaptationId}`);
    
    return architecture;
  }

  /**
   * Находит похожую архитектуру
   */
  findSimilarArchitecture(taskType, taskComplexity) {
    for (const [id, arch] of this.taskSpecificArchitectures) {
      if (arch.taskType === taskType && 
          Math.abs(arch.taskComplexity - taskComplexity) < 0.3 &&
          arch.performance > 0.6) {
        arch.usageCount++;
        return arch;
      }
    }
    return null;
  }

  /**
   * Создает специализированные слои для задачи
   */
  async createSpecializedLayers(taskType, taskComplexity) {
    const layers = [];

    switch (taskType) {
      case 'image_generation':
        layers.push(this.createImageProcessingLayer());
        layers.push(this.createCreativityLayer());
        break;
        
      case 'search':
        layers.push(this.createQueryAnalysisLayer());
        layers.push(this.createRelevanceLayer());
        break;
        
      case 'conversation':
        layers.push(this.createContextLayer());
        layers.push(this.createEmotionalLayer());
        break;
        
      default:
        layers.push(this.createGeneralProcessingLayer());
    }

    // Добавляем слои сложности
    if (taskComplexity > 0.7) {
      layers.push(this.createComplexityHandlingLayer());
    }

    return layers;
  }

  /**
   * Создает слой обработки изображений
   */
  createImageProcessingLayer() {
    const layer = new NeuralLayer(`image_proc_${this.layerCounter++}`, 'specialized');
    
    ['style_analyzer', 'color_processor', 'composition_evaluator', 'aesthetic_judge'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'processing', 0.6);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает слой креативности
   */
  createCreativityLayer() {
    const layer = new NeuralLayer(`creativity_${this.layerCounter++}`, 'specialized');
    
    ['novelty_generator', 'pattern_breaker', 'inspiration_synthesizer'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'creative', 0.8);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает слой анализа запросов
   */
  createQueryAnalysisLayer() {
    const layer = new NeuralLayer(`query_analysis_${this.layerCounter++}`, 'specialized');
    
    ['intent_extractor', 'keyword_analyzer', 'context_mapper'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'analytical', 0.7);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает слой релевантности
   */
  createRelevanceLayer() {
    const layer = new NeuralLayer(`relevance_${this.layerCounter++}`, 'specialized');
    
    ['similarity_calculator', 'importance_evaluator', 'freshness_assessor'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'evaluative', 0.65);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает контекстный слой
   */
  createContextLayer() {
    const layer = new NeuralLayer(`context_${this.layerCounter++}`, 'specialized');
    
    ['history_analyzer', 'topic_tracker', 'conversation_flow'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'contextual', 0.6);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает эмоциональный слой
   */
  createEmotionalLayer() {
    const layer = new NeuralLayer(`emotional_${this.layerCounter++}`, 'specialized');
    
    ['mood_detector', 'empathy_generator', 'tone_adapter'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'emotional', 0.7);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает общий слой обработки
   */
  createGeneralProcessingLayer() {
    const layer = new NeuralLayer(`general_${this.layerCounter++}`, 'general');
    
    ['pattern_recognizer', 'logic_processor', 'decision_maker'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'general', 0.5);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает слой обработки сложности
   */
  createComplexityHandlingLayer() {
    const layer = new NeuralLayer(`complexity_${this.layerCounter++}`, 'meta');
    
    ['complexity_analyzer', 'strategy_selector', 'resource_allocator'].forEach(nodeType => {
      const node = new NeuralNode(`${nodeType}_${this.nodeCounter++}`, 'meta', 0.8);
      layer.addNode(node);
    });

    this.layers.set(layer.name, layer);
    return layer;
  }

  /**
   * Создает узлы специфичные для задачи
   */
  createTaskSpecificNodes(taskType, context) {
    const nodes = [];

    // Добавляем узлы на основе контекста
    if (context.userPreferences) {
      nodes.push(new NeuralNode(`user_pref_${this.nodeCounter++}`, 'preference', 0.9));
    }

    if (context.previousInteractions) {
      nodes.push(new NeuralNode(`history_${this.nodeCounter++}`, 'memory', 0.7));
    }

    if (context.urgency) {
      nodes.push(new NeuralNode(`urgency_${this.nodeCounter++}`, 'priority', 0.8));
    }

    return nodes;
  }

  /**
   * Обрабатывает запрос через динамическую архитектуру
   */
  async processWithDynamicArchitecture(query, taskType, context = {}) {
    const startTime = Date.now();
    
    // Определяем сложность задачи
    const taskComplexity = this.assessTaskComplexity(query, context);
    
    // Адаптируем архитектуру
    const architecture = await this.adaptArchitectureForTask(taskType, taskComplexity, context);
    
    // Подготавливаем входные данные
    const inputs = this.prepareInputs(query, context);
    
    // Прогоняем через слои
    let currentOutputs = inputs;
    const layerResults = {};
    
    // Проходим через базовые слои
    for (const [layerName, layer] of this.layers) {
      currentOutputs = layer.process(currentOutputs);
      layerResults[layerName] = { ...currentOutputs };
    }
    
    // Проходим через специализированные слои
    for (const specializedLayer of architecture.specializedLayers) {
      currentOutputs = specializedLayer.process(currentOutputs);
      layerResults[specializedLayer.name] = { ...currentOutputs };
    }

    const processingTime = Date.now() - startTime;
    
    // Обновляем производительность архитектуры
    this.updateArchitecturePerformance(architecture, processingTime, currentOutputs);
    
    const result = {
      interpretation: this.interpretOutputs(currentOutputs),
      confidence: this.calculateConfidence(currentOutputs),
      architecture: architecture.id,
      layerResults,
      processingTime,
      nodesUsed: this.countActiveNodes(),
      adaptations: architecture.specializedLayers.length
    };

    SmartLogger.neural(`🎯 Обработка завершена за ${processingTime}мс с архитектурой ${architecture.id}`);
    
    return result;
  }

  /**
   * Оценивает сложность задачи
   */
  assessTaskComplexity(query, context) {
    let complexity = 0.3; // Базовая сложность

    // Анализ длины запроса
    complexity += Math.min(0.3, query.length / 1000);

    // Анализ контекста
    if (context.previousInteractions) complexity += 0.1;
    if (context.multipleSteps) complexity += 0.2;
    if (context.requiresCreativity) complexity += 0.2;
    if (context.technicalDepth) complexity += 0.15;

    // Анализ ключевых слов сложности
    const complexityWords = ['детально', 'комплексно', 'анализ', 'сравнение', 'оптимизация'];
    const complexWords = complexityWords.filter(word => 
      query.toLowerCase().includes(word)
    ).length;
    
    complexity += complexWords * 0.1;

    return Math.max(0, Math.min(1, complexity));
  }

  /**
   * Подготавливает входные данные
   */
  prepareInputs(query, context) {
    return {
      semantic_input: this.encodeQuery(query),
      context_input: this.encodeContext(context),
      user_input: query.length / 1000, // Нормализованная длина
      timestamp: Date.now() / 1000000000 // Нормализованное время
    };
  }

  /**
   * Кодирует запрос в числовое представление
   */
  encodeQuery(query) {
    // Простое кодирование на основе характеристик
    const length = Math.min(1, query.length / 500);
    const complexity = query.split(' ').length / 100;
    const questionCount = (query.match(/\?/g) || []).length / 10;
    
    return (length + complexity + questionCount) / 3;
  }

  /**
   * Кодирует контекст
   */
  encodeContext(context) {
    let score = 0.5;
    
    if (context.previousInteractions) score += 0.2;
    if (context.userPreferences) score += 0.15;
    if (context.urgency) score += 0.1;
    
    return Math.min(1, score);
  }

  /**
   * Интерпретирует выходные данные
   */
  interpretOutputs(outputs) {
    const interpretation = {
      category: 'conversation',
      confidence: 0.5,
      reasoning: []
    };

    // Анализируем выходы
    if (outputs.interpretation_output > 0.7) {
      interpretation.category = 'high_confidence_task';
      interpretation.reasoning.push('Высокая активация интерпретатора');
    }

    if (outputs.confidence_output > 0.8) {
      interpretation.confidence = outputs.confidence_output;
      interpretation.reasoning.push('Высокая уверенность системы');
    }

    return interpretation;
  }

  /**
   * Вычисляет общую уверенность
   */
  calculateConfidence(outputs) {
    const values = Object.values(outputs).filter(v => typeof v === 'number');
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // Уверенность = среднее значение, скорректированное на стабильность
    return mean * (1 - Math.min(0.5, variance));
  }

  /**
   * Подсчитывает активные узлы
   */
  countActiveNodes() {
    let count = 0;
    for (const layer of this.layers.values()) {
      count += layer.nodes.size;
    }
    return count;
  }

  /**
   * Обновляет производительность архитектуры
   */
  updateArchitecturePerformance(architecture, processingTime, outputs) {
    const efficiency = Math.max(0, 1 - processingTime / 10000); // 10 секунд = 0 эффективности
    const outputQuality = this.calculateConfidence(outputs);
    
    const newPerformance = (efficiency + outputQuality) / 2;
    
    // Обновляем с экспоненциальным сглаживанием
    architecture.performance = architecture.performance * 0.8 + newPerformance * 0.2;
    
    this.performanceHistory.push({
      timestamp: Date.now(),
      architectureId: architecture.id,
      performance: newPerformance,
      processingTime,
      outputQuality
    });

    // Поддерживаем размер истории
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-500);
    }
  }

  /**
   * Глобальная оптимизация всей системы
   */
  async performGlobalOptimization() {
    if (Date.now() - this.lastGlobalOptimization < this.optimizationInterval) {
      return;
    }

    SmartLogger.neural('🔧 Начинаем глобальную оптимизацию архитектуры...');

    let totalOptimizations = 0;

    // Оптимизируем каждый слой
    for (const layer of this.layers.values()) {
      totalOptimizations += layer.optimize();
    }

    // Удаляем неэффективные архитектуры
    const ineffectiveArchitectures = [];
    for (const [id, arch] of this.taskSpecificArchitectures) {
      if (arch.performance < 0.4 && arch.usageCount > 5) {
        ineffectiveArchitectures.push(id);
      }
    }

    ineffectiveArchitectures.forEach(id => {
      this.taskSpecificArchitectures.delete(id);
      SmartLogger.neural(`🗑️ Удалена неэффективная архитектура: ${id}`);
    });

    // Создаем новые нейронные пути для улучшения
    const newPathways = this.createNewNeuralPathways();

    this.lastGlobalOptimization = Date.now();

    SmartLogger.neural(`✅ Глобальная оптимизация завершена: ${totalOptimizations} узлов удалено, ${ineffectiveArchitectures.length} архитектур удалено, ${newPathways} новых путей создано`);

    return {
      optimizedNodes: totalOptimizations,
      removedArchitectures: ineffectiveArchitectures.length,
      newPathways,
      timestamp: Date.now()
    };
  }

  /**
   * Создает новые нейронные пути
   */
  createNewNeuralPathways() {
    let newPathways = 0;

    // Анализируем успешные паттерны
    const successfulPatterns = this.analyzeSuccessfulPatterns();

    for (const pattern of successfulPatterns) {
      if (pattern.confidence > 0.8) {
        // Создаем новый узел для этого паттерна
        const newNode = new NeuralNode(
          `pattern_${pattern.type}_${this.nodeCounter++}`,
          'pattern_specialized',
          0.7
        );

        // Добавляем в подходящий слой
        const targetLayer = this.findBestLayerForPattern(pattern);
        if (targetLayer) {
          targetLayer.addNode(newNode);
          this.createPatternConnections(newNode, pattern);
          newPathways++;
        }
      }
    }

    return newPathways;
  }

  /**
   * Анализирует успешные паттерны
   */
  analyzeSuccessfulPatterns() {
    const patterns = [];
    
    // Анализируем историю производительности
    const recentSuccesses = this.performanceHistory
      .filter(h => h.performance > 0.7)
      .slice(-50);

    // Группируем по типам архитектур
    const architectureGroups = {};
    for (const success of recentSuccesses) {
      const archId = success.architectureId;
      if (!architectureGroups[archId]) {
        architectureGroups[archId] = [];
      }
      architectureGroups[archId].push(success);
    }

    // Создаем паттерны для успешных архитектур
    for (const [archId, successes] of Object.entries(architectureGroups)) {
      if (successes.length >= 3) {
        const avgPerformance = successes.reduce((sum, s) => sum + s.performance, 0) / successes.length;
        
        patterns.push({
          type: archId.split('_')[0], // Тип задачи
          confidence: avgPerformance,
          frequency: successes.length,
          architectureId: archId
        });
      }
    }

    return patterns;
  }

  /**
   * Находит лучший слой для паттерна
   */
  findBestLayerForPattern(pattern) {
    // Ищем слой с похожим типом
    for (const layer of this.layers.values()) {
      if (layer.type === 'processing' || layer.type === 'specialized') {
        return layer;
      }
    }
    
    // Если не найден, используем семантический слой
    return this.layers.get('semantic');
  }

  /**
   * Создает связи для нового узла паттерна
   */
  createPatternConnections(newNode, pattern) {
    // Связываем с входным слоем
    const inputLayer = this.layers.get('input');
    for (const inputNode of inputLayer.nodes.values()) {
      newNode.addConnection(inputNode.id, Math.random() * 0.3 + 0.4);
    }

    // Связываемся с выходным слоем
    const outputLayer = this.layers.get('output');
    for (const outputNode of outputLayer.nodes.values()) {
      outputNode.addConnection(newNode.id, Math.random() * 0.3 + 0.4);
    }
  }

  /**
   * Получает статистику архитектуры
   */
  getArchitectureStatistics() {
    const stats = {
      totalLayers: this.layers.size,
      totalNodes: 0,
      totalConnections: 0,
      specializedArchitectures: this.taskSpecificArchitectures.size,
      averagePerformance: 0,
      systemAge: Date.now() - (this.performanceHistory[0]?.timestamp || Date.now()),
      optimizationCycles: Math.floor((Date.now() - this.lastGlobalOptimization) / this.optimizationInterval)
    };

    // Подсчитываем узлы и связи
    for (const layer of this.layers.values()) {
      stats.totalNodes += layer.nodes.size;
      for (const node of layer.nodes.values()) {
        stats.totalConnections += node.connections.size;
      }
    }

    // Средняя производительность
    if (this.performanceHistory.length > 0) {
      const recentPerformance = this.performanceHistory.slice(-100);
      stats.averagePerformance = recentPerformance.reduce((sum, p) => sum + p.performance, 0) / recentPerformance.length;
    }

    return stats;
  }

  /**
   * Экспортирует полное состояние архитектуры
   */
  exportArchitecture() {
    return {
      layers: Array.from(this.layers.values()).map(layer => layer.export()),
      taskSpecificArchitectures: Array.from(this.taskSpecificArchitectures.values()).map(arch => ({
        id: arch.id,
        taskType: arch.taskType,
        taskComplexity: arch.taskComplexity,
        usageCount: arch.usageCount,
        performance: arch.performance
      })),
      statistics: this.getArchitectureStatistics(),
      recentPerformance: this.performanceHistory.slice(-20)
    };
  }
}

module.exports = {
  DynamicNeuralArchitect,
  NeuralLayer,
  NeuralNode
};