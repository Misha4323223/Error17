/**
 * Обучение LITE нейросети BOOOMERANGS
 * Обучает модель на диалоговых данных для генерации осмысленного текста
 */

const tf = require('@tensorflow/tfjs-node');

class NeuralLiteTrainer {
  constructor() {
    this.neuralLite = null;
    this.trainingData = [];
    this.vocabulary = new Map();
    this.reverseVocabulary = new Map();
  }

  async initialize() {
    console.log('🚀 Инициализация системы обучения LITE...');
    
    // Загружаем neural lite
    const { BooomerangsNeuralLite } = require('./server/neural-network-lite.cjs');
    this.neuralLite = new BooomerangsNeuralLite();
    await this.neuralLite.initialize();
    
    this.vocabulary = this.neuralLite.vocabulary;
    this.reverseVocabulary = this.neuralLite.reverseVocabulary;
    
    console.log('✅ Neural Lite загружен для обучения');
    console.log(`📚 Словарь: ${this.vocabulary.size} токенов`);
  }

  prepareTrainingData() {
    console.log('📚 Подготовка обучающих данных...');
    
    // Обучающий набор диалогов BOOOMERANGS
    const dialogues = [
      // Приветствия
      { input: 'Привет', output: 'Привет! Рад тебя видеть! Я BOOOMERANGS AI готов помочь с творческими задачами' },
      { input: 'Здравствуй', output: 'Здравствуй! Отличный день для создания чего-то нового' },
      { input: 'Как дела', output: 'У меня все отлично! Готов к новым творческим вызовам' },
      
      // Возможности
      { input: 'Что ты умеешь', output: 'Я умею создавать изображения работать с векторной графикой делать дизайны для вышивки' },
      { input: 'Что можешь', output: 'Могу генерировать картинки векторизировать изображения создавать дизайны для печати' },
      { input: 'Твои способности', output: 'BOOOMERANGS AI специализируется на создании уникальных изображений и векторной графике' },
      
      // Создание
      { input: 'Создай картинку', output: 'Отличная идея! Опиши подробнее что именно хочешь увидеть' },
      { input: 'Сделай изображение', output: 'С удовольствием создам! Расскажи детали стиль цвета настроение' },
      { input: 'Нарисуй кота', output: 'Готов нарисовать кота! Какой стиль предпочитаешь реалистичный или мультяшный' },
      
      // Помощь
      { input: 'Помоги мне', output: 'Конечно помогу! Расскажи с чем именно нужна помощь' },
      { input: 'Нужна помощь', output: 'Всегда готов помочь! Опиши свою задачу найдем решение' },
      
      // Благодарности
      { input: 'Спасибо', output: 'Пожалуйста! Мне приятно быть полезным' },
      { input: 'Благодарю', output: 'Всегда рад помочь! Есть еще идеи для реализации' },
      
      // Вопросы о BOOOMERANGS
      { input: 'Что такое BOOOMERANGS', output: 'BOOOMERANGS это AI платформа для создания изображений и векторного дизайна' },
      { input: 'Расскажи о себе', output: 'Я BOOOMERANGS AI помощник для творческих задач специализируюсь на изображениях' },
      
      // Общие вопросы
      { input: 'Как работаешь', output: 'Использую нейронные сети и семантический анализ для понимания запросов' },
      { input: 'Интересно', output: 'Рад что интересно! Давай подумаем как решить эту задачу' },
      { input: 'Хорошо', output: 'Отлично! Что делаем дальше' },
      
      // Технические вопросы
      { input: 'Векторизация', output: 'Векторизация это преобразование растровых изображений в векторный формат SVG' },
      { input: 'Что такое вышивка', output: 'Вышивка это создание узоров нитками могу подготовить дизайны для вышивальных машин' }
    ];

    // Конвертируем в обучающий формат
    this.trainingData = dialogues.map(dialogue => {
      const inputTokens = this.tokenizeText(dialogue.input);
      const outputTokens = this.tokenizeText(dialogue.output);
      
      return {
        input: inputTokens,
        output: outputTokens,
        inputText: dialogue.input,
        outputText: dialogue.output
      };
    }).filter(item => item.input.length > 0 && item.output.length > 0);

    console.log(`✅ Подготовлено ${this.trainingData.length} обучающих примеров`);
    return this.trainingData;
  }

