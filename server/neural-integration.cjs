/**
 * 🔗 NEURAL INTEGRATION LAYER
 * Интегрирует transformer нейросеть с семантической системой BOOOMERANGS
 */

const { BooomerangsNeuralCore } = require('./neural-network-core.cjs');
const { getGlobalProgressManager } = require('./neural-progress-manager.cjs');

class NeuralIntegrationLayer {
  constructor() {
    this.neuralCore = null;
    this.neuralLite = null;
    this.isInitialized = false;
    this.semanticMemory = null;
    this.hybridMode = true; // Комбинируем нейросеть и семантику

    // Новые режимы работы
    this.mode = 'loading'; // 'lite', 'full', 'loading'
    this.upgradeInProgress = false;
    this.initializationStartTime = Date.now();
    this.isInitializing = false;

    // Интеграция с Progress Manager
    this.progressManager = getGlobalProgressManager();

    // Интеграция с Memory Monitor
    try {
      const { getGlobalMemoryMonitor } = require('./memory-monitor.cjs');
      this.memoryMonitor = getGlobalMemoryMonitor();
    } catch (error) {
      console.log('⚠️ Memory Monitor недоступен');
      this.memoryMonitor = null;
    }
  }

  async initialize() {
    console.log('🔗 Инициализация интеграционного слоя нейросети...');
    console.log('🚀 Запуск в LITE режиме для быстрого старта...');

    try {
      // Сначала инициализируем LITE версию
      await this.initializeLite();

      // Подключаем семантическую память
      try {
        this.semanticMemory = require('./semantic-memory/index.cjs');
        console.log('✅ Семантическая память подключена к нейросети');
      } catch (error) {
        console.log('⚠️ Семантическая память недоступна');
      }

      // Подключаем conversation engine для качественных ответов
      try {
        this.conversationEngine = require('./conversation-engine.cjs');
        console.log('✅ Conversation engine подключен к нейросети');
      } catch (error) {
        console.log('⚠️ Conversation engine недоступен:', error.message);
      }

      this.isInitialized = true;
      console.log('🎉 Нейросетевая интеграция готова в LITE режиме!');
      console.log('💡 Для полной мощности запустите upgradeToFull()');

    } catch (error) {
      console.error('❌ Ошибка инициализации нейросети:', error);
      throw error;
    }
  }

