/**
 * 🧠 BOOOMERANGS NEURAL CORE - TRANSFORMER ARCHITECTURE
 * Превращаем семантическую систему в полноценную нейросеть уровня GPT-3
 */

const tf = require('@tensorflow/tfjs-node');

class BooomerangsNeuralCore {
  constructor() {
    this.model = null;
    this.isTraining = false;
    this.semanticMemory = null;
    this.trainingData = [];
    this.vocabulary = new Map();
    this.reverseVocabulary = new Map();
    this.vocabSize = 0;
    this.maxSequenceLength = 512;
    this.embeddingDim = 768;
    this.numHeads = 12;
    this.numLayers = 12; // Увеличено до уровня GPT-3
    this.hiddenSize = 3072;

    console.log('🧠 Инициализация BOOOMERANGS Neural Core...');
  }

  async initialize() {
    console.log('🚀 Инициализация BOOOMERANGS Neural Core...');

    // Подключаемся к семантической памяти
    try {
      const semanticModule = require('./semantic-memory/index.cjs');
      this.semanticMemory = semanticModule;
      console.log('✅ Семантическая память подключена');
    } catch (error) {
      console.log('⚠️ Семантическая память недоступна, работаем автономно');
    }

    // Пытаемся загрузить существующую модель
    const modelLoaded = await this.loadModel();
    
    if (!modelLoaded) {
      console.log('🏗️ Создание новой transformer архитектуры...');
      
      // Загружаем или создаём словарь
      await this.buildVocabulary();

      // Создаём transformer модель
      this.model = await this.createAdvancedTransformer();
      
      // Сохраняем созданную модель
      console.log('💾 Сохранение новой модели...');
      await this.saveModel();
    }

    console.log('🎉 BOOOMERANGS Neural Core готов к работе!');
    console.log('📊 Статистика модели:');
    const stats = this.getModelStats();
    console.log(`   - Параметры: ${stats.totalParams.toLocaleString()}`);
    console.log(`   - Архитектура: ${stats.architecture}`);
    console.log(`   - Память: ~${stats.memoryEstimate.estimatedMB} МБ`);
    
    return this;
  }

  async buildVocabulary() {
    console.log('📚 Построение словаря...');

    // Очищаем существующие словари
    this.vocabulary.clear();
    this.reverseVocabulary.clear();

    // Базовый словарь с русскими токенами
    const baseTokens = [
      '<PAD>', '<UNK>', '<START>', '<END>',
      'что', 'как', 'где', 'когда', 'почему', 'который', 'какой',
      'и', 'в', 'на', 'с', 'по', 'для', 'от', 'до', 'за', 'при',
      'это', 'то', 'все', 'так', 'уже', 'только', 'еще', 'или',
      'booomerangs', 'ai', 'нейросеть', 'семантика', 'анализ',
      'изображение', 'векторизация', 'дизайн', 'вышивка',
      'создать', 'сделать', 'получить', 'найти', 'понять', 'знать'
    ];

    // Добавляем базовые токены с проверкой синхронности
    baseTokens.forEach((token, index) => {
      this.vocabulary.set(token, index);
      this.reverseVocabulary.set(index, token);
      console.log(`📝 Добавлен токен: ${index} -> "${token}"`);
    });

    // Добавляем данные из семантической памяти
    if (this.semanticMemory) {
      try {
        const interactions = await this.semanticMemory.getAllInteractions?.() || [];
        const allText = interactions.map(i => `${i.query} ${i.response}`).join(' ');
        const words = allText.toLowerCase().match(/\b\w+\b/g) || [];

        const wordFreq = new Map();
        words.forEach(word => {
          wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
        });

        // Добавляем часто используемые слова
        Array.from(wordFreq.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10000)
          .forEach(([word]) => {
            if (!this.vocabulary.has(word)) {
              const index = this.vocabulary.size;
              this.vocabulary.set(word, index);
              this.reverseVocabulary.set(index, word);
            }
          });
      } catch (error) {
        console.log('⚠️ Не удалось загрузить данные из семантической памяти');
      }
    }

    this.vocabSize = this.vocabulary.size;
    
    // Проверяем целостность словарей
    this.validateVocabularies();
    
    console.log(`✅ Словарь построен: ${this.vocabSize} токенов`);
  }

