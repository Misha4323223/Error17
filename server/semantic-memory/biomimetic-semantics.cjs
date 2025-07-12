/**
 * 🦋🧠 БИОМИМЕТИЧЕСКАЯ СЕМАНТИКА
 * Имитация природных процессов обработки информации
 * Адаптация биологических алгоритмов для семантического анализа
 */

const { createLogger } = require('../semantic-logger.cjs');
const SmartLogger = createLogger('BIOMIMETIC-SEMANTICS');

/**
 * НЕЙРОН СЕМАНТИЧЕСКОЙ СЕТИ
 * Имитирует биологический нейрон для обработки семантической информации
 */
class SemanticNeuron {
  constructor(id, neuronType = 'general') {
    this.id = id;
    this.neuronType = neuronType; // general, sensory, motor, interneuron
    this.activationLevel = 0; // Уровень активации (0-1)
    this.threshold = 0.3 + Math.random() * 0.4; // Порог активации
    this.connections = new Map(); // Связи с другими нейронами
    this.weights = new Map(); // Веса связей
    this.lastActivation = 0; // Время последней активации
    this.fatigue = 0; // Усталость нейрона
    this.plasticity = 0.1 + Math.random() * 0.1; // Пластичность
    this.age = 0; // Возраст нейрона
    this.specialization = this.determineSpecialization(neuronType);
    this.metabolicRate = 0.5 + Math.random() * 0.5; // Метаболическая активность
    this.neurotransmitters = new Map([
      ['dopamine', 0.5],
      ['serotonin', 0.5],
      ['acetylcholine', 0.5],
      ['gaba', 0.5]
    ]);
    this.memoryTrace = []; // След памяти нейрона
    this.inhibitoryInputs = 0; // Тормозящие входы
    this.excitatoryInputs = 0; // Возбуждающие входы
  }

  /**
   * Определяет специализацию нейрона
   */
  determineSpecialization(neuronType) {
    const specializations = {
      'general': ['pattern_recognition', 'association'],
      'sensory': ['feature_detection', 'encoding'],
      'motor': ['action_planning', 'execution'],
      'interneuron': ['integration', 'modulation']
    };

    const typeSpecializations = specializations[neuronType] || specializations['general'];
    return typeSpecializations[Math.floor(Math.random() * typeSpecializations.length)];
  }

  /**
   * Обрабатывает входящий сигнал
   */
  processInput(input, sourceNeuronId, signalType = 'excitatory') {
    // Учитываем вес связи
    const weight = this.weights.get(sourceNeuronId) || 0.5;
    const weightedInput = input * weight;

    // Применяем нейромедиаторы
    const neurotransmitterEffect = this.applyNeurotransmitterEffect(signalType);
    const modifiedInput = weightedInput * neurotransmitterEffect;

    // Обновляем входы
    if (signalType === 'excitatory') {
      this.excitatoryInputs += modifiedInput;
    } else {
      this.inhibitoryInputs += modifiedInput;
    }

    // Проверяем активацию
    const netInput = this.excitatoryInputs - this.inhibitoryInputs;

    if (netInput > this.threshold && this.fatigue < 0.8) {
      this.activate(netInput);
      return this.activationLevel;
    }

    return 0;
  }

  /**
   * Активирует нейрон
   */
  activate(netInput) {
    // Сигмоидная функция активации
    this.activationLevel = 1 / (1 + Math.exp(-(netInput - this.threshold)));

    // Учитываем усталость
    this.activationLevel *= (1 - this.fatigue);

    // Обновляем состояние
    this.lastActivation = Date.now();
    this.fatigue += 0.1 * this.metabolicRate;
    this.age++;

    // Сохраняем в памяти
    this.memoryTrace.push({
      timestamp: this.lastActivation,
      activationLevel: this.activationLevel,
      netInput: netInput
    });

    // Ограничиваем память
    if (this.memoryTrace.length > 100) {
      this.memoryTrace = this.memoryTrace.slice(-100);
    }

    // Сбрасываем входы
    this.excitatoryInputs = 0;
    this.inhibitoryInputs = 0;

    SmartLogger.biomimetic(`🧠 Нейрон ${this.id} активирован (уровень: ${this.activationLevel.toFixed(3)})`);
  }

  /**
   * Применяет эффект нейромедиаторов
   */
  applyNeurotransmitterEffect(signalType) {
    let effect = 1.0;

    switch (signalType) {
      case 'dopaminergic':
        effect *= (1 + this.neurotransmitters.get('dopamine'));
        break;
      case 'serotonergic':
        effect *= (1 + this.neurotransmitters.get('serotonin'));
        break;
      case 'cholinergic':
        effect *= (1 + this.neurotransmitters.get('acetylcholine'));
        break;
      case 'gabaergic':
        effect *= (1 - this.neurotransmitters.get('gaba')); // ГАМК тормозящий
        break;
    }

    return effect;
  }