  async initializeLite() {
    // Проверяем уже инициализированную модель
    if (this.isInitialized && this.mode === 'lite' && this.liteModel) {
      console.log('⚡ LITE модель уже инициализирована');
      return { 
        success: true, 
        message: 'LITE модель уже готова', 
        alreadyInitialized: true,
        stats: this.liteModel.getModelStats?.() || null
      };
    }

    // Защита от множественной инициализации с таймаутом
    if (this.isInitializing) {
      console.log('⏳ Инициализация уже в процессе, ждем завершения...');

      // Ждем завершения с таймаутом 30 сек
      let attempts = 0;
      while (this.isInitializing && attempts < 300) { // 30 сек = 300 * 100мс
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (this.isInitializing) {
        console.log('⚠️ Инициализация зависла, сбрасываем флаг');
        this.isInitializing = false;
        this.mode = 'loading';
      } else if (this.mode === 'lite') {
        return { success: true, message: 'Инициализация завершена во время ожидания' };
      }
    }

    console.log('⚡ Инициализация LITE нейросети для быстрого старта...');
    this.mode = 'loading';
    this.isInitializing = true;

    // Устанавливаем timeout для инициализации
    const initTimeout = setTimeout(() => {
      if (this.isInitializing) {
        console.error('❌ Таймаут инициализации LITE нейросети');
        this.isInitializing = false;
        this.mode = 'loading';
      }
    }, 45000); // 45 секунд таймаут

    try {
      // Запускаем отслеживание прогресса
      const trackingPromise = this.progressManager.trackLiteInitialization(this);

      const { BooomerangsNeuralLite } = require('./neural-network-lite.cjs');
      this.neuralLite = new BooomerangsNeuralLite();
      this.liteModel = this.neuralLite; // Store the lite model instance

      // Пытаемся загрузить существующую lite модель с диска
      const liteModelPath = './neural-models/booomerangs-lite/';
      const fs = require('fs');
      const path = require('path');

      if (fs.existsSync(path.join(liteModelPath, 'model.json'))) {
        console.log('📦 Найдена сохраненная LITE модель, загружаем...');
        try {
          await this.neuralLite.loadModel(liteModelPath);
          console.log('✅ LITE модель загружена с диска');
        } catch (loadError) {
          console.log('⚠️ Не удалось загрузить модель с диска, создаем новую');
          await this.neuralLite.initialize();
        }
      } else {
        console.log('🔧 Создаем новую LITE модель...');
        await this.neuralLite.initialize();
      }

      this.mode = 'lite';
      const initTime = Date.now() - this.initializationStartTime;
      console.log(`✅ LITE нейросеть инициализирована за ${initTime}мс`);

      // Получаем статистику LITE модели
      const stats = this.neuralLite.getModelStats();
      console.log(`📊 LITE модель: ${stats.totalParams.toLocaleString()} параметров, ~${stats.memoryEstimate.estimatedMB}МБ`);

      // Ждем завершения трекинга
      await trackingPromise;

      this.isInitializing = false;
      clearTimeout(initTimeout);
      return true;
    } catch (error) {
      console.error('❌ Ошибка инициализации LITE нейросети:', error);
      this.mode = 'loading';
      this.isInitializing = false;
      clearTimeout(initTimeout);

      // Возвращаем объект ошибки вместо throw для graceful handling
      return {
        success: false,
        error: error.message,
        message: 'Ошибка инициализации LITE нейросети'
      };
    } finally {
      // Убеждаемся что флаг сброшен в любом случае
      if (this.isInitializing) {
        console.log('🔧 Принудительный сброс флага инициализации');
        this.isInitializing = false;
      }
      clearTimeout(initTimeout);
    }
  }

  /**
   * Переключение на полную модель без прерывания сервиса
   */
  async upgradeToFull() {
    if (this.mode === 'full') {
      console.log('✅ Уже используется полная модель');
      return { success: true, message: 'Already using full model' };
    }

    try {
      this.mode = 'upgrading';
      console.log('🔄 Начинаем переход на полную модель...');

      // Проверяем память через Memory Monitor
      const { getGlobalMemoryMonitor } = require('./memory-monitor.cjs');
      const memoryMonitor = getGlobalMemoryMonitor();
      const memoryStatus = memoryMonitor.getCurrentMemoryStatus();

      if (memoryStatus.usagePercent > 0.8) {
        console.log('⚠️ Недостаточно памяти для полной модели');
        this.mode = 'lite';
        return { success: false, message: 'Insufficient memory for full model' };
      }

      console.log(`💾 Память перед upgrade: ${memoryStatus.usagePercentFormatted}`);

      // Инициализируем полную модель в фоне
      const fullCore = new BooomerangsNeuralCore();

      // Отслеживаем прогресс если менеджер доступен
      if (this.progressManager) {
        await this.progressManager.trackFullUpgrade(fullCore);
      }

      const fullModel = await fullCore.initialize();

      // Горячая замена
      const oldCore = this.neuralCore;
      const oldLite = this.neuralLite;

      this.neuralCore = fullModel;
      this.neuralLite = null;
      this.mode = 'full';

      // Очищаем старые модели
      if (oldCore) {
        await this.gracefulCleanup(oldCore);
      }
      if (oldLite) {
        await this.gracefulCleanup(oldLite);
      }

      // Принудительная очистка памяти
      memoryMonitor.forceGarbageCollection();

      console.log('✅ Переход на полную модель завершен');
      return { success: true, message: 'Successfully upgraded to full model' };

    } catch (error) {
      console.error('❌ Ошибка перехода на полную модель:', error);
      this.mode = 'lite';
      return { success: false, message: error.message };
    }
  }

  /**
   * 🔄 HOT SWAP СИСТЕМА (ОПТИМИЗИРОВАННАЯ)
   * Переключение моделей без прерывания сервиса
   */
  async switchToFullModel() {
    console.log('🔄 HOT SWAP: Переключение на полную модель...');

    if (this.mode === 'full') {
      console.log('✅ HOT SWAP: Уже используется полная модель');
      return { success: true, message: 'Already using full model' };
    }

    // Блокируем повторные вызовы
    if (this.upgradeInProgress) {
      console.log('⚠️ HOT SWAP: Upgrade уже выполняется');
      return { success: false, message: 'Upgrade already in progress' };
    }

    try {
      this.upgradeInProgress = true;

      // Сохраняем текущую модель как fallback
      const fallbackModel = this.getCurrentModel();
      const fallbackMode = this.mode;

      this.mode = 'upgrading';
      console.log('🔄 HOT SWAP: Начинаем оптимизированную горячую замену...');

      // Проверяем совместимость (быстрая проверка)
      const compatibilityCheck = await this.checkModelCompatibility('full');
      if (!compatibilityCheck.compatible) {
        console.log('❌ HOT SWAP: Модели несовместимы:', compatibilityCheck.reason);
        this.mode = fallbackMode;
        this.upgradeInProgress = false;
        return { success: false, message: compatibilityCheck.reason };
      }

      // Создаем новую модель в фоне с оптимизацией
      const { BooomerangsNeuralCore } = require('./neural-network-core.cjs');
      const newFullCore = new BooomerangsNeuralCore();

      // Отслеживаем прогресс с улучшенными таймингами
      if (this.progressManager) {
        this.progressManager.startOperation('Optimized Hot Swap to Full Model', 35000);
      }

      try {
        if (this.progressManager) this.progressManager.updateProgress(15, 'Создание полной модели...');

        // Пытаемся загрузить существующую полную модель с диска
        const fullModelPath = './neural-models/booomerangs-transformer/';
        const fs = require('fs');
        const path = require('path');

        let initPromise;
        if (fs.existsSync(path.join(fullModelPath, 'model.json'))) {
          console.log('📦 Найдена сохраненная полная модель (12 слоев), загружаем...');
          if (this.progressManager) this.progressManager.updateProgress(30, 'Загрузка сохраненной модели...');
          initPromise = newFullCore.loadModel(fullModelPath);
        } else {
          console.log('🔧 Создаем новую полную модель (12 слоев)...');
          initPromise = newFullCore.initialize();
        }

        // Пока модель инициализируется, подготавливаем cleanup
        const cleanupPromise = this.prepareForCleanup(fallbackModel);

        const [newFullModel] = await Promise.all([initPromise, cleanupPromise]);

        if (this.progressManager) this.progressManager.updateProgress(60, 'Модель готова, тестирование...');

        // Быстрое тестирование
        const testResult = await this.testModel(newFullModel);
        if (!testResult.success) {
          throw new Error(`Модель не прошла тестирование: ${testResult.message}`);
        }

        if (this.progressManager) this.progressManager.updateProgress(80, 'Атомарная замена...');

        // Атомарная замена с минимальным downtime
        const oldModel = this.neuralCore;
        const oldLite = this.neuralLite;

        this.neuralCore = newFullModel;
        this.neuralLite = null;
        this.mode = 'full';

        if (this.progressManager) this.progressManager.updateProgress(95, 'Финализация...');

        // Асинхронная очистка старых моделей
        setImmediate(async () => {
          try {
            if (oldModel) await this.gracefulCleanup(oldModel);
            if (oldLite) await this.gracefulCleanup(oldLite);
            console.log('✅ HOT SWAP: Cleanup завершен');
          } catch (cleanupError) {
            console.error('⚠️ HOT SWAP: Ошибка cleanup:', cleanupError.message);
          }
        });

        if (this.progressManager) {
          this.progressManager.completeOperation(true, 'Optimized hot swap completed');
        }

        this.upgradeInProgress = false;
        console.log('✅ HOT SWAP: Оптимизированный переход завершен успешно');

        return { 
          success: true, 
          message: 'Optimized hot swap completed',
          previousMode: fallbackMode,
          newMode: 'full',
          optimized: true
        };

      } catch (swapError) {
        console.log('❌ HOT SWAP: Ошибка замены, выполняем быстрый rollback...');

        // Быстрый rollback
        this.mode = fallbackMode;

        if (this.progressManager) {
          this.progressManager.completeOperation(false, `Hot swap failed: ${swapError.message}`);
        }

        this.upgradeInProgress = false;
        throw swapError;
      }

    } catch (error) {
      console.error('❌ HOT SWAP: Критическая ошибка:', error);
      this.upgradeInProgress = false;

      // Проверяем что система в рабочем состоянии
      if (!this.getCurrentModel()) {
        console.log('🚨 HOT SWAP: Экстренное восстановление...');
        try {
          await this.emergencyLiteInit();
        } catch (emergencyError) {
          console.error('🚨 HOT SWAP: Критическая ошибка восстановления:', emergencyError.message);
        }
      }

      return { 
        success: false, 
        message: `Hot swap failed: ${error.message}`,
        fallbackActive: true,
        error: error.message
      };
    }
  }

  /**
   * Подготовка к очистке памяти
   */
  async prepareForCleanup(model) {
    try {
      if (this.memoryMonitor) {
        await this.memoryMonitor.forceGarbageCollection();
      }
      return true;
    } catch (error) {
      console.warn('⚠️ Подготовка cleanup не удалась:', error.message);
      return false;
    }
  }

  /**
   * Проверка совместимости моделей
   */
  async checkModelCompatibility(targetMode) {
    try {
      console.log(`🔍 Проверка совместимости для режима: ${targetMode}`);

      // Проверяем память
      const memoryStatus = this.memoryMonitor.getCurrentMemoryStatus();
      if (targetMode === 'full' && memoryStatus.usagePercent > 0.75) {
        return {
          compatible: false,
          reason: `Insufficient memory: ${memoryStatus.usagePercentFormatted} used`
        };
      }

      // Проверяем TensorFlow
      if (!global.tf) {
        return {
          compatible: false,
          reason: 'TensorFlow not available'
        };
      }

      // Проверяем архитектуру
      const currentModel = this.getCurrentModel();
      if (currentModel && targetMode === 'full') {
        // Проверяем совместимость словарей
        const currentVocabSize = currentModel.vocabSize || 0;
        if (currentVocabSize > 0 && currentVocabSize < 1000) {
          return {
            compatible: false,
            reason: 'Vocabulary size too small for full model'
          };
        }
      }

      console.log('✅ Модели совместимы');
      return { compatible: true };

    } catch (error) {
      console.error('❌ Ошибка проверки совместимости:', error);
      return {
        compatible: false,
        reason: `Compatibility check failed: ${error.message}`
      };
    }
  }

  /**
   * Graceful fallback при ошибках
   */
  async gracefulFallback(fallbackModel, fallbackMode) {
    console.log('🔄 Выполняем graceful fallback...');

    try {
      if (fallbackModel) {
        this.neuralCore = fallbackModel;
        this.mode = fallbackMode;
        console.log(`✅ Fallback выполнен: возврат к режиму ${fallbackMode}`);
      } else {
        // Экстренная инициализация lite модели
        await this.emergencyLiteInit();
        console.log('✅ Fallback выполнен: экстренная lite модель');
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Ошибка graceful fallback:', error);

      // Последний шанс - базовая функциональность
      this.mode = 'error';
      return { success: false, error: error.message };
    }
  }

  /**
   * Экстренная инициализация lite модели
   */
  async emergencyLiteInit() {
    console.log('🚨 Экстренная инициализация lite модели...');

    try {
      const { BooomerangsNeuralLite } = require('./neural-network-lite.cjs');
      const emergencyLite = new BooomerangsNeuralLite();

      // Быстрая инициализация без полной проверки
      await emergencyLite.fastInitialize();

      this.neuralLite = emergencyLite;
      this.neuralCore = null;
      this.mode = 'lite';

      console.log('✅ Экстренная lite модель инициализирована');
      return { success: true };

    } catch (error) {
      console.error('❌ Критическая ошибка экстренной инициализации:', error);
      this.mode = 'error';
      return { success: false, error: error.message };
    }
  }

  /**
   * Тестирование модели
   */
  async testModel(model) {
    try {
      if (!model) {
        return { success: false, message: 'Model is null' };
      }

      // Простой тест генерации
      const testInput = "привет";
      const testResult = await model.generateResponse(testInput, { maxTokens: 10 });

      if (testResult && testResult.length > 0) {
        return { success: true, response: testResult };
      } else {
        return { success: false, message: 'Model generated empty response' };
      }

    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Graceful cleanup моделей
   */
  async gracefulCleanup(model) {
    try {
      if (model && typeof model.cleanup === 'function') {
        await model.cleanup();
      }

      // Принудительная очистка памяти
      if (global.gc) {
        global.gc();
      }

      console.log('✅ Graceful cleanup завершен');

    } catch (error) {
      console.error('⚠️ Ошибка graceful cleanup:', error);
    }
  }

  /**
   * Гибридная генерация ответов с маркировкой
   */
  async generateHybridResponse(input, context = {}) {
    try {
      const currentModel = this.getCurrentModel();

      if (!currentModel) {
        throw new Error('Нейросеть не инициализирована');
      }

      console.log(`🧠 Генерация через ${this.mode} модель`);

      const response = await currentModel.generateResponse(input, {
        maxTokens: context.maxTokens || 150,
        temperature: context.temperature || 0.8,
        userContext: context.userContext
      });

      // Маркируем ответ режимом генерации
      const markedResponse = this.markResponseWithMode(response, this.mode);

      return markedResponse;

    } catch (error) {
      console.error('❌ Ошибка гибридной генерации:', error);
      throw error;
    }
  }

  /**
   * Маркировка ответов режимом генерации
   */
  markResponseWithMode(response, mode) {
    const markers = {
      'lite': '⚡ Generated by Neural Lite',
      'full': '🧠 Generated by Neural Full',
      'upgrading': '🔄 Generated during upgrade',
      'error': '⚠️ Generated in fallback mode'
    };

    const marker = markers[mode] || '🤖 Generated by Neural Network';

    // Добавляем маркер в конец ответа
    if (typeof response === 'string') {
      return `${response}\n\n_${marker}_`;
    }

    return response;
  }

  /**
   * Адаптация для Conversation Engine
   */
  async adaptForConversationEngine(input, context = {}) {
    try {
      console.log('🔄 Адаптация для Conversation Engine...');

      // Получаем текущий режим
      const currentMode = this.mode;

      // Подготавливаем контекст для нейросети
      const neuralContext = {
        ...context,
        mode: currentMode,
        conversationEngine: true,
        semanticContext: context.semanticContext,
        emotionalContext: context.emotionalContext,
        userProfile: context.userProfile
      };

      // Генерируем ответ
      const response = await this.generateHybridResponse(input, neuralContext);

      // Возвращаем в формате, ожидаемом Conversation Engine
      return {
        response: response,
        confidence: this.getConfidenceByMode(currentMode),
        metadata: {
          neuralMode: currentMode,
          generatedBy: 'neural-integration',
          timestamp: new Date().toISOString(),
          modelType: currentMode === 'full' ? 'transformer-12layer' : 'transformer-3layer'
        }
      };

    } catch (error) {
      console.error('❌ Ошибка адаптации для Conversation Engine:', error);

      // Fallback для Conversation Engine
      return {
        response: `Извините, произошла ошибка в нейросетевом модуле. Попробуйте еще раз.`,
        confidence: 0.3,
        metadata: {
          neuralMode: 'error',
          generatedBy: 'neural-integration-fallback',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Получение уверенности по режиму
   */
  getConfidenceByMode(mode) {
    const confidenceMap = {
      'full': 0.95,
      'lite': 0.85,
      'upgrading': 0.7,
      'loading': 0.6,
      'error': 0.3
    };

    return confidenceMap[mode] || 0.5;
  }

  /**
   * Проверка готовности для Conversation Engine
   */
  isReadyForConversationEngine() {
    return this.isInitialized && ['lite', 'full'].includes(this.mode);
  }

  /**
   * Получение статуса для Conversation Engine
   */
  getStatusForConversationEngine() {
    return {
      isReady: this.isReadyForConversationEngine(),
      mode: this.mode,
      capabilities: {
        textGeneration: this.isInitialized,
        contextAwareness: this.mode === 'full',
        fastResponse: this.mode === 'lite',
        hotSwap: true
      },
      performance: {
        expectedLatency: this.mode === 'lite' ? '1-2s' : '2-5s',
        maxTokens: this.mode === 'lite' ? 100 : 512,
        concurrency: this.mode === 'lite' ? 'high' : 'medium'
      }
    };
  }

  getCurrentModel() {
    return this.mode === 'full' ? this.neuralCore : this.neuralLite;
  }

  cleanup(model) {
    if (model && typeof model.dispose === 'function') {
      model.dispose();
    }
  }

  /**
   * Обучение с расширенным словарем
   */
  async trainWithExpandedVocabulary(options = {}) {
    const currentModel = this.getCurrentModel();
    if (!currentModel) {
      throw new Error('Модель не инициализирована');
    }

    console.log('🎓 Запуск обучения с расширенным словарем...');

    try {
      // Инициализируем систему обучения
      const { NeuralTrainingSystem } = require('./neural-training-system.cjs');
      const trainingSystem = new NeuralTrainingSystem();
      await trainingSystem.initialize();

      // Подготавливаем данные
      console.log('📊 Подготовка данных для обучения...');
      const dataStats = await trainingSystem.prepareTrainingData();

      console.log(`✅ Данные подготовлены:`);
      console.log(`   - Обучающих примеров: ${dataStats.trainingSize}`);
      console.log(`   - Валидационных примеров: ${dataStats.validationSize}`);
      console.log(`   - Размер словаря: ${dataStats.vocabularySize}`);

      // Запускаем обучение
      const result = await trainingSystem.trainModel(currentModel, options);

      console.log('✅ Обучение с расширенным словарем завершено:', result);
      return result;

    } catch (error) {
      console.error('❌ Ошибка обучения с расширенным словарем:', error);
      throw error;
    }
  }

  /**
   * Метод для обучения модели (legacy)
   */
  async trainOnDialogues(trainingData) {
    if (!this.model) {
      throw new Error('Модель не инициализирована');
    }

    console.log(`🎯 Начинаем legacy обучение на ${trainingData.length} примерах...`);

    const batchSize = 4;
    const epochs = 5;

    for (let epoch = 0; epoch < epochs; epoch++) {
      console.log(`📈 Эпоха ${epoch + 1}/${epochs}`);

      for (let i = 0; i < trainingData.length; i += batchSize) {
        const batch = trainingData.slice(i, i + batchSize);

        // Подготавливаем входные и целевые данные
        const inputs = batch.map(item => {
          const tokens = this.tokenize(item.input);
          const padded = [...tokens];
          while (padded.length < this.maxSequenceLength) padded.push(0);
          return padded.slice(0, this.maxSequenceLength);
        });

        const targets = batch.map(item => {
          const tokens = this.tokenize(item.output);
          const padded = [...tokens];
          while (padded.length < this.maxSequenceLength) padded.push(0);
          return padded.slice(0, this.maxSequenceLength);
        });

        const positions = inputs.map(() => 
          Array.from({ length: this.maxSequenceLength }, (_, i) => i)
        );

        // Создаем тензоры
        const inputTensor = tf.tensor2d(inputs);
        const positionTensor = tf.tensor2d(positions);
        const targetTensor = tf.tensor2d(targets);

        try {
          // Обучающий шаг
          await this.model.fit([inputTensor, positionTensor], targetTensor, {
            epochs: 1,
            batchSize: batch.length,
            verbose: 0
          });

        } finally {
          inputTensor.dispose();
          positionTensor.dispose();
          targetTensor.dispose();
        }
      }
    }

    console.log('✅ Legacy обучение LITE модели завершено');
    this.isTraining = false;
  }

  /**
   * Обновление словаря модели
   */
  async updateModelVocabulary(expandedVocabulary, reverseVocabulary) {
    const currentModel = this.getCurrentModel();
    if (!currentModel) {
      throw new Error('Модель не инициализирована');
    }

    console.log('📚 Обновляем словарь модели...');

    // Обновляем словарь
    currentModel.vocabulary = expandedVocabulary;
    currentModel.reverseVocabulary = reverseVocabulary;
    currentModel.vocabSize = expandedVocabulary.size;

    console.log(`✅ Словарь модели обновлен: ${expandedVocabulary.size} токенов`);

    return {
      success: true,
      vocabularySize: expandedVocabulary.size,
      previousSize: currentModel.vocabSize
    };
  }
}

// Функция для инициализации нейросетевой интеграции
async function initializeNeuralIntegration() {
  console.log('🔧 Инициализация нейросетевой интеграции...');

  try {
    const integration = new NeuralIntegrationLayer();
    await integration.initialize();
    return integration;
  } catch (error) {
    console.error('❌ Ошибка инициализации Neural Integration:', error);
    throw error;
  }
}

// Экспорт и создание глобального экземпляра
const globalNeuralIntegration = new NeuralIntegrationLayer();

// Автоматическая инициализация lite модели
(async () => {
  try {
    console.log('🚀 Автоматическая инициализация Neural Integration...');
    await globalNeuralIntegration.initializeLite();
    console.log('✅ Neural Integration автоматически инициализирован в lite режиме');
  } catch (error) {
    console.log('⚠️ Автоинициализация neural integration пропущена:', error.message);
  }
})();

module.exports = {
  NeuralIntegrationLayer,
  initializeNeuralIntegration,
  getGlobalNeuralIntegration: () => globalNeuralIntegration
};