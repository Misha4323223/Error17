
/**
 * 🎓 NEURAL TRAINING SYSTEM
 * Система обучения LITE нейросети с расширенным словарем
 */

const tf = require('@tensorflow/tfjs-node');
const { NeuralVocabularyExpander } = require('./neural-vocabulary-expander.cjs');

class NeuralTrainingSystem {
  constructor() {
    this.vocabularyExpander = null;
    this.neuralModel = null;
    this.trainingData = [];
    this.validationData = [];
    this.semanticMemory = null;
    this.isTraining = false;
    this.trainingMetrics = {
      loss: [],
      accuracy: [],
      perplexity: []
    };
    
    console.log('🎓 Инициализация системы обучения нейросети...');
  }

  async initialize() {
    try {
      // Инициализируем расширитель словаря
      this.vocabularyExpander = new NeuralVocabularyExpander();
      await this.vocabularyExpander.initialize();

      // Подключаемся к семантической памяти
      try {
        this.semanticMemory = require('./semantic-memory/index.cjs');
        console.log('✅ Семантическая память подключена к системе обучения');
      } catch (error) {
        console.log('⚠️ Семантическая память недоступна');
      }

      console.log('🎓 Система обучения готова к работе');
      return this;
    } catch (error) {
      console.error('❌ Ошибка инициализации системы обучения:', error);
      throw error;
    }
  }

  /**
   * Подготовка данных для обучения
   */
  async prepareTrainingData() {
    console.log('📊 Подготовка данных для обучения...');

    // 1. Расширяем словарь
    await this.vocabularyExpander.expandVocabulary();
    const expandedVocab = this.vocabularyExpander.expandedVocabulary;
    
    console.log(`📚 Использован расширенный словарь: ${expandedVocab.size} токенов`);

    // 2. Собираем диалоги из семантической памяти
    const dialogues = await this.collectDialogues();
    console.log(`💬 Собрано ${dialogues.length} диалогов`);

    // 3. Добавляем синтетические данные
    const syntheticData = this.generateSyntheticData();
    console.log(`🤖 Сгенерировано ${syntheticData.length} синтетических примеров`);

    // 4. Объединяем все данные
    const allData = [...dialogues, ...syntheticData];
    
    // 5. Токенизируем данные
    const tokenizedData = this.tokenizeTrainingData(allData);
    console.log(`🔤 Токенизировано ${tokenizedData.length} примеров`);

    // 6. Разделяем на обучающую и валидационную выборки
    this.splitData(tokenizedData);

    console.log(`✅ Данные подготовлены: ${this.trainingData.length} обучающих, ${this.validationData.length} валидационных`);
    
    return {
      trainingSize: this.trainingData.length,
      validationSize: this.validationData.length,
      vocabularySize: expandedVocab.size
    };
  }

  async collectDialogues() {
    if (!this.semanticMemory) {
      console.log('⚠️ Семантическая память недоступна, используем базовые диалоги');
      return this.getBaseDialogues();
    }

    try {
      const interactions = await this.semanticMemory.getAllInteractions?.() || [];
      
      return interactions
        .filter(i => i.query && i.response)
        .filter(i => i.query.length > 5 && i.response.length > 10)
        .map(i => ({
          input: i.query,
          output: i.response,
          metadata: {
            timestamp: i.timestamp,
            category: i.category || 'general',
            quality: this.assessResponseQuality(i.response)
          }
        }))
        .filter(d => d.metadata.quality > 0.5) // Только качественные ответы
        .slice(0, 5000); // Ограничиваем количество

    } catch (error) {
      console.error('❌ Ошибка сбора диалогов:', error);
      return this.getBaseDialogues();
    }
  }

  getBaseDialogues() {
    return [
      {
        input: 'привет',
        output: 'Привет! Как дела? Я BOOOMERANGS AI, готов помочь с любыми творческими задачами!',
        metadata: { category: 'greeting', quality: 0.9 }
      },
      {
        input: 'что ты умеешь',
        output: 'Я создаю изображения, векторизую графику, проектирую дизайны для вышивки и помогаю с творческими проектами!',
        metadata: { category: 'capabilities', quality: 0.9 }
      },
      {
        input: 'создай изображение',
        output: 'Отлично! Опиши детально что нужно создать: стиль, цвета, композицию, настроение. Чем подробнее, тем лучше результат!',
        metadata: { category: 'image_generation', quality: 0.8 }
      },
      {
        input: 'помоги с дизайном',
        output: 'Конечно помогу с дизайном! Расскажи о проекте: цели, аудитория, стиль, предпочтения. Создадим что-то потрясающее!',
        metadata: { category: 'design_help', quality: 0.8 }
      },
      {
        input: 'спасибо',
        output: 'Пожалуйста! Всегда рад помочь. Обращайся с новыми творческими задачами!',
        metadata: { category: 'gratitude', quality: 0.8 }
      },
      {
        input: 'ты лучше человека',
        output: 'У меня есть свои сильные стороны в обработке данных и генерации, но человеческая креативность и интуиция незаменимы. Лучше всего мы работаем вместе!',
        metadata: { category: 'comparison', quality: 0.9 }
      },
      {
        input: 'как векторизовать изображение',
        output: 'Векторизация превращает растровое изображение в векторную графику. Я использую передовые алгоритмы для точного контурирования и цветовой сегментации!',
        metadata: { category: 'vectorization', quality: 0.8 }
      },
      {
        input: 'нужна вышивка',
        output: 'Превосходно! Создаю дизайны для машинной вышивки в форматах DST, PES, JEF. Опиши мотив, размер, количество цветов!',
        metadata: { category: 'embroidery', quality: 0.8 }
      }
    ];
  }