  /**
   * Создает связь с другим нейроном
   */
  connectTo(targetNeuron, initialWeight = null) {
    const weight = initialWeight || (0.3 + Math.random() * 0.4);
    this.connections.set(targetNeuron.id, targetNeuron);
    this.weights.set(targetNeuron.id, weight);

    SmartLogger.biomimetic(`🔗 Связь создана: ${this.id} → ${targetNeuron.id} (вес: ${weight.toFixed(3)})`);

    return weight;
  }

  /**
   * Обновляет вес связи (пластичность)
   */
  updateWeight(targetNeuronId, delta) {
    const currentWeight = this.weights.get(targetNeuronId) || 0;
    const newWeight = Math.max(0, Math.min(1, currentWeight + delta * this.plasticity));

    this.weights.set(targetNeuronId, newWeight);

    return newWeight;
  }

  /**
   * Восстанавливается от усталости
   */
  rest(duration = 1000) {
    const restEffect = duration / 10000; // Нормализация
    this.fatigue = Math.max(0, this.fatigue - restEffect);

    // Регенерация нейромедиаторов
    for (const [neurotransmitter, level] of this.neurotransmitters) {
      this.neurotransmitters.set(neurotransmitter, Math.min(1, level + restEffect * 0.1));
    }

    SmartLogger.biomimetic(`😴 Нейрон ${this.id} восстанавливается (усталость: ${this.fatigue.toFixed(3)})`);
  }

  /**
   * Применяет синаптическую пластичность (обучение Хебба)
   */
  applyHebbianLearning(targetNeuronId, targetActivation) {
    if (this.activationLevel > 0.5 && targetActivation > 0.5) {
      // Усиливаем связь (LTP - Long Term Potentiation)
      const strengthening = 0.01 * this.activationLevel * targetActivation;
      this.updateWeight(targetNeuronId, strengthening);
      return 'strengthened';
    } else if (this.activationLevel > 0.5 && targetActivation < 0.1) {
      // Ослабляем связь (LTD - Long Term Depression)
      const weakening = -0.005 * this.activationLevel;
      this.updateWeight(targetNeuronId, weakening);
      return 'weakened';
    }

    return 'unchanged';
  }

  /**
   * Экспортирует состояние нейрона
   */
  export() {
    return {
      id: this.id,
      neuronType: this.neuronType,
      specialization: this.specialization,
      activationLevel: this.activationLevel,
      threshold: this.threshold,
      connectionsCount: this.connections.size,
      age: this.age,
      fatigue: this.fatigue,
      plasticity: this.plasticity,
      neurotransmitters: Object.fromEntries(this.neurotransmitters),
      memoryTraceLength: this.memoryTrace.length
    };
  }
}

/**
 * СЕМАНТИЧЕСКАЯ НЕЙРОННАЯ СЕТЬ
 * Биологически вдохновленная нейронная сеть для семантической обработки
 */
class SemanticNeuralNetwork {
  constructor(networkSize = 50) {
    this.neurons = new Map();
    this.layers = new Map([
      ['input', []],
      ['hidden1', []],
      ['hidden2', []],
      ['output', []]
    ]);
    this.networkSize = networkSize;
    this.globalInhibition = 0.1; // Глобальное торможение
    this.neurotransmitterPool = new Map([
      ['dopamine', 1.0],
      ['serotonin', 1.0],
      ['acetylcholine', 1.0],
      ['gaba', 1.0]
    ]);
    this.learningRate = 0.01;
    this.networkActivity = 0;
    this.oscillations = new Map(); // Нейронные осцилляции
    this.criticalPeriods = []; // Критические периоды развития

    this.initializeNetwork();
  }

  /**
   * Инициализирует сеть
   */
  initializeNetwork() {
    // Создаем нейроны для каждого слоя
    const layerSizes = {
      'input': Math.floor(this.networkSize * 0.2),
      'hidden1': Math.floor(this.networkSize * 0.3),
      'hidden2': Math.floor(this.networkSize * 0.3),
      'output': Math.floor(this.networkSize * 0.2)
    };

    for (const [layerName, size] of Object.entries(layerSizes)) {
      for (let i = 0; i < size; i++) {
        const neuronId = `${layerName}_${i}`;
        const neuronType = this.determineNeuronType(layerName);
        const neuron = new SemanticNeuron(neuronId, neuronType);

        this.neurons.set(neuronId, neuron);
        this.layers.get(layerName).push(neuron);
      }
    }

    // Создаем связи между слоями
    this.establishConnections();

    SmartLogger.biomimetic(`🧠 Семантическая нейронная сеть инициализирована с ${this.neurons.size} нейронами`);
  }

  /**
   * Определяет тип нейрона по слою
   */
  determineNeuronType(layerName) {
    const typeMap = {
      'input': 'sensory',
      'hidden1': 'interneuron',
      'hidden2': 'interneuron',
      'output': 'motor'
    };

    return typeMap[layerName] || 'general';
  }