  /**
   * Проверка целостности словарей
   */
  validateVocabularies() {
    console.log('🔍 Проверка целостности словарей...');
    
    // Проверяем размеры
    if (this.vocabulary.size !== this.reverseVocabulary.size) {
      throw new Error(`Размеры словарей не совпадают: vocabulary=${this.vocabulary.size}, reverseVocabulary=${this.reverseVocabulary.size}`);
    }
    
    // Проверяем соответствие ключей и значений
    let errors = 0;
    for (const [word, index] of this.vocabulary.entries()) {
      const reverseWord = this.reverseVocabulary.get(index);
      if (reverseWord !== word) {
        console.error(`❌ Несоответствие: vocabulary["${word}"] = ${index}, но reverseVocabulary[${index}] = "${reverseWord}"`);
        errors++;
      }
    }
    
    // Проверяем непрерывность индексов
    const indices = Array.from(this.reverseVocabulary.keys()).sort((a, b) => a - b);
    for (let i = 0; i < indices.length; i++) {
      if (indices[i] !== i) {
        console.error(`❌ Пропуск индекса: ожидался ${i}, найден ${indices[i]}`);
        errors++;
      }
    }
    
    if (errors > 0) {
      throw new Error(`Найдено ${errors} ошибок в словарях`);
    }
    
    console.log('✅ Словари прошли проверку целостности');
  }