  generateSyntheticData() {
    console.log('🤖 Генерация синтетических данных...');

    const templates = [
      {
        input: 'создай {object} в стиле {style}',
        output: 'Отлично! Создам {object} в {style} стиле. Какие дополнительные детали важны: цветовая гамма, размер, настроение?',
        variants: {
          object: ['логотип', 'иллюстрацию', 'дизайн', 'изображение', 'картинку'],
          style: ['минимализм', 'реализм', 'абстракция', 'ретро', 'современный']
        }
      },
      {
        input: 'помоги с {task}',
        output: 'Конечно помогу с {task}! Расскажи подробнее о задаче и требованиях.',
        variants: {
          task: ['проектом', 'дизайном', 'векторизацией', 'вышивкой', 'печатью']
        }
      },
      {
        input: 'что такое {concept}',
        output: '{concept} - это важная технология в области обработки изображений и дизайна. Могу рассказать подробнее!',
        variants: {
          concept: ['векторизация', 'растеризация', 'цветовая сегментация', 'контурирование']
        }
      }
    ];

    const syntheticData = [];

    templates.forEach(template => {
      const combinations = this.generateCombinations(template.variants);
      
      combinations.slice(0, 20).forEach(combo => { // Ограничиваем количество
        const input = this.fillTemplate(template.input, combo);
        const output = this.fillTemplate(template.output, combo);
        
        syntheticData.push({
          input,
          output,
          metadata: { category: 'synthetic', quality: 0.7 }
        });
      });
    });

    return syntheticData;
  }

  generateCombinations(variants) {
    const keys = Object.keys(variants);
    if (keys.length === 0) return [{}];
    
    const combinations = [];
    const [firstKey, ...restKeys] = keys;
    const firstValues = variants[firstKey];
    
    firstValues.forEach(value => {
      const restVariants = Object.fromEntries(restKeys.map(k => [k, variants[k]]));
      const restCombinations = this.generateCombinations(restVariants);
      
      restCombinations.forEach(combo => {
        combinations.push({ [firstKey]: value, ...combo });
      });
    });
    
    return combinations;
  }

  fillTemplate(template, values) {
    let result = template;
    Object.entries(values).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  }

  tokenizeTrainingData(data) {
    console.log('🔤 Токенизация данных...');
    
    const expandedVocab = this.vocabularyExpander.expandedVocabulary;
    const maxLength = 128;
    
    return data.map(item => {
      const inputTokens = this.tokenize(item.input, expandedVocab, maxLength);
      const outputTokens = this.tokenize(item.output, expandedVocab, maxLength);
      
      return {
        input: inputTokens,
        output: outputTokens,
        metadata: item.metadata
      };
    }).filter(item => item.input.length > 0 && item.output.length > 0);
  }

  tokenize(text, vocabulary, maxLength) {
    if (!text) return [];

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const tokens = words.map(word => {
      return vocabulary.get(word) || vocabulary.get('<UNK>') || 1;
    });

    // Добавляем START токен
    tokens.unshift(vocabulary.get('<START>') || 2);
    
    // Добавляем END токен если есть место
    if (tokens.length < maxLength) {
      tokens.push(vocabulary.get('<END>') || 3);
    }

    // Обрезаем или дополняем
    if (tokens.length > maxLength) {
      tokens.length = maxLength;
    } else {
      while (tokens.length < maxLength) {
        tokens.push(vocabulary.get('<PAD>') || 0);
      }
    }

    return tokens;
  }

  splitData(tokenizedData) {
    // Перемешиваем данные
    const shuffled = [...tokenizedData].sort(() => Math.random() - 0.5);
    
    // 80% на обучение, 20% на валидацию
    const splitIndex = Math.floor(shuffled.length * 0.8);
    
    this.trainingData = shuffled.slice(0, splitIndex);
    this.validationData = shuffled.slice(splitIndex);
  }