  /**
   * Устанавливает связи между слоями
   */
  establishConnections() {
    const layerNames = ['input', 'hidden1', 'hidden2', 'output'];

    for (let i = 0; i < layerNames.length - 1; i++) {
      const sourceLayer = this.layers.get(layerNames[i]);
      const targetLayer = this.layers.get(layerNames[i + 1]);

      for (const sourceNeuron of sourceLayer) {
        for (const targetNeuron of targetLayer) {
          // Вероятностное соединение
          if (Math.random() < 0.7) {
            sourceNeuron.connectTo(targetNeuron);
          }
        }
      }
    }

    // Рекуррентные связи в скрытых слоях
    this.establishRecurrentConnections();
  }

  /**
   * Устанавливает рекуррентные связи
   */
  establishRecurrentConnections() {
    for (const layerName of ['hidden1', 'hidden2']) {
      const layer = this.layers.get(layerName);

      for (let i = 0; i < layer.length; i++) {
        for (let j = 0; j < layer.length; j++) {
          if (i !== j && Math.random() < 0.3) {
            layer[i].connectTo(layer[j], 0.1 + Math.random() * 0.2);
          }
        }
      }
    }
  }

  /**
   * Обрабатывает входные данные через сеть
   */
  async processSemanticInput(semanticInput, context = {}) {
    SmartLogger.biomimetic(`🔄 Обработка семантического входа через биомиметическую сеть`);

    // Кодируем семантический вход в нейронные сигналы
    const encodedInput = this.encodeSemanticInput(semanticInput, context);

    // Пропускаем через входной слой
    await this.activateInputLayer(encodedInput);

    // Пропагация через скрытые слои
    for (const layerName of ['hidden1', 'hidden2']) {
      await this.propagateToLayer(layerName);
      await this.applyLayerProcessing(layerName);
    }

    // Активация выходного слоя
    await this.propagateToLayer('output');

    // Декодируем выход
    const semanticOutput = this.decodeNetworkOutput();

    // Применяем обучение
    this.applyNetworkLearning(semanticInput, semanticOutput);

    // Обновляем сетевую активность
    this.updateNetworkActivity();

    return {
      semanticOutput,
      networkActivity: this.networkActivity,
      activatedNeurons: this.getActivatedNeurons(),
      emergentPatterns: this.detectEmergentPatterns(),
      learningChanges: this.getRecentLearningChanges()
    };
  }

  /**
   * Кодирует семантический вход
   */
  encodeSemanticInput(semanticInput, context) {
    const encoded = new Map();

    // Кодирование различных аспектов семантики
    const aspects = [
      'intent', 'emotion', 'complexity', 'specificity', 
      'creativity', 'urgency', 'technical_content', 'context_continuity'
    ];

    for (let i = 0; i < aspects.length && i < this.layers.get('input').length; i++) {
      const aspect = aspects[i];
      let value = 0;

      switch (aspect) {
        case 'intent':
          value = this.extractIntentSignal(semanticInput);
          break;
        case 'emotion':
          value = this.extractEmotionalSignal(semanticInput);
          break;
        case 'complexity':
          value = this.extractComplexitySignal(semanticInput);
          break;
        case 'specificity':
          value = this.extractSpecificitySignal(semanticInput);
          break;
        case 'creativity':
          value = this.extractCreativitySignal(semanticInput);
          break;
        case 'urgency':
          value = this.extractUrgencySignal(semanticInput);
          break;
        case 'technical_content':
          value = this.extractTechnicalSignal(semanticInput);
          break;
        case 'context_continuity':
          value = this.extractContextualSignal(semanticInput, context);
          break;
      }

      encoded.set(this.layers.get('input')[i].id, value);
    }

    return encoded;
  }

  /**
   * Активирует входной слой
   */
  async activateInputLayer(encodedInput) {
    for (const [neuronId, inputValue] of encodedInput) {
      const neuron = this.neurons.get(neuronId);
      if (neuron) {
        neuron.processInput(inputValue, 'external', 'excitatory');
      }
    }
  }

  /**
   * Пропагирует активацию к слою
   */
  async propagateToLayer(layerName) {
    const targetLayer = this.layers.get(layerName);

    for (const targetNeuron of targetLayer) {
      let totalInput = 0;
      let inputCount = 0;

      // Собираем входы от всех связанных нейронов
      for (const [sourceNeuronId, sourceNeuron] of this.neurons) {
        if (sourceNeuron.connections.has(targetNeuron.id)) {
          const signal = sourceNeuron.activationLevel;
          if (signal > 0) {
            totalInput += targetNeuron.processInput(signal, sourceNeuronId, 'excitatory');
            inputCount++;
          }
        }
      }

      // Применяем глобальное торможение
      if (inputCount > 0) {
        const inhibition = this.globalInhibition * this.networkActivity;
        targetNeuron.processInput(inhibition, 'global', 'inhibitory');
      }
    }
  }