  tokenizeText(text) {
    if (!text) return [];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.map(word => {
      return this.vocabulary.get(word) || this.vocabulary.get('<UNK>') || 3;
    }).slice(0, 32); // Ограничиваем длину
  }

  async trainModel() {
    console.log('🎯 Начинаем обучение модели...');
    
    if (this.trainingData.length === 0) {
      throw new Error('Нет обучающих данных');
    }

    // Подготавливаем тензоры для обучения
    const batchSize = Math.min(8, this.trainingData.length);
    const maxLength = 32;
    
    // Входные данные (input sequences)
    const inputSequences = [];
    const targetSequences = [];
    
    for (let i = 0; i < this.trainingData.length; i += batchSize) {
      const batch = this.trainingData.slice(i, i + batchSize);
      
      const batchInputs = batch.map(item => {
        const padded = [...item.input];
        while (padded.length < maxLength) padded.push(0); // PAD token
        return padded.slice(0, maxLength);
      });
      
      const batchTargets = batch.map(item => {
        const padded = [...item.output];
        while (padded.length < maxLength) padded.push(0); // PAD token
        return padded.slice(0, maxLength);
      });
      
      inputSequences.push(batchInputs);
      targetSequences.push(batchTargets);
    }

    console.log(`📊 Обучающих батчей: ${inputSequences.length}`);
    console.log(`📏 Размер батча: ${batchSize}, Длина последовательности: ${maxLength}`);

    // Обучение
    const epochs = 10;
    console.log(`🔄 Начинаем обучение на ${epochs} эпох...`);
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      console.log(`\n📈 Эпоха ${epoch + 1}/${epochs}`);
      let totalLoss = 0;
      
      for (let batchIdx = 0; batchIdx < inputSequences.length; batchIdx++) {
        const batchInputs = inputSequences[batchIdx];
        const batchTargets = targetSequences[batchIdx];
        
        // Создаем тензоры
        const inputTensor = tf.tensor3d([batchInputs]);
        const targetTensor = tf.tensor3d([batchTargets]);
        const positionTensor = tf.tensor3d([batchInputs.map(() => 
          Array.from({ length: maxLength }, (_, i) => i)
        )]);
        
        try {
          // Обучающий шаг
          const result = await this.neuralLite.model.fit(
            [inputTensor, positionTensor], 
            targetTensor,
            {
              epochs: 1,
              batchSize: 1,
              verbose: 0,
              shuffle: true
            }
          );
          
          const loss = result.history.loss[0];
          totalLoss += loss;
          
          if (batchIdx % 5 === 0) {
            process.stdout.write(`⚡ Батч ${batchIdx + 1}/${inputSequences.length}, Loss: ${loss.toFixed(4)}\r`);
          }
          
        } finally {
          inputTensor.dispose();
          targetTensor.dispose();
          positionTensor.dispose();
        }
      }
      
      const avgLoss = totalLoss / inputSequences.length;
      console.log(`\n✅ Эпоха ${epoch + 1} завершена. Средний Loss: ${avgLoss.toFixed(4)}`);
      
      // Тест генерации после каждой эпохи
      if ((epoch + 1) % 3 === 0) {
        console.log('\n🧪 Тест генерации:');
        await this.testGeneration();
      }
    }

    console.log('\n🎉 Обучение завершено!');
    
    // Сохраняем обученную модель
    await this.neuralLite.saveModel();
    console.log('💾 Обученная модель сохранена');
  }

  async testGeneration() {
    const testInputs = ['Привет', 'Что умеешь', 'Создай картинку'];
    
    for (const input of testInputs) {
      try {
        const response = await this.neuralLite.generateResponse(input, {
          maxTokens: 20,
          temperature: 0.7
        });
        console.log(`  "${input}" → "${response}"`);
      } catch (error) {
        console.log(`  "${input}" → Ошибка: ${error.message}`);
      }
    }
  }

  async run() {
    try {
      await this.initialize();
      this.prepareTrainingData();
      await this.trainModel();
      
      console.log('\n🚀 Финальное тестирование обученной модели:');
      await this.testGeneration();
      
    } catch (error) {
      console.error('❌ Ошибка обучения:', error);
      throw error;
    }
  }
}

// Запуск обучения
if (require.main === module) {
  const trainer = new NeuralLiteTrainer();
  trainer.run().then(() => {
    console.log('✅ Обучение LITE нейросети завершено успешно!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Критическая ошибка обучения:', error);
    process.exit(1);
  });
}

module.exports = { NeuralLiteTrainer };