  /**
   * Обучение модели
   */
  async trainModel(neuralModel, options = {}) {
    if (this.isTraining) {
      throw new Error('Обучение уже выполняется');
    }

    this.isTraining = true;
    this.neuralModel = neuralModel;
    
    const {
      epochs = 10,
      batchSize = 8,
      learningRate = 0.001,
      validationSplit = 0.2,
      patience = 3
    } = options;

    console.log(`🎓 Начинаем обучение модели:`);
    console.log(`   - Эпохи: ${epochs}`);
    console.log(`   - Размер батча: ${batchSize}`);
    console.log(`   - Learning rate: ${learningRate}`);
    console.log(`   - Данных для обучения: ${this.trainingData.length}`);
    console.log(`   - Данных для валидации: ${this.validationData.length}`);

    try {
      // Обновляем словарь модели
      await this.updateModelVocabulary();

      // Подготавливаем данные для TensorFlow
      const { trainInputs, trainTargets } = this.prepareTensorFlowData(this.trainingData);
      const { valInputs, valTargets } = this.prepareTensorFlowData(this.validationData);

      console.log('📊 Данные подготовлены для TensorFlow');

      // Настраиваем callbacks
      const callbacks = this.setupTrainingCallbacks(patience);

      // Запускаем обучение
      const history = await this.neuralModel.fit([trainInputs.input, trainInputs.positions], trainTargets, {
        epochs,
        batchSize,
        validationData: [[valInputs.input, valInputs.positions], valTargets],
        callbacks,
        shuffle: true,
        verbose: 1
      });

      // Сохраняем метрики
      this.saveTrainingMetrics(history);

      console.log('✅ Обучение завершено успешно!');
      
      return {
        success: true,
        epochs: history.epoch.length,
        finalLoss: history.history.loss[history.history.loss.length - 1],
        finalAccuracy: history.history.accuracy?.[history.history.accuracy.length - 1],
        trainingTime: Date.now() - this.trainingStartTime
      };

    } catch (error) {
      console.error('❌ Ошибка обучения модели:', error);
      throw error;
    } finally {
      this.isTraining = false;
    }
  }

  async updateModelVocabulary() {
    console.log('📚 Обновляем словарь модели...');
    
    const expandedVocab = this.vocabularyExpander.expandedVocabulary;
    const reverseVocab = this.vocabularyExpander.reverseExpandedVocabulary;
    
    // Обновляем словарь в модели
    if (this.neuralModel.vocabulary) {
      this.neuralModel.vocabulary = expandedVocab;
      this.neuralModel.reverseVocabulary = reverseVocab;
      this.neuralModel.vocabSize = expandedVocab.size;
    }
    
    console.log(`✅ Словарь модели обновлен: ${expandedVocab.size} токенов`);
  }

  prepareTensorFlowData(data) {
    const batchSize = data.length;
    const maxLength = 128;
    
    // Подготавливаем входные данные
    const inputSequences = data.map(item => item.input);
    const targetSequences = data.map(item => item.output);
    
    // Создаем позиционные индексы
    const positions = inputSequences.map(() => 
      Array.from({ length: maxLength }, (_, i) => i)
    );
    
    // Создаем тензоры
    const trainInputs = {
      input: tf.tensor2d(inputSequences),
      positions: tf.tensor2d(positions)
    };
    
    const trainTargets = tf.tensor2d(targetSequences);
    
    return { trainInputs, trainTargets };
  }

  setupTrainingCallbacks(patience) {
    const callbacks = [];
    
    // Early stopping
    const earlyStopping = tf.callbacks.earlyStopping({
      monitor: 'val_loss',
      patience: patience,
      restoreBestWeights: true
    });
    callbacks.push(earlyStopping);
    
    // Custom callback для мониторинга
    const progressCallback = {
      onEpochEnd: (epoch, logs) => {
        console.log(`Эпоха ${epoch + 1}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss?.toFixed(4) || 'N/A'}`);
        
        // Сохраняем метрики
        this.trainingMetrics.loss.push(logs.loss);
        if (logs.accuracy) this.trainingMetrics.accuracy.push(logs.accuracy);
        if (logs.val_loss) {
          const perplexity = Math.exp(logs.val_loss);
          this.trainingMetrics.perplexity.push(perplexity);
        }
      }
    };
    callbacks.push(progressCallback);
    
    return callbacks;
  }

  saveTrainingMetrics(history) {
    const metrics = {
      loss: history.history.loss,
      accuracy: history.history.accuracy || [],
      val_loss: history.history.val_loss || [],
      val_accuracy: history.history.val_accuracy || [],
      epochs: history.epoch.length,
      timestamp: new Date().toISOString()
    };
    
    // Сохраняем в файл
    const fs = require('fs');
    const path = './neural-models/training-metrics.json';
    
    try {
      fs.writeFileSync(path, JSON.stringify(metrics, null, 2));
      console.log(`📊 Метрики обучения сохранены: ${path}`);
    } catch (error) {
      console.error('❌ Ошибка сохранения метрик:', error);
    }
  }

  assessResponseQuality(response) {
    if (!response || response.length < 10) return 0.3;
    if (response.length < 30) return 0.5;
    if (response.includes('<UNK>')) return 0.4;
    if (response.length > 50 && response.length < 500) return 0.8;
    return 0.7;
  }

  /**
   * Получение статистики обучения
   */
  getTrainingStats() {
    return {
      isTraining: this.isTraining,
      trainingDataSize: this.trainingData.length,
      validationDataSize: this.validationData.length,
      vocabularySize: this.vocabularyExpander?.expandedVocabulary?.size || 0,
      metrics: this.trainingMetrics,
      lastTrainingTime: this.trainingStartTime
    };
  }
}

module.exports = { NeuralTrainingSystem };