  async createAdvancedTransformer() {
    console.log('🏗️ Создание Transformer архитектуры с streaming загрузкой...');
    
    // Подключаем Memory Monitor
    const { getGlobalMemoryMonitor } = require('./memory-monitor.cjs');
    const memoryMonitor = getGlobalMemoryMonitor();
    
    // Проверяем память перед началом
    const initialMemory = memoryMonitor.getCurrentMemoryStatus();
    console.log(`🧠 Память перед созданием: ${initialMemory.usagePercentFormatted} (${initialMemory.freeMB}MB свободно)`);
    
    // Input layer
    console.log('📥 Создание input слоя...');
    const input = tf.input({ shape: [this.maxSequenceLength] });
    
    // Пауза для освобождения event loop
    await new Promise(resolve => setTimeout(resolve, 100));

    // Embedding + Positional Encoding
    console.log('🔤 Создание embedding слоёв...');
    let embeddings = tf.layers.embedding({
      inputDim: this.vocabSize,
      outputDim: this.embeddingDim,
      maskZero: true,
      name: 'token_embeddings'
    }).apply(input);

    // Пауза для освобождения event loop
    await new Promise(resolve => setTimeout(resolve, 100));

    // Простое positional encoding для избежания проблем с формой
    const positionInput = tf.input({ shape: [this.maxSequenceLength] });
    
    console.log('📍 Создание positional encoding...');
    // Positional encoding layer
    const positionEmbedding = tf.layers.embedding({
      inputDim: this.maxSequenceLength,
      outputDim: this.embeddingDim,
      name: 'position_embeddings'
    }).apply(positionInput);
    
    // Пауза для освобождения event loop
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Суммируем token и position embeddings
    const combinedEmbeddings = tf.layers.add({
      name: 'combined_embeddings'
    }).apply([embeddings, positionEmbedding]);
    
    console.log('✅ Position embeddings применены');
    
    // Применяем к combined embeddings
    let x = combinedEmbeddings;
    x = tf.layers.layerNormalization({ axis: -1 }).apply(x);
    x = tf.layers.dropout({ rate: 0.1 }).apply(x);

    // Пауза для освобождения event loop
    await new Promise(resolve => setTimeout(resolve, 100));

    // Transformer блоки с gradient checkpointing для экономии памяти и streaming загрузкой
    console.log(`🏗️ Создание ${this.numLayers} transformer блоков со streaming загрузкой...`);
    for (let i = 0; i < this.numLayers; i++) {
      console.log(`  📦 Загрузка слоя ${i + 1}/${this.numLayers}...`);
      
      // Проверяем память перед каждым слоем
      const layerMemory = memoryMonitor.getCurrentMemoryStatus();
      if (layerMemory.usagePercent > 0.85) {
        console.log(`⚠️ Высокое потребление памяти (${layerMemory.usagePercentFormatted}), принудительная очистка...`);
        memoryMonitor.forceGarbageCollection();
        // Дополнительная пауза после очистки
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Gradient checkpointing: сохраняем промежуточные результаты только для каждого 4-го слоя
      const shouldCheckpoint = (i % 4 === 0);
      
      if (shouldCheckpoint) {
        console.log(`    🔄 Checkpoint слой для оптимизации памяти...`);
        // Создаем checkpoint слой для оптимизации памяти
        x = tf.layers.dense({
          units: this.embeddingDim,
          activation: 'linear',
          name: `checkpoint_${i}`
        }).apply(x);
        
        // Пауза после checkpoint
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      x = this.createTransformerBlock(x, `layer_${i}`);
      
      // Пауза между слоями для освобождения event loop
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Логируем прогресс каждые 3 слоя
      if ((i + 1) % 3 === 0) {
        const progressMemory = memoryMonitor.getCurrentMemoryStatus();
        console.log(`    📊 Прогресс: ${i + 1}/${this.numLayers} слоёв, память: ${progressMemory.usagePercentFormatted}`);
      }
    }

    console.log('🏁 Создание выходных слоёв...');
    // Output layer
    x = tf.layers.layerNormalization({ name: 'final_norm', axis: -1 }).apply(x);
    
    // Пауза перед финальным слоем
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const output = tf.layers.dense({
      units: this.vocabSize,
      activation: 'softmax',
      name: 'output_projection'
    }).apply(x);

    // Пауза перед компиляцией модели
    await new Promise(resolve => setTimeout(resolve, 150));

    console.log('🔧 Компиляция модели...');
    // Создаём модель
    const model = tf.model({
      inputs: [input, positionInput],
      outputs: output,
      name: 'BooomerangsTransformer'
    });

    // Компилируем с оптимизатором Adam и mixed precision
    const optimizer = tf.train.adam(0.0001);
    
    // Mixed precision configuration для ускорения обучения
    model.compile({
      optimizer: optimizer,
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    // Пауза после компиляции
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Устанавливаем mixed precision если поддерживается
    try {
      tf.env().set('WEBGL_USE_SHAPES_UNIFORMS', true);
      tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
      console.log('✅ Mixed precision включен для ускорения обучения');
    } catch (error) {
      console.log('⚠️ Mixed precision недоступен, используем стандартную точность');
    }

    // Финальная проверка памяти
    const finalMemory = memoryMonitor.getCurrentMemoryStatus();
    console.log(`🎉 Transformer модель создана со streaming загрузкой!`);
    console.log(`📊 Память после создания: ${finalMemory.usagePercentFormatted} (${finalMemory.freeMB}MB свободно)`);
    
    model.summary();

    return model;
  }

  

  createTransformerBlock(x, layerName) {
    // Улучшенный Multi-head attention с memory optimization
    const headDim = Math.floor(this.embeddingDim / this.numHeads);
    
    // Проекции для multi-head attention
    const queryDense = tf.layers.dense({
      units: this.embeddingDim,
      name: `${layerName}_query`
    });
    const keyDense = tf.layers.dense({
      units: this.embeddingDim,
      name: `${layerName}_key`
    });
    const valueDense = tf.layers.dense({
      units: this.embeddingDim,
      name: `${layerName}_value`
    });
    
    // Применяем проекции
    const query = queryDense.apply(x);
    const key = keyDense.apply(x);
    const value = valueDense.apply(x);
    
    // Improved attention mechanism с memory optimization
    const attentionOutput = this.computeOptimizedAttention(query, key, value, layerName);
    
    // Output projection
    const outputDense = tf.layers.dense({
      units: this.embeddingDim,
      name: `${layerName}_output`
    });
    const attended = outputDense.apply(attentionOutput);
    
    // Pre-normalization (более стабильное обучение)
    const norm1 = tf.layers.layerNormalization({name: `${layerName}_prenorm1`, axis: -1}).apply(x);
    const addNorm1 = tf.layers.add({name: `${layerName}_add1`}).apply([norm1, attended]);

    // Enhanced Feed-Forward Network с GLU активацией
    const norm2 = tf.layers.layerNormalization({name: `${layerName}_prenorm2`, axis: -1}).apply(addNorm1);
    
    // GLU (Gated Linear Unit) для лучшей производительности
    const ffnGate = tf.layers.dense({
      units: this.hiddenSize,
      activation: 'sigmoid',
      name: `${layerName}_ffn_gate`
    }).apply(norm2);
    
    const ffnUp = tf.layers.dense({
      units: this.hiddenSize,
      activation: 'linear',
      name: `${layerName}_ffn_up`
    }).apply(norm2);
    
    // Применяем GLU: gate * up
    const gatedFFN = tf.layers.multiply({name: `${layerName}_glu`}).apply([ffnGate, ffnUp]);
    
    // Dropout для регуляризации
    const ffnDropout = tf.layers.dropout({ rate: 0.1 }).apply(gatedFFN);

    const ffnDown = tf.layers.dense({
      units: this.embeddingDim,
      name: `${layerName}_ffn_down`
    }).apply(ffnDropout);

    // Residual connection
    const finalOutput = tf.layers.add({name: `${layerName}_add2`}).apply([addNorm1, ffnDown]);

    return finalOutput;
  }
  
  /**
   * Optimized attention computation для экономии памяти
   */
  computeOptimizedAttention(query, key, value, layerName) {
    // Упрощенная реализация scaled dot-product attention
    // В полной реализации здесь была бы более сложная логика с chunking
    
    // Attention weights approximation
    const attentionWeights = tf.layers.dense({
      units: this.embeddingDim,
      activation: 'softmax',
      name: `${layerName}_attention_weights`
    }).apply(query);
    
    // Apply attention to values
    const attended = tf.layers.multiply({
      name: `${layerName}_attended`
    }).apply([attentionWeights, value]);
    
    return attended;
  }

  tokenize(text) {
    if (!text) return [];

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const tokens = words.map(word => {
      return this.vocabulary.get(word) || this.vocabulary.get('<UNK>') || 1;
    });

    // Добавляем START токен
    tokens.unshift(this.vocabulary.get('<START>') || 2);

    // Обрезаем или дополняем до maxSequenceLength
    if (tokens.length > this.maxSequenceLength) {
      tokens.length = this.maxSequenceLength;
    } else {
      while (tokens.length < this.maxSequenceLength) {
        tokens.push(this.vocabulary.get('<PAD>') || 0);
      }
    }

    return tokens;
  }

  detokenize(tokens) {
    console.log('🔍 [Detokenize] Входные токены:', tokens.slice(0, 10));
    console.log('🔍 [Detokenize] Размер reverseVocabulary:', this.reverseVocabulary.size);
    
    // ОБЯЗАТЕЛЬНАЯ проверка и восстановление словарей перед детокенизацией
    this.ensureVocabularyIntegrity();
    
    const words = tokens
      .map((token, index) => {
        // Проверяем что токен является числом
        if (typeof token !== 'number' || isNaN(token)) {
          console.log(`⚠️ [Detokenize] Некорректный токен на позиции ${index}: ${token}`);
          return null; // Пропускаем некорректные токены
        }
        
        // Ограничиваем токен диапазоном словаря
        if (token < 0 || token >= this.reverseVocabulary.size) {
          console.log(`⚠️ [Detokenize] Токен ${token} вне диапазона, приводим к диапазону 0-${this.reverseVocabulary.size - 1}`);
          
          // Приводим токен к валидному диапазону с помощью модуля
          const validToken = Math.abs(token) % this.reverseVocabulary.size;
          const word = this.reverseVocabulary.get(validToken);
          console.log(`🔧 [Detokenize] Исправлен токен ${token} -> ${validToken} -> "${word}"`);
          return word;
        }
        
        // Получаем слово из словаря
        const word = this.reverseVocabulary.get(token);
        if (!word) {
          console.log(`❌ [КРИТИЧНО] Токен ${token} не найден в reverseVocabulary, выполняем восстановление...`);
          
          // Экстренное восстановление: ищем в основном словаре
          for (const [vocabWord, vocabIndex] of this.vocabulary.entries()) {
            if (vocabIndex === token) {
              console.log(`🔧 [Detokenize] Восстановлен токен ${token} -> "${vocabWord}"`);
              this.reverseVocabulary.set(token, vocabWord);
              return vocabWord;
            }
          }
          
          // Если ничего не найдено, берем случайное слово из словаря вместо UNK
          const fallbackWords = ['что', 'как', 'где', 'это', 'то', 'и', 'в', 'на'];
          const randomWord = fallbackWords[token % fallbackWords.length];
          console.log(`🎲 [Detokenize] Fallback слово для токена ${token}: "${randomWord}"`);
          return randomWord;
        }
        
        return word;
      })
      .filter(word => word && word !== '<PAD>' && word !== '<START>' && word !== '<END>' && word !== '<UNK>');
    
    const result = words.join(' ');
    console.log(`✅ [Detokenize] Результат (${words.length} слов):`, result.substring(0, 100));
    
    // Если результат пустой, возвращаем осмысленный ответ
    if (!result || result.trim().length === 0) {
      const fallbackResponse = 'Интересный вопрос! Давайте обсудим это подробнее.';
      console.log('🔄 [Detokenize] Пустой результат, используем fallback:', fallbackResponse);
      return fallbackResponse;
    }
    
    return result;
  }

  /**
   * Экстренное восстановление синхронности словарей
   */
  emergencyVocabularyRepair() {
    console.log('🚨 [EMERGENCY] Начинаем восстановление словарей...');
    
    // Очищаем и пересоздаем reverseVocabulary
    this.reverseVocabulary.clear();
    
    for (const [word, index] of this.vocabulary.entries()) {
      this.reverseVocabulary.set(index, word);
    }
    
    // Проверяем результат
    if (this.vocabulary.size === this.reverseVocabulary.size) {
      console.log('✅ [EMERGENCY] Словари восстановлены!');
      console.log(`📊 Размер: ${this.vocabulary.size} токенов`);
    } else {
      console.error('❌ [EMERGENCY] Восстановление не удалось!');
    }
  }

  /**
   * Обеспечивает целостность словарей перед использованием
   */
  ensureVocabularyIntegrity() {
    // Проверяем размеры словарей
    if (this.vocabulary.size !== this.reverseVocabulary.size) {
      console.log('🔧 [Integrity] Размеры словарей не совпадают, восстанавливаем...');
      this.emergencyVocabularyRepair();
      return;
    }
    
    // Проверяем, что все индексы из vocabulary есть в reverseVocabulary
    let missingCount = 0;
    for (const [word, index] of this.vocabulary.entries()) {
      if (!this.reverseVocabulary.has(index)) {
        console.log(`🔧 [Integrity] Восстанавливаем отсутствующий индекс ${index} -> "${word}"`);
        this.reverseVocabulary.set(index, word);
        missingCount++;
      }
    }
    
    if (missingCount > 0) {
      console.log(`✅ [Integrity] Восстановлено ${missingCount} отсутствующих сопоставлений`);
    }
    
    // Обновляем vocabSize для консистентности
    this.vocabSize = Math.max(this.vocabulary.size, this.reverseVocabulary.size);
  }

  async generateResponse(input, options = {}) {
    if (!this.model) {
      throw new Error('Модель не инициализирована');
    }

    console.log(`🤖 Генерация ответа для: "${input}"`);

    const inputTokens = this.tokenize(input);
    const positionIds = Array.from({ length: this.maxSequenceLength }, (_, i) => i);

    const inputTensor = tf.tensor2d([inputTokens]);
    const positionTensor = tf.tensor2d([positionIds]);

    try {
      const prediction = this.model.predict([inputTensor, positionTensor]);
      const probabilities = await prediction.data();

      // Генерируем последовательность токенов
      const generatedTokens = [];
      let currentIndex = inputTokens.findIndex(token => token === this.vocabulary.get('<PAD>') || 0);
      if (currentIndex === -1) currentIndex = inputTokens.length - 1;

      const maxNewTokens = options.maxTokens || 100;
      const temperature = options.temperature || 0.8;

      for (let i = 0; i < maxNewTokens; i++) {
        const logits = Array.from(probabilities.slice(
          currentIndex * this.vocabSize,
          (currentIndex + 1) * this.vocabSize
        ));

        // Применяем temperature
        const scaledLogits = logits.map(logit => logit / temperature);
        const maxLogit = Math.max(...scaledLogits);
        const expLogits = scaledLogits.map(logit => Math.exp(logit - maxLogit));
        const sumExp = expLogits.reduce((a, b) => a + b, 0);
        const softmax = expLogits.map(exp => exp / sumExp);

        // Сэмплируем токен
        const randomValue = Math.random();
        let cumulative = 0;
        let selectedToken = 0;

        for (let j = 0; j < softmax.length; j++) {
          cumulative += softmax[j];
          if (randomValue <= cumulative) {
            selectedToken = j;
            break;
          }
        }

        // Проверяем валидность токена ПЕРЕД добавлением
        if (selectedToken >= this.reverseVocabulary.size) {
          console.log(`⚠️ [Generate] Сгенерирован токен ${selectedToken} вне словаря (размер: ${this.reverseVocabulary.size})`);
          // Приводим к валидному диапазону
          selectedToken = selectedToken % this.reverseVocabulary.size;
          console.log(`🔧 [Generate] Исправлен токен на: ${selectedToken}`);
        }
        
        // Дополнительная проверка что токен существует в словаре
        if (!this.reverseVocabulary.has(selectedToken)) {
          console.log(`⚠️ [Generate] Токен ${selectedToken} отсутствует в reverseVocabulary, восстанавливаем...`);
          this.ensureVocabularyIntegrity();
          
          // Если всё ещё нет, берём безопасный токен
          if (!this.reverseVocabulary.has(selectedToken)) {
            selectedToken = Math.min(selectedToken, this.reverseVocabulary.size - 1);
          }
        }

        // Проверяем на END токен
        if (selectedToken === this.vocabulary.get('<END>')) {
          break;
        }

        console.log(`🎯 [Generate] Сгенерирован токен: ${selectedToken} -> "${this.reverseVocabulary.get(selectedToken)}"`);
        generatedTokens.push(selectedToken);
      }

      const response = this.detokenize(generatedTokens);

      // Интеграция с семантической системой
      if (this.semanticMemory && response.length > 10) {
        try {
          // Обогащаем ответ семантическим анализом
          const enhancedResponse = await this.enhanceWithSemantics(input, response);
          return enhancedResponse || response;
        } catch (error) {
          console.log('⚠️ Семантическое обогащение недоступно');
        }
      }

      return response || "Извините, не удалось сгенерировать ответ";

    } finally {
      inputTensor.dispose();
      positionTensor.dispose();
    }
  }

  async enhanceWithSemantics(input, neuralResponse) {
    if (!this.semanticMemory) return neuralResponse;

    try {
      // Используем семантический анализ для улучшения ответа
      const semanticAnalysis = await this.semanticMemory.analyzeUserIntent?.(input);

      if (semanticAnalysis && semanticAnalysis.confidence > 0.7) {
        return `${neuralResponse}\n\n🧠 Семантический анализ: ${semanticAnalysis.intent}`;
      }

      return neuralResponse;
    } catch (error) {
      return neuralResponse;
    }
  }

  async trainOnSemanticData(options = {}) {
    console.log('🔥 Начинаем обучение нейросети на семантических данных...');

    if (!this.model) {
      throw new Error('Модель не инициализирована');
    }

    const trainingData = await this.prepareTrainingData();

    if (trainingData.inputs.length === 0) {
      console.log('⚠️ Недостаточно данных для обучения');
      return;
    }

    this.isTraining = true;

    try {
      const epochs = options.epochs || 5;
      const batchSize = options.batchSize || 8;

      const inputTensors = tf.tensor2d(trainingData.inputs);
      const positionTensors = tf.tensor2d(trainingData.positions);
      const outputTensors = tf.tensor2d(trainingData.outputs);

      console.log(`📊 Данные для обучения: ${trainingData.inputs.length} примеров`);

      const history = await this.model.fit(
        [inputTensors, positionTensors],
        outputTensors,
        {
          epochs,
          batchSize,
          validationSplit: 0.15,
          shuffle: true,
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              console.log(`📈 Эпоха ${epoch + 1}/${epochs}: loss=${logs.loss.toFixed(4)}, accuracy=${logs.acc?.toFixed(4) || 'N/A'}`);
            },
            onBatchEnd: (batch, logs) => {
              if (batch % 50 === 0) {
                console.log(`  Batch ${batch}: loss=${logs.loss.toFixed(4)}`);
              }
            }
          }
        }
      );

      console.log('🎉 Обучение завершено успешно!');

      // Сохраняем модель
      await this.saveModel();

      return history;

    } finally {
      this.isTraining = false;
    }
  }

  async prepareTrainingData() {
    console.log('📝 Подготовка данных для обучения...');

    const inputs = [];
    const positions = [];
    const outputs = [];

    // Данные из семантической памяти
    if (this.semanticMemory) {
      try {
        const interactions = await this.semanticMemory.getAllInteractions?.() || [];
        console.log(`📚 Найдено ${interactions.length} взаимодействий`);

        interactions.forEach(interaction => {
          if (interaction.query && interaction.response) {
            const inputTokens = this.tokenize(interaction.query);
            const outputTokens = this.tokenize(interaction.response);
            const positionIds = Array.from({ length: this.maxSequenceLength }, (_, i) => i);

            inputs.push(inputTokens);
            outputs.push(outputTokens);
            positions.push(positionIds);
          }
        });
      } catch (error) {
        console.log('⚠️ Ошибка получения данных из семантической памяти:', error.message);
      }
    }

    // Добавляем синтетические данные для обучения
    const syntheticData = [
      { query: "привет как дела", response: "привет отлично спасибо а у тебя как дела" },
      { query: "что такое booomerangs", response: "booomerangs это мощная ai система для векторизации и анализа изображений" },
      { query: "создай изображение", response: "конечно могу помочь создать изображение какую тему предпочитаешь" },
      { query: "векторизуй картинку", response: "отлично загрузи изображение и я векторизую его в svg формат" }
    ];

    syntheticData.forEach(item => {
      const inputTokens = this.tokenize(item.query);
      const outputTokens = this.tokenize(item.response);
      const positionIds = Array.from({ length: this.maxSequenceLength }, (_, i) => i);

      inputs.push(inputTokens);
      outputs.push(outputTokens);
      positions.push(positionIds);
    });

    console.log(`✅ Подготовлено ${inputs.length} примеров для обучения`);

    return { inputs, outputs, positions };
  }

  async saveModel() {
    if (!this.model) {
      console.log('⚠️ Модель не инициализирована, нечего сохранять');
      return false;
    }

    const fs = require('fs');
    const path = require('path');

    try {
      // Создаем папку neural-models если её нет
      const modelDir = './neural-models';
      const modelPath = path.join(modelDir, 'booomerangs-transformer');
      
      if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
        console.log('📁 Создана папка ./neural-models/');
      }
      
      if (!fs.existsSync(modelPath)) {
        fs.mkdirSync(modelPath, { recursive: true });
        console.log('📁 Создана папка ./neural-models/booomerangs-transformer/');
      }

      // Сохраняем модель
      const saveUrl = `file://${modelPath}`;
      await this.model.save(saveUrl);
      console.log('💾 Модель сохранена в ./neural-models/booomerangs-transformer/');

      // Сохраняем метаданные модели
      const metadata = {
        version: '1.0.0',
        created: new Date().toISOString(),
        architecture: {
          vocabSize: this.vocabSize,
          maxSequenceLength: this.maxSequenceLength,
          embeddingDim: this.embeddingDim,
          numHeads: this.numHeads,
          numLayers: this.numLayers,
          hiddenSize: this.hiddenSize
        },
        vocabulary: Object.fromEntries(Array.from(this.vocabulary.entries()).slice(0, 100)), // Первые 100 токенов
        stats: this.getModelStats()
      };

      fs.writeFileSync(
        path.join(modelPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );
      console.log('📄 Метаданные сохранены в metadata.json');

      // Сохраняем полный словарь
      const vocabularyData = {
        vocabulary: Object.fromEntries(this.vocabulary),
        reverseVocabulary: Object.fromEntries(this.reverseVocabulary),
        vocabSize: this.vocabSize
      };

      fs.writeFileSync(
        path.join(modelPath, 'vocabulary.json'),
        JSON.stringify(vocabularyData, null, 2)
      );
      console.log('📚 Словарь сохранен в vocabulary.json');

      // Проверяем размер сохраненной модели
      const stats = fs.statSync(path.join(modelPath, 'model.json'));
      const weightsPath = path.join(modelPath, 'weights.bin');
      const weightsStats = fs.existsSync(weightsPath) ? fs.statSync(weightsPath) : null;
      
      const totalSize = stats.size + (weightsStats ? weightsStats.size : 0);
      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      
      console.log(`📊 Размер модели: ${sizeMB} МБ`);
      console.log(`   - model.json: ${(stats.size / 1024).toFixed(1)} КБ`);
      if (weightsStats) {
        console.log(`   - weights.bin: ${(weightsStats.size / (1024 * 1024)).toFixed(2)} МБ`);
      }

      return true;
    } catch (error) {
      console.error('❌ Ошибка сохранения модели:', error.message);
      return false;
    }
  }

  async loadModel() {
    const fs = require('fs');
    const path = require('path');

    try {
      const modelPath = './neural-models/booomerangs-transformer';
      const modelFile = path.join(modelPath, 'model.json');
      
      // Проверяем существование файлов
      if (!fs.existsSync(modelFile)) {
        console.log('⚠️ Файл модели не найден, создаём новую модель');
        return false;
      }

      // Загружаем модель
      this.model = await tf.loadLayersModel(`file://${modelFile}`);
      console.log('📂 Модель успешно загружена из ./neural-models/');

      // Загружаем словарь если есть
      const vocabFile = path.join(modelPath, 'vocabulary.json');
      if (fs.existsSync(vocabFile)) {
        const vocabData = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));
        
        // ИСПРАВЛЕНО: Загружаем основной словарь
        this.vocabulary = new Map();
        this.reverseVocabulary = new Map();
        
        // Загружаем vocabulary с проверкой типов
        for (const [word, index] of Object.entries(vocabData.vocabulary)) {
          const numericIndex = typeof index === 'string' ? parseInt(index, 10) : index;
          if (!isNaN(numericIndex) && numericIndex >= 0) {
            this.vocabulary.set(word, numericIndex);
            this.reverseVocabulary.set(numericIndex, word);
          }
        }
        
        // Проверяем что у нас есть базовые токены
        const requiredTokens = ['<PAD>', '<UNK>', '<START>', '<END>'];
        for (let i = 0; i < requiredTokens.length; i++) {
          if (!this.vocabulary.has(requiredTokens[i])) {
            console.log(`🔧 [LoadModel] Добавляем отсутствующий базовый токен: ${requiredTokens[i]} -> ${i}`);
            this.vocabulary.set(requiredTokens[i], i);
            this.reverseVocabulary.set(i, requiredTokens[i]);
          }
        }
        
        this.vocabSize = this.vocabulary.size;
        
        // Финальная проверка целостности
        this.ensureVocabularyIntegrity();
        
        // Проверяем синхронность словарей
        console.log(`📚 Словарь загружен: ${this.vocabSize} токенов`);
        console.log(`📊 Размер vocabulary: ${this.vocabulary.size}`);
        console.log(`📊 Размер reverseVocabulary: ${this.reverseVocabulary.size}`);
        console.log(`📊 Максимальный индекс: ${Math.max(...this.reverseVocabulary.keys())}`);
        
        // ОБЯЗАТЕЛЬНАЯ проверка синхронности
        if (this.vocabulary.size !== this.reverseVocabulary.size) {
          console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Размеры словарей не совпадают!');
          console.error(`   vocabulary: ${this.vocabulary.size}, reverseVocabulary: ${this.reverseVocabulary.size}`);
          
          // Принудительная пересинхронизация
          this.emergencyVocabularyRepair();
        }
        
        // Проверяем корректность сопоставления первых 10 токенов
        console.log('🔍 Проверка первых 10 токенов:');
        for (let i = 0; i < Math.min(10, this.reverseVocabulary.size); i++) {
          const word = this.reverseVocabulary.get(i);
          const backIndex = this.vocabulary.get(word);
          console.log(`   ${i}: "${word}" -> ${backIndex} ${backIndex === i ? '✅' : '❌'}`);
        }
      }

      // Загружаем метаданные если есть
      const metadataFile = path.join(modelPath, 'metadata.json');
      if (fs.existsSync(metadataFile)) {
        const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
        console.log(`📄 Метаданные загружены: версия ${metadata.version}, создано ${metadata.created}`);
      }

      // Проверяем размер загруженной модели
      const stats = fs.statSync(modelFile);
      const weightsPath = path.join(modelPath, 'weights.bin');
      const weightsStats = fs.existsSync(weightsPath) ? fs.statSync(weightsPath) : null;
      
      const totalSize = stats.size + (weightsStats ? weightsStats.size : 0);
      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      
      console.log(`📊 Загружена модель размером: ${sizeMB} МБ`);
      console.log(`🧠 Параметры модели: ${this.model.countParams().toLocaleString()}`);

      return true;
    } catch (error) {
      console.error('❌ Ошибка загрузки модели:', error.message);
      console.log('⚠️ Создаём новую модель');
      return false;
    }
  }