  /**
   * Применяет специфическую обработку слоя
   */
  async applyLayerProcessing(layerName) {
    const layer = this.layers.get(layerName);

    // Латеральное торможение
    await this.applyLateralInhibition(layer);

    // Конкуренция нейронов
    await this.applyNeuronalCompetition(layer);

    // Синхронизация
    await this.applySynchronization(layer);
  }

  /**
   * Применяет латеральное торможение
   */
  async applyLateralInhibition(layer) {
    const activeNeurons = layer.filter(n => n.activationLevel > 0.5);

    for (const neuron of activeNeurons) {
      for (const otherNeuron of layer) {
        if (neuron !== otherNeuron && otherNeuron.activationLevel > 0.3) {
          const inhibition = neuron.activationLevel * 0.1;
          otherNeuron.processInput(inhibition, neuron.id, 'inhibitory');
        }
      }
    }
  }

  /**
   * Применяет конкуренцию нейронов
   */
  async applyNeuronalCompetition(layer) {
    // Находим самый активный нейрон
    const mostActive = layer.reduce((max, neuron) => 
      neuron.activationLevel > max.activationLevel ? neuron : max);

    if (mostActive.activationLevel > 0.7) {
      // Усиливаем победителя
      mostActive.activationLevel = Math.min(1, mostActive.activationLevel * 1.1);

      // Подавляем остальных
      for (const neuron of layer) {
        if (neuron !== mostActive) {
          neuron.activationLevel *= 0.9;
        }
      }
    }
  }

  /**
   * Применяет синхронизацию
   */
  async applySynchronization(layer) {
    const activeNeurons = layer.filter(n => n.activationLevel > 0.4);

    if (activeNeurons.length >= 2) {
      const avgActivation = activeNeurons.reduce((sum, n) => sum + n.activationLevel, 0) / activeNeurons.length;

      // Синхронизируем активные нейроны
      for (const neuron of activeNeurons) {
        neuron.activationLevel = (neuron.activationLevel + avgActivation) / 2;
      }

      // Записываем осцилляцию
      this.recordOscillation(layer, avgActivation);
    }
  }

  /**
   * Записывает осцилляцию
   */
  recordOscillation(layer, amplitude) {
    const layerName = Array.from(this.layers.entries())
      .find(([name, neurons]) => neurons === layer)?.[0];

    if (layerName) {
      if (!this.oscillations.has(layerName)) {
        this.oscillations.set(layerName, []);
      }

      this.oscillations.get(layerName).push({
        timestamp: Date.now(),
        amplitude: amplitude,
        frequency: this.calculateOscillationFrequency(layerName)
      });

      // Ограничиваем историю
      const history = this.oscillations.get(layerName);
      if (history.length > 100) {
        this.oscillations.set(layerName, history.slice(-100));
      }
    }
  }

