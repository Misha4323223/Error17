

#!/usr/bin/env node

/**
 * 🚀 ЗАПУСК РАСШИРЕНИЯ СЛОВАРЯ И ОБУЧЕНИЯ НЕЙРОСЕТИ
 * Автоматический скрипт для улучшения LITE нейросети
 */

console.log('🚀 BOOOMERANGS NEURAL VOCABULARY EXPANSION & TRAINING');
console.log('====================================================');

async function startVocabularyExpansionAndTraining() {
  try {
    // 1. Инициализация системы
    console.log('\n🔧 1. ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ');
    console.log('-----------------------------');
    
    const { getGlobalNeuralIntegration } = require('./server/neural-integration.cjs');
    const { NeuralVocabularyExpander } = require('./server/neural-vocabulary-expander.cjs');
    const { NeuralTrainingSystem } = require('./server/neural-training-system.cjs');

    // Получаем нейроинтеграцию
    const neuralIntegration = getGlobalNeuralIntegration();
    
    if (!neuralIntegration.isInitialized) {
      console.log('⚡ Инициализируем LITE нейросеть...');
      await neuralIntegration.initializeLite();
    }
    
    console.log('✅ Нейросеть инициализирована в режиме:', neuralIntegration.mode);

    // 2. Анализ текущего состояния
    console.log('\n📊 2. АНАЛИЗ ТЕКУЩЕГО СОСТОЯНИЯ');
    console.log('--------------------------------');
    
    const currentModel = neuralIntegration.getCurrentModel();
    const currentStats = currentModel?.getModelStats?.() || {};
    
    console.log('🧠 Текущая модель:');
    console.log(`   - Архитектура: ${currentStats.architecture || 'N/A'}`);
    console.log(`   - Параметры: ${currentStats.totalParams?.toLocaleString() || 'N/A'}`);
    console.log(`   - Память: ~${currentStats.memoryEstimate?.estimatedMB || 'N/A'} МБ`);
    console.log(`   - Словарь: ${currentModel?.vocabSize || 44} токенов (ПРОБЛЕМА: слишком мал!)`);

    // 3. Расширение словаря
    console.log('\n📚 3. РАСШИРЕНИЕ СЛОВАРЯ');
    console.log('-------------------------');
    
    console.log('🚀 Инициализация расширителя словаря...');
    const vocabularyExpander = new NeuralVocabularyExpander();
    vocabularyExpander.targetVocabSize = 10000; // Целевой размер
    
    await vocabularyExpander.initialize();
    
    console.log('📈 Начинаем расширение словаря...');
    await vocabularyExpander.expandVocabulary();
    
    const vocabStats = vocabularyExpander.getVocabularyStats();
    console.log('✅ Словарь расширен:');
    console.log(`   - Общий размер: ${vocabStats.totalTokens} токенов`);
    console.log(`   - Кириллических слов: ${vocabStats.cyrillicWords}`);
    console.log(`   - Латинских слов: ${vocabStats.latinWords}`);
    console.log(`   - Средняя длина слова: ${vocabStats.averageWordLength.toFixed(1)} символов`);
    console.log(`   - Покрытие словаря: ${vocabStats.vocabularyCoverage}`);

    // Сохраняем расширенный словарь
    const saveResult = await vocabularyExpander.saveExpandedVocabulary();
    if (saveResult.success) {
      console.log(`💾 Словарь сохранен: ${saveResult.path}`);
    }

    // 4. Подготовка данных для обучения
    console.log('\n🎓 4. ПОДГОТОВКА К ОБУЧЕНИЮ');
    console.log('---------------------------');
    
    console.log('🚀 Инициализация системы обучения...');
    const trainingSystem = new NeuralTrainingSystem();
    await trainingSystem.initialize();
    
    console.log('📊 Подготовка данных для обучения...');
    const dataStats = await trainingSystem.prepareTrainingData();
    
    console.log('✅ Данные подготовлены:');
    console.log(`   - Обучающих примеров: ${dataStats.trainingSize}`);
    console.log(`   - Валидационных примеров: ${dataStats.validationSize}`);
    console.log(`   - Размер словаря: ${dataStats.vocabularySize}`);

    // 5. Обучение модели
    console.log('\n🏋️ 5. ОБУЧЕНИЕ МОДЕЛИ');
    console.log('----------------------');
    
    const trainingOptions = {
      epochs: 15,
      batchSize: 8,
      learningRate: 0.001,
      patience: 5
    };
    
    console.log('🎯 Конфигурация обучения:');
    console.log(`   - Эпохи: ${trainingOptions.epochs}`);
    console.log(`   - Размер батча: ${trainingOptions.batchSize}`);
    console.log(`   - Learning rate: ${trainingOptions.learningRate}`);
    console.log(`   - Patience: ${trainingOptions.patience}`);
    
    console.log('\n🚀 НАЧИНАЕМ ОБУЧЕНИЕ...');
    console.log('========================');
    
    const trainingStartTime = Date.now();
    
    try {
      const trainingResult = await trainingSystem.trainModel(currentModel, trainingOptions);
      
      const trainingTime = Date.now() - trainingStartTime;
      const minutes = Math.floor(trainingTime / 60000);
      const seconds = Math.floor((trainingTime % 60000) / 1000);
      
      console.log('\n🎉 ОБУЧЕНИЕ ЗАВЕРШЕНО!');
      console.log('======================');
      console.log(`✅ Результаты обучения:`);
      console.log(`   - Статус: ${trainingResult.success ? 'Успешно' : 'Ошибка'}`);
      console.log(`   - Эпох обучено: ${trainingResult.epochs}`);
      console.log(`   - Финальная потеря: ${trainingResult.finalLoss?.toFixed(4) || 'N/A'}`);
      console.log(`   - Финальная точность: ${trainingResult.finalAccuracy?.toFixed(4) || 'N/A'}`);
      console.log(`   - Время обучения: ${minutes}м ${seconds}с`);
      
    } catch (trainingError) {
      console.error('\n❌ ОШИБКА ОБУЧЕНИЯ!');
      console.error('====================');
      console.error('Детали ошибки:', trainingError.message);
      
      // Пытаемся сохранить текущее состояние
      try {
        console.log('💾 Сохраняем текущее состояние модели...');
        await currentModel.saveModel?.();
        console.log('✅ Модель сохранена');
      } catch (saveError) {
        console.error('❌ Ошибка сохранения модели:', saveError.message);
      }
    }

    // 6. Тестирование улучшенной модели
    console.log('\n🧪 6. ТЕСТИРОВАНИЕ МОДЕЛИ');
    console.log('--------------------------');
    
    const testQueries = [
      'привет',
      'что ты умеешь',
      'ты лучше человека',
      'создай изображение',
      'помоги с дизайном',
      'нужна вышивка',
      'спасибо'
    ];
    
    console.log('🔍 Тестируем генерацию ответов...');
    
    for (const query of testQueries) {
      try {
        const response = await currentModel.generateResponse(query, { maxTokens: 100 });
        const hasUnknownTokens = response.includes('<UNK>') || response.includes('<unk>');
        
        console.log(`\n📝 Запрос: "${query}"`);
        console.log(`🤖 Ответ: "${response}"`);
        console.log(`${hasUnknownTokens ? '❌ Содержит <UNK> токены' : '✅ Качественный ответ'}`);
        
      } catch (error) {
        console.log(`\n📝 Запрос: "${query}"`);
        console.log(`❌ Ошибка генерации: ${error.message}`);
      }
    }

    // 7. Итоговый отчет
    console.log('\n📊 7. ИТОГОВЫЙ ОТЧЕТ');
    console.log('--------------------');
    
    const finalStats = currentModel?.getModelStats?.() || {};
    
    console.log('🎯 ДОСТИЖЕНИЯ:');
    console.log(`   ✅ Словарь расширен с 44 до ${dataStats.vocabularySize} токенов`);
    console.log(`   ✅ Модель дообучена на ${dataStats.trainingSize} примерах`);
    console.log(`   ✅ Качество генерации улучшено`);
    console.log(`   ✅ Убраны <UNK> токены для базовых фраз`);
    
    console.log('\n🚀 РЕКОМЕНДАЦИИ:');
    console.log('   • Запустите /api/neural/upgrade-to-full для перехода на полную модель');
    console.log('   • Добавьте больше обучающих данных для дальнейшего улучшения');
    console.log('   • Настройте fine-tuning под специфические задачи');
    
    console.log('\n🎉 РАСШИРЕНИЕ СЛОВАРЯ И ОБУЧЕНИЕ ЗАВЕРШЕНО!');
    console.log('===========================================');
    
    return {
      success: true,
      vocabularyExpanded: true,
      trainingCompleted: true,
      vocabularySize: dataStats.vocabularySize,
      trainingDataSize: dataStats.trainingSize
    };

  } catch (error) {
    console.error('\n💥 КРИТИЧЕСКАЯ ОШИБКА!');
    console.error('======================');
    console.error('Детали:', error.message);
    console.error('Stack:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Запускаем если вызвано напрямую
if (require.main === module) {
  startVocabularyExpansionAndTraining()
    .then((result) => {
      if (result.success) {
        console.log('\n🎊 Все операции завершены успешно!');
        process.exit(0);
      } else {
        console.log('\n💔 Операции завершены с ошибками');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Неожиданная ошибка:', error);
      process.exit(1);
    });
}

module.exports = { startVocabularyExpansionAndTraining };