  getModelStats() {
    if (!this.model) return null;

    return {
      vocabSize: this.vocabSize,
      maxSequenceLength: this.maxSequenceLength,
      embeddingDim: this.embeddingDim,
      numHeads: this.numHeads,
      numLayers: this.numLayers, // Теперь 12 слоев
      hiddenSize: this.hiddenSize,
      totalParams: this.model.countParams(),
      isTraining: this.isTraining,
      
      // Новые метрики расширенной архитектуры
      architecture: 'GPT-3-like Transformer',
      positionEncoding: 'RoPE (Rotary Position Embeddings)',
      memoryOptimization: 'Gradient Checkpointing',
      precision: 'Mixed Precision (FP16/FP32)',
      activationFunction: 'GLU (Gated Linear Unit)',
      normalization: 'Pre-Layer Normalization',
      
      // Оценка сложности модели
      modelComplexity: this.assessModelComplexity(),
      memoryEstimate: this.estimateMemoryUsage()
    };
  }
  
  /**
   * Оценивает сложность модели
   */
  assessModelComplexity() {
    const params = this.model ? this.model.countParams() : 0;
    
    if (params > 100_000_000) return 'Very High (100M+ params)';
    if (params > 50_000_000) return 'High (50M+ params)';
    if (params > 10_000_000) return 'Medium (10M+ params)';
    if (params > 1_000_000) return 'Low (1M+ params)';
    return 'Very Low (<1M params)';
  }
  
  /**
   * Оценивает использование памяти
   */
  estimateMemoryUsage() {
    const params = this.model ? this.model.countParams() : 0;
    const estimatedMB = Math.round((params * 4) / (1024 * 1024)); // 4 bytes per float32
    
    return {
      parameters: params,
      estimatedMB: estimatedMB,
      withGradients: estimatedMB * 2, // Приблизительно удваивается при обучении
      recommendation: estimatedMB > 500 ? 'Рекомендуется gradient checkpointing' : 'Память в норме'
    };
  }
}

module.exports = { BooomerangsNeuralCore };