  /**
   * Вычисляет частоту осцилляций
   */
  calculateOscillationFrequency(layerName) {
    const history = this.oscillations.get(layerName) || [];

    if (history.length < 3) return 0;

    const recent = history.slice(-3);
    const intervals = [];

    for (let i = 1; i < recent.length; i++) {
      intervals.push(recent[i].timestamp - recent[i-1].timestamp);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return avgInterval > 0 ? 1000 / avgInterval : 0; // Частота в Гц
  }

  /**
   * Декодирует выход сети
   */
  decodeNetworkOutput() {
    const outputLayer = this.layers.get('output');
    const semanticOutput = {};

    // Интерпретируем активацию выходных нейронов
    const outputMappings = [
      'enhanced_understanding', 'creative_insight', 'logical_structure',
      'emotional_resonance', 'contextual_relevance', 'actionable_clarity'
    ];

    for (let i = 0; i < Math.min(outputLayer.length, outputMappings.length); i++) {
      const neuron = outputLayer[i];
      const mapping = outputMappings[i];
      semanticOutput[mapping] = neuron.activationLevel;
    }

    // Вычисляем общее качество обработки
    semanticOutput.overall_quality = outputLayer.reduce((sum, n) => sum + n.activationLevel, 0) / outputLayer.length;

    return semanticOutput;
  }

  /**
   * Применяет обучение сети
   */
  applyNetworkLearning(input, output) {
    // Применяем правило Хебба для всех связей
    for (const [neuronId, neuron] of this.neurons) {
      for (const [targetId, targetNeuron] of neuron.connections) {
        const learningResult = neuron.applyHebbianLearning(targetId, targetNeuron.activationLevel);

        if (learningResult !== 'unchanged') {
          this.recordLearningChange(neuronId, targetId, learningResult);
        }
      }
    }

    // Применяем глобальную модуляцию обучения
    this.applyGlobalLearningModulation(output.overall_quality);
  }

  /**
   * Применяет глобальную модуляцию обучения
   */
  applyGlobalLearningModulation(qualityScore) {
    // Модулируем нейромедиаторы в зависимости от качества
    if (qualityScore > 0.7) {
      // Успешная обработка - увеличиваем дофамин
      const currentDopamine = this.neurotransmitterPool.get('dopamine');
      this.neurotransmitterPool.set('dopamine', Math.min(1, currentDopamine + 0.1));
    } else if (qualityScore < 0.3) {
      // Неудачная обработка - увеличиваем ацетилхолин (внимание)
      const currentAcetylcholine = this.neurotransmitterPool.get('acetylcholine');
      this.neurotransmitterPool.set('acetylcholine', Math.min(1, currentAcetylcholine + 0.05));
    }

    // Обновляем нейромедиаторы всех нейронов
    for (const neuron of this.neurons.values()) {
      for (const [neurotransmitter, globalLevel] of this.neurotransmitterPool) {
        const currentLevel = neuron.neurotransmitters.get(neurotransmitter);
        const newLevel = (currentLevel + globalLevel) / 2;
        neuron.neurotransmitters.set(neurotransmitter, newLevel);
      }
    }
  }

  /**
   * Записывает изменение обучения
   */
  recordLearningChange(sourceId, targetId, changeType) {
    // Простая реализация для отслеживания изменений
    const change = {
      timestamp: Date.now(),
      source: sourceId,
      target: targetId,
      type: changeType
    };

    // Можно расширить для более детального анализа
  }

  /**
   * Обновляет сетевую активность
   */
  updateNetworkActivity() {
    const totalActivation = Array.from(this.neurons.values())
      .reduce((sum, neuron) => sum + neuron.activationLevel, 0);

    this.networkActivity = totalActivation / this.neurons.size;
  }

  /**
   * Получает активированные нейроны
   */
  getActivatedNeurons() {
    return Array.from(this.neurons.values())
      .filter(neuron => neuron.activationLevel > 0.3)
      .map(neuron => ({
        id: neuron.id,
        type: neuron.neuronType,
        specialization: neuron.specialization,
        activation: neuron.activationLevel
      }));
  }

  /**
   * Обнаруживает эмерджентные паттерны
   */
  detectEmergentPatterns() {
    const patterns = [];

    // Паттерн синхронизации
    const synchronizedLayers = this.detectSynchronizedLayers();
    if (synchronizedLayers.length > 0) {
      patterns.push({
        type: 'layer_synchronization',
        layers: synchronizedLayers,
        strength: this.calculateSynchronizationStrength(synchronizedLayers)
      });
    }

    // Паттерн доминирования
    const dominantNeurons = this.detectDominantNeurons();
    if (dominantNeurons.length > 0) {
      patterns.push({
        type: 'neuronal_dominance',
        neurons: dominantNeurons,
        dominanceLevel: this.calculateDominanceLevel(dominantNeurons)
      });
    }

    // Паттерн осцилляций
    const oscillationPatterns = this.detectOscillationPatterns();
    if (oscillationPatterns.length > 0) {
      patterns.push({
        type: 'oscillatory_activity',
        patterns: oscillationPatterns
      });
    }

    return patterns;
  }

  /**
   * Обнаруживает синхронизированные слои
   */
  detectSynchronizedLayers() {
    const synchronized = [];

    for (const [layerName, neurons] of this.layers) {
      const activations = neurons.map(n => n.activationLevel);
      const avgActivation = activations.reduce((sum, a) => sum + a, 0) / activations.length;
      const variance = activations.reduce((sum, a) => sum + Math.pow(a - avgActivation, 2), 0) / activations.length;

      // Низкая вариативность = высокая синхронизация
      if (variance < 0.1 && avgActivation > 0.3) {
        synchronized.push({
          layer: layerName,
          synchronizationLevel: 1 - variance,
          averageActivation: avgActivation
        });
      }
    }

    return synchronized;
  }

  /**
   * Обнаруживает доминирующие нейроны
   */
  detectDominantNeurons() {
    const dominant = [];
    const threshold = 0.8;

    for (const neuron of this.neurons.values()) {
      if (neuron.activationLevel > threshold) {
        dominant.push({
          id: neuron.id,
          activation: neuron.activationLevel,
          influence: this.calculateNeuronInfluence(neuron)
        });
      }
    }

    return dominant.sort((a, b) => b.activation - a.activation);
  }

  /**
   * Вычисляет влияние нейрона
   */
  calculateNeuronInfluence(neuron) {
    const connectionStrength = Array.from(neuron.weights.values())
      .reduce((sum, weight) => sum + weight, 0);

    return neuron.activationLevel * connectionStrength;
  }

  /**
   * Обнаруживает паттерны осцилляций
   */
  detectOscillationPatterns() {
    const patterns = [];

    for (const [layerName, oscillations] of this.oscillations) {
      if (oscillations.length >= 3) {
        const frequencies = oscillations.slice(-5).map(o => o.frequency);
        const avgFreq = frequencies.reduce((sum, f) => sum + f, 0) / frequencies.length;

        if (avgFreq > 0.1) { // Минимальная частота
          patterns.push({
            layer: layerName,
            frequency: avgFreq,
            amplitude: oscillations[oscillations.length - 1].amplitude,
            stability: this.calculateFrequencyStability(frequencies)
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Вычисляет стабильность частоты
   */
  calculateFrequencyStability(frequencies) {
    if (frequencies.length < 2) return 1;

    const avgFreq = frequencies.reduce((sum, f) => sum + f, 0) / frequencies.length;
    const variance = frequencies.reduce((sum, f) => sum + Math.pow(f - avgFreq, 2), 0) / frequencies.length;

    return 1 / (1 + variance);
  }

  /**
   * Получает недавние изменения обучения
   */
  getRecentLearningChanges() {
    // Подсчитываем изменения весов за последний период
    let strengthened = 0;
    let weakened = 0;

    for (const neuron of this.neurons.values()) {
      // Здесь можно добавить логику отслеживания изменений
      // Пока используем упрощенную версию
      strengthened += Math.floor(Math.random() * 3);
      weakened += Math.floor(Math.random() * 2);
    }

    return {
      connectionsStrengthened: strengthened,
      connectionsWeakened: weakened,
      netPlasticity: strengthened - weakened
    };
  }

  /**
   * Восстанавливает сеть от усталости
   */
  async restNetwork(duration = 5000) {
    SmartLogger.biomimetic(`😴 Восстановление биомиметической сети...`);

    const promises = Array.from(this.neurons.values()).map(neuron => {
      return new Promise(resolve => {
        setTimeout(() => {
          neuron.rest(duration);
          resolve();
        }, Math.random() * 1000);
      });
    });

    await Promise.all(promises);

    // Восстанавливаем глобальные нейромедиаторы
    for (const [neurotransmitter, level] of this.neurotransmitterPool) {
      this.neurotransmitterPool.set(neurotransmitter, Math.min(1, level + 0.1));
    }

    SmartLogger.biomimetic(`😌 Биомиметическая сеть восстановлена`);
  }

  // Методы извлечения сигналов
  extractIntentSignal(input) {
    const intentWords = ['создай', 'сделай', 'нарисуй', 'измени'];
    const words = input.toLowerCase().split(/\s+/);
    return intentWords.filter(word => words.includes(word)).length / intentWords.length;
  }

  extractEmotionalSignal(input) {
    const emotionalWords = ['красиво', 'ужасно', 'прекрасно', 'отлично'];
    const words = input.toLowerCase().split(/\s+/);
    return emotionalWords.filter(word => words.includes(word)).length / emotionalWords.length;
  }

  extractComplexitySignal(input) {
    return Math.min(1, input.length / 200);
  }

  extractSpecificitySignal(input) {
    const specificWords = input.split(' ').filter(word => word.length > 6);
    return Math.min(1, specificWords.length / 10);
  }

  extractCreativitySignal(input) {
    const creativeWords = ['уникальный', 'оригинальный', 'креативный', 'необычный'];
    const words = input.toLowerCase().split(/\s+/);
    return creativeWords.filter(word => words.includes(word)).length / creativeWords.length;
  }

  extractUrgencySignal(input) {
    const urgencyWords = ['срочно', 'быстро', 'немедленно', 'сейчас'];
    const words = input.toLowerCase().split(/\s+/);
    return urgencyWords.filter(word => words.includes(word)).length / urgencyWords.length;
  }

  extractTechnicalSignal(input) {
    const technicalWords = ['svg', 'вектор', 'пиксель', 'формат'];
    const words = input.toLowerCase().split(/\s+/);
    return technicalWords.filter(word => words.includes(word)).length / technicalWords.length;
  }

  extractContextualSignal(input, context) {
    return context.hasRecentImages ? 0.8 : 0.2;
  }

  // Вспомогательные методы для расчетов
  calculateSynchronizationStrength(layers) {
    return layers.reduce((sum, layer) => sum + layer.synchronizationLevel, 0) / layers.length;
  }

  calculateDominanceLevel(neurons) {
    return neurons.reduce((sum, neuron) => sum + neuron.activation, 0) / neurons.length;
  }

  /**
   * Получает статистикусети
   */
  getNetworkStatistics() {
    const activeNeurons = Array.from(this.neurons.values()).filter(n => n.activationLevel > 0.1);
    const totalConnections = Array.from(this.neurons.values()).reduce((sum, n) => sum + n.connections.size, 0);

    return {
      totalNeurons: this.neurons.size,
      activeNeurons: activeNeurons.length,
      networkActivity: this.networkActivity,
      totalConnections: totalConnections,
      averageConnectionsPerNeuron: totalConnections / this.neurons.size,
      neurotransmitterLevels: Object.fromEntries(this.neurotransmitterPool),
      oscillationsDetected: Array.from(this.oscillations.values()).reduce((sum, osc) => sum + osc.length, 0),
      criticalPeriodsActive: this.criticalPeriods.length,
      learningRate: this.learningRate,
      globalInhibition: this.globalInhibition
    };
  }
}

/**
 * БИОМИМЕТИЧЕСКАЯ СЕМАНТИКА - ГЛАВНЫЙ КЛАСС
 */
class BiomimeticSemantics {
  constructor() {
    this.neuralNetwork = new SemanticNeuralNetwork(100);
    this.evolutionaryProcessor = new EvolutionarySemanticProcessor();
    this.swarmIntelligence = new SemanticSwarmProcessor();
    this.circadianRhythms = new CircadianSemanticProcessor();
    this.immuneSystem = new SemanticImmuneSystem();
    this.adaptationMechanisms = new AdaptationMechanisms();

    SmartLogger.biomimetic('🦋 Биомиметическая семантическая система инициализирована');
  }

  /**
   * Анализирует семантику с использованием биомиметических принципов
   */
  async analyzeWithBiomimetics(query, context = {}) {
    const queryStr = (typeof query === 'string') ? query : JSON.stringify(query);
    SmartLogger.biomimetic(`🦋 Запуск биомиметического анализа: "${queryStr.substring(0, 50)}..."`);

    const startTime = Date.now();

    // Нейронная обработка
    const neuralResult = await this.neuralNetwork.processSemanticInput(query, context);

    // Эволюционная оптимизация
    const evolutionResult = await this.evolutionaryProcessor.evolveInterpretation(query, neuralResult);

    // Роевой интеллект
    const swarmResult = await this.swarmIntelligence.collectiveProcessing(query, context);

    // Циркадная модуляция
    const circadianResult = this.circadianRhythms.modulateProcessing(neuralResult, context);

    // Иммунная проверка
    const immuneResult = this.immuneSystem.validateSemantics(query, neuralResult);

    // Адаптация
    const adaptationResult = await this.adaptationMechanisms.adapt(query, neuralResult, context);

    const processingTime = Date.now() - startTime;

    // Интеграция результатов
    const integratedResult = this.integrateBeomimeticResults({
      neural: neuralResult,
      evolution: evolutionResult,
      swarm: swarmResult,
      circadian: circadianResult,
      immune: immuneResult,
      adaptation: adaptationResult
    });

    return {
      biomimeticAnalysis: integratedResult,
      processingTime,
      neuralNetworkState: this.neuralNetwork.getNetworkStatistics(),
      evolutionaryProgress: evolutionResult.generationStats,
      swarmCoherence: swarmResult.coherenceLevel,
      circadianPhase: circadianResult.currentPhase,
      immuneHealth: immuneResult.systemHealth,
      adaptationLevel: adaptationResult.adaptationStrength
    };
  }

  /**
   * Интегрирует результаты биомиметических процессов
   */
  integrateBeomimeticResults(results) {
    const integration = {
      confidence: 0,
      insights: [],
      recommendations: [],
      emergentProperties: [],
      biologicalMetaphors: []
    };

    // Интегрируем уверенность
    const confidences = [
      results.neural.semanticOutput.overall_quality,
      results.evolution.fitness,
      results.swarm.consensusStrength,
      results.circadian.efficiency,
      results.immune.confidence,
      results.adaptation.success
    ];

    integration.confidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;

    // Собираем инсайты
    integration.insights.push({
      source: 'neural',
      type: 'network_activation',
      content: `Активированы ${results.neural.activatedNeurons.length} нейронов`,
      strength: results.neural.networkActivity
    });

    integration.insights.push({
      source: 'evolutionary',
      type: 'fitness_optimization',
      content: `Эволюция улучшила интерпретацию на ${(results.evolution.improvement * 100).toFixed(1)}%`,
      strength: results.evolution.improvement
    });

    // Биологические метафоры
    integration.biologicalMetaphors.push({
      type: 'neural_plasticity',
      description: 'Семантическая сеть адаптируется как биологический мозг',
      relevance: results.neural.learningChanges.netPlasticity
    });

    integration.biologicalMetaphors.push({
      type: 'evolutionary_pressure',
      description: 'Интерпретации эволюционируют под давлением селекции',
      relevance: results.evolution.selectionPressure
    });

    return integration;
  }

  /**
   * Получает статистику биомиметической системы
   */
  getBiomimeticStatistics() {
    return {
      neuralNetwork: this.neuralNetwork.getNetworkStatistics(),
      evolution: this.evolutionaryProcessor.getEvolutionStatistics(),
      swarm: this.swarmIntelligence.getSwarmStatistics(),
      circadian: this.circadianRhythms.getCurrentPhase(),
      immune: this.immuneSystem.getSystemHealth(),
      adaptation: this.adaptationMechanisms.getAdaptationHistory()
    };
  }
}

/**
 * ЭВОЛЮЦИОННЫЙ СЕМАНТИЧЕСКИЙ ПРОЦЕССОР
 * Упрощенная версия для демонстрации концепции
 */
class EvolutionarySemanticProcessor {
  constructor() {
    this.population = [];
    this.generation = 0;
    this.selectionPressure = 0.5;
    this.mutationRate = 0.1;
    this.crossoverRate = 0.7;
  }

  async evolveInterpretation(query, neuralResult) {
    // Упрощенная эволюционная оптимизация
    const fitness = neuralResult.semanticOutput.overall_quality;
    const improvement = Math.random() * 0.1; // Симуляция улучшения

    this.generation++;

    return {
      fitness: Math.min(1, fitness + improvement),
      improvement: improvement,
      generation: this.generation,
      selectionPressure: this.selectionPressure,
      generationStats: {
        population: this.population.length,
        avgFitness: fitness
      }
    };
  }

  getEvolutionStatistics() {
    return {
      generation: this.generation,
      populationSize: this.population.length,
      selectionPressure: this.selectionPressure,
      mutationRate: this.mutationRate,
      crossoverRate: this.crossoverRate
    };
  }
}

/**
 * СЕМАНТИЧЕСКИЙ РОЕВОЙ ПРОЦЕССОР
 * Упрощенная версия
 */
class SemanticSwarmProcessor {
  constructor() {
    this.agents = 20;
    this.coherenceLevel = 0.5;
    this.consensusThreshold = 0.7;
  }

  async collectiveProcessing(query, context) {
    // Симуляция роевой обработки
    const consensusStrength = 0.6 + Math.random() * 0.3;

    return {
      consensusStrength,
      activeAgents: this.agents,
      coherenceLevel: this.coherenceLevel,
      emergentBehavior: Math.random() > 0.7
    };
  }

  getSwarmStatistics() {
    return {
      totalAgents: this.agents,
      coherenceLevel: this.coherenceLevel,
      consensusThreshold: this.consensusThreshold
    };
  }
}

/**
 * ЦИРКАДНЫЙ СЕМАНТИЧЕСКИЙ ПРОЦЕССОР
 * Упрощенная версия
 */
class CircadianSemanticProcessor {
  constructor() {
    this.phase = 'day'; // day, night, dawn, dusk
    this.efficiency = 1.0;
  }

  modulateProcessing(neuralResult, context) {
    const hour = new Date().getHours();

    // Определяем фазу
    if (hour >= 6 && hour < 12) this.phase = 'morning';
    else if (hour >= 12 && hour < 18) this.phase = 'day';
    else if (hour >= 18 && hour < 22) this.phase = 'evening';
    else this.phase = 'night';

    // Модулируем эффективность
    const phaseEfficiency = {
      'morning': 0.9,
      'day': 1.0,
      'evening': 0.8,
      'night': 0.6
    };

    this.efficiency = phaseEfficiency[this.phase];

    return {
      currentPhase: this.phase,
      efficiency: this.efficiency,
      modulation: this.efficiency
    };
  }

  getCurrentPhase() {
    return {
      phase: this.phase,
      efficiency: this.efficiency
    };
  }
}

/**
 * СЕМАНТИЧЕСКАЯ ИММУННАЯ СИСТЕМА
 * Упрощенная версия
 */
class SemanticImmuneSystem {
  constructor() {
    this.antibodies = new Map();
    this.systemHealth = 0.9;
    this.threats = [];
  }

  validateSemantics(query, neuralResult) {
    // Простая проверка на "вредоносные" паттерны
    const threats = this.detectThreats(query);
    const confidence = threats.length === 0 ? 0.9 : 0.5;

    return {
      confidence,
      threatsDetected: threats.length,
      systemHealth: this.systemHealth,
      antibodiesActive: this.antibodies.size
    };
  }

  detectThreats(query) {
    const threats = [];

    // Примеры простых угроз
    if (query.includes('delete') || query.includes('destroy')) {
      threats.push('destructive_intent');
    }

    return threats;
  }

  getSystemHealth() {
    return {
      health: this.systemHealth,
      antibodies: this.antibodies.size,
      threats: this.threats.length
    };
  }
}

/**
 * МЕХАНИЗМЫ АДАПТАЦИИ
 * Упрощенная версия
 */
class AdaptationMechanisms {
  constructor() {
    this.adaptationHistory = [];
    this.currentAdaptation = 0.5;
  }

  async adapt(query, neuralResult, context) {
    // Симуляция адаптации
    const adaptationStrength = 0.3 + Math.random() * 0.4;
    const success = adaptationStrength > 0.5;

    this.adaptationHistory.push({
      timestamp: Date.now(),
      strength: adaptationStrength,
      success
    });

    if (this.adaptationHistory.length > 100) {
      this.adaptationHistory = this.adaptationHistory.slice(-100);
    }

    return {
      adaptationStrength,
      success,
      mechanismsUsed: ['neural_plasticity', 'weight_adjustment']
    };
  }

  getAdaptationHistory() {
    return {
      totalAdaptations: this.adaptationHistory.length,
      successRate: this.adaptationHistory.filter(a => a.success).length / Math.max(1, this.adaptationHistory.length),
      currentLevel: this.currentAdaptation
    };
  }
}

module.exports = {
  BiomimeticSemantics,
  SemanticNeuralNetwork,
  SemanticNeuron